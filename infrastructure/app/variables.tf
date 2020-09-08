variable "project" {}
variable "region" {}
variable "database_passwords" {
  type = map
}
variable "hasura_passwords" {
  type = map
}
variable "hasura_jwt_keys" {
  type = map
}
variable "oauth_client_id" {}
variable "oauth_client_secret" {}
variable "gsuite_domain" {}
