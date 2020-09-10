output "hasura_url" {
  value = module.database.hasura_url
}

output "functions_auth_url" {
  value = module.functions_auth.https_trigger_url
}
