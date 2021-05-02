locals {
  zipfile = "../lambda-zips/fetch-location-lambda.zip"
}

variable "MAPBOX_ACCESS_TOKEN" {
  type        = string
  description = "Access token of the Mapbox API"
  sensitive   = true
}

variable "MAPBOX_GEOCODING_PLACES_API_URL" {
  type        = string
  description = "URL of the Mapbox API for geocoding service (using the endpoint 'mapbox.places'). If no value is inserted, 'https://api.mapbox.com/geocoding/v5/mapbox.places' will be used."
  default     = "https://api.mapbox.com/geocoding/v5/mapbox.places"
}

resource "aws_iam_role" "iam_for_fetch_location_lambda" {
  name = "iam_for_fetch_location_lambda"

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

resource "aws_iam_policy" "fetch_location_lambda_logging" {
  name        = "fetch_location_lambda_logging"
  path        = "/"
  description = "IAM policy for logging from fetch_location_lambda"

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

resource "aws_iam_role_policy_attachment" "fetch_location_lambda_logs" {
  role       = aws_iam_role.iam_for_fetch_location_lambda.name
  policy_arn = aws_iam_policy.fetch_location_lambda_logging.arn
}

resource "aws_lambda_function" "fetch_location_lambda" {
  filename      = local.zipfile
  function_name = "fetch_location"
  role          = aws_iam_role.iam_for_fetch_location_lambda.arn
  handler       = "fetch-location-handler.handler"

  source_code_hash = filebase64sha256(local.zipfile)

  runtime = "nodejs14.x"

  environment {
    variables = {
      MAPBOX_ACCESS_TOKEN = var.MAPBOX_ACCESS_TOKEN
      MAPBOX_GEOCODING_PLACES_API_URL = var.MAPBOX_GEOCODING_PLACES_API_URL
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.fetch_location_lambda_logs,
  ]
}