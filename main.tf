variable "graphql_api_name" {
  description = "Name of pai"
  default = "graphql_api"
}

variable "graphql_api_path" {
  description = "Api Path"
  default = "graphql"
}

variable "aws_access_key" {
  description = "AWS access key"
  default = "AKIAZ4SUYHD4JA2JAX6P"
}

variable "aws_secret_key" {
  description = "AWS secret key"
  default = "hxe9e3qdMRlGURhVBQgCM4pKMcPA1GhZg3JDQiZA"
}

variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "deploy_stage"{
  description = "Deployment Stage"
  default = "staging"
}

provider "aws" {
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region     = "${var.aws_region}"
}
# expose the discovered account_id etc
data "aws_caller_identity" "current" {}

output "aws_account_id" {
  value = "${data.aws_caller_identity.current.account_id}"
}

output "caller_arn" {
  value = "${data.aws_caller_identity.current.arn}"
}

output "caller_user" {
  value = "${data.aws_caller_identity.current.user_id}"
}

module "graphql_lambda"{
  source = "./iac/aws/lambda"
  name = "graphql"
  zip_file_path      = "./dist/"
}

module "graphql_lambda_api_gateway"{
  source = "./iac/aws/api_gateway/aws_proxy"
  api_name = "${var.graphql_api_name}"
  api_path = "${var.graphql_api_path}"
  lambda_arn ="${module.graphql_lambda.arn}"
  region     = "${var.aws_region}"
  account_id = "${data.aws_caller_identity.current.account_id}"
  deploy_stage = "${var.deploy_stage}"

}

output "url" {
  value = "${module.graphql_lambda_api_gateway.url}/${var.graphql_api_path}"
}