module "kms_key" {
  source                  = "../modules/aws_kms_key"
  description             = "${var.project}-${var.environment}-kms-key"
  deletion_window_in_days = 7
  rotation_period_in_days = 90
}


output "kms_key_arn" {
  description = "The ARN of the KMS key"
  value       = module.kms_key.key_arn
}
