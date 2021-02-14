output "url" {
  value = "${google_cloud_run_service.main.status[0].url}/certificate-generator"
}
