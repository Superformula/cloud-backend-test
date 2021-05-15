output "iam_role_arn" {
  value       = aws_iam_role.s3.arn
  description = "the executing role arn"
}
