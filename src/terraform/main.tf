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
  region  = var.aws_region
  profile = var.aws_profile
}

resource "aws_s3_bucket" "devclericuzzi-super-formula-test-deploy-bucket" {
  acl    = "private"
  bucket = "devclericuzzi-super-formula-test-deploy-bucket"

  tags = {
    "Name"        = "Deployment bucket for the api packages"
    "Environment" = "dev"
  }
}
