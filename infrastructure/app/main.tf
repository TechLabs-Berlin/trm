terraform {
  backend "gcs" {
    bucket = "techlabs-trm-test-state"
    prefix = "app"
  }
}

provider "google-beta" {
  version = "~> 3.37"
  project = var.project
  region  = var.region
}

provider "archive" {
  version = "~> 1.3"
}

provider "local" {
  version = "~> 1.4"
}

data "terraform_remote_state" "common" {
  backend   = "gcs"
  workspace = "default"
  config = {
    bucket = "techlabs-trm-test-state"
    prefix = "common"
  }
}

locals {
  database_instance_name  = data.terraform_remote_state.common.outputs.database_instance_name
  storage_bucket_name     = data.terraform_remote_state.common.outputs.storage_bucket_name
  google_dns_name         = data.terraform_remote_state.common.outputs.google_dns_name
  google_dns_managed_zone = data.terraform_remote_state.common.outputs.google_dns_managed_zone
}

module "database" {
  source = "./modules/database"

  fn_url_typeform      = "https://${var.region}-${var.project}.cloudfunctions.net/typeform-${terraform.workspace}?op=all"
  fn_url_form_response = "https://${var.region}-${var.project}.cloudfunctions.net/form-response-${terraform.workspace}"

  project                 = var.project
  region                  = var.region
  database_instance_name  = local.database_instance_name
  database_passwords      = var.database_passwords
  hasura_passwords        = var.hasura_passwords
  hasura_jwt_keys         = var.hasura_jwt_keys
  domain                  = var.domain
  api_dns_name_prefixes   = var.api_dns_name_prefixes
  google_dns_name         = local.google_dns_name
  google_dns_managed_zone = local.google_dns_managed_zone
}

module "functions_auth" {
  source = "./modules/function"

  project             = var.project
  source_path         = "${path.module}/../../functions/auth"
  name                = "trm-auth-${terraform.workspace}"
  storage_bucket_name = local.storage_bucket_name
  environment_variables = {
    OAUTH_CLIENT_ID     = var.oauth_credentials[terraform.workspace].client_id,
    OAUTH_CLIENT_SECRET = var.oauth_credentials[terraform.workspace].client_secret,
    GSUITE_DOMAIN       = var.gsuite_domain,
    JWT_KEY             = var.hasura_jwt_keys[terraform.workspace]
    DEBUG               = "1" // TODO add config variable
  }
}

module "functions_typeform" {
  source = "./modules/function"

  project             = var.project
  source_path         = "${path.module}/../../functions/typeform"
  name                = "typeform-${terraform.workspace}"
  storage_bucket_name = local.storage_bucket_name
  timeout             = 180
  environment_variables = {
    NODE_ENV     = terraform.workspace
    GRAPHQL_URL  = module.database.hasura_url
    JWT_KEY      = var.hasura_jwt_keys[terraform.workspace]
    FUNCTION_URL = "https://${var.region}-${var.project}.cloudfunctions.net/typeform-${terraform.workspace}"
    DEBUG        = "1" // TODO add config variable
  }
}

module "functions_form_response" {
  source = "./modules/function"

  project             = var.project
  source_path         = "${path.module}/../../functions/form-response"
  name                = "form-response-${terraform.workspace}"
  storage_bucket_name = local.storage_bucket_name
  environment_variables = {
    NODE_ENV    = terraform.workspace
    GRAPHQL_URL = module.database.hasura_url
    JWT_KEY     = var.hasura_jwt_keys[terraform.workspace]
    DEBUG       = "1" // TODO add config variable
  }
}

resource "google_dns_record_set" "frontend" {
  provider = google-beta

  name         = "${var.frontend_dns_name_prefixes[terraform.workspace]}${local.google_dns_name}"
  managed_zone = local.google_dns_managed_zone
  type         = "CNAME"
  ttl          = 86400
  rrdatas      = [var.frontend_cname_record]
}

resource "local_file" "frontend_config" {
  filename        = "${path.module}/output/config.${terraform.workspace}.js"
  file_permission = "0644"
  content = templatefile("${path.module}/config.js.tmpl", {
    hasura_url         = module.database.hasura_url,
    functions_auth_url = module.functions_auth.https_trigger_url,
    oauth_client_id    = var.oauth_credentials[terraform.workspace].client_id,
    gsuite_domain      = var.gsuite_domain
  })
}
