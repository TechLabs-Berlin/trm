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
  database_instance_name    = data.terraform_remote_state.common.outputs.database_instance_name
  storage_bucket_name       = data.terraform_remote_state.common.outputs.storage_bucket_name
}

module "database" {
  source = "./modules/database"

  // TODO refactor into map & use custom domain when available
  fn_url_typeform_webhook = "https://europe-west3-techlabs-trm-test.cloudfunctions.net/typeform-webhook"

  project                   = var.project
  region = var.region
  database_instance_name    = local.database_instance_name
  database_passwords        = var.database_passwords
  hasura_passwords          = var.hasura_passwords
  hasura_jwt_keys           = var.hasura_jwt_keys
}

module "functions_auth" {
  source = "./modules/function"

  project             = var.project
  source_path         = "${path.module}/../../functions/auth"
  name                = "trm-auth"
  storage_bucket_name = local.storage_bucket_name
  environment_variables = {
    OAUTH_CLIENT_ID     = var.oauth_credentials[terraform.workspace].client_id,
    OAUTH_CLIENT_SECRET = var.oauth_credentials[terraform.workspace].client_secret,
    GSUITE_DOMAIN       = var.gsuite_domain,
    JWT_KEY             = var.hasura_jwt_keys[terraform.workspace]
    DEBUG               = "1" // TODO add config variable
  }
}

module "functions_typeform_webhook" {
  source = "./modules/function"

  project             = var.project
  source_path         = "${path.module}/../../functions/typeform-webhook"
  name                = "typeform-webhook"
  storage_bucket_name = local.storage_bucket_name
  environment_variables = {
    GRAPHQL_URL           = "${module.database.hasura_url}/v1/graphql"
    TYPEFORM_CALLBACK_URL = "https://example.invalid"
    JWT_KEY               = var.hasura_jwt_keys[terraform.workspace]
    DEBUG                 = "1" // TODO add config variable
  }
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
