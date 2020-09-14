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
variable "frontend_cname_record" {
  default = "techlabs-berlin.github.io."
}
