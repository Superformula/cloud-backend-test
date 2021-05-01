locals {
  file_name = "../packages/user-lambda.zip"
}

resource "aws_lambda_function" "gql_lambda" {
  function_name = "users_gql_lambda"
  handler       = "lambda.graphqlHandler"
  role          = aws_iam_role.gql_lambda_role.arn
  runtime       = "nodejs14.x"

  filename         = local.file_name
  source_code_hash = filebase64sha256(local.file_name)
}

resource "aws_iam_role" "gql_lambda_role" {
  name = "users_gql_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Effect = "Allow",
        Sid    = ""
      }
    ]
  })
}
