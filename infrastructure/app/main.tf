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
  vpc_access_connector_name = data.terraform_remote_state.common.outputs.vpc_access_connector_name
  database_instance_ip      = data.terraform_remote_state.common.outputs.database_instance_ip
  storage_bucket_name      = data.terraform_remote_state.common.outputs.storage_bucket_name
}

resource "google_sql_database" "main" {
  provider = google-beta

  name = "trm-${terraform.workspace}"

  instance = local.database_instance_name
  project  = var.project
}

resource "google_sql_user" "main" {
  provider = google-beta

  name     = "trm-${terraform.workspace}"
  password = var.database_passwords[terraform.workspace]

  instance = local.database_instance_name
  project  = var.project
}

resource "google_cloud_run_service" "hasura" {
  provider = google-beta
  depends_on = [
    google_sql_database.main,
    google_sql_user.main,
  ]
  name = "trm-${terraform.workspace}-hasura"

  template {
    spec {
      containers {
        image = "europe-west3-docker.pkg.dev/techlabs-trm-test/trm/hasura:${terraform.workspace}"
        env {
          name = "HASURA_GRAPHQL_DATABASE_URL"
          #value = "postgres://trm-${terraform.workspace}:${var.database_passwords[terraform.workspace]}@/trm-${terraform.workspace}?host=/cloudsql/${var.project}:${var.region}:${local.database_instance_name}"
          value = "postgres://trm-${terraform.workspace}:${var.database_passwords[terraform.workspace]}@${local.database_instance_ip}/trm-${terraform.workspace}?sslmode=require"
        }
        env {
          name  = "HASURA_GRAPHQL_ENABLE_CONSOLE"
          value = "true"
        }
        env {
          name  = "HASURA_GRAPHQL_SERVER_PORT"
          value = "8080"
        }
        env {
          name  = "HASURA_GRAPHQL_ADMIN_SECRET"
          value = var.hasura_passwords[terraform.workspace]
        }
        # env {
        #   name  = "HASURA_GRAPHQL_UNAUTHORIZED_ROLE"
        #   value = "anonymous"
        # }
        env {
          name  = "HASURA_GRAPHQL_JWT_SECRET"
          value = "{\"type\":\"HS256\",\"key\":\"${var.hasura_jwt_keys[terraform.workspace]}\"}"
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"        = "1"
        "run.googleapis.com/vpc-access-connector" = local.vpc_access_connector_name
        "run.googleapis.com/client-name"          = "terraform"
      }
    }
  }

  autogenerate_revision_name = true
  # europe-west3 not yet supported: https://cloud.google.com/run/docs/locations
  location = "europe-west1"
  project  = var.project
}

data "google_iam_policy" "noauth" {
  provider = google-beta

  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "hasura" {
  provider = google-beta

  location = google_cloud_run_service.hasura.location
  project  = google_cloud_run_service.hasura.project
  service  = google_cloud_run_service.hasura.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

data "archive_file" "functions_auth" {
  type = "zip"
  source_dir = "${path.module}/../../functions/auth"
  output_path = "${path.module}/../../functions/auth.zip"
}

resource "google_storage_bucket_object" "functions_auth" {
  provider = google-beta

  name = format("app/%s/%s#%s", terraform.workspace, "auth.zip", data.archive_file.functions_auth.output_md5)
  bucket = local.storage_bucket_name
  source = data.archive_file.functions_auth.output_path
}

resource "google_cloudfunctions_function" "functions_auth" {
  provider = google-beta

  name        = "trm-auth"
  runtime     = "nodejs12"

  available_memory_mb   = 128
  timeout               = 10
  max_instances         = 1
  source_archive_bucket = local.storage_bucket_name
  source_archive_object = google_storage_bucket_object.functions_auth.name
  trigger_http          = true
  entry_point           = "handler"
  environment_variables = {
    OAUTH_CLIENT_ID = var.oauth_client_id,
    OAUTH_CLIENT_SECRET = var.oauth_client_secret,
    GSUITE_DOMAIN = var.gsuite_domain,
    JWT_KEY = var.hasura_jwt_keys[terraform.workspace]
  }

  project = var.project
}

resource "google_cloudfunctions_function_iam_member" "invoker" {
  provider = google-beta

  project        = google_cloudfunctions_function.functions_auth.project
  region         = google_cloudfunctions_function.functions_auth.region
  cloud_function = google_cloudfunctions_function.functions_auth.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}

resource "local_file" "frontend_config" {
  filename = "${path.module}/output/config.${terraform.workspace}.js"
  file_permission = "0644"
  content = templatefile("${path.module}/config.js.tmpl", {
    hasura_url = google_cloud_run_service.hasura.status[0].url,
    functions_auth_url = google_cloudfunctions_function.functions_auth.https_trigger_url,
    oauth_client_id = var.oauth_client_id,
    gsuite_domain = var.gsuite_domain
  })
}
