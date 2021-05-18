data "aws_caller_identity" "current" {}

locals {
  env            = terraform.workspace == "default" ? "dev" : terraform.workspace
  layers_path    = "${path.module}/../dist/layers"
  lambdas_path   = "${path.module}/../dist/lambdas"
  aws_account_id = data.aws_caller_identity.current.account_id
}
