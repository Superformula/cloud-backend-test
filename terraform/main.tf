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
    dynamodb_table = "tflock-tfstate-clericuzzi-cloud-developer-test-450001857077"
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "super-formula"
}

module "iam" {
  source = "./modules/iam"
}

module "dynamo" {
  source = "./modules/dynamo"
}

module "remote-state" {
  source         = "./modules/remote-state"
  aws_account_id = local.aws_account_id
}

module "appsync" {
  source           = "./modules/appsync"
  dynamo_table     = module.dynamo.dynamodb_table
  dynamo_table_arn = module.dynamo.dynamodb_table_arn
}

module "layer" {
  source      = "./modules/layer"
  layers_path = local.layers_path
}

module "api" {
  source                 = "./modules/api"
  workspace              = local.env
  lambda_crud_invoke_arn = module.lambda.lambda_crud_invoke_arn
  # lambda_geolocation_invoke_arn = module.lambda.lambda_geolocation_invoke_arn
}

module "lambda" {
  source                     = "./modules/lambda"
  aws_region                 = var.aws_region[local.env]
  dynamo_table               = module.dynamo.dynamodb_table
  iam_role_arn               = module.iam.iam_role_arn
  lambdas_path               = local.lambdas_path
  aws_account_id             = local.aws_account_id
  aws_access_key             = "AKIAWRRRTNI22GY4QB4W"
  project_lambda_layer       = module.layer.project_lambda_layer
  aws_secret_access_key      = "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"
  geolocation_mapbox_api_key = "pk.eyJ1IjoiY2xlcmljdXp6aSIsImEiOiJja29uM3UzNjIwMTA0Mm9yM2k5Z2s0ZWN1In0.Cc0aeu_0ui30v0zthtJMZA"
}
