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
