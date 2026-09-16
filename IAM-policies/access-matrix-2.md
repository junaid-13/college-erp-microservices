# FIRST-PASS IAM ACTION MODEL + IAM ACCESS MATRIX

## 1. Access Decision Model

Identity / Persona
        |
        v
     Resource
        |
        v
      Action
        |
        v
   Environment
        |
        v
     Decision
    /        \
 ALLOW       DENY
    \        /
      CONDITION
   (when required)

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

## 3. Resource / Action Model

| Resource | Action | First-Pass Interpretation |
|----------|--------|---------------------------|
| EC2 | View | TBD |
| EC2 | Read | Environment/resource-scoped infrastructure visibility |
| EC2 | Write | Environment/resource-scoped infrastructure change; exact boundary TBD |
| EC2 | Deploy | TBD |
| EC2 | Delete | TBD |
| EC2 | Admin | Not granted by default |
| EC2 | Exec | TBD; interactive instance access requires explicit role design |
| EC2 | Modify | TBD |
| EKS | View | Cluster/namespace/workload visibility |
| EKS | Read | Kubernetes configuration/runtime/log visibility |
| EKS | Write | Create/update non-deployment Kubernetes resources |
| EKS | Deploy | Application/workload deployment |
| EKS | Delete | Delete Kubernetes resources |
| EKS | Admin | Not granted by default |
| EKS | Exec | Pod/runtime interactive access; explicit control required |
| EKS | Modify | Kubernetes configuration/permission modification; exact boundary TBD |
| ECR | View | Repository metadata/status |
| ECR | Read | Pull/read artifacts and repository information |
| ECR | Write | Publish/update artifacts |
| ECR | Deploy | Not independently defined; TBD |
| ECR | Delete | Artifact/repository deletion; TBD |
| ECR | Admin | Not granted by default |
| ECR | Exec | Not applicable / TBD |
| ECR | Modify | Repository configuration; TBD |
| S3 | View | Bucket/object metadata; TBD |
| S3 | Read | Object/configuration read; exact scope TBD |
| S3 | Write | Object creation/update; exact scope TBD |
| S3 | Deploy | Not normally applicable; TBD |
| S3 | Delete | Object/bucket deletion; TBD |
| S3 | Admin | Not granted by default |
| S3 | Exec | Not applicable |
| S3 | Modify | Bucket/configuration modification; TBD |
| RDS (MongoDB) | View | Database/service metadata; TBD |
| RDS (MongoDB) | Read | Database data/configuration read; exact data scope TBD |
| RDS (MongoDB) | Write | Database/content change; exact boundary TBD |
| RDS (MongoDB) | Deploy | TBD |
| RDS (MongoDB) | Delete | Database/object deletion; TBD |
| RDS (MongoDB) | Admin | Full database administration; not inferred |
| RDS (MongoDB) | Exec | TBD |
| RDS (MongoDB) | Modify | Database configuration/permission change; TBD |
| IAM | View | Identity/policy metadata |
| IAM | Read | Identities, roles, policies, assignments |
| IAM | Write | Create/update IAM objects; highly privileged; explicit approval required |
| IAM | Deploy | Not applicable |
| IAM | Delete | Delete IAM objects; explicit privileged control required |
| IAM | Admin | Full identity-management administration; not granted by default |
| IAM | Exec | Not applicable |
| IAM | Modify | Modify IAM policies/permissions; highly privileged |
| Github | View | Repository/status metadata |
| Github | Read | Read source/repository content |
| Github | Write | Commit/push/update repository content |
| Github | Deploy | Not directly defined; TBD |
| Github | Delete | Repository/content deletion; TBD |
| Github | Admin | Full repository administration; not granted by default |
| Github | Exec | Not applicable |
| Github | Modify | Branch/workflow/repository configuration; exact boundary TBD |
| ArgoCD | View | Application/synchronization/status visibility |
| ArgoCD | Read | Read GitOps/application configuration |
| ArgoCD | Write | Change ArgoCD-managed configuration; TBD |
| ArgoCD | Deploy | Deploy/synchronize application through GitOps |
| ArgoCD | Delete | Delete/prune GitOps-managed workloads; TBD |
| ArgoCD | Admin | Full ArgoCD administration; not granted by default |
| ArgoCD | Exec | Not normally required; TBD |
| ArgoCD | Modify | Modify application/project/repository configuration; TBD |

