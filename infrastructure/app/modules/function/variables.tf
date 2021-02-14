variable "project" {}

variable "source_path" {}

variable "name" {}

variable "storage_bucket_name" {}

variable "environment_variables" {
  type = map
}

variable "timeout" {
  default = 30
}

variable "schedule" {
  default = null
}

variable "service_account_email" {
  default = null
}

variable "available_memory_mb" {
  default = 128
}
