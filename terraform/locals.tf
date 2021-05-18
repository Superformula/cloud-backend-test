data "aws_caller_identity" "current" {}

locals {
  env            = terraform.workspace == "default" ? "dev" : terraform.workspace
  layer_name     = "project-code"
  layers_path    = "${path.module}/../app/layers"
  lambdas_path   = "${path.module}/../app/lambdas"
  aws_account_id = data.aws_caller_identity.current.account_id
}