## 4. Fixed IAM Matrix

| Identity / Persona | Type | Environment | Resource | Action | Scope | Access | Condition | Justification / Control Rationale |
|--------------------|------|-------------|----------|--------|-------|--------|-----------|------------------------------------|
| Developer | Human | Development | Github | Read | Assigned application repositories | Allow | SSO/MFA and repository membership | Development requires source-code access |
| Developer | Human | Development | Github | Write | Assigned application repositories | Allow | Protected branch / PR controls | Supports application development without unrestricted repository administration |
| Developer | Human | Development | Github | Modify | Branch/workflow/repository configuration | TBD | Explicit repository-owner/security decision required | Persona definition says develop/maintain code, not repository security administration |
| Developer | Human | Development | ECR | Read | Assigned application repositories | Allow | Repository scoped | Supports use/inspection of development artifacts |
| Developer | Human | Development | ECR | Write | Assigned application repositories | Allow | Development repositories only | Supports development artifact publishing |
| Developer | Human | Development | EKS | View | Assigned application namespace | Allow | Namespace scoped | Supports development/troubleshooting visibility |
| Developer | Human | Development | EKS | Read | Assigned application namespace | Allow | Namespace scoped | Supports application development and troubleshooting |
| Developer | Human | Development | EKS | Write | Assigned application namespace | Allow | Application workload resources only | Supports development resource changes |
| Developer | Human | Development | EKS | Deploy | Assigned application namespace | Allow | Development only; CI/GitOps preferred | Development ownership permits controlled deployment |
| Developer | Human | Development | EKS | Delete | Assigned application namespace | TBD | Resource types and approval model must be defined | Destructive access is not established by the persona definition |
| Developer | Human | Development | EKS | Exec | Assigned application pods | TBD | JIT/MFA/session logging to be defined | Interactive runtime access is not explicitly granted |
| Developer | Human | Testing | Github | Read | Assigned application repositories | TBD | Business need for source visibility in Testing must be confirmed | Persona supports development, but Testing access is not explicitly defined |
| Developer | Human | Testing | EKS | View | Assigned application namespace | TBD | Confirm troubleshooting requirement | Avoid granting operational access merely because the user develops code |
| Developer | Human | Testing | EKS | Deploy | Assigned application namespace | Deny | Deployment authority remains controlled | Prevents development identity from bypassing test promotion controls |
| Developer | Human | Testing | EKS | Write | Assigned application namespace | Deny | Explicit test-owner authorization would be required | No source definition grants test-environment write authority |
| Developer | Human | Staging | EKS | Deploy | Staging namespaces | Deny | Release process required | Protects controlled promotion |
| Developer | Human | Production | EKS | Deploy | Production namespaces | Deny | Controlled release path required | Strong separation between development and production |
| Developer | Human | Production | EKS | Exec | Production workloads | Deny | Exception would require explicit emergency-role design | Prevents standing developer production runtime access |
| Developer | Human | Production | RDS (MongoDB) | Read | Application production database | Deny | Separate approved data-access role would be required | Prevents unnecessary production data exposure |
| Developer | Human | All environments | IAM | Admin | AWS account / IAM control plane | Deny | Separate privileged identity required | Development responsibility does not establish IAM administration authority |
| Tester | Human | Testing | Github | Read | Test-relevant application repositories | TBD | Exact repository need must be confirmed | Testing the application may require source visibility, but source definition does not specify repositories |
| Tester | Human | Testing | ECR | Read | Test application artifact repositories | TBD | Exact repositories must be defined | Testing may require artifact validation, but scope is unspecified |
| Tester | Human | Testing | EKS | View | Test namespaces | Allow | Namespace scoped | Testing requires environment visibility |
| Tester | Human | Testing | EKS | Read | Test namespaces | Allow | Read-only scope | Supports application validation and troubleshooting |
| Tester | Human | Testing | EKS | Write | Test application resources | TBD | Test data/resource boundaries must be defined | Tester responsibility alone does not establish general Kubernetes write access |
| Tester | Human | Testing | EKS | Deploy | Test namespaces | TBD | CI/CD or approved test deployment process must be defined | Deployment authority is not explicit in the persona definition |
| Tester | Human | Testing | EKS | Delete | Test resources | TBD | Resource types and approval model must be defined | Destructive test capability requires explicit authorization |
| Tester | Human | Testing | EKS | Exec | Test pods | TBD | JIT/session logging requirement must be confirmed | Interactive runtime access is not explicitly granted |
| Tester | Human | Production | EKS | Deploy | Production namespaces | Deny | Controlled production release path | Tester should not own production deployment by default |
| Tester | Human | Production | EKS | Exec | Production workloads | Deny | Exception requires explicit emergency process | Prevents standing production runtime access |
| Tester | Human | Production | RDS (MongoDB) | Write | Production database | Deny | Separate approved privileged role required | Testing responsibility does not justify production database modification |
| Security engineer | Human | Development | EC2 | Read | Security-relevant configuration/telemetry | Allow | Read-only | Security assessment requires visibility |
| Security engineer | Human | Testing | EC2 | Read | Security-relevant configuration/telemetry | Allow | Read-only | Security validation |
| Security engineer | Human | Staging | EC2 | Read | Security-relevant configuration/telemetry | Allow | Read-only | Pre-production assessment |
| Security engineer | Human | Production | EC2 | Read | Security-relevant configuration/telemetry | Allow | Sensitive-data minimization | Security monitoring/investigation |
| Security engineer | Human | Development | EKS | View | Cluster/namespaces | Allow | Read-only | Security posture assessment |
| Security engineer | Human | Testing | EKS | View | Cluster/namespaces | Allow | Read-only | Security validation |
| Security engineer | Human | Staging | EKS | View | Cluster/namespaces | Allow | Read-only | Security validation |
| Security engineer | Human | Production | EKS | View | Cluster/namespaces | Allow | Read-only | Production security monitoring |
| Security engineer | Human | All environments | IAM | Read | Identities/roles/policies | Allow | Read-only | Supports IAM governance and security review |
| Security engineer | Human | All environments | IAM | Write | IAM roles/policies | TBD | Explicit security administration authority must be approved | Security assessment does not automatically equal IAM administration |
| Security engineer | Human | All environments | IAM | Admin | IAM control plane | Deny | Dedicated privileged role required | Enforces separation of duties |
| Security engineer | Human | All environments | Github | Read | Security-relevant repositories/configuration | TBD | Repository scope must be defined | Persona states security assessment, not broad source-code administration |
| Security engineer | Human | All environments | ECR | Read | Security-relevant repositories/artifacts | TBD | Repository scope must be defined | Security assessment may require artifact inspection |
| Security engineer | Human | All environments | S3 | Read | Security-relevant configuration/data | TBD | Data sensitivity and scope must be defined | Source does not specify security-engineering S3 access |
| Security engineer | Human | All environments | RDS (MongoDB) | Read | Security-relevant configuration/access evidence | TBD | Sensitive data scope must be defined | Security access must minimize direct business-data exposure |
| Security engineer | Human | All environments | ArgoCD | Read | Application/deployment status/configuration | TBD | Scope must be defined | Security review may require GitOps visibility |
| Security engineer | Human | Production | EKS | Exec | Production workloads | TBD | Explicit incident-response/JIT process required | Do not infer interactive production access from security responsibility |
| Security engineer | Human | Production | EKS | Deploy | Production namespaces | Deny | Controlled release authority required | Security assessment is separated from deployment authority |
| DevOps Engineer - Infrastructure | Human | Development | EC2 | Read | Development infrastructure | Allow | Environment scoped | Infrastructure ownership |
| DevOps Engineer - Infrastructure | Human | Development | EC2 | Write | Development infrastructure | Allow | Resource scoped | Infrastructure development/change |
| DevOps Engineer - Infrastructure | Human | Testing | EC2 | Read | Testing infrastructure | Allow | Environment scoped | Infrastructure support |
| DevOps Engineer - Infrastructure | Human | Testing | EC2 | Write | Testing infrastructure | Allow | Change controlled | Infrastructure support |
| DevOps Engineer - Infrastructure | Human | Staging | EC2 | Read | Staging infrastructure | Allow | Environment scoped | Infrastructure support |
| DevOps Engineer - Infrastructure | Human | Staging | EC2 | Write | Staging infrastructure | Allow | Change controlled | Infrastructure support |
| DevOps Engineer - Infrastructure | Human | Production | EC2 | Read | Production infrastructure | Allow | Read-first; sensitive resources restricted | Production operations |
| DevOps Engineer - Infrastructure | Human | Production | EC2 | Write | Production infrastructure | TBD | Approved change/JIT boundary required | Production modification is high impact |
| DevOps Engineer - Infrastructure | Human | Development | EKS | Read | Development cluster/namespaces | Allow | Environment scoped | Infrastructure/platform management |
| DevOps Engineer - Infrastructure | Human | Development | EKS | Write | Development platform resources | Allow | Namespace/resource scoped | Infrastructure development |
| DevOps Engineer - Infrastructure | Human | Testing | EKS | Read | Testing cluster/namespaces | Allow | Environment scoped | Infrastructure management |
| DevOps Engineer - Infrastructure | Human | Testing | EKS | Write | Testing platform resources | Allow | Namespace/resource scoped | Infrastructure management |
| DevOps Engineer - Infrastructure | Human | Staging | EKS | Read | Staging cluster/namespaces | Allow | Environment scoped | Infrastructure management |
| DevOps Engineer - Infrastructure | Human | Staging | EKS | Write | Staging platform resources | Allow | Namespace/resource scoped | Infrastructure management |
| DevOps Engineer - Infrastructure | Human | Production | EKS | Read | Production cluster/namespaces | Allow | Sensitive resources restricted | Production infrastructure visibility |
| DevOps Engineer - Infrastructure | Human | Production | EKS | Write | Production platform resources | TBD | Approved change/JIT/resource scope required | Prevents broad standing production privilege |
| DevOps Engineer - Infrastructure | Human | Production | EKS | Admin | Cluster | Deny | Separate cluster-admin decision required | Infrastructure responsibility does not automatically justify unrestricted cluster admin |
| DevOps Engineer - Infrastructure | Human | All environments | ECR | Read | Platform/application repositories | Allow | Repository scoped | Infrastructure and CI/CD support |
| DevOps Engineer - Infrastructure | Human | All environments | IAM | Read | IAM configuration relevant to operations | TBD | Exact operational need must be established | IAM visibility is not equivalent to IAM administration |
| DevOps Engineer - Infrastructure | Human | All environments | IAM | Write | IAM roles/policies | TBD | Explicit IAM delegation model required | Highly privileged capability must not be inferred |
| DevOps Engineer - CI/CD | Human | Development | Github | Read | Application/CI repositories | Allow | Repository scoped | CI/CD engineering requires source visibility |
| DevOps Engineer - CI/CD | Human | Development | Github | Write | Application/CI repositories | Allow | Protected branches and change control | Maintains CI/CD integration |
| DevOps Engineer - CI/CD | Human | Testing | Github | Read | CI/CD repositories | Allow | Repository scoped | Supports test automation pipeline |
| DevOps Engineer - CI/CD | Human | Staging | Github | Read | Release/pipeline repositories | Allow | Repository scoped | Supports controlled promotion |
| DevOps Engineer - CI/CD | Human | Production | Github | Read | Release/pipeline repositories | Allow | Repository scoped | Supports release process |
| DevOps Engineer - CI/CD | Human | All environments | Github | Modify | Branch/workflow configuration | TBD | Dedicated approval/security-control process required | CI/CD administration can weaken security controls |
| DevOps Engineer - CI/CD | Human | Development | ECR | Write | Development image repositories | Allow | Repository scoped | Publishes application artifacts |
| DevOps Engineer - CI/CD | Human | Testing | ECR | Write | Test image repositories | Allow | Repository scoped | Publishes test artifacts |
| DevOps Engineer - CI/CD | Human | Staging | ECR | Write | Staging image repositories | Allow | Repository scoped | Publishes staging artifacts |
| DevOps Engineer - CI/CD | Human | Production | ECR | Write | Production image repositories | TBD | Release/immutability/signing model required | Production artifact publication requires stronger controls |
| DevOps Engineer - CI/CD | Human | Development | EKS | Deploy | Application namespaces | TBD | Prefer CI/GitOps controlled deployment | Exact human deployment authority is not stated |
| DevOps Engineer - CI/CD | Human | Testing | EKS | Deploy | Test namespaces | TBD | Controlled test-release workflow required | Deployment ownership is not explicitly defined |
| DevOps Engineer - CI/CD | Human | Staging | EKS | Deploy | Staging namespaces | TBD | Release approval/workflow required | Controlled promotion |
| DevOps Engineer - CI/CD | Human | Production | EKS | Deploy | Production namespaces | TBD | Release ownership and SoD must be explicitly defined | Persona covers deployment, but exact production authorization is not defined |
| DevOps Engineer - CI/CD | Human | All environments | ArgoCD | Read | GitOps applications/status | TBD | Exact administration model required | DevOps owns CI/CD, but exact ArgoCD permissions are not defined |
| DevOps Engineer - CI/CD | Human | All environments | ArgoCD | Write | GitOps configuration | TBD | Change-controlled administration required | Avoid unrestricted GitOps control |
| DevOps Engineer - CI/CD | Human | All environments | ArgoCD | Deploy | GitOps-managed applications | TBD | Approved workflow required | Application deployment authority needs explicit ownership |
| CI Pipeline | Workload | Development | Github | Read | Source repositories required by pipeline | Allow | Repository scoped, read-only | Build/test pipeline consumes source |
| CI Pipeline | Workload | Testing | Github | Read | Source repositories required by pipeline | Allow | Repository scoped, read-only | Build/test pipeline consumes source |
| CI Pipeline | Workload | Staging | Github | Read | Source repositories required by pipeline | Allow | Repository scoped, read-only | Build/release workflow |
| CI Pipeline | Workload | Production | Github | Read | Source/release repositories required by pipeline | Allow | Repository scoped, read-only | Production pipeline source consumption |
| CI Pipeline | Workload | Development | ECR | Write | Development image repositories | Allow | Repository scoped | Pipeline publishes development artifacts |
| CI Pipeline | Workload | Testing | ECR | Write | Test image repositories | Allow | Repository scoped | Pipeline publishes test artifacts |
| CI Pipeline | Workload | Staging | ECR | Write | Staging image repositories | Allow | Repository scoped | Pipeline publishes staging artifacts |
| CI Pipeline | Workload | Production | ECR | Write | Production image repositories | TBD | Release workflow and artifact integrity controls required | Source says publish artifacts, but production publication authority is not explicit |
| CI Pipeline | Workload | All environments | Github | Write | Application repositories | Deny | Separate workflow-management identity required | Build pipeline should not modify source of truth by default |
| CI Pipeline | Workload | All environments | IAM | Admin | IAM control plane | Deny | None | Build/test/publish responsibility does not justify IAM administration |
| CI Pipeline | Workload | All environments | EKS | Deploy | Any namespace | TBD | Deployment responsibility is not stated; ArgoCD is separately defined as deployer | Do not infer Kubernetes deployment authority |
| ArgoCD | Workload | Development | ArgoCD | Deploy | GitOps-managed applications | Allow | Approved GitOps workflow | ArgoCD is defined as the GitOps deployment identity |
| ArgoCD | Workload | Testing | ArgoCD | Deploy | GitOps-managed applications | Allow | Approved GitOps workflow | GitOps deployment |
| ArgoCD | Workload | Staging | ArgoCD | Deploy | GitOps-managed applications | Allow | Approved GitOps workflow | GitOps deployment |
| ArgoCD | Workload | Production | ArgoCD | Deploy | GitOps-managed applications | Allow | Approved Git revision / protected source | Centralized production deployment |
| ArgoCD | Workload | Development | EKS | Deploy | GitOps-managed application namespaces | Allow | Namespace/resource scoped | Deploys application workloads |
| ArgoCD | Workload | Testing | EKS | Deploy | GitOps-managed application namespaces | Allow | Namespace/resource scoped | Deploys application workloads |
| ArgoCD | Workload | Staging | EKS | Deploy | GitOps-managed application namespaces | Allow | Namespace/resource scoped | Deploys application workloads |
| ArgoCD | Workload | Production | EKS | Deploy | GitOps-managed application namespaces | Allow | Namespace/resource scoped + approved source revision | Production deployment is centralized |
| ArgoCD | Workload | All environments | EKS | Write | GitOps-managed resource types only | TBD | Exact Kubernetes resource allow-list required | Deploy must not imply unrestricted cluster write |
| ArgoCD | Workload | All environments | EKS | Delete | GitOps-managed resources | TBD | Explicit prune/delete policy required | Destructive GitOps actions require deliberate authorization |
| ArgoCD | Workload | All environments | EKS | Admin | Cluster | Deny | Namespace/resource-scoped RBAC preferred | Eliminates unnecessary cluster administration |
| ArgoCD | Workload | All environments | Github | Read | GitOps source repositories | TBD | Repository-scoped identity required | GitOps requires access to desired-state source |
| ArgoCD | Workload | All environments | Github | Write | GitOps source repositories | Deny | Source of truth should remain external to controller | Prevents controller tampering with source |
| ArgoCD | Workload | All environments | IAM | Admin | IAM control plane | Deny | None | Deployment workload does not require identity administration |
| Monitoring | Workload | Development | EC2 | Read | Application/platform telemetry source | TBD | Exact telemetry endpoints must be defined | Persona says collect logs/metrics |
| Monitoring | Workload | Testing | EC2 | Read | Application/platform telemetry source | TBD | Exact telemetry endpoints must be defined | Observability |
| Monitoring | Workload | Staging | EC2 | Read | Application/platform telemetry source | TBD | Exact telemetry endpoints must be defined | Observability |
| Monitoring | Workload | Production | EC2 | Read | Application/platform telemetry source | TBD | Sensitive-data filtering required | Production monitoring |
| Monitoring | Workload | Development | EKS | Read | Application/platform telemetry | Allow | Read-only | Collects logs/metrics |
| Monitoring | Workload | Testing | EKS | Read | Application/platform telemetry | Allow | Read-only | Collects logs/metrics |
| Monitoring | Workload | Staging | EKS | Read | Application/platform telemetry | Allow | Read-only | Collects logs/metrics |
| Monitoring | Workload | Production | EKS | Read | Application/platform telemetry | Allow | Read-only; sensitive-data filtering | Production observability |
| Monitoring | Workload | All environments | RDS (MongoDB) | Write | Metrics destination | TBD | Database/schema must be explicitly identified | Source says metrics are written to a database, but does not identify the exact RDS scope |
| Monitoring | Workload | All environments | RDS (MongoDB) | Read | Monitoring-related telemetry/schema | TBD | Only if required by monitoring design | Avoid unrelated database access |
| Monitoring | Workload | All environments | IAM | Admin | IAM control plane | Deny | None | Monitoring requires no identity administration |
| Monitoring | Workload | All environments | Github | Read | Monitoring configuration repository | TBD | Only if monitoring implementation requires it | Not established by persona definition |
| Monitoring | Workload | All environments | ECR | Read | Monitoring component images | TBD | Only if required by runtime architecture | Image access is not established by persona definition |
| Monitoring | Workload | All environments | S3 | Read | Monitoring-related telemetry storage | TBD | Storage dependency must be explicitly identified | Not established by persona definition |

