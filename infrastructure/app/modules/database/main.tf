locals {
  cloudsql_instance_name = "${var.project}:${var.region}:${var.database_instance_name}"
}

resource "google_sql_database" "main" {
  provider = google-beta

  name = "trm-${terraform.workspace}"

  instance = var.database_instance_name
  project  = var.project
}

resource "google_sql_user" "main" {
  provider = google-beta

  name     = "trm-${terraform.workspace}"
  password = var.database_passwords[terraform.workspace]

  instance = var.database_instance_name
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
        image = "europe-west3-docker.pkg.dev/techlabs-trm/trm/hasura:${terraform.workspace}"
        env {
          name  = "HASURA_GRAPHQL_DATABASE_URL"
          value = "postgres://trm-${terraform.workspace}:${var.database_passwords[terraform.workspace]}@/trm-${terraform.workspace}?host=/cloudsql/${local.cloudsql_instance_name}&sslmode=require"
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
        env {
          name  = "FN_URL_TYPEFORM"
          value = var.fn_url_typeform
        }
        env {
          name  = "FN_URL_FORM_RESPONSE"
          value = var.fn_url_form_response
        }
        env {
          name  = "FN_URL_EDYOUCATED"
          value = var.fn_url_edyoucated
        }
        env {
          name  = "FN_URL_GSHEETS"
          value = var.fn_url_gsheets
        }
        env {
          name  = "SKIP_MIGRATIONS"
          value = var.skip_migrations
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "256Mi"
          }
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "1"
        "run.googleapis.com/cloudsql-instances" = local.cloudsql_instance_name
        "run.googleapis.com/client-name"        = "terraform"
      }
    }
  }

  autogenerate_revision_name = true
  # europe-west3 not yet supported: https://cloud.google.com/run/docs/locations
  location = var.location
  project  = var.project
}

resource "google_cloud_run_domain_mapping" "hasura" {
  provider = google-beta
  location = var.location
  name     = "${var.api_dns_name_prefixes[terraform.workspace]}${var.domain}"

  metadata {
    namespace = var.project
  }

  spec {
    route_name = google_cloud_run_service.hasura.name
  }
}

resource "google_dns_record_set" "hasura" {
  provider = google-beta

  name         = "${google_cloud_run_domain_mapping.hasura.status[0].resource_records[0].name}.${var.google_dns_name}"
  managed_zone = var.google_dns_managed_zone
  type         = google_cloud_run_domain_mapping.hasura.status[0].resource_records[0].type
  ttl          = 86400
  rrdatas      = [google_cloud_run_domain_mapping.hasura.status[0].resource_records[0].rrdata]
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
