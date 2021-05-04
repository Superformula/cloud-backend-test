provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
    encrypt = true
  }
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

resource "aws_dynamodb_table" "users" {
  name           = "Users"
  hash_key       = "id"
  billing_mode   = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  global_secondary_index {
    name            = "name-index"
    hash_key        = "name"
    range_key       = "createdAt"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "connections" {
  name         = "Connections"
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "subscriptions" {
  name         = "Subscriptions"
  hash_key     = "event"
  range_key    = "subscriptionId"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "event"
    type = "S"
  }

  attribute {
    name = "subscriptionId"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "subscription_operations" {
  name         = "SubscriptionOperations"
  hash_key     = "subscriptionId"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "subscriptionId"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "events" {
  name             = "Events"
  hash_key         = "id"
  billing_mode     = "PAY_PER_REQUEST"
  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}

resource "aws_iam_role" "iam_for_graphql_lambda" {
  name = "sf-api-graphql-lambda_execution"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "sts:AssumeRole",
        ]
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      },
    ]
  })
}

# Lambda Execution IAM Role AWSLambdaBasicExecutionRole Attachment
resource "aws_iam_role_policy_attachment" "lambda_exec_cloudwatch" {
  role       = aws_iam_role.iam_for_graphql_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda execution role for websocket with api gateway
resource "aws_iam_role_policy" "lamdba_exec_websocket" {
  name = "sf-api-websocket-policy"
  role = aws_iam_role.iam_for_graphql_lambda.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow",
        Action   = "execute-api:ManageConnections",
        Resource = "arn:aws:execute-api:*:*:*/@connections/*"
      }
    ]
  })
}

# Access to Dynamodb Users Table
resource "aws_iam_role_policy" "lamdba_exec_dynamodb_users" {
  name = "sf-api-dynamodb-users-policy"
  role = aws_iam_role.iam_for_graphql_lambda.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:Query",
          "dynamodb:BatchWriteItem",
          "dynamodb:GetItem",
          "dynamodb:DeleteItem",
          "dynamodb:PutItem",
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ]
        Resource = "${aws_dynamodb_table.users.arn}"
      }
    ]
  })
}

# Access to Dynamodb Connections Table
resource "aws_iam_role_policy" "lamdba_exec_dynamodb_connections" {
  name = "sf-api-dynamodb-connections-policy"
  role = aws_iam_role.iam_for_graphql_lambda.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ]
        Resource = "${aws_dynamodb_table.connections.arn}"
      }
    ]
  })
}

# Write access to Dynamodb Events Table
resource "aws_iam_role_policy" "lamdba_exec_dynamodb_events" {
  name = "sf-api-dynamodb-events-policy"
  role = aws_iam_role.iam_for_graphql_lambda.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem"
        ]
        Resource = "${aws_dynamodb_table.events.arn}"
      }
    ]
  })
}

# Write access to Dynamodb Subscriptions Table
resource "aws_iam_role_policy" "lamdba_exec_dynamodb_subscriptions" {
  name = "sf-api-dynamodb-subscriptions-policy"
  role = aws_iam_role.iam_for_graphql_lambda.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:BatchWriteItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = "${aws_dynamodb_table.subscriptions.arn}"
      }
    ]
  })
}

# Write access to Dynamodb Subscription Operations Table
resource "aws_iam_role_policy" "lamdba_exec_dynamodb_subscription_operations" {
  name = "sf-api-dynamodb-subscription-operations-policy"
  role = aws_iam_role.iam_for_graphql_lambda.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:BatchWriteItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem"
        ]
        Resource = "${aws_dynamodb_table.subscription_operations.arn}"
      }
    ]
  })
}

# Read access to Dynamodb Stream
resource "aws_iam_role_policy" "lamdba_exec_dynamodb_stream" {
  name = "sf-api-dynamodb-stream-policy"
  role = aws_iam_role.iam_for_graphql_lambda.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams"
        ]
        Resource = "${aws_dynamodb_table.events.stream_arn}"
      }
    ]
  })
}

# Lambda deployment
resource "aws_s3_bucket_object" "file_upload" {
  bucket = var.s3_bucket
  key    = "lambda-functions/sf-api.zip"
  source = "${path.module}/sf-api.zip"
  etag   = filemd5("${path.module}/sf-api.zip")
}

resource "aws_lambda_function" "http_handler" {
  function_name = "sf-api-httpHandler"
  role          = aws_iam_role.iam_for_graphql_lambda.arn
  handler       = "src/index.handleHttp"
  runtime       = "nodejs12.x"
  memory_size   = var.lambda_memory_size

  s3_bucket        = var.s3_bucket
  s3_key           = aws_s3_bucket_object.file_upload.key
  source_code_hash = filebase64sha256("${path.module}/sf-api.zip")

  environment {
    variables = {
      MAP_BOX_ACCESS_TOKEN = var.mapbox_access_token
    }
  }
}

resource "aws_lambda_function" "websocket_handler" {
  function_name = "sf-api-webSocketHandler"
  role          = aws_iam_role.iam_for_graphql_lambda.arn
  handler       = "src/index.handleWebSocket"
  runtime       = "nodejs12.x"
  memory_size   = var.lambda_memory_size

  s3_bucket        = var.s3_bucket
  s3_key           = aws_s3_bucket_object.file_upload.key
  source_code_hash = filebase64sha256("${path.module}/sf-api.zip")

  environment {
    variables = {
      MAP_BOX_ACCESS_TOKEN = var.mapbox_access_token
    }
  }
}

