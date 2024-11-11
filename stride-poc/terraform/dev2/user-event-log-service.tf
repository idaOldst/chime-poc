module "user-event-log_sns_topic" {
  source      = "../modules/aws_sns_topic_fifo"
  kms_key_arn = module.kms_key.key_arn
  topic_name  = "${var.project}-${var.environment}-user-event-log-topic"
}

module "user_event_log_sqs_queue" {
  source        = "../modules/aws_sqs_subscription"
  queue_name    = "${var.project}-${var.environment}-user-event-log-queue"
  sns_topic_arn = module.user-event-log_sns_topic.topic_arn

}

resource "null_resource" "user-event-log-service-docker_image" {
  depends_on = [ module.user-event-service-ecr ]
  provisioner "local-exec" {
   command = "docker login ${module.user-event-service-ecr.token_proxy_endpoint} -u AWS -p ${module.user-event-service-ecr.token_password} >> output.txt && docker info >> output.txt && docker pull alpine >> output.txt && docker tag alpine ${module.user-event-service-ecr.repository_url}:latest >> output.txt && docker push ${module.user-event-service-ecr.repository_url}:latest >> output-user-event-log-service.txt"
  }
}


module "user-event-service-ecr" {
  source          = "../modules/aws_ecr"
  repository_name = "${var.project}-${var.environment}-user-event-log-service"
}


resource "aws_lambda_event_source_mapping" "user-event-log-service-sqs_trigger" {
  event_source_arn = module.user_event_log_sqs_queue.queue_arn
  function_name    = module.user-event-service-lambda.lambda_function_name
} 

module "user-event-service-lambda" {
  source             = "../modules/aws_lambda_docker"
  function_name      = "${var.project}-${var.environment}-user-event-log-service"
  role_arn           = module.lamda_task_role.role_arn
  docker_image_uri   = "${module.user-event-service-ecr.repository_url}:latest"
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.lambda_security_group_outbound_only.security_group_id]
  timeout            = 900
  memory_size        = 128
  environment_variables = {
    DYNAMO_DB_USER_TABLE   = "${var.project}-${var.environment}-users"
    AWS_SECRET_ID          = "${module.secret_manager.secret_name}"
    DEFAULT_REGION         = "${var.aws_region}"
    USER_COMMAND_SERVICE_SNS_TOPIC = "${module.user-command-service-sns_topic.topic_arn}"
    FE_BASE_URL="http://nx-template2-dev2-webapp-alb-118676189.eu-west-2.elb.amazonaws.com/api/events"
  }
  depends_on = [ null_resource.user-event-log-service-docker_image ]

}
