# this is the main resource for our API Gateway REST API
resource "aws_api_gateway_rest_api" "backend_apigw" {
  name        = "backend-api-gateway"
  description = "API Gateway for the AWS Lambda that will handle our backend"
}

# this gateway resource will handle requests for the path '/graphql'
resource "aws_api_gateway_resource" "graphql_resource" {
  rest_api_id = aws_api_gateway_rest_api.backend_apigw.id
  parent_id   = aws_api_gateway_rest_api.backend_apigw.root_resource_id
  path_part   = "graphql"
}

# this resource defines the HTTP Method for the gateway resource defined above. In this case, only POSTs will be handled.
resource "aws_api_gateway_method" "graphql_method" {
  rest_api_id   = aws_api_gateway_rest_api.backend_apigw.id
  resource_id   = aws_api_gateway_resource.graphql_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

# this resource will integrate the gateway resource and gateway method defined above (defined under aws_api_gateway_rest_api.backend_apigw) to our lambda function that will handle requests to our backend
resource "aws_api_gateway_integration" "backend_lambda" {
  rest_api_id = aws_api_gateway_rest_api.backend_apigw.id
  resource_id = aws_api_gateway_method.graphql_method.resource_id
  http_method = aws_api_gateway_method.graphql_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.backend_lambda.invoke_arn
}

# this resource basically deploys our recently created API Gateway REST API, in a stage called "test" (other examples of stages could be "dev", "prod", ...)
resource "aws_api_gateway_deployment" "backend_apigw_deployment" {
  depends_on = [
    aws_api_gateway_integration.backend_lambda,
  ]

  rest_api_id = aws_api_gateway_rest_api.backend_apigw.id
  stage_name  = "test"
}

# this resource grants access to our API Gateway REST API, so that it can invoke our lambda
resource "aws_lambda_permission" "backend_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.backend_apigw.execution_arn}/*/*"
}

# store the invoke url in base_url, so that we can use it later
output "base_url" {
  value = aws_api_gateway_deployment.backend_apigw_deployment.invoke_url
}