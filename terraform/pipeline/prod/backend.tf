terraform {
  backend "s3" {
    bucket = "terraform-states-211125642419"
    key    = "prod/server/pipeline/terraform.tfvars"
    region = "eu-west-2"
  }
}
