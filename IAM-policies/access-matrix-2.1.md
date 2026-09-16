# FIRST-PASS IAM ACTION MODEL AND ACCESS MATRIX

## 1. IAM Decision Model

Resource
    |
    v
Identity / Persona
    |
    +------> Action ------> Environment
                           |
                           v
                        Decision
                       /        \
                   ALLOW        DENY
                      |
                   CONDITION
                      |
                      v
                 Scope / Control

Design principles:
- Least privilege
- Deny by default
- Environment isolation
- Separation of duties
- No privilege is implied by another action
- Admin is never inferred from Write / Deploy
- TBD means the source definitions are insufficient to authorize the action
- Scope must be explicit before implementation
- Human identities should be individually attributable
- Workload identities should be non-interactive and resource scoped

---

## 2. Action Model

| Action | Meaning |
|--------|---------|
| None | No access |
| View | Can view configuration, topology, status, metadata |
| Read | Can read data, logs, metrics, artifacts, configuration |
| Write | Can create/update non-deployment resources or content |
| Deploy | Can release/deploy application or workload |
| Delete | Can delete resources/data |
| Admin | Full administrative control |
| Exec | Runtime/interactive execution access |
| Modify | Change existing configuration/permissions/content; exact boundary requires confirmation |

---

## 3. Resource / Action Model

| Resource | Action | First-Pass Interpretation |
|----------|--------|---------------------------|
| EC2 | View | Instance/configuration/status visibility |
| EC2 | Read | Instance configuration/log/metric visibility |
| EC2 | Write | Create/update EC2-related infrastructure; exact permission boundary TBD |
| EC2 | Deploy | TBD — source does not define what constitutes EC2 deployment |
| EC2 | Delete | TBD — destructive infrastructure access requires explicit approval model |
| EC2 | Admin | Not granted by default |
| EC2 | Exec | TBD — interactive operating-system access is not established by persona definitions |
| EC2 | Modify | TBD — exact infrastructure-configuration boundary required |
| EKS | View | Cluster/namespace/workload/configuration visibility |
| EKS | Read | Kubernetes configuration/log/metric/artifact visibility |
| EKS | Write | Create/update Kubernetes resources excluding deployment authority |
| EKS | Deploy | Application/workload deployment |
| EKS | Delete | Delete Kubernetes resources |
| EKS | Admin | Full cluster/platform administration; not granted by default |
| EKS | Exec | Interactive pod/runtime access |
| EKS | Modify | Change Kubernetes configuration/RBAC/content; exact scope TBD |
| ECR | View | Repository metadata/status |
| ECR | Read | Read/pull artifacts and repository configuration |
| ECR | Write | Publish/update application artifacts |
| ECR | Deploy | Not established for ECR; TBD |
| ECR | Delete | Delete images/repositories; exact scope TBD |
| ECR | Admin | Full repository administration; not granted by default |
| ECR | Exec | Not applicable |
| ECR | Modify | Change repository configuration; exact scope TBD |
| S3 | View | Bucket/object metadata |
| S3 | Read | Read objects/configuration |
| S3 | Write | Create/update objects |
| S3 | Deploy | Not established; TBD |
| S3 | Delete | Delete objects/buckets; exact scope TBD |
| S3 | Admin | Full storage administration; not granted by default |
| S3 | Exec | Not applicable |
| S3 | Modify | Change bucket/configuration; exact scope TBD |
| RDS (MongoDB) | View | Database/service metadata |
| RDS (MongoDB) | Read | Database metadata/data/logs/configuration |
| RDS (MongoDB) | Write | Database/content/configuration changes; exact boundary TBD |
| RDS (MongoDB) | Deploy | TBD |
| RDS (MongoDB) | Delete | Database/resource deletion; TBD |
| RDS (MongoDB) | Admin | Full database administration; not granted by default |
| RDS (MongoDB) | Exec | TBD |
| RDS (MongoDB) | Modify | Database configuration/permission/content changes; TBD |
| IAM | View | Identity/policy metadata |
| IAM | Read | Read identities, roles, policies, assignments |
| IAM | Write | Create/update IAM objects |
| IAM | Deploy | Not applicable |
| IAM | Delete | Delete IAM objects |
| IAM | Admin | Full identity/permission administration |
| IAM | Exec | Not applicable |
| IAM | Modify | Modify policies/roles/permissions |
| Github | View | Repository metadata/status |
| Github | Read | Read repository/source content |
| Github | Write | Create/update repository content |
| Github | Deploy | Not directly defined; TBD |
| Github | Delete | Delete repository/content; TBD |
| Github | Admin | Full repository administration |
| Github | Exec | Not applicable |
| Github | Modify | Branch/workflow/repository configuration |
| ArgoCD | View | Application/synchronization/configuration visibility |
| ArgoCD | Read | Read GitOps/application configuration |
| ArgoCD | Write | Change ArgoCD-managed configuration |
| ArgoCD | Deploy | Trigger/synchronize GitOps deployment |
| ArgoCD | Delete | Delete/prune GitOps-managed applications/resources |
| ArgoCD | Admin | Full ArgoCD administration |
| ArgoCD | Exec | Not normally applicable; TBD |
| ArgoCD | Modify | Change projects/application/repository configuration |
| VPC | View | Network configuration/status visibility |
| VPC | Read | Network configuration/metadata visibility |
| VPC | Write | Create/update network infrastructure |
| VPC | Deploy | TBD |
| VPC | Delete | Delete network resources |
| VPC | Admin | Full network administration |
| VPC | Exec | Not applicable |
| VPC | Modify | Modify network configuration/security controls |

