output "hasura_url" {
  value = module.database.hasura_url
}

output "functions_auth_url" {
  value = module.functions_auth.https_trigger_url
}

output "drive_service_account_email" {
  value = google_service_account.drive.email
}
