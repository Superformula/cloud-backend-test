resource "aws_dynamodb_table" "our-dynamo-table" {
  name           = "our-dynamo-table"
  hash_key       = "name"
  range_key      = "id"
  read_capacity  = 3
  write_capacity = 5

  local_secondary_index {
    name               = "our-dynamo-table-lsi"
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
    name = "name"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }
}