## 5. Explicit Deny Guardrails

| Identity / Persona | Environment | Resource | Action | Access | Control Rationale |
|--------------------|-------------|----------|--------|--------|-------------------|
| Developer | Production | EKS | Deploy | Deny | Development identity must not bypass production release controls |
| Developer | Production | EKS | Admin | Deny | No cluster administration |
| Developer | All environments | IAM | Admin | Deny | No identity administration |
| Tester | Production | EKS | Deploy | Deny | Testing responsibility does not imply production deployment |
| Tester | Production | RDS (MongoDB) | Write | Deny | Prevent direct production database modification |
| Security engineer | All environments | IAM | Admin | Deny | Security assessment is separated from IAM administration |
| Security engineer | Production | EKS | Deploy | Deny | Security review is separated from release authority |
| CI Pipeline | All environments | IAM | Admin | Deny | Prevent pipeline compromise from becoming IAM compromise |
| CI Pipeline | All environments | Github | Write | Deny | Build pipeline should not alter source of truth by default |
| CI Pipeline | All environments | EKS | Exec | Deny | Non-interactive workload identity |
| ArgoCD | All environments | EKS | Admin | Deny | GitOps controller should use scoped Kubernetes RBAC |
| ArgoCD | All environments | Github | Write | Deny | Controller should not modify source of truth |
| ArgoCD | All environments | IAM | Admin | Deny | Deployment workload has no IAM administration requirement |
| Monitoring | All environments | IAM | Admin | Deny | Monitoring should not manage identities |
| Monitoring | All environments | EKS | Deploy | Deny | Observability identity should not deploy workloads |

