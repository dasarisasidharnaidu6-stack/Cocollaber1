output "vpc_id" {
  description = "Virtual Private Cloud Identifier"
  value       = aws_vpc.main.id
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS Endpoint"
  value       = aws_lb.alb.dns_name
}

output "database_endpoint" {
  description = "PostgreSQL Database Connection Endpoint (Internal VPC)"
  value       = aws_db_instance.postgres.endpoint
}

output "database_port" {
  description = "PostgreSQL Database Port"
  value       = aws_db_instance.postgres.port
}

output "ecs_cluster_name" {
  description = "ECS Cluster Name"
  value       = aws_ecs_cluster.main.name
}
