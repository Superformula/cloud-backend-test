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

  environment {
    variables = {
      "USERS_TABLE_NAME"    = var.users_table_name
      "NAME_INDEX"          = var.user_name_index
      "MAPBOX_ACCESS_TOKEN" = var.mapbox_access_token
      "STAGE_NAME"          = var.gateway_stage
    }
  }
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.gql_lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:BatchGetItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ],
        Resource = [
          aws_dynamodb_table.users_table.arn,
          "${aws_dynamodb_table.users_table.arn}/index/${var.user_name_index}"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "*"
      }
    ]
  })
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