---

## 4. Human Identity IAM Matrix

| Identity / Persona | Type | Environment | Resource | Action | Scope | Access | Condition | Justification / Control Rationale |
|--------------------|------|-------------|----------|--------|-------|--------|-----------|------------------------------------|
| Developer | Human | Development | Github | Read | Assigned application repositories | Allow | Named identity; SSO/MFA; repository membership | Developer responsibility includes developing and maintaining code |
| Developer | Human | Development | Github | Write | Assigned application repositories | Allow | PR/branch controls where configured | Code maintenance requires repository write capability |
| Developer | Human | Development | Github | Modify | Repository/branch/workflow configuration | TBD | Define whether developer is allowed to administer repository controls | “Maintain code” does not by itself establish repository administration |
| Developer | Human | Development | EKS | View | Application namespace | Allow | Namespace scoped | Development ownership supports environment visibility |
| Developer | Human | Development | EKS | Read | Application namespace | Allow | Namespace scoped | Supports application development/troubleshooting |
| Developer | Human | Development | EKS | Write | Application namespace | TBD | Define permitted Kubernetes resource types | Development ownership does not define exact Kubernetes write scope |
| Developer | Human | Development | EKS | Deploy | Application namespace | TBD | Decide whether developers may directly deploy or deployment must use CI/GitOps | Persona definition does not explicitly grant deployment authority |
| Developer | Human | Development | EKS | Delete | Application namespace | TBD | Define resource types and approval requirement | Destructive access is not established by persona definition |
| Developer | Human | Development | EKS | Exec | Application pods | TBD | JIT/MFA/session logging decision required | Runtime access is not explicitly defined |
| Developer | Human | Testing | EKS | View | Application/test namespace | TBD | Confirm whether development team has test troubleshooting access | Tester owns testing; developer test access is not explicitly defined |
| Developer | Human | Testing | EKS | Deploy | Test namespaces | Deny | Deployment should follow controlled CI/GitOps path unless explicitly approved | Prevents developers bypassing test promotion controls |
| Developer | Human | Staging | EKS | Deploy | Staging namespaces | Deny | Controlled promotion path | Separates development from release authority |
| Developer | Human | Production | EKS | Deploy | Production namespaces | Deny | Production deployment through approved release/GitOps path | Protects production from direct developer deployment |
| Developer | Human | Production | EKS | Exec | Production workloads | Deny | Separate emergency role/process required | Prevents standing developer production runtime access |
| Developer | Human | Production | RDS (MongoDB) | Read | Production application database | Deny | Separate approved production data-access process | Persona does not establish production database access |
| Developer | Human | Production | RDS (MongoDB) | Write | Production application database | Deny | Separate approved privileged process required | Prevents direct production data modification |
| Developer | Human | All environments | IAM | Admin | IAM control plane | Deny | Dedicated privileged identity/process required | Application development does not require IAM administration |
| Developer | Human | Development | EC2 | Read | Development infrastructure supporting application | TBD | Infrastructure ownership belongs to DevOps; need explicit developer requirement | Avoids unnecessary infrastructure visibility |
| Developer | Human | Development | VPC | Read | Development network configuration | TBD | Need explicit networking requirement | Developer responsibility does not establish network access |
| Developer | Human | Development | S3 | Read | Application buckets | TBD | Bucket/data scope must be defined | No direct S3 requirement is stated |
| Developer | Human | Development | RDS (MongoDB) | Read | Development database | TBD | Application data-access need must be confirmed | Code development may not require direct DB access |
| Tester | Human | Testing | Github | Read | Test-relevant repositories | TBD | Identify repositories required for validation | Testing responsibility may require source visibility, but exact repository need is unspecified |
| Tester | Human | Testing | ECR | Read | Test artifact repositories | TBD | Identify repositories required for test validation | Persona does not explicitly specify artifact access |
| Tester | Human | Testing | EKS | View | Testing namespaces | Allow | Testing scope only | Tester needs environment visibility to test the application |
| Tester | Human | Testing | EKS | Read | Testing namespaces | Allow | Namespace scoped | Supports application/test validation |
| Tester | Human | Testing | EKS | Write | Test resources | TBD | Define exact test resource types | Testing does not automatically justify broad Kubernetes write |
| Tester | Human | Testing | EKS | Deploy | Test namespaces | TBD | Decide whether Tester or CI/GitOps owns test deployment | Persona says test application code, not deploy it |
| Tester | Human | Testing | EKS | Delete | Test resources | TBD | Define reset/cleanup requirement | Destructive test access needs explicit scope |
| Tester | Human | Testing | EKS | Exec | Test pods | TBD | JIT/session logging decision required | Interactive troubleshooting not explicitly defined |
| Tester | Human | Production | EKS | Deploy | Production namespaces | Deny | Production release authority remains separate | Testing responsibility does not require production deployment |
| Tester | Human | Production | EKS | Exec | Production workloads | Deny | Separate emergency process required | Prevents standing production runtime privilege |
| Tester | Human | Production | RDS (MongoDB) | Write | Production database | Deny | No direct production data modification | Testing responsibility does not require production database write |
| Tester | Human | Production | IAM | Admin | IAM control plane | Deny | Dedicated privileged identity/process required | No IAM administration requirement |
| Tester | Human | Testing | RDS (MongoDB) | Read | Test database | TBD | Confirm whether test execution needs direct database access | Exact test data access requirement is not defined |
| Tester | Human | Testing | RDS (MongoDB) | Write | Test database | TBD | Define whether test reset/data preparation requires database writes | Could be needed for test execution but is not defined |
| Security engineer | Human | Development | EC2 | Read | Security-relevant infrastructure information | Allow | Security scope; least-privilege filtering | Persona explicitly covers security assessment/monitoring |
| Security engineer | Human | Testing | EC2 | Read | Security-relevant infrastructure information | Allow | Security scope | Supports security assessment |
| Security engineer | Human | Staging | EC2 | Read | Security-relevant infrastructure information | Allow | Security scope | Supports pre-production security assessment |
| Security engineer | Human | Production | EC2 | Read | Security-relevant infrastructure information | Allow | Sensitive-data minimization | Security monitoring/assessment across environments |
| Security engineer | Human | Development | EKS | Read | Cluster/namespace/application security data | Allow | Read-only; sensitive data minimized | Security responsibility requires visibility |
| Security engineer | Human | Testing | EKS | Read | Cluster/namespace/application security data | Allow | Read-only | Security assessment |
| Security engineer | Human | Staging | EKS | Read | Cluster/namespace/application security data | Allow | Read-only | Security assessment |
| Security engineer | Human | Production | EKS | Read | Cluster/namespace/application security data | Allow | Read-only; sensitive-data controls | Security monitoring and assessment |
| Security engineer | Human | Development | ECR | Read | Application artifacts/repositories | Allow | Security scope | Artifact/security inspection |
| Security engineer | Human | Testing | ECR | Read | Application artifacts/repositories | Allow | Security scope | Artifact/security inspection |
| Security engineer | Human | Staging | ECR | Read | Application artifacts/repositories | Allow | Security scope | Artifact/security inspection |
| Security engineer | Human | Production | ECR | Read | Application artifacts/repositories | Allow | Read-only; artifact scope defined | Security assessment |
| Security engineer | Human | Development | S3 | Read | Security-relevant storage/configuration | Allow | Security scope; sensitive data minimized | Security assessment |
| Security engineer | Human | Testing | S3 | Read | Security-relevant storage/configuration | Allow | Security scope; sensitive data minimized | Security assessment |
| Security engineer | Human | Staging | S3 | Read | Security-relevant storage/configuration | Allow | Security scope; sensitive data minimized | Security assessment |
| Security engineer | Human | Production | S3 | Read | Security-relevant storage/configuration | Allow | Strong data minimization | Production security assessment |
| Security engineer | Human | Development | RDS (MongoDB) | Read | Security-relevant DB configuration/telemetry | Allow | Avoid unrestricted business data access | Security assessment |
| Security engineer | Human | Testing | RDS (MongoDB) | Read | Security-relevant DB configuration/telemetry | Allow | Avoid unrestricted business data access | Security assessment |
| Security engineer | Human | Staging | RDS (MongoDB) | Read | Security-relevant DB configuration/telemetry | Allow | Avoid unrestricted business data access | Security assessment |
| Security engineer | Human | Production | RDS (MongoDB) | Read | Security-relevant DB configuration/telemetry | TBD | Confirm whether direct DB reads are actually required | Security review should minimize sensitive-data access |
| Security engineer | Human | Development | IAM | Read | Identities, roles, policies | Allow | Read-only | Security governance requires IAM visibility |
| Security engineer | Human | Testing | IAM | Read | Identities, roles, policies | Allow | Read-only | Security governance |
| Security engineer | Human | Staging | IAM | Read | Identities, roles, policies | Allow | Read-only | Security governance |
| Security engineer | Human | Production | IAM | Read | Identities, roles, policies | Allow | Read-only | Security governance |
| Security engineer | Human | All environments | IAM | Write | IAM roles/policies | TBD | Explicit IAM-change authority and SoD required | Security assessment does not automatically equal IAM administration |
| Security engineer | Human | All environments | IAM | Admin | IAM control plane | Deny | Dedicated IAM administration required | Prevents conflict of monitoring and administration |
| Security engineer | Human | Production | EKS | Exec | Production pods/nodes | TBD | JIT, ticket, MFA, session recording, incident-specific approval | Interactive access is not a normal security-assessment entitlement |
| Security engineer | Human | Production | EKS | Deploy | Production namespaces | Deny | Deployment owned by approved release/GitOps process | Security role should not combine assessment and release control |
| Security engineer | Human | Development | VPC | Read | Security-relevant network configuration | Allow | Read-only | Security assessment of application infrastructure |
| Security engineer | Human | Testing | VPC | Read | Security-relevant network configuration | Allow | Read-only | Security assessment |
| Security engineer | Human | Staging | VPC | Read | Security-relevant network configuration | Allow | Read-only | Security assessment |
| Security engineer | Human | Production | VPC | Read | Security-relevant network configuration | Allow | Read-only; sensitive controls minimized | Security assessment |
| Devops Engineer | Human | Development | EC2 | Read | Development infrastructure | Allow | Environment scoped | Persona explicitly includes infrastructure planning/design/development |
| Devops Engineer | Human | Development | EC2 | Write | Development infrastructure | Allow | Environment scoped | Infrastructure development responsibility |
| Devops Engineer | Human | Testing | EC2 | Read | Testing infrastructure | Allow | Environment scoped | Infrastructure responsibility across environments |
| Devops Engineer | Human | Testing | EC2 | Write | Testing infrastructure | Allow | Controlled change | Infrastructure responsibility |
| Devops Engineer | Human | Staging | EC2 | Read | Staging infrastructure | Allow | Environment scoped | Infrastructure responsibility |
| Devops Engineer | Human | Staging | EC2 | Write | Staging infrastructure | Allow | Controlled change | Infrastructure responsibility |
| Devops Engineer | Human | Production | EC2 | Read | Production infrastructure | Allow | Production scope; least privilege | Infrastructure monitoring/support |
| Devops Engineer | Human | Production | EC2 | Write | Production infrastructure | TBD | Formal change control/JIT/approval model required | Persona includes infrastructure deployment, but production change boundary is not specified |
| Devops Engineer | Human | Development | EKS | Read | Development cluster/namespaces | Allow | Environment scoped | Infrastructure/platform responsibility |
| Devops Engineer | Human | Development | EKS | Write | Development platform resources | Allow | Resource/namespace scoped | Infrastructure responsibility |
| Devops Engineer | Human | Testing | EKS | Read | Testing cluster/namespaces | Allow | Environment scoped | Infrastructure responsibility |
| Devops Engineer | Human | Testing | EKS | Write | Testing platform resources | Allow | Resource/namespace scoped | Infrastructure responsibility |
| Devops Engineer | Human | Staging | EKS | Read | Staging cluster/namespaces | Allow | Environment scoped | Infrastructure responsibility |
| Devops Engineer | Human | Staging | EKS | Write | Staging platform resources | Allow | Resource/namespace scoped | Infrastructure responsibility |
| Devops Engineer | Human | Production | EKS | Read | Production cluster/namespaces | Allow | Environment scoped | Infrastructure support |
| Devops Engineer | Human | Production | EKS | Write | Production platform resources | TBD | Formal change/JIT/approval boundary required | High-impact production infrastructure change |
| Devops Engineer | Human | Development | EKS | Deploy | Infrastructure workloads | TBD | Separate infrastructure deployment from application deployment | Persona includes deployment but ArgoCD is explicitly responsible for application GitOps deployment |
| Devops Engineer | Human | Testing | EKS | Deploy | Infrastructure workloads | TBD | Define infrastructure/application deployment boundary | Avoid accidental application deployment authority |
| Devops Engineer | Human | Staging | EKS | Deploy | Infrastructure workloads | TBD | Release/process ownership must be defined | Avoid bypassing GitOps/release controls |
| Devops Engineer | Human | Production | EKS | Deploy | Infrastructure workloads | TBD | Formal production release/change authority required | DevOps responsibility includes deployment, but exact authorization boundary is unspecified |
| Devops Engineer | Human | All environments | EKS | Admin | Cluster | Deny | Separate elevated administration role/process required | Infrastructure responsibility does not automatically justify unrestricted cluster admin |
| Devops Engineer | Human | All environments | ECR | Read | Required application/platform repositories | TBD | Repository scope must be defined | CI/CD responsibility may require artifact visibility |
| Devops Engineer | Human | All environments | ECR | Write | Application/platform repositories | TBD | Determine whether DevOps or CI Pipeline owns artifact publication | CI Pipeline explicitly owns publishing artifacts |
| Devops Engineer | Human | All environments | Github | Read | Application and CI/CD repositories | Allow | Repository scoped | DevOps responsibility includes CI/CD |
| Devops Engineer | Human | All environments | Github | Write | Application/CI/CD repositories | TBD | Define repository ownership and change controls | “Develop CI/CD” supports some write access but exact repositories are not defined |
| Devops Engineer | Human | All environments | Github | Modify | Branch/workflow/repository controls | TBD | Explicit repository-admin scope required | CI/CD administration can affect security controls |
| Devops Engineer | Human | All environments | IAM | Read | Operationally required IAM configuration | TBD | Exact IAM objects must be defined | Infrastructure operations may need IAM visibility |
| Devops Engineer | Human | All environments | IAM | Write | Operational IAM roles/policies | TBD | Explicit delegation and SoD required | IAM change is high privilege |
| Devops Engineer | Human | All environments | IAM | Admin | IAM control plane | Deny | Dedicated IAM administration required | Infrastructure and identity administration should be separated |
| Devops Engineer | Human | Development | S3 | Read | Infrastructure/application storage | TBD | Specific buckets must be identified | Resource is defined but exact operational dependency is absent |
| Devops Engineer | Human | Development | S3 | Write | Infrastructure/application storage | TBD | Specific buckets/use case required | Avoid broad storage write |
| Devops Engineer | Human | Testing | S3 | Read | Infrastructure/application storage | TBD | Bucket scope required | Not explicitly defined |
| Devops Engineer | Human | Testing | S3 | Write | Infrastructure/application storage | TBD | Bucket scope required | Not explicitly defined |
| Devops Engineer | Human | Staging | S3 | Read | Infrastructure/application storage | TBD | Bucket scope required | Not explicitly defined |
| Devops Engineer | Human | Staging | S3 | Write | Infrastructure/application storage | TBD | Bucket scope required | Not explicitly defined |
| Devops Engineer | Human | Production | S3 | Read | Infrastructure/application storage | TBD | Bucket/data classification required | Production storage may contain sensitive data |
| Devops Engineer | Human | Production | S3 | Write | Infrastructure/application storage | TBD | Change/data ownership must be defined | High-impact production data/configuration access |
| Devops Engineer | Human | All environments | VPC | Read | Network infrastructure | Allow | Environment scoped | Infrastructure ownership |
| Devops Engineer | Human | All environments | VPC | Write | Network infrastructure | TBD | Exact network objects/change authority required | Infrastructure responsibility supports access, but precise permission boundary is unspecified |
| Devops Engineer | Human | All environments | VPC | Admin | Entire network control plane | Deny | Separate network-admin elevation if required | Prevents unrestricted privilege by default |
| Devops Engineer | Human | Development | RDS (MongoDB) | Read | Development DB infrastructure/configuration | TBD | Confirm operational dependency | Exact database responsibilities are not defined |
| Devops Engineer | Human | Testing | RDS (MongoDB) | Read | Test DB infrastructure/configuration | TBD | Confirm operational dependency | Exact database responsibilities are not defined |
| Devops Engineer | Human | Staging | RDS (MongoDB) | Read | Staging DB infrastructure/configuration | TBD | Confirm operational dependency | Exact database responsibilities are not defined |
| Devops Engineer | Human | Production | RDS (MongoDB) | Read | Production DB infrastructure/configuration | TBD | Confirm need and sensitive-data boundary | Infrastructure role should not automatically expose business data |
| Devops Engineer | Human | Production | RDS (MongoDB) | Write | Production DB | Deny | Separate approved database administration/change process required | Prevents infrastructure role from becoming direct production data administrator |

