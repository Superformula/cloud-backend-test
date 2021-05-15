data "aws_caller_identity" "current" {}

locals {
  env            = terraform.workspace == "default" ? "dev" : terraform.workspace
  lambdas_path   = "${path.module}/../src/lambdas"
  aws_account_id = data.aws_caller_identity.current.account_id
}
