resource "aws_api_gateway_rest_api" "this" {
  name = "our-rest-api"
}

resource "aws_api_gateway_resource" "v1" {
  path_part   = "v1"
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.this.id
}

resource "aws_api_gateway_method" "crud_method" {
  http_method   = "ANY"
  resource_id   = aws_api_gateway_resource.v1.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  authorization = "NONE"

}
resource "aws_api_gateway_integration" "crud_integration" {
  uri                     = var.lambda_crud_invoke_arn
  type                    = "AWS_PROXY"
  resource_id             = aws_api_gateway_resource.v1.id
  rest_api_id             = aws_api_gateway_rest_api.this.id
  http_method             = aws_api_gateway_method.crud_method.http_method
  integration_http_method = "POST"
}

# resource "aws_api_gateway_method" "geolocation_method" {
#   http_method   = "ANY"
#   resource_id   = aws_api_gateway_resource.v1.id
#   rest_api_id   = aws_api_gateway_rest_api.this.id
#   authorization = "NONE"
# }
# resource "aws_api_gateway_integration" "geolocation_integration" {
#   uri                     = var.lambda_geolocation_invoke_arn
#   type                    = "AWS_PROXY"
#   resource_id             = aws_api_gateway_resource.v1.id
#   rest_api_id             = aws_api_gateway_rest_api.this.id
#   http_method             = aws_api_gateway_method.geolocation_method.http_method
#   integration_http_method = "POST"
# }

resource "aws_api_gateway_deployment" "this" {
  stage_name  = var.workspace
  rest_api_id = aws_api_gateway_rest_api.this.id

  depends_on = [
    aws_api_gateway_integration.crud_integration,
    # aws_api_gateway_integration.geolocation_integration
  ]
}