---

## 5. Workload Identity IAM Matrix

| Identity / Persona | Type | Environment | Resource | Action | Scope | Access | Condition | Justification / Control Rationale |
|--------------------|------|-------------|----------|--------|-------|--------|-----------|------------------------------------|
| CI Pipeline | Workload | Development | Github | Read | Source repositories required for build/test | Allow | Repository-scoped machine identity | CI builds and tests application artifacts |
| CI Pipeline | Workload | Testing | Github | Read | Source repositories required for build/test | Allow | Repository-scoped machine identity | CI builds and tests application artifacts |
| CI Pipeline | Workload | Staging | Github | Read | Source/release repositories required by pipeline | Allow | Repository-scoped machine identity | CI/CD workflow dependency |
| CI Pipeline | Workload | Production | Github | Read | Source/release repositories required by pipeline | Allow | Repository-scoped; read-only | Pipeline should consume source, not alter it |
| CI Pipeline | Workload | All environments | Github | Write | Source repositories | Deny | Separate repository-management identity would be required | Build/test/publish responsibility does not require source mutation |
| CI Pipeline | Workload | All environments | Github | Modify | Branch/workflow/repository controls | Deny | Dedicated repository administration process required | Prevents pipeline compromise from changing security controls |
| CI Pipeline | Workload | Development | ECR | Write | Development application artifact repositories | Allow | Repository scoped | CI Pipeline publishes application artifacts |
| CI Pipeline | Workload | Testing | ECR | Write | Testing application artifact repositories | Allow | Repository scoped | CI Pipeline publishes application artifacts |
| CI Pipeline | Workload | Staging | ECR | Write | Staging application artifact repositories | Allow | Repository scoped | CI Pipeline publishes application artifacts |
| CI Pipeline | Workload | Production | ECR | Write | Production application artifact repositories | TBD | Define production artifact promotion/signing/approval controls | Publishing is within responsibility, but production control boundary is unspecified |
| CI Pipeline | Workload | All environments | EKS | Deploy | Kubernetes application namespaces | Deny | Application deployment is explicitly assigned to ArgoCD | Prevents two competing deployment authorities |
| CI Pipeline | Workload | All environments | EKS | Exec | Any namespace | Deny | No interactive workload access | CI should never require interactive runtime control |
| CI Pipeline | Workload | All environments | IAM | Admin | IAM control plane | Deny | No IAM administration requirement | Prevents build compromise from becoming account takeover |
| CI Pipeline | Workload | All environments | EKS | Admin | Cluster | Deny | No cluster administration requirement | Least privilege |
| ArgoCD | Workload | Development | Github | Read | GitOps repositories | Allow | Repository-scoped service identity | GitOps requires desired-state source |
| ArgoCD | Workload | Testing | Github | Read | GitOps repositories | Allow | Repository scoped | GitOps source access |
| ArgoCD | Workload | Staging | Github | Read | GitOps repositories | Allow | Repository scoped | GitOps source access |
| ArgoCD | Workload | Production | Github | Read | GitOps repositories | Allow | Protected repository / approved source | Production GitOps source |
| ArgoCD | Workload | All environments | Github | Write | GitOps repositories | Deny | Source of truth must remain outside controller | Prevents controller compromise from modifying desired state |
| ArgoCD | Workload | Development | EKS | Deploy | GitOps-managed application namespaces | Allow | Namespace/resource scoped | Persona explicitly says deploy using GitOps |
| ArgoCD | Workload | Testing | EKS | Deploy | GitOps-managed application namespaces | Allow | Namespace/resource scoped | GitOps deployment |
| ArgoCD | Workload | Staging | EKS | Deploy | GitOps-managed application namespaces | Allow | Namespace/resource scoped; approved source | Controlled staging deployment |
| ArgoCD | Workload | Production | EKS | Deploy | GitOps-managed application namespaces | Allow | Approved Git revision; protected repository; namespace scoped | Centralized, auditable production deployment |
| ArgoCD | Workload | All environments | EKS | Write | GitOps-managed resource types | TBD | Exact Kubernetes resource allow-list required | Deploy must not be treated as unrestricted Kubernetes write |
| ArgoCD | Workload | All environments | EKS | Delete | GitOps-managed resources | TBD | Explicit prune/delete policy required | Delete is a separate high-risk action |
| ArgoCD | Workload | All environments | EKS | Exec | Any pod/node | Deny | No interactive runtime requirement | GitOps controller should not provide runtime shell access |
| ArgoCD | Workload | All environments | EKS | Admin | Cluster | Deny | Namespace/resource-level RBAC preferred | Prevents cluster-admin privilege |
| ArgoCD | Workload | All environments | ArgoCD | Admin | ArgoCD control plane | TBD | Determine whether the service identity itself needs administrative control | GitOps deployment does not necessarily require ArgoCD administration |
| ArgoCD | Workload | All environments | IAM | Admin | IAM control plane | Deny | No identity-administration requirement | Prevents GitOps compromise from becoming IAM compromise |
| Monitoring | Workload | Development | EC2 | Read | Application/platform logs and metrics | Allow | Telemetry-only access | Persona explicitly collects application and platform logs/metrics |
| Monitoring | Workload | Testing | EC2 | Read | Application/platform logs and metrics | Allow | Telemetry-only access | Monitoring responsibility |
| Monitoring | Workload | Staging | EC2 | Read | Application/platform logs and metrics | Allow | Telemetry-only access | Monitoring responsibility |
| Monitoring | Workload | Production | EC2 | Read | Application/platform logs and metrics | Allow | Sensitive-data filtering | Monitoring responsibility |
| Monitoring | Workload | Development | EKS | Read | Application/platform logs and metrics | Allow | Telemetry-only; no control-plane mutation | Monitoring responsibility |
| Monitoring | Workload | Testing | EKS | Read | Application/platform logs and metrics | Allow | Telemetry-only | Monitoring responsibility |
| Monitoring | Workload | Staging | EKS | Read | Application/platform logs and metrics | Allow | Telemetry-only | Monitoring responsibility |
| Monitoring | Workload | Production | EKS | Read | Application/platform logs and metrics | Allow | Telemetry-only; sensitive-data filtering | Monitoring responsibility |
| Monitoring | Workload | Development | RDS (MongoDB) | Read | Monitoring metrics/health information | TBD | Confirm monitoring interface and prevent business-data access | Database is a defined platform resource, but exact monitoring mechanism is unspecified |
| Monitoring | Workload | Testing | RDS (MongoDB) | Read | Monitoring metrics/health information | TBD | Confirm monitoring interface | Avoid direct business-data access |
| Monitoring | Workload | Staging | RDS (MongoDB) | Read | Monitoring metrics/health information | TBD | Confirm monitoring interface | Avoid direct business-data access |
| Monitoring | Workload | Production | RDS (MongoDB) | Read | Monitoring metrics/health information | TBD | Metrics-only path required; no unrestricted DB data access | Protects production database information |
| Monitoring | Workload | All environments | RDS (MongoDB) | Write | Metrics repository | TBD | Identify exact destination/database/schema first | Source says metrics are collected, but does not define the destination |
| Monitoring | Workload | All environments | S3 | Read | Monitoring log/metric storage, if applicable | TBD | Confirm whether S3 is actually used for telemetry | Do not invent a storage dependency |
| Monitoring | Workload | All environments | VPC | Read | Network/platform telemetry | TBD | Confirm whether monitoring collects VPC/network telemetry | Platform monitoring may require this, but source does not explicitly grant it |
| Monitoring | Workload | All environments | ECR | Read | Monitoring images/artifacts | TBD | Only if runtime architecture requires repository access | Avoid unnecessary artifact access |
| Monitoring | Workload | All environments | Github | Read | Monitoring configuration repositories | TBD | Only where implementation requires repository access | Not established by persona definition |
| Monitoring | Workload | All environments | IAM | Admin | IAM control plane | Deny | No IAM administration requirement | Monitoring identity must not administer identities |
| Monitoring | Workload | All environments | EKS | Deploy | Any namespace | Deny | Monitoring is observability-only | Prevents monitoring compromise from becoming deployment privilege |
| Monitoring | Workload | All environments | EKS | Write | Any namespace | Deny | Monitoring should not modify workloads | Enforces read-only monitoring architecture |
| Monitoring | Workload | All environments | EKS | Exec | Any pod/node | Deny | No interactive requirement | Prevents runtime compromise escalation |

