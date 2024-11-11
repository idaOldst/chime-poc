module "user-command-service-sns_topic" {
  source      = "../modules/aws_sns_topic_fifo"
  kms_key_arn = module.kms_key.key_arn
  topic_name  = "${var.project}-${var.environment}-user-command-service-topic"
}

module "user-command-service-sqs_queue" {
  source        = "../modules/aws_sqs_subscription"
  queue_name    = "${var.project}-${var.environment}-user-command-service-queue"
  sns_topic_arn = module.user-command-service-sns_topic.topic_arn

}


resource "null_resource" "user-command-service-docker_image" {
  depends_on = [ module.user-command-service-ecr ]
  provisioner "local-exec" {
   command = "docker login ${module.user-command-service-ecr.token_proxy_endpoint} -u AWS -p ${module.user-command-service-ecr.token_password} >> output.txt && docker info >> output.txt && docker pull alpine >> output.txt && docker tag alpine ${module.user-command-service-ecr.repository_url}:latest >> output.txt && docker push ${module.user-command-service-ecr.repository_url}:latest >> output-user-command-service.txt"
  }
}


module "user-command-service-ecr" {
  source          = "../modules/aws_ecr"
  repository_name = "${var.project}-${var.environment}-user-command-service"
}

resource "aws_lambda_event_source_mapping" "user-command-service-sqs_trigger" {
  event_source_arn = module.user-command-service-sqs_queue.queue_arn
  function_name    = module.user-command-service-lambda.lambda_function_name
}



module "user-command-service-lambda" {
  source             = "../modules/aws_lambda_docker"
  function_name      = "${var.project}-${var.environment}-user-command-service"
  role_arn           = module.lamda_task_role.role_arn
  docker_image_uri   = "${module.user-command-service-ecr.repository_url}:latest"
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.lambda_security_group_outbound_only.security_group_id]
  timeout            = 900
  memory_size        = 128
  environment_variables = {
    DYNAMO_DB_USER_TABLE   = "${var.project}-${var.environment}-users"
    AWS_SECRET_ID          = "${module.secret_manager.secret_name}"
    DEFAULT_REGION         = "${var.aws_region}"
    FE_BASE_URL="http://nx-template2-dev2-webapp-alb-118676189.eu-west-2.elb.amazonaws.com/api/events"
  }
  depends_on = [ null_resource.user-command-service-docker_image ]

}
