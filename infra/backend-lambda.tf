locals {
  backendZipFile = "../lambda-zips/backend-lambda.zip"
}

# this role will be assigned to our backend's AWS Lambda resource 
resource "aws_iam_role" "iam_for_backend_lambda" {
  name = "iam_for_backend_lambda"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
  })
}

# this policy grants that our backend lambda will be able to handle logging
resource "aws_iam_policy" "backend_lambda_logging" {
  name        = "backend_lambda_logging"
  path        = "/"
  description = "IAM policy for logging from backend_lambda"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "arn:aws:logs:*:*:*",
        "Effect" : "Allow"
      }
    ]
  })
}

# attach the logging policy to the execution role of this lambda 
resource "aws_iam_role_policy_attachment" "backend_lambda_logs" {
  role       = aws_iam_role.iam_for_backend_lambda.name
  policy_arn = aws_iam_policy.backend_lambda_logging.arn
}

# this policy grants that our backend lambda will be able to handle logging
resource "aws_iam_role_policy" "backend_lambda_dynamodb" {
  name = "backend_lambda_dynamodb"
  role = aws_iam_role.iam_for_backend_lambda.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        "Resource" : "${aws_dynamodb_table.users-table.arn}",
        "Effect" : "Allow"
      }
    ]
  })

  depends_on = [
    aws_dynamodb_table.users-table,
  ]
}

# this policy gives permission for the Backend Lambda to invoke Fetch Location Lambda
resource "aws_iam_role_policy" "invoke_fetch_location_from_backend" {
  name = "invoke_fetch_location_from_backend"
  role = aws_iam_role.iam_for_backend_lambda.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "lambda:InvokeFunction"
        ],
        "Resource" : "${aws_lambda_function.fetch_location_lambda.arn}",
        "Effect" : "Allow"
      }
    ]
  })

  depends_on = [
    aws_lambda_function.fetch_location_lambda,
  ]
}

# the AWS Lambda resource for our backend
resource "aws_lambda_function" "backend_lambda" {
  filename      = local.backendZipFile
  function_name = "backend_handler"
  role          = aws_iam_role.iam_for_backend_lambda.arn
  handler       = "server/backend-lambda.handler"

  source_code_hash = filebase64sha256(local.backendZipFile)

  runtime = "nodejs14.x"

  environment {
    variables = {
      # we are using preffix "TF_VAR" here to share the same declared env var between terraform and the dev-server (which is not deployed)
      TF_VAR_API_DEPLOYMENT_STAGE_NAME = var.API_DEPLOYMENT_STAGE_NAME
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.backend_lambda_logs,
    aws_iam_role.iam_for_backend_lambda,
  ]
}