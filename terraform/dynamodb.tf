resource "aws_dynamodb_table" "users_table" {
  name           = var.users_table_name
  hash_key       = "id"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "id"
    type = "S"
  }
}
