output "appsync_graphql_id" {
  value       = aws_appsync_graphql_api.this.id
  description = "the appSync's GraphQL id"
}

output "appsync_graphql_name" {
  value       = aws_appsync_graphql_api.this.name
  description = "the appSync's GraphQL name"
}
