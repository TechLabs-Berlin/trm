output "hasura_url" {
  value = google_cloud_run_service.hasura.status[0].url
}

output "functions_auth_url" {
  value = google_cloudfunctions_function.functions_auth.https_trigger_url
}
