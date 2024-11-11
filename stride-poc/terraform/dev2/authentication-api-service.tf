module "authentication-api-service-ecr" {
  source          = "../modules/aws_ecr"
  repository_name = "${var.project}-${var.environment}-authentication-api-service"
}


resource "null_resource" "authentication-api-service-docker_image" {
  depends_on = [ module.authentication-api-service-ecr ]
  provisioner "local-exec" {
   command = "docker login ${module.authentication-api-service-ecr.token_proxy_endpoint} -u AWS -p ${module.authentication-api-service-ecr.token_password} >> output.txt && docker info >> output.txt && docker pull alpine >> output.txt && docker tag alpine ${module.authentication-api-service-ecr.repository_url}:latest >> output.txt && docker push ${module.authentication-api-service-ecr.repository_url}:latest >> output-authentication-api-service.txt"
  }
}

module "authentication-api-service-lambda" {
  source             = "../modules/aws_lambda_docker"
  function_name      = "${var.project}-${var.environment}-authentication-api-service"
  role_arn           = module.lamda_task_role.role_arn
  docker_image_uri   = "${module.authentication-api-service-ecr.repository_url}:latest"
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.lambda_security_group_outbound_only.security_group_id]
  timeout            = 900
  memory_size        = 128
  environment_variables = {
    DYNAMO_DB_AUTHENTICATION_TABLE   = "${var.project}-${var.environment}-authentication"
    AWS_SECRET_ID          = "${module.secret_manager.secret_name}"
    DEFAULT_REGION         = "${var.aws_region}"
    AUTHENTICATION_EVENT_SNS_TOPIC = "${module.authentication-event-log-service-fifo_sns_topic.topic_arn}"
    FE_BASE_URL="http://nx-template2-dev2-webapp-alb-118676189.eu-west-2.elb.amazonaws.com/api/events"
  }
  depends_on = [ null_resource.authentication-api-service-docker_image ]
}


