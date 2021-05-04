variable "aws_region" {
  type    = string
  default = "us-east-2"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "s3_bucket" {
  type = string
}

variable "mapbox_access_token" {
  type = string
}

variable "lambda_memory_size" {
  type    = number
  default = 1024
}
