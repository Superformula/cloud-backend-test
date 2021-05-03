locals {
  file_name = "../artifacts/cloud-backend-test-lambda.zip"
}

# Creates the lambda function using the file specified above
resource "aws_lambda_function" "gql_lambda_function" {
  depends_on = [
    aws_dynamodb_table.users_dynamodb_table
  ]
  function_name = var.function_name
  handler = "lambda-server.graphqlHandler"
  role = aws_iam_role.gql_lambda_role.arn
  runtime = "nodejs14.x"

  filename = local.file_name
  source_code_hash = filebase64sha256(local.file_name)

  environment {
    variables = {
      USERS_TABLE_NAME = "${aws_dynamodb_table.users_dynamodb_table.name}"
      MAPBOX_API_KEY = "pk.eyJ1IjoiZmFiaW9jZm1hcnF1ZXMiLCJhIjoiY2tvNjh2em15MHhueTJub252czU1eHh5ayJ9.3Cds6u5zt_oCNrSPfC-9zQ" # Example API Key
      DEPLOYMENT_STAGE_NAME = var.deployment_stage
    }
  }
}

# Add IAM role to the created Lambda

resource "aws_iam_role" "gql_lambda_role" {
  name = "cloud_backend_test_gql_lambda_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# Add Role policy to access DynamoDB

resource "aws_iam_role_policy" "lambda_policy" {
  depends_on = [
    aws_dynamodb_table.users_dynamodb_table
  ]
  name = "lambda_policy"
  role = aws_iam_role.gql_lambda_role.id

  policy = <<EOF
{  
  "Version": "2012-10-17",
  "Statement":[{
    "Effect": "Allow",
    "Action": [
     "dynamodb:*"
    ],
    "Resource": "${aws_dynamodb_table.users_dynamodb_table.arn}"
   },
   {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

# Add CloudWatch logging

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = 14
}