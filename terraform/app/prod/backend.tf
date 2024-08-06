terraform {
  backend "s3" {
    bucket = "terraform-states-211125642419"
    key    = "prod/ecs-services/server/terraform.tfvars"
    region = "eu-west-2"
  }
}
