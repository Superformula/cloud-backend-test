variable "aws_region" {
  type = object({
    dev  = string
    prod = string
  })

  default = {
    dev  = "us-east-1"
    prod = "us-east-2"
  }
}

variable "aws_profile" {
  type    = string
  default = "super-formula"
}