resource "aws_lambda_function" "dynamodb_stream_handler" {
  function_name = "sf-api-dynamoDBStreamHandler"
  role          = aws_iam_role.iam_for_graphql_lambda.arn
  handler       = "src/index.handleDynamoDBStream"
  runtime       = "nodejs12.x"
  memory_size   = var.lambda_memory_size

  s3_bucket        = var.s3_bucket
  s3_key           = aws_s3_bucket_object.file_upload.key
  source_code_hash = filebase64sha256("${path.module}/sf-api.zip")

  environment {
    variables = {
      MAP_BOX_ACCESS_TOKEN = var.mapbox_access_token
    }
  }
}

# API Gateway for http endpoint
resource "aws_api_gateway_rest_api" "api" {
  name = "sf-api"
  endpoint_configuration {
    types = ["EDGE"]
  }
}

## Options Request
resource "aws_api_gateway_method" "options" {
  authorization = "NONE"
  http_method   = "OPTIONS"
  resource_id   = aws_api_gateway_rest_api.api.root_resource_id
  rest_api_id   = aws_api_gateway_rest_api.api.id
}

resource "aws_api_gateway_method_response" "options" {
  resource_id = aws_api_gateway_rest_api.api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.api.id
  http_method = aws_api_gateway_method.options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
  response_models = {}
}

resource "aws_api_gateway_integration" "options" {
  http_method      = aws_api_gateway_method.options.http_method
  resource_id      = aws_api_gateway_rest_api.api.root_resource_id
  rest_api_id      = aws_api_gateway_rest_api.api.id
  type             = "MOCK"
  content_handling = "CONVERT_TO_TEXT"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "options" {
  depends_on = [
    aws_api_gateway_integration.options,
    aws_api_gateway_method_response.options
  ]
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_rest_api.api.root_resource_id
  http_method = aws_api_gateway_method.options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,DELETE,GET,HEAD,PATCH,POST,PUT'"
  }
  response_templates = {
    "application/json" = <<-EOF
      #set($origin = $input.params("Origin"))
      #if($origin == "")
        #set($origin = $input.params("origin"))
      #end
      #if($origin.matches(".+"))
        #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin)
      #end
    EOF
  }
}

# ANY Request
resource "aws_api_gateway_method" "http" {
  authorization = "NONE"
  http_method   = "ANY"
  resource_id   = aws_api_gateway_rest_api.api.root_resource_id
  rest_api_id   = aws_api_gateway_rest_api.api.id
}

resource "aws_api_gateway_integration" "http" {
  http_method             = aws_api_gateway_method.http.http_method
  resource_id             = aws_api_gateway_rest_api.api.root_resource_id
  rest_api_id             = aws_api_gateway_rest_api.api.id
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.http_handler.arn}/invocations"
}

resource "aws_api_gateway_deployment" "api" {
  depends_on = [
    aws_api_gateway_method.options,
    aws_api_gateway_method.http,
    aws_api_gateway_integration.http
  ]
  rest_api_id = aws_api_gateway_rest_api.api.id
}

resource "aws_api_gateway_stage" "api" {
  deployment_id = aws_api_gateway_deployment.api.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = var.environment
}

data "aws_caller_identity" "current" {}

resource "aws_lambda_permission" "http_apigateway_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.http_handler.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.api.id}/*/*/*"
}

# API Gateway for websocket endpoint
resource "aws_apigatewayv2_api" "websocket" {
  name                       = "sf-websocket-api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_integration" "websocket" {
  api_id           = aws_apigatewayv2_api.websocket.id
  integration_type = "AWS_PROXY"
  integration_uri  = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.websocket_handler.arn}/invocations"
}

resource "aws_lambda_permission" "websocket_apigateway_permission" {
  depends_on = [
    aws_apigatewayv2_api.websocket,
    aws_lambda_function.websocket_handler
  ]

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.websocket_handler.arn
  principal     = "apigateway.amazonaws.com"
}

resource "aws_apigatewayv2_route" "connect" {
  api_id             = aws_apigatewayv2_api.websocket.id
  route_key          = "$connect"
  authorization_type = "NONE"
  target             = "integrations/${aws_apigatewayv2_integration.websocket.id}"
}

resource "aws_apigatewayv2_route" "disconnect" {
  api_id             = aws_apigatewayv2_api.websocket.id
  route_key          = "$disconnect"
  authorization_type = "NONE"
  target             = "integrations/${aws_apigatewayv2_integration.websocket.id}"
}

resource "aws_apigatewayv2_route" "default" {
  api_id             = aws_apigatewayv2_api.websocket.id
  route_key          = "$default"
  authorization_type = "NONE"
  target             = "integrations/${aws_apigatewayv2_integration.websocket.id}"
}

resource "aws_apigatewayv2_deployment" "websocket" {
  depends_on = [
    aws_apigatewayv2_api.websocket,
    aws_apigatewayv2_route.connect,
    aws_apigatewayv2_route.disconnect,
    aws_apigatewayv2_route.default
  ]
  api_id = aws_apigatewayv2_api.websocket.id
}

resource "aws_apigatewayv2_stage" "websocket" {
  deployment_id = aws_apigatewayv2_deployment.websocket.id
  api_id        = aws_apigatewayv2_api.websocket.id
  name          = var.environment
}

# DynaomDB Stream event source mapping
resource "aws_lambda_event_source_mapping" "events" {
  depends_on = [
    aws_iam_role.iam_for_graphql_lambda
  ]
  event_source_arn  = aws_dynamodb_table.events.stream_arn
  function_name     = aws_lambda_function.dynamodb_stream_handler.arn
  starting_position = "TRIM_HORIZON"
}
