module "authentication-command-service-fifo_sns_topic" {
  source      = "../modules/aws_sns_topic_fifo"
  kms_key_arn = module.kms_key.key_arn
  topic_name  = "${var.project}-${var.environment}-authentication-command-service-topic"
}

module "authentication-command-service_sqs_queue" {
  source        = "../modules/aws_sqs_subscription"
  queue_name    = "${var.project}-${var.environment}-authentication-command-service-log-queue"
  sns_topic_arn = module.authentication-command-service-fifo_sns_topic.topic_arn

}



module "authentication-command-service-ecr" {
  source          = "../modules/aws_ecr"
  repository_name = "${var.project}-${var.environment}-authentication-command-service"
}


resource "null_resource" "authentication-command-service-docker_image" {
  depends_on = [ module.authentication-command-service-ecr ]
  provisioner "local-exec" {
   command = "docker login ${module.authentication-command-service-ecr.token_proxy_endpoint} -u AWS -p ${module.authentication-command-service-ecr.token_password} >> output.txt && docker info >> output.txt && docker pull alpine >> output.txt && docker tag alpine ${module.authentication-command-service-ecr.repository_url}:latest >> output.txt && docker push ${module.authentication-command-service-ecr.repository_url}:latest >> output-authentication-command-service.txt"
  }
}

module "authentication-command-service-lambda" {
  source             = "../modules/aws_lambda_docker"
  function_name      = "${var.project}-${var.environment}-authentication-command-service"
  role_arn           = module.lamda_task_role.role_arn
  docker_image_uri   = "${module.authentication-command-service-ecr.repository_url}:latest"
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.lambda_security_group_outbound_only.security_group_id]
  timeout            = 900
  memory_size        = 128
  environment_variables = {
    DYNAMO_DB_AUTHENTICATION_TABLE   = "${var.project}-${var.environment}-authentication"
    AWS_SECRET_ID          = "${module.secret_manager.secret_name}"
    DEFAULT_REGION         = "${var.aws_region}"
    AWS_COGNITO_USER_POOL_ID= "${module.cognito_user_pool.pool_id}"
    AWS_COGNITO_CLIENT_ID= "${module.cognito_user_pool.client_id}"
    FE_BASE_URL="http://nx-template2-dev2-webapp-alb-118676189.eu-west-2.elb.amazonaws.com/api/events"
  }
  depends_on = [ null_resource.authentication-command-service-docker_image ]

}

resource "aws_lambda_event_source_mapping" "authentication-command-service_sqs_trigger" {
  event_source_arn = module.authentication-command-service_sqs_queue.queue_arn
  function_name    = module.authentication-command-service-lambda.lambda_function_name
}