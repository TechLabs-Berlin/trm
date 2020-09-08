terraform {
  backend "gcs" {
    bucket = "techlabs-trm-test-state"
    prefix = "common"
  }
}

provider "google-beta" {
  version = "~> 3.37"
  project = var.project
  region  = var.region
}

resource "google_compute_network" "main" {
  provider = google-beta

  name = "private-network"
}

resource "google_compute_global_address" "main" {
  provider = google-beta

  name          = "trm"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.main.id
}

resource "google_vpc_access_connector" "main" {
  provider = google-beta

  name = "trm"
  # Cloud Run does not support europe-west3 yet
  region        = "europe-west1"
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.main.name
}

resource "google_service_networking_connection" "private_vpc_connection" {
  provider = google-beta

  network                 = google_compute_network.main.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.main.name]
}

resource "google_sql_database_instance" "main" {
  provider   = google-beta
  depends_on = [google_service_networking_connection.private_vpc_connection]

  name             = "trm"
  database_version = "POSTGRES_12"
  region           = var.region

  settings {
    tier            = "db-f1-micro"
    disk_autoresize = false
    disk_size       = 10
    disk_type       = "PD_HDD"
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
    }
  }
}

resource "google_artifact_registry_repository" "main" {
  provider = google-beta

  location      = var.region
  repository_id = "trm"
  format        = "DOCKER"
}