---

## 6. Explicit Security Guardrails

| Identity / Persona | Environment | Resource | Action | Access | Control Rationale |
|--------------------|-------------|----------|--------|--------|-------------------|
| Developer | Production | EKS | Deploy | Deny | Developer role must not bypass production deployment controls |
| Developer | Production | EKS | Exec | Deny | No standing developer production runtime access |
| Developer | Production | RDS (MongoDB) | Write | Deny | No direct production data modification |
| Developer | All environments | IAM | Admin | Deny | Development role must never become IAM administrator |
| Tester | Production | EKS | Deploy | Deny | Tester is not a production deployment authority |
| Tester | Production | EKS | Exec | Deny | No standing production runtime access |
| Tester | Production | RDS (MongoDB) | Write | Deny | Protects production data |
| Tester | All environments | IAM | Admin | Deny | No IAM administrative responsibility |
| Security engineer | All environments | IAM | Admin | Deny | Separates security assessment from identity administration |
| Security engineer | Production | EKS | Deploy | Deny | Separates security assessment from release authority |
| Devops Engineer | All environments | IAM | Admin | Deny | Infrastructure responsibility must not automatically become IAM administration |
| Devops Engineer | Production | RDS (MongoDB) | Write | Deny | Direct production DB modification requires separate controlled authority |
| CI Pipeline | All environments | Github | Write | Deny | CI consumes source; source mutation requires separate authority |
| CI Pipeline | All environments | Github | Modify | Deny | CI compromise must not weaken repository security controls |
| CI Pipeline | All environments | EKS | Exec | Deny | Build/test workload has no interactive runtime requirement |
| CI Pipeline | All environments | EKS | Admin | Deny | No cluster administration |
| CI Pipeline | All environments | IAM | Admin | Deny | Prevents supply-chain/build compromise from becoming IAM compromise |
| ArgoCD | All environments | Github | Write | Deny | GitOps controller must not modify the source of truth |
| ArgoCD | All environments | EKS | Exec | Deny | No runtime shell requirement |
| ArgoCD | All environments | EKS | Admin | Deny | Use scoped Kubernetes RBAC |
| ArgoCD | All environments | IAM | Admin | Deny | Deployment workload has no identity-administration need |
| Monitoring | All environments | EKS | Write | Deny | Monitoring is observability-only |
| Monitoring | All environments | EKS | Deploy | Deny | Monitoring is not a deployment identity |
| Monitoring | All environments | EKS | Exec | Deny | No interactive runtime requirement |
| Monitoring | All environments | IAM | Admin | Deny | Monitoring does not need IAM administration |


