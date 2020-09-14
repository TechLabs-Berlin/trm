output "database_instance_name" {
  value = google_sql_database_instance.main.name
}

output "artifact_registry_repository_prefix" {
  value = "${var.region}-docker.pkg.dev/${var.project}/${google_artifact_registry_repository.main.name}"
}

output "storage_bucket_name" {
  value = "techlabs-trm-test-state"
}

output "google_dns_name_servers" {
  value = google_dns_managed_zone.main.name_servers
}

output "google_dns_name" {
  value = google_dns_managed_zone.main.dns_name
}

output "google_dns_managed_zone" {
  value = google_dns_managed_zone.main.name
}
