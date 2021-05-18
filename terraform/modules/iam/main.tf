data "aws_iam_policy_document" "lambda-assume-role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }

  statement {
    sid       = "AllowInvokingLambdas"
    effect    = "Allow"
    actions   = ["lambda:InvokeFunction"]
    resources = ["arn:aws:lambda:*:*:function:*"]
  }

  statement {
    sid       = "AllowCreatingLogGroups"
    effect    = "Allow"
    actions   = ["logs:CreateLogGroup"]
    resources = ["arn:aws:logs:*:*:*"]
  }

  statement {
    sid       = "AllowWritingLogs"
    effect    = "Allow"
    actions   = ["logs:CreateLogStreams", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:*:*:log-group:/aws/lambda/*:*"]
  }
}

data "aws_iam_policy_document" "s3" {
  statement {
    sid       = "AllowS3Actions"
    effect    = "Allow"
    resources = ["*"]
    actions = [
      "s3:*"
    ]
  }

  statement {
    sid       = "AllowInvokingLambdas"
    effect    = "Allow"
    actions   = ["lambda:InvokeFunction"]
    resources = ["arn:aws:lambda:*:*:function:*"]
  }

  statement {
    sid       = "AllowCreatingLogGroups"
    effect    = "Allow"
    actions   = ["logs:CreateLogGroup"]
    resources = ["arn:aws:logs:*:*:*"]
  }

  statement {
    sid       = "AllowWritingLogs"
    effect    = "Allow"
    actions   = ["logs:CreateLogStreams", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:*:*:log-group:/aws/lambda/*:*"]
  }
}

resource "aws_iam_role" "s3" {
  name               = "our-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda-assume-role.json
}

resource "aws_iam_policy" "s3" {
  name   = "our-lambda-execute-policy"
  policy = data.aws_iam_policy_document.s3.json
}

resource "aws_iam_role_policy_attachment" "s3-execute" {
  role       = aws_iam_role.s3.name
  policy_arn = aws_iam_policy.s3.arn
}