## 6. High-Risk Items Requiring Architecture Decisions Before Implementation

| Decision Area | Status | Decision Required |
|---------------|--------|-------------------|
| Developer production access | Defined as Deny for Deploy/Admin | Keep production application deployment outside the developer persona |
| Tester deployment authority | TBD | Decide whether testers can deploy to Test or whether CI/CD owns deployment |
| DevOps IAM access | TBD | Define whether DevOps can read/write IAM and exactly which IAM objects |
| DevOps production deployment | TBD | Define separation between DevOps engineering, release approval, and GitOps execution |
| Github branch/workflow administration | TBD | Define who can Modify branch protection/workflows |
| EKS Write vs Deploy | Separate | Do not bundle these permissions into one role |
| EKS Exec | TBD for humans | Define JIT/PAM, MFA, approval, session recording, and production restrictions |
| EKS Delete | TBD | Define resource types, approval, and environment-specific destructive controls |
| RDS access | Mostly TBD | Define database-level vs data-level access and production data restrictions |
| S3 access | TBD | Define which personas/services need object access and whether access is read/write/delete |
| ArgoCD Write/Delete | TBD | Define exact projects, applications, namespaces and prune behavior |
| CI Pipeline -> EKS | TBD | Prefer ArgoCD as deployment identity unless direct CI deployment is explicitly required |
| Monitoring -> RDS | TBD | Identify the exact metrics destination/schema before granting database permissions |
| Shared accounts | Not an approved persona | Do not create shared human identities; use named identities |
| Additional roles such as DBA/SRE/Auditor/Break-Glass | Not in source personas | Create separately through a formal role-definition process before putting them into the entitlement model |