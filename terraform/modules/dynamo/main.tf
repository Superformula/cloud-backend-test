resource "aws_dynamodb_table" "this" {
  name           = "our-dynamo-table"
  hash_key       = "partition_key"
  range_key      = "name"
  read_capacity  = 3
  write_capacity = 5

  local_secondary_index {
    name               = "our_lsi"
    range_key          = "id"
    projection_type    = "INCLUDE"
    non_key_attributes = ["address", "description"]
  }

  point_in_time_recovery {
    enabled = false
  }

  server_side_encryption {
    enabled = false
  }

  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }
}
