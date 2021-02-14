variable "project" {}

variable "region" {}

variable "location" {
  # europe-west3 not yet supported for Cloud Run: https://cloud.google.com/run/docs/locations
  default = "europe-west1"
}

variable "service_account_email" {}
