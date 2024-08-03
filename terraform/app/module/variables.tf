variable "environment" {
  type = string
}
variable "service" {
  description = "List of ECS services to be deployed"
}
variable "cluster_arn" {
  type = string
}
variable "subnet_ids" {
  type = list(any)
}
variable "image" {
  type    = string
  default = "355354508679.dkr.ecr.eu-central-1.amazonaws.com/bitads:latest"
}
variable "tasks_iam_role_statements" {
  description = "Permissions for ECS task"
  default     = []
}
