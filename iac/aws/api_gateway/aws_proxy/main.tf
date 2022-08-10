variable "api_name" {
  description = "name of the api"
  default = "api"
}

variable "api_path" {
  description = "path of the api"
  default = "api"
}

variable "lambda_arn" {
  description = "arn of the associated lambda function"
}

variable "region" {
  description = "region"
}
variable "account_id" {
  description = "account id"
}

variable "deploy_stage" {
  description = "stage name for deployment"
}


# API Gateway
resource "aws_api_gateway_rest_api" "api" {
  name = "${var.api_name}"
}

resource "aws_api_gateway_resource" "resource" {
  path_part = "${var.api_path}"
  parent_id = "${aws_api_gateway_rest_api.api.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  resource_id   = "${aws_api_gateway_resource.resource.id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = "${aws_api_gateway_rest_api.api.id}"
  resource_id             = "${aws_api_gateway_resource.resource.id}"
  http_method             = "${aws_api_gateway_method.method.http_method}"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${var.lambda_arn}/invocations"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
}
resource "aws_api_gateway_deployment" "deployment" {
  depends_on = ["aws_api_gateway_method.method","aws_api_gateway_integration.integration"]
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  stage_name  = "${var.deploy_stage}"
}
output "url" {
  value = "${aws_api_gateway_deployment.deployment.invoke_url}"
}

# Lambda
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${var.lambda_arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.api.id}/*/*/*"
}