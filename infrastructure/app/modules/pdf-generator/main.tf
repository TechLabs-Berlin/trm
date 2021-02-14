resource "google_cloud_run_service" "main" {
  provider = google-beta
  name     = "trm-${terraform.workspace}-gotenberg"

  template {
    spec {
      containers {
        image = "europe-west3-docker.pkg.dev/techlabs-trm/trm/gotenberg:${terraform.workspace}"
        resources {
          limits = {
            cpu    = "2000m"
            memory = "1024Mi"
          }
        }
        ports {
          container_port = 3000
        }
      }
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

resource "google_cloud_run_service_iam_member" "service_account" {
  service  = google_cloud_run_service.main.name
  location = google_cloud_run_service.main.location
  role     = "roles/run.invoker"
  member   = "serviceAccount:${var.service_account_email}"
  project  = var.project
}
