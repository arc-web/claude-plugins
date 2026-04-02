# Kubernetes / K3s — Architecture Patterns

## Namespace Strategy

| Pattern | When to use |
|---------|------------|
| **Per-app** (`myapp-dev`, `myapp-prod`) | Single team, few apps. Simple. |
| **Per-environment** (`dev`, `staging`, `prod`) | Multiple apps share environments. Common in homelabs. |
| **Per-team** (`team-backend`, `team-frontend`) | Multi-team orgs with RBAC boundaries. |

For **K3s homelabs**: per-environment is usually right. You have one cluster, few teams, and want clear environment isolation without namespace sprawl.

---

## Resource Organization

### One Resource Per File

```
deploy/base/
├── namespace.yaml
├── deployment.yaml
├── service.yaml
├── configmap.yaml
├── ingress.yaml
└── kustomization.yaml
```

### Naming Convention

Files named by resource kind, prefixed with app name when multiple apps share a directory:

```
deploy/base/
├── api-deployment.yaml
├── api-service.yaml
├── web-deployment.yaml
├── web-service.yaml
└── shared-configmap.yaml
```

---

## Helm vs Raw Manifests vs Kustomize

| Tool | Best for | Avoid when |
|------|----------|-----------|
| **Raw manifests + Kustomize** | Simple apps, homelabs, learning. Full visibility, no templating magic. | Many environment variations or complex conditionals. |
| **Helm** | Apps with many configuration knobs, community charts, teams that need parameterization. | Simple deployments where the template overhead isn't worth it. |
| **Kustomize** | Environment overlays on top of raw manifests. Built into `kubectl`. | When you need conditionals or loops (Helm is better). |

**For K3s homelabs**: Start with raw manifests + Kustomize overlays. Graduate to Helm when you need parameterized charts or want community charts (cert-manager, ingress-nginx, etc.).

---

## K3s-Specific Patterns

K3s is lightweight Kubernetes with sensible defaults. Key differences from full K8s:

### Built-in Components

| Component | K3s default | Override |
|-----------|------------|---------|
| **Ingress** | Traefik | Disable with `--disable=traefik`, install nginx-ingress or other |
| **Storage** | local-path-provisioner | Adequate for homelabs. Use Longhorn for replication. |
| **Load Balancer** | ServiceLB (Klipper) | Adequate for single-node. Use MetalLB for multi-node. |
| **Container Runtime** | containerd | Rarely need to change |
| **CNI** | Flannel | Calico for network policies |

### K3s Installation Patterns

```bash
# Single-node (homelab)
curl -sfL https://get.k3s.io | sh -

# Server + agent (multi-node)
# On server:
curl -sfL https://get.k3s.io | sh -s - server --cluster-init
# On agents:
curl -sfL https://get.k3s.io | K3S_URL=https://server:6443 K3S_TOKEN=<token> sh -
```

### kubeconfig Location

K3s writes kubeconfig to `/etc/rancher/k3s/k3s.yaml`. Copy and adjust for remote access:

```bash
# Never commit this file
cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
# Update server address from 127.0.0.1 to actual IP
sed -i 's/127.0.0.1/YOUR_SERVER_IP/' ~/.kube/config
```

---

## Resource Limits and Requests

**Always set on every container.** No exceptions — even in dev.

```yaml
resources:
  requests:
    cpu: 100m        # Minimum guaranteed
    memory: 128Mi
  limits:
    cpu: 500m        # Maximum allowed
    memory: 512Mi
```

### Sizing Guidelines

| Workload type | CPU request | Memory request | Notes |
|--------------|------------|---------------|-------|
| API server | 100-250m | 128-256Mi | Scale horizontally |
| Worker/cron | 50-100m | 64-128Mi | Bursty, set limits higher |
| Database | 250-500m | 256Mi-1Gi | Memory-bound, be generous |
| Web frontend | 50-100m | 64-128Mi | Mostly static serving |

For K3s homelabs with limited resources, set requests low and limits at 2-3x requests.

---

## Health Checks

Every Deployment needs all three probes:

```yaml
livenessProbe:          # Is the container alive? Restart if not.
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 20

readinessProbe:         # Is the container ready for traffic? Remove from service if not.
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10

startupProbe:           # Is the container still starting? Don't check liveness until startup passes.
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30
  periodSeconds: 10
```

---

## RBAC Patterns

### Principle of Least Privilege

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: myapp-prod
  name: app-reader
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: myapp-prod
  name: app-reader-binding
subjects:
- kind: ServiceAccount
  name: myapp-sa
roleRef:
  kind: Role
  name: app-reader
  apiGroup: rbac.authorization.k8s.io
```

### Service Accounts

Every app gets its own ServiceAccount. Never use `default`.

---

## Anti-Patterns

### ❌ Images & Tags
- Using `latest` tag — non-deterministic, breaks rollbacks
- Not pinning image digest for production
- Pulling from public registries without a mirror/cache

### ❌ Configuration
- Hardcoded values in manifests (use ConfigMaps or Kustomize patches)
- Secrets in ConfigMaps (use Secrets or external secret managers)
- No resource limits (one pod can starve the node)

### ❌ Operations
- `kubectl apply` from laptops in production
- No rollback strategy (test `kubectl rollout undo` before you need it)
- Running as root (set `runAsNonRoot: true` in securityContext)
- No PodDisruptionBudget for critical services

### ❌ Networking
- No NetworkPolicies (default-allow between all pods)
- Exposing services via NodePort in production (use Ingress)
- Hardcoded ClusterIP addresses
