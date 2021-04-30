locals {
  file_name = "../artifacts/cloud-backend-test-lambda.zip"
}

# Creates the lambda function using the file specified above
resource "aws_lambda_function" "gql_lambda_function" {
  function_name = "cloud-backend-test-lambda"
  handler = "lambda.graphqlHandler"
  role = aws_iam_role.gql_lambda_role.arn
  runtime = "nodejs14.x"

  filename = local.file_name
  source_code_hash = filebase64sha256(local.file_name)
}

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