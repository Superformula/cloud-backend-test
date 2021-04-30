resource "aws_dynamodb_table" "users_dynamodb_table" {
  name           = "UsersTable"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "Id"

  attribute {
    name = "Id"
    type = "S"
  }
}