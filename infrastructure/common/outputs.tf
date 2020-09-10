output "database_instance_name" {
  value = google_sql_database_instance.main.name
}

output "artifact_registry_repository_prefix" {
  value = "${var.region}-docker.pkg.dev/${var.project}/${google_artifact_registry_repository.main.name}"
}

output "storage_bucket_name" {
  value = "techlabs-trm-test-state"
}
