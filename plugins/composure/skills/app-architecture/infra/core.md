# Infrastructure Core — GitOps, Secrets & Environment Management

## Manifest Organization

### Directory Structure Conventions

Infra projects should separate concerns by purpose, not by tool:

```
project/
├── deploy/                    ← Deployment manifests (K8s, Helm, Compose)
│   ├── base/                  ← Shared base configurations
│   ├── overlays/              ← Per-environment overrides
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   └── charts/                ← Helm charts (if using Helm)
├── infra/                     ← Infrastructure provisioning (Terraform, Pulumi)
│   ├── modules/               ← Reusable modules
│   └── environments/          ← Per-environment configs
├── scripts/                   ← Automation scripts (setup, teardown, migration)
└── docs/                      ← Runbooks, architecture decisions
```

**One resource per file** for K8s manifests. Group related resources in directories, not multi-document YAML files. This makes diffs readable and reduces merge conflicts.

**Exception**: Small clusters (K3s homelabs) can use grouped files if the total is under 20 resources.

---

## GitOps Workflow

### Repo-as-Source-of-Truth

The git repository is the single source of truth for infrastructure state. All changes flow through git — never `kubectl apply` from a laptop in production.

**Pull-based deployment** (preferred):
1. Push manifest changes to git
2. GitOps controller (ArgoCD, FluxCD) detects changes
3. Controller applies changes to the cluster
4. Controller reports sync status back

**Push-based deployment** (simpler, acceptable for small setups):
1. Push manifest changes to git
2. CI pipeline applies changes via `kubectl apply` or `helm upgrade`
3. Pipeline reports success/failure

### Branch Strategy for Infra

| Pattern | When to use |
|---------|------------|
| **Directory-per-environment** | Most projects. `overlays/dev/`, `overlays/prod/`. Single branch (`main`), promotion = copy + modify. |
| **Branch-per-environment** | When environments need independent change cadence. `dev` branch auto-deploys, `prod` branch requires approval. |

Prefer directory-per-environment — it keeps all state visible in one branch and avoids merge drift between long-lived branches.

---

## Secret Management

### Never commit secrets. No exceptions.

| Approach | Complexity | Best for |
|----------|-----------|----------|
| **Sealed Secrets** (Bitnami) | Low | K8s clusters, team-managed keys |
| **External Secrets Operator** | Medium | Cloud-managed secrets (AWS SSM, GCP Secret Manager, Vault) |
| **SOPS** (Mozilla) | Low | Encrypting files in git (works with any tool, not just K8s) |
| **HashiCorp Vault** | High | Enterprise, dynamic secrets, short-lived credentials |

**For homelabs/small clusters**: SOPS + age keys is the simplest path. Encrypt secret manifests in git, decrypt at apply time.

### What counts as a secret

- API keys, tokens, passwords, connection strings
- TLS certificates and private keys
- SSH keys, GPG keys
- `.env` files with credentials
- kubeconfig files

### .gitignore for infra projects

```gitignore
# Secrets
*.key
*.pem
*.crt
.env
.env.*
!.env.example
kubeconfig*
*-secret.yaml
!*-sealed-secret.yaml

# Terraform
*.tfstate
*.tfstate.*
.terraform/
crash.log

# Generated
*.rendered
```

---

## Environment Promotion

### Promotion Flow

```
dev → staging → prod
```

Changes are tested in lower environments before promotion. Never push directly to prod manifests.

### Kustomize Overlays (K8s)

```
deploy/
├── base/
│   ├── kustomization.yaml    ← Shared resources
│   ├── deployment.yaml
│   └── service.yaml
└── overlays/
    ├── dev/
    │   └── kustomization.yaml  ← Dev-specific: replicas=1, debug logging
    ├── staging/
    │   └── kustomization.yaml  ← Staging: replicas=2, matches prod config
    └── prod/
        └── kustomization.yaml  ← Prod: replicas=3, resource limits enforced
```

### Helm Values (K8s)

```
deploy/charts/myapp/
├── Chart.yaml
├── values.yaml               ← Defaults
├── values-dev.yaml            ← Dev overrides
├── values-staging.yaml
└── values-prod.yaml
```

### Terraform Workspaces / Directories

```
infra/
├── modules/networking/        ← Reusable
├── environments/
│   ├── dev/main.tf           ← Dev config
│   ├── staging/main.tf
│   └── prod/main.tf
```

---

## Naming Conventions

### Resource Labels (K8s)

Every resource should have these labels:

```yaml
metadata:
  labels:
    app.kubernetes.io/name: myapp
    app.kubernetes.io/component: api        # api, web, worker, db
    app.kubernetes.io/part-of: myplatform
    app.kubernetes.io/managed-by: helm      # helm, kustomize, manual
    environment: dev                        # dev, staging, prod
```

### Resource Naming

- Lowercase with hyphens: `my-app-api`, not `myApp_API`
- Include the environment in namespace, not in resource name: namespace `myapp-dev`, resource `api`
- Terraform resources: `snake_case` (Terraform convention)

---

## Anti-Patterns

### ❌ Secrets & Security
- Committing secrets, credentials, or API keys to git
- Using `latest` image tag (non-deterministic deployments)
- Running containers as root
- No network policies (all pods can talk to all pods)

### ❌ Organization
- Monolithic YAML files with 500+ lines and multiple resources
- Hardcoded IPs, URLs, or environment-specific values in base configs
- No separation between base configs and environment overrides
- Mixing provisioning (Terraform) and deployment (K8s) in the same directory

### ❌ Operations
- Applying changes directly from a laptop (`kubectl apply` in prod)
- No resource limits or requests on containers
- No health checks (readiness/liveness probes)
- No rollback strategy documented
- State files (`.tfstate`) committed to git
