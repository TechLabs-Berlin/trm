output "hasura_url" {
  value = google_cloud_run_service.hasura.status[0].url
}
