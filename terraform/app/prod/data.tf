
variable "environment" {
  type    = string
  default = "prod"
}
variable "image" {
  type    = string
  default = "211125642419.dkr.ecr.eu-west-2.amazonaws.com/server:latest"
}

data "aws_ssm_parameter" "ADMIN_PASSWORD" {
  name = "/${var.environment}/ADMIN_PASSWORD"
}
data "aws_ssm_parameter" "APP_SESSION_SECRET" {
  name = "/${var.environment}/APP_SESSION_SECRET"
}
data "aws_ssm_parameter" "FACEBOOK_APP_ID" {
  name = "/${var.environment}/FACEBOOK_APP_ID"
}
data "aws_ssm_parameter" "FACEBOOK_APP_SECRET" {
  name = "/${var.environment}/FACEBOOK_APP_SECRET"
}
data "aws_ssm_parameter" "GOOGLE_CLIENT_API" {
  name = "/${var.environment}/GOOGLE_CLIENT_API"
}
data "aws_ssm_parameter" "GOOGLE_CLIENT_SECRET" {
  name = "/${var.environment}/GOOGLE_CLIENT_SECRET"
}
data "aws_ssm_parameter" "GOOGLE_GEOCODING_KEY" {
  name = "/${var.environment}/GOOGLE_GEOCODING_KEY"
}
data "aws_ssm_parameter" "PAYPAL_API_URL" {
  name = "/${var.environment}/PAYPAL_API_URL"
}
data "aws_ssm_parameter" "PAYPAL_CLIENT_ID" {
  name = "/${var.environment}/PAYPAL_CLIENT_ID"
}
data "aws_ssm_parameter" "PAYPAL_SECRET_KEY" {
  name = "/${var.environment}/PAYPAL_SECRET_KEY"
}
data "aws_ssm_parameter" "TWILIO_AUTH" {
  name = "/${var.environment}/TWILIO_AUTH"
}
data "aws_ssm_parameter" "TWILIO_PHONE" {
  name = "/${var.environment}/TWILIO_PHONE"
}
data "aws_ssm_parameter" "TWILIO_SID" {
  name = "/${var.environment}/TWILIO_SID"
}
data "aws_ssm_parameter" "JWT_SECRET_KEY" {
  name = "/${var.environment}/JWT_SECRET_KEY"
}
data "aws_ssm_parameter" "DB_PASSWORD" {
  name = "/${var.environment}/DB_PASSWORD"
}
data "aws_ssm_parameter" "MAIL_EMAIL" {
  name = "/${var.environment}/MAIL_EMAIL"
}
data "aws_ssm_parameter" "MAIL_PASSWORD" {
  name = "/${var.environment}/MAIL_PASSWORD"
}
data "aws_ssm_parameter" "MAIL_FROM" {
  name = "/${var.environment}/MAIL_FROM"
}

