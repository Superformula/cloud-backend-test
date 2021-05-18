resource "aws_appsync_graphql_api" "this" {
  name                = "our-graphql"
  authentication_type = "API_KEY"

  schema = file("./modules/appsync/schema.graphql")

  additional_authentication_provider {
    authentication_type = "AWS_IAM"
  }
}

resource "aws_appsync_api_key" "this" {
  api_id  = aws_appsync_graphql_api.this.id
  expires = "2022-01-01T04:00:00Z"

}

resource "aws_iam_role" "iam_role" {
  name = "appSyncAllowRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["sts:AssumeRole"]
        Effect = "Allow"
        Principal = {
          Service = "appsync.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "role_policy" {
  name = "appSyncAllowRole_policy"
  role = aws_iam_role.iam_role.id

  policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Action" : ["dynamodb:*"],
        "Effect" = "Allow",
        "Resource" : [
          "${var.dynamo_table_arn}"
        ]
      }
    ]
  })
}

resource "aws_appsync_datasource" "dynamo-table" {
  type             = "AMAZON_DYNAMODB"
  name             = "appSync_dynamo_source"
  api_id           = aws_appsync_graphql_api.this.id
  service_role_arn = aws_iam_role.iam_role.arn

  dynamodb_config {
    table_name = var.dynamo_table
  }
}

resource "aws_appsync_resolver" "getItem" {
  type        = "Query"
  field       = "getItem"
  api_id      = aws_appsync_graphql_api.this.id
  data_source = aws_appsync_datasource.dynamo-table.name

  request_template  = file("./modules/appsync/getItem/request.vtl")
  response_template = file("./modules/appsync/getItem/response.vtl")
}

resource "aws_appsync_resolver" "listUsers" {
  type        = "Query"
  field       = "listUsers"
  api_id      = aws_appsync_graphql_api.this.id
  data_source = aws_appsync_datasource.dynamo-table.name

  request_template  = file("./modules/appsync/listUsers/request.vtl")
  response_template = file("./modules/appsync/listUsers/response.vtl")
}
