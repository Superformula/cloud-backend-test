resource "aws_appsync_graphql_api" "this" {
  name                = "our-graphql"
  authentication_type = "API_KEY"

  schema = file("./modules/appsync/schema.graphql")
}

resource "aws_iam_role" "iam_role" {
  name = "appSyncAllowRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["sts:AssumeRole"]
        Effect = "Allow"
        Principal = {
          Service = "appsync.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "role_policy" {
  name = "appSyncAllowRole_policy"
  role = aws_iam_role.iam_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "${var.dynamo_table_arn}"
      ]
    }
  ]
}
EOF
}

resource "aws_appsync_datasource" "dynamo-table" {
  type             = "AMAZON_DYNAMODB"
  name             = "appSync_dynamo_source"
  api_id           = aws_appsync_graphql_api.this.id
  service_role_arn = aws_iam_role.iam_role.arn

  dynamodb_config {
    table_name = var.dynamo_table
  }
}
