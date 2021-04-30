resource "aws_api_gateway_rest_api" "gql_api_gateway" {
  name        = "CloudBackendTestGateway"
  description = "Cloud Backend Test API Gateway"
  endpoint_configuration {
    types = [ "REGIONAL" ]
  }
}

resource "aws_api_gateway_resource" "gql_proxy_resource" {
  rest_api_id = aws_api_gateway_rest_api.gql_api_gateway.id
  parent_id   = aws_api_gateway_rest_api.gql_api_gateway.root_resource_id
  path_part   = "graphql"
}

#  Configuring the proxy

resource "aws_api_gateway_method" "gql_proxy_method" {
  rest_api_id   = aws_api_gateway_rest_api.gql_api_gateway.id
  resource_id   = aws_api_gateway_resource.gql_proxy_resource.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "gql_lambda" {
  rest_api_id = aws_api_gateway_rest_api.gql_api_gateway.id
  resource_id = aws_api_gateway_method.gql_proxy_method.resource_id
  http_method = aws_api_gateway_method.gql_proxy_method.http_method

  integration_http_method = "ANY"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.gql_lambda_function.invoke_arn
}

#

# Adding the required resources to help the API match the empty path

resource "aws_api_gateway_method" "gql_proxy_root_method" {
   rest_api_id   = aws_api_gateway_rest_api.gql_api_gateway.id
   resource_id   = aws_api_gateway_rest_api.gql_api_gateway.root_resource_id
   http_method   = "ANY"
   authorization = "NONE"
}

resource "aws_api_gateway_integration" "gql_lambda_root" {
   rest_api_id = aws_api_gateway_rest_api.gql_api_gateway.id
   resource_id = aws_api_gateway_method.gql_proxy_root_method.resource_id
   http_method = aws_api_gateway_method.gql_proxy_root_method.http_method

   integration_http_method = "ANY"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.gql_lambda_function.invoke_arn
}

#

# Adding the gateway deployment with the stage

resource "aws_api_gateway_deployment" "gql_api_deployment" {
  depends_on = [
    aws_api_gateway_integration.gql_lambda,
    aws_api_gateway_integration.gql_lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.gql_api_gateway.id
  stage_name  = "test"
}

#

# Adding the permission for the services talk with each other

resource "aws_lambda_permission" "api_gw" {
   statement_id  = "AllowAPIGatewayInvoke"
   action        = "lambda:InvokeFunction"
   function_name = aws_lambda_function.gql_lambda_function.function_name
   principal     = "apigateway.amazonaws.com"

   # The "/*/*" portion grants access from any method on any resource
   # within the API Gateway REST API.
   source_arn = "${aws_api_gateway_rest_api.gql_api_gateway.execution_arn}/*/*"
}

#

output "gateway_base_url" {
  value = aws_api_gateway_deployment.gql_api_deployment.invoke_url
}