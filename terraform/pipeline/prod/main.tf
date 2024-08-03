module "pipeline" {
  source          = "../module"
  app_name        = "server"
  environment     = "prod"
  branch          = "master"
  repository_name = "selina/selina-server"
}
provider "aws" {
  region = "eu-west-2"
}