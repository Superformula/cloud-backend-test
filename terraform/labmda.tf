locals {
  file_name = "../packages/user_lambda.zip"
}

resource "aws_lambda_function" "user_lambda" {
  function_name = "user_labmda_function"
  handler       = "lambda.graphqlHandler"
  role          = aws_iam_role.user_lambda_role.arn
  runtime       = "nodejs14.x"

  filename         = local.file_name
  source_code_hash = filebase64sha256(local.file_name)

  environment {
    variables = {
      "ENVIRONMENT" = var.environment
    }
  }
}
