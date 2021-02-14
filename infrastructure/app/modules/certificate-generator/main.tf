resource "google_cloud_run_service" "main" {
  provider = google-beta
  name     = "trm-${terraform.workspace}-certificate-generator"

  template {
    spec {
      containers {
        image = "europe-west3-docker.pkg.dev/techlabs-trm/trm/certificate-generator:${terraform.workspace}"
        resources {
          limits = {
            cpu    = "1000m"
            memory = "256Mi"
          }
        }
        env {
          name  = "NODE_ENV"
          value = terraform.workspace
        }
        env {
          name  = "JWT_KEY"
          value = var.hasura_jwt_keys[terraform.workspace]
        }
        env {
          name  = "GRAPHQL_URL"
          value = var.graphql_url
        }
        env {
          name  = "GOTENBERG_URL"
          value = var.gotenberg_url
        }
        env {
          name  = "DEBUG"
          value = "1" // TODO add config variable
        }
      }
      service_account_name = var.service_account_email
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "1"
        "run.googleapis.com/client-name"   = "terraform"
      }
    }
  }

  autogenerate_revision_name = true
  # europe-west3 not yet supported: https://cloud.google.com/run/docs/locations
  location = var.location
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

resource "google_cloud_run_service_iam_policy" "main" {
  provider = google-beta

  location = google_cloud_run_service.main.location
  project  = google_cloud_run_service.main.project
  service  = google_cloud_run_service.main.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
