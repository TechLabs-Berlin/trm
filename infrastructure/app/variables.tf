variable "project" {}
variable "region" {}
variable "database_passwords" {
  type = map(any)
}
variable "hasura_passwords" {
  type = map(any)
}
variable "hasura_jwt_keys" {
  type = map(any)
}
variable "oauth_credentials" {
  type = map(any)
}
variable "domain" {}
variable "gsuite_domain" {}
variable "api_dns_name_prefixes" {
  default = {
    staging    = "api-staging.",
    production = "api."
  }
}
variable "frontend_dns_name_prefixes" {
  default = {
    staging    = "staging.",
    production = ""
  }
}
variable "edyoucated_username" {}
variable "edyoucated_password" {}
variable "edyoucated_user_pool_id" {}
variable "edyoucated_client_id" {}
variable "edyoucated_aws_region" {}
variable "edyoucated_api_url" {}
variable "edyoucated_organization_id" {}
variable "trm_data_folder_id" {
  type = map(any)
}
variable "google_impersonate_subject" {}
