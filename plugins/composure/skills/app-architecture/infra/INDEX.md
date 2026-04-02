# Infrastructure Architecture — Index

> **This is a barrel index.** Read this file first, then load the files listed below based on the detected `infra` value from `.claude/no-bandaids.json`.

## Always Load

| File | Contains |
|------|----------|
| [core.md](core.md) | GitOps workflow, secret management, environment promotion, manifest organization, naming conventions |

## Load by `infra` value

| `infra` value | Also load |
|---|---|
| `"kubernetes"` or `"helm"` | [kubernetes/kubernetes.md](kubernetes/kubernetes.md) |
| `"terraform"` | [terraform/terraform.md](terraform/terraform.md) |
| `"docker"` or `"docker-compose"` | [docker/docker.md](docker/docker.md) |
| `"ansible"` or `"pulumi"` | Core only (tool-specific docs TBD) |

**DO NOT load tool files that don't match.**

## Project-Level Docs

Also check `.claude/frameworks/infra/` for project-specific docs:
- `generated/` — Context7 docs (kubernetes, terraform, helm, etc.)
- `project/` — team-written conventions
