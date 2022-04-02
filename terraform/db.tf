resource "aws_dynamodb_table" "users_table" {
  name           = var.user_table_name
  hash_key       = "id"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2

  attribute {
    name = "id"
    type = "S"
  }
}