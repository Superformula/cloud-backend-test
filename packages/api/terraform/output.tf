output "http_endpoint" {
  value = aws_api_gateway_stage.api.invoke_url
}

output "websocket_endpoint" {
  value = aws_apigatewayv2_stage.websocket.invoke_url
}
