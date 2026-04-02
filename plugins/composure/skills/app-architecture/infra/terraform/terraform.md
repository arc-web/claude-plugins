# Terraform — Architecture Patterns

## Module Structure

### Root Module Layout

```
infra/
├── main.tf              ← Provider config, module calls
├── variables.tf         ← Input variables
├── outputs.tf           ← Output values
├── versions.tf          ← Required providers + Terraform version constraint
├── terraform.tfvars     ← Variable values (DO NOT commit sensitive values)
├── backend.tf           ← Remote state configuration
└── modules/
    ├── networking/       ← Reusable module
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    └── compute/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

### Per-Environment Structure

```
infra/
├── modules/              ← Shared, reusable
│   ├── networking/
│   └── compute/
├── environments/
│   ├── dev/
│   │   ├── main.tf       ← Calls modules with dev params
│   │   ├── backend.tf    ← Dev state backend
│   │   └── terraform.tfvars
│   ├── staging/
│   │   ├── main.tf
│   │   ├── backend.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── main.tf
│       ├── backend.tf
│       └── terraform.tfvars
```

Prefer per-environment directories over Terraform workspaces for production — workspaces share state backend configuration, which limits isolation.

---

## State Management

### Remote State (required for teams)

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "mycompany-terraform-state"
    key            = "prod/networking/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

**State locking** is non-negotiable. Use DynamoDB (AWS), Blob Storage lease (Azure), or GCS (GCP) to prevent concurrent applies.

### State File Rules

- **Never commit `.tfstate` to git** — contains secrets in plaintext
- **Never edit state manually** — use `terraform state mv`, `terraform import`
- **Back up state** — enable versioning on the state bucket
- **One state per environment** — separate blast radius

---

## Provider Organization

### Version Pinning

```hcl
# versions.tf
terraform {
  required_version = ">= 1.5.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
  }
}
```

Always pin provider versions. Use `~>` (pessimistic constraint) to allow patch updates but block major/minor surprises.

### Lock File

Commit `.terraform.lock.hcl` — it pins exact provider versions and hashes for reproducible builds.

---

## Variable and Output Conventions

### Variables

```hcl
variable "environment" {
  type        = string
  description = "Deployment environment (dev, staging, prod)"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t3.micro"
}
```

- Every variable gets a `description`
- Use `validation` blocks for constrained inputs
- Set `default` only when a sensible default exists
- Sensitive variables: use `sensitive = true`

### Outputs

```hcl
output "cluster_endpoint" {
  value       = module.k8s.endpoint
  description = "Kubernetes API server endpoint"
  sensitive   = false
}
```

Outputs are the module's public API. Name them clearly, document them.

---

## Naming Conventions

```hcl
# Resources: snake_case, descriptive
resource "aws_instance" "api_server" { }
resource "aws_security_group" "allow_https" { }

# Modules: snake_case
module "networking" { }
module "k8s_cluster" { }

# Variables: snake_case
variable "vpc_cidr_block" { }

# Locals: snake_case
locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Project     = var.project_name
  }
}
```

### Tagging Strategy

Apply common tags to every resource:

```hcl
resource "aws_instance" "api_server" {
  # ...
  tags = merge(local.common_tags, {
    Name = "${var.project_name}-api-${var.environment}"
    Role = "api"
  })
}
```

---

## Anti-Patterns

### ❌ State
- Committing `.tfstate` files to git (secrets in plaintext)
- No state locking (concurrent applies corrupt state)
- Single state file for all environments (blast radius = everything)
- Manual state edits instead of `terraform state` commands

### ❌ Structure
- Monolithic `main.tf` with 500+ lines (split into modules)
- Hardcoded values instead of variables
- No version constraints on providers
- Duplicated code across environments (use modules)

### ❌ Security
- Secrets in `terraform.tfvars` committed to git
- Overly permissive IAM policies for Terraform execution
- No `sensitive = true` on credential variables
- Using `*` in IAM policy resources for production

### ❌ Operations
- Running `terraform apply` without `terraform plan` review
- No CI/CD pipeline for infrastructure changes
- Skipping `terraform fmt` and `terraform validate`
- Not using `-target` carefully (creates state drift)
