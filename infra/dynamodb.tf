resource "aws_dynamodb_table" "users-table" {
  name           = "Users"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}