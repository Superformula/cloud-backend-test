output "dynamodb_table" {
  value = aws_dynamodb_table.this.name
}
output "dynamodb_table_arn" {
  value = aws_dynamodb_table.this.arn
}
