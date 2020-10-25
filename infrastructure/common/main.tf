terraform {
  backend "gcs" {
    bucket = "techlabs-trm-state"
    prefix = "common"
  }
}

provider "google-beta" {
  version = "~> 3.37"
  project = var.project
  region  = var.region
}

resource "google_dns_managed_zone" "main" {
  provider = google-beta

  name     = "trm"
  dns_name = "techlabs.org."
}

# TODO fix DNS name 'trm.techlabs.org.' may have either one CNAME resource record set or resource record sets of other types, but not both., cnameResourceRecordSetConflict
# resource "google_dns_record_set" "google_site_verification" {
#   provider = google-beta

#   name         = "trm.${google_dns_managed_zone.main.dns_name}"
#   managed_zone = google_dns_managed_zone.main.name
#   type         = "TXT"
#   ttl          = 86400
#   rrdatas      = [var.google_site_verification_key]
# }

resource "google_sql_database_instance" "main" {
  provider = google-beta

  name             = "trm-data"
  database_version = "POSTGRES_12"
  region           = var.region

  settings {
    tier            = "db-f1-micro"
    disk_autoresize = false
    disk_size       = 10
    disk_type       = "PD_HDD"
    ip_configuration {
      ipv4_enabled = true
    }
  }
}

resource "google_artifact_registry_repository" "main" {
  provider = google-beta

  location      = var.region
  repository_id = "trm"
  format        = "DOCKER"
}
