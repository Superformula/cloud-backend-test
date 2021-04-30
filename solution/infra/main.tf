terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      # Its being already 2 months of testing (release on 26 Feb)
      version = "~> 3.30"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
}