data "aws_iam_policy_document" "labmda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    effect = "Allow"
    sid    = ""
  }
}

resource "aws_iam_role" "user_lambda_role" {
  name               = "user-api-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.labmda_assume_role.json
}

data "aws_iam_policy_document" "labmda_policy" {
  statement {
    actions = ["dynamodb:*"]

    resources = [
      "${aws_dynamodb_table.users_table.arn}",
    ]
    effect = "Allow"
  }

  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["*"]
    effect    = "Allow"
  }
}

resource "aws_iam_role_policy" "lambda_dynamo_policy" {
  depends_on = [
    aws_dynamodb_table.users_table
  ]
  name   = "lambda_dynamo_policy"
  role   = aws_iam_role.user_lambda_role.id
  policy = data.aws_iam_policy_document.labmda_policy.json
}
