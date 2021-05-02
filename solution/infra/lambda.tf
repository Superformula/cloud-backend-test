locals {
  file_name = "../artifacts/cloud-backend-test-lambda.zip"
}

# Creates the lambda function using the file specified above
resource "aws_lambda_function" "gql_lambda_function" {
  depends_on = [
    aws_dynamodb_table.users_dynamodb_table
  ]
  function_name = "cloud-backend-test-lambda"
  handler = "lambda-server.graphqlHandler"
  role = aws_iam_role.gql_lambda_role.arn
  runtime = "nodejs14.x"

  filename = local.file_name
  source_code_hash = filebase64sha256(local.file_name)

  environment {
    variables = {
      USERS_TABLE_NAME = "${aws_dynamodb_table.users_dynamodb_table.name}"
      MAPBOX_API_KEY = "MY-API-KEY"
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
   }
  ]
}
EOF
}