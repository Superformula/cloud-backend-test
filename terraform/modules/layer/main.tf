data "archive_file" "lambda_layer" {
  type        = "zip"
  source_dir  = var.layers_path
  output_path = "files/project-code-layer.zip"
}

resource "aws_lambda_layer_version" "project-code" {
  filename   = "files/project-code-layer.zip"
  layer_name = "project-code"

  compatible_runtimes = ["nodejs14.x"]
}
