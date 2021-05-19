terraform {
  required_version = "0.15.3"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.39.0"
    }
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "super-formula"
}

module "dynamo" {
  source = "./modules/dynamo"
}

module "appsync" {
  source           = "./modules/appsync"
  dynamo_table     = module.dynamo.dynamodb_table
  dynamo_table_arn = module.dynamo.dynamodb_table_arn
}
