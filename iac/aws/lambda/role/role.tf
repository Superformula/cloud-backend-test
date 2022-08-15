resource "aws_iam_role" "iam_role_for_lambda" {
  name = "iam_role_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}
resource "aws_iam_role_policy" "lambda_log_policy" {
  name   = "lambda_log_policy"
  role   = "${aws_iam_role.iam_role_for_lambda.id}"
  policy = "${data.aws_iam_policy_document.lambda_log_policy.json}"
}

data "aws_iam_policy_document" "lambda_log_policy" {

  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["*"]

  }
}


output "role"{
  value = "${aws_iam_role.iam_role_for_lambda.arn}"
}