---

## 7. Decisions Required Before Production IAM Implementation

| Decision ID | Area | Required Decision |
|-------------|------|-------------------|
| D01 | Developer -> EKS | Can Developers Deploy directly in Development, or must CI/GitOps perform all deployment? |
| D02 | Developer -> EKS Write | Which Kubernetes resource types may Developers create/update? |
| D03 | Developer -> EKS Exec | Is interactive development runtime access required, and what session-control standard applies? |
| D04 | Tester -> EKS Deploy | Does Tester deploy test workloads, or is deployment owned by CI/ArgoCD? |
| D05 | Tester -> RDS | Does test execution require direct database Read/Write access? |
| D06 | Security engineer -> RDS | Is direct database read access required, or are metrics/configuration interfaces sufficient? |
| D07 | Devops -> IAM | Which exact IAM objects may DevOps Read/Write? |
| D08 | Devops -> EKS Deploy | What is the boundary between infrastructure deployment and application deployment? |
| D09 | Devops -> Production Write | Which production changes require JIT/PAM/approval? |
| D10 | CI Pipeline -> Production ECR | Is production artifact publication allowed directly, or only after promotion/signing/approval? |
| D11 | ArgoCD -> EKS Write/Delete | Which Kubernetes API resources may ArgoCD create/update/delete? |
| D12 | ArgoCD -> ArgoCD Admin | Does the service identity require ArgoCD administrative privileges, or only application synchronization? |
| D13 | Monitoring -> RDS | Which exact database/schema stores metrics? |
| D14 | Monitoring -> S3/VPC/ECR/Github | Which of these resources are actual telemetry dependencies? |
| D15 | IAM Administration | A separate IAM administrator persona/role is required if IAM Write/Modify/Admin is to be granted |
| D16 | Production Emergency Access | Define a separate approved emergency-access process before any human Production Exec/Admin capability is introduced |