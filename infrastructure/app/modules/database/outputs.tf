output "hasura_url" {
  value = "https://${trimsuffix(google_dns_record_set.hasura.name, ".")}/v1/graphql"
}
