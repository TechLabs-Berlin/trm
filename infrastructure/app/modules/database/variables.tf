variable "project" {}

variable "region" {}

variable "database_instance_name" {}

variable "location" {
  # europe-west3 not yet supported for Cloud Run: https://cloud.google.com/run/docs/locations
  default = "europe-west1"
}

variable "database_passwords" {
  type = map
}

variable "hasura_passwords" {
  type = map
}

variable "hasura_jwt_keys" {
  type = map
}

variable "fn_url_typeform_webhook" {}

variable "domain" {}

variable "api_dns_name_prefixes" {}

variable "google_dns_name" {}

variable "google_dns_managed_zone" {}
