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
variable "oauth_credentials" {
  type = map
}
variable "gsuite_domain" {}
