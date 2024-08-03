module "ecs-service" {
  source      = "../module"
  environment = var.environment
  cluster_arn = "arn:aws:ecs:eu-west-2:211125642419:cluster/prod-cluster"
  subnet_ids  = ["subnet-0fc30fbddf024c925", "subnet-07b4e02d8ef9ace5b", "subnet-08d271a06428162c9"]
  # subnet_ids = ["subnet-0fa0128e4b9148f9a","subnet-042c419ffae0e83fb"]
  image = var.image
  service = {
    service_name = "server"
    environment = [
      {
        "name" : "PORT",
        "value" : 8080
      },
      {
        "name" : "SERVER_URL",
        "value" : "https://api.rentabout.com"
      },
      {
        "name" : "CLIENT_URL",
        "value" : "https://rentabout.com"
      },
      {
        "name" : "DB_HOST",
        "value" : "rentabout.cr2s2ssiqiiq.eu-west-2.rds.amazonaws.com"
      },
      {
        "name" : "DB_PORT",
        "value" : "5432"
      },
      {
        "name" : "DB_USER_NAME",
        "value" : "rentabout"
      },
      {
        "name" : "DB_DATABASE",
        "value" : "rentabout"
      },
      {
        "name" : "ADMIN_NAME",
        "value" : "admin"
      },
      {
        "name" : "ADMIN_EMAIL",
        "value" : "admin@ydk.com"
      },
      {
        "name" : "MAIL_HOST",
        "value" : "smtp.gmail.com"
      },
      {
        "name" : "MAIL_PORT",
        "value" : 587
      },
      {
        "name" : "DB_PASSWORD",
        "value" : data.aws_ssm_parameter.DB_PASSWORD.value
      },
      {
        "name" : "ADMIN_PASSWORD",
        "value" : data.aws_ssm_parameter.ADMIN_PASSWORD.value
      },
      {
        "name" : "APP_SESSION_SECRET",
        "value" : data.aws_ssm_parameter.APP_SESSION_SECRET.value
      },
      {
        "name" : "JWT_SECRET_KEY",
        "value" : data.aws_ssm_parameter.JWT_SECRET_KEY.value
      },
      {
        "name" : "MAIL_EMAIL",
        "value" : data.aws_ssm_parameter.MAIL_EMAIL.value
      },
      {
        "name" : "MAIL_FROM",
        "value" : data.aws_ssm_parameter.MAIL_FROM.value
      },
      {
        "name" : "MAIL_PASSWORD",
        "value" : data.aws_ssm_parameter.MAIL_PASSWORD.value
      },
      {
        "name" : "FACEBOOK_APP_ID",
        "value" : data.aws_ssm_parameter.FACEBOOK_APP_ID.value
      },
      {
        "name" : "FACEBOOK_APP_SECRET",
        "value" : data.aws_ssm_parameter.FACEBOOK_APP_SECRET.value
      },
      {
        "name" : "GOOGLE_CLIENT_API",
        "value" : data.aws_ssm_parameter.GOOGLE_CLIENT_API.value
      },
      {
        "name" : "GOOGLE_CLIENT_SECRET",
        "value" : data.aws_ssm_parameter.GOOGLE_CLIENT_SECRET.value
      },
      {
        "name" : "TWILIO_PHONE",
        "value" : data.aws_ssm_parameter.TWILIO_PHONE.value
      },
      {
        "name" : "TWILIO_SID",
        "value" : data.aws_ssm_parameter.TWILIO_SID.value
      },
      {
        "name" : "TWILIO_AUTH",
        "value" : data.aws_ssm_parameter.TWILIO_AUTH.value
      },
      {
        "name" : "MAX_FILE_SIZE",
        "value" : "5242880"
      },
      {
        "name" : "MAX_SMALL_FILE_SIZE",
        "value" : "1048576"
      },
      {
        "name" : "MAX_SUMMARY_FILE_SIZE",
        "value" : "26214400"
      },
      {
        "name" : "PAYPAL_CLIENT_ID",
        "value" : data.aws_ssm_parameter.PAYPAL_CLIENT_ID.value
      },
      {
        "name" : "PAYPAL_SECRET_KEY",
        "value" : data.aws_ssm_parameter.PAYPAL_SECRET_KEY.value
      },
      {
        "name" : "PAYPAL_API_URL",
        "value" : data.aws_ssm_parameter.PAYPAL_API_URL.value
      },
      {
        "name" : "GOOGLE_GEOCODING_KEY",
        "value" : data.aws_ssm_parameter.GOOGLE_GEOCODING_KEY.value
      }
    ]
  }
}
provider "aws" {
  region = "eu-west-2"
}
