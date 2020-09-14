output "hasura_url" {
  # TODO: enable once the domain mapping works
  # value = "https://${trimsuffix(google_dns_record_set.hasura.name, ".")}/v1/graphql"
  value = "${google_cloud_run_service.hasura.status[0].url}/v1/graphql"
}
