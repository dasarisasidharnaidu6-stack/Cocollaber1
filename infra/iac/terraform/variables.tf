variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Target deployment environment (staging, production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project identifier for resource naming and tagging"
  type        = string
  default     = "cocollaber"
}

variable "vpc_cidr" {
  description = "CIDR block for the Virtual Private Cloud"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones for multi-AZ topology"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "db_instance_class" {
  description = "RDS PostgreSQL compute instance class"
  type        = string
  default     = "db.t4g.small"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS database in GB"
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "cocollaber_db"
}

variable "db_username" {
  description = "Master database username"
  type        = string
  default     = "cocollaber_admin"
}

variable "db_password" {
  description = "Master database password (injected via Secret Manager or CI variable, never committed)"
  type        = string
  sensitive   = true
}

variable "backend_cpu" {
  description = "Fargate vCPU units for backend service (256 = 0.25 vCPU, 512 = 0.5 vCPU)"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Fargate memory allocation for backend service in MB"
  type        = number
  default     = 1024
}

variable "frontend_cpu" {
  description = "Fargate vCPU units for frontend service"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Fargate memory allocation for frontend service in MB"
  type        = number
  default     = 512
}

variable "domain_name" {
  description = "Primary public domain for CoCollaber deployment"
  type        = string
  default     = "cocollaber.example.com"
}
