resource "aws_dynamodb_table" "this" {
  name           = "our-dynamo-table"
  hash_key       = "pk"
  range_key      = "sk"
  read_capacity  = 3
  write_capacity = 5

  point_in_time_recovery {
    enabled = false
  }

  server_side_encryption {
    enabled = false
  }

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }
}
