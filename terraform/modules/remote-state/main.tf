resource "aws_s3_bucket" "remote-state" {
  bucket = "tfstate-clericuzzi-cloud-developer-test-${var.aws_account_id}"

  versioning {
    enabled = true
  }

  tags = {
    Owner       = "Pedro Clericuzzi"
    ManagedBy   = "Terraform"
    CreatedAt   = "2021-05-14"
    Description = "Bucket for the terraform remote state"
  }
}

resource "aws_dynamodb_table" "lock-table" {
  name           = "tflock-${aws_s3_bucket.remote-state.bucket}"
  hash_key       = "LockId"
  read_capacity  = 5
  write_capacity = 5

  point_in_time_recovery {
    enabled = false
  }

  server_side_encryption {
    enabled = false
  }

  attribute {
    name = "LockId"
    type = "S"
  }
}

output "remote_state_bucket" {
  value = aws_s3_bucket.remote-state.bucket
}

output "remote_state_bucket_arn" {
  value = aws_s3_bucket.remote-state.arn
}
