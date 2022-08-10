variable "name" {
  description = "Name of lambda"
  default = "lambda"
}

variable "runtime" {
  description = "Runtime of lambda"
  default     = "nodejs14.x"
}
variable "zip_file_path" {
  description = "zip file path"
  default     = "./"
}

variable "handler" {
  description = "Handler name"
  default     = "handler"
}


module "role"{
  source = "./role"
}

resource "aws_lambda_function" "lambda" {
  filename      = "${var.zip_file_path}${var.name}.zip"
  function_name = "${var.name}_lambda"
  handler       = "${var.name}_lambda.${var.handler}"
  role          = "${module.role.role}"
  runtime       = "${var.runtime}"
  source_code_hash = filebase64sha256("${var.zip_file_path}${var.name}.zip")
  timeout = 59
  environment {
    variables = {
      NODE_ENV = "aws"
    }
  }
}

output "name" {
  value = "${aws_lambda_function.lambda.function_name}"
}

output "arn" {
  value = "${aws_lambda_function.lambda.arn}"
}