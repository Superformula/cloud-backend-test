data "archive_file" "lambda_functions" {
  type        = "zip"
  source_file = "${var.lambdas_path}/dynamo.js"
  output_path = "files/s3-artefact.zip"
}

resource "aws_lambda_function" "this" {
  role          = var.iam_role_arn
  handler       = "dynamo.handler"
  runtime       = "nodejs14.x"
  function_name = "dynamoCrudHandler"

  filename         = data.archive_file.lambda_functions.output_path
  source_code_hash = data.archive_file.lambda_functions.output_base64sha256

  timeout     = 30
  memory_size = 128

  environment {
    variables = {
      "TABLE" = var.dynamo_table
    }
  }
}

resource "aws_lambda_permission" "dynamo-access" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.arn
  statement_id  = "AllowExecutionFromAPIGateway"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:*/*"
}
