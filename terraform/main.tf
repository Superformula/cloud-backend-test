terraform {
  required_version = "0.15.3"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.39.0"
    }
  }

  backend "s3" {
    key            = "terraform.tfstate"
    bucket         = "tfstate-clericuzzi-cloud-developer-test-450001857077"
    region         = "us-east-1"
    profile        = "super-formula"
    dynamodb-table = "tflock-tfstate-clericuzzi-cloud-developer-test-450001857077"
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "super-formula"
}

module "api" {
  source            = "./modules/api"
  workspace         = local.env
  lambda_invoke_arn = module.lambda.lambda_invoke_arn
}

module "iam" {
  source = "./modules/iam"
}

module "lambda" {
  source         = "./modules/lambda"
  aws_region     = var.aws_region[local.env]
  dynamo_table   = module.dynamo.dynamodb_table
  iam_role_arn   = module.iam.iam_role_arn
  lambdas_path   = local.lambdas_path
  aws_account_id = local.aws_account_id
}

module "dynamo" {
  source = "./modules/dynamo"
}

module "appsync" {
  source           = "./modules/appsync"
  dynamo_table     = module.dynamo.dynamodb_table
  dynamo_table_arn = module.dynamo.dynamodb_table_arn
}

module "remote-state" {
  source         = "./modules/remote-state"
  aws_account_id = local.aws_account_id
}
