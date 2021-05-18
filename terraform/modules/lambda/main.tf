data "archive_file" "lambdaCrud" {
  type        = "zip"
  source_file = "${var.lambdas_path}/crud.js"
  output_path = "files/lambdaCrud.zip"
}

resource "aws_lambda_function" "lambdaCrud" {
  role          = var.iam_role_arn
  handler       = "crud.handler"
  runtime       = "nodejs14.x"
  function_name = "lambdaCrud"

  filename         = data.archive_file.lambdaCrud.output_path
  source_code_hash = data.archive_file.lambdaCrud.output_base64sha256

  timeout     = 30
  memory_size = 128

  layers = [var.project_lambda_layer]
}

resource "aws_lambda_permission" "lambdaDynamoAccessPermission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambdaCrud.arn
  statement_id  = "AllowExecutionFromAPIGateway"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:*/*"
}

# resource "aws_lambda_function" "lambdaLocation" {
#   role          = var.iam_role_arn
#   handler       = "dynamo.handler"
#   runtime       = "nodejs14.x"
#   function_name = "getGeoLocationHandler"

#   filename         = data.archive_file.lambda_functions.output_path
#   source_code_hash = data.archive_file.lambda_functions.output_base64sha256

#   timeout     = 30
#   memory_size = 128

#   environment {
#     variables = {
#       TABLE             = var.dynamo_table,
#       MAP_BOX_API       = var.geolocation_mapbox_api_key
#       ACCESS_KEY_ID     = var.aws_access_key,
#       SECRET_ACCESS_KEY = var.aws_secret_access_key
#     }
#   }
# }

# resource "aws_lambda_permission" "lambdaGeoLocationPermission" {
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.lambdaLocation.arn
#   statement_id  = "AllowExecutionFromAPIGateway"
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:*/*"
# }
