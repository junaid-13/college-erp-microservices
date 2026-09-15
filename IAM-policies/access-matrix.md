| Identity / Persona | Type | Environment | Resource | Action | Scope | Access | Condition | Justification / Control Rationale |
|--------------------|------|-------------|----------|--------|-------|--------|-----------|------------------------------------|
| Application Developer | Human | Development | GitHub | Read | Assigned application repositories | Allow | SSO + MFA; repo membership | Developers need source-code access only to applications they own |
| Application Developer | Human | Development | GitHub | Write | Assigned application repositories | Allow | Protected main branch; PR required | Code contribution is required, but direct production branch modification is restricted |
| Application Developer | Human | Development | GitHub | Modify | Branch/workflow configuration | Deny | Maintainer approval required | Prevent developers from weakening branch protection or CI controls |
| Application Developer | Human | Development | ECR | Read | Assigned application repositories | Allow | Repository scoped | Developers may inspect/pull development artifacts |
| Application Developer | Human | Development | ECR | Write | Assigned application repositories | Allow | Dev repositories only | Allows development image publishing without production repository access |
| Application Developer | Human | Development | EKS | View | Assigned application namespace | Allow | Namespace scoped | Required for development troubleshooting |
| Application Developer | Human | Development | EKS | Read | Assigned application namespace | Allow | Namespace scoped | Read runtime/configuration information within owned namespace |
| Application Developer | Human | Development | EKS | Write | Assigned application namespace | Allow | Resource types limited to application workload objects | Supports development changes without cluster administration |
| Application Developer | Human | Development | EKS | Deploy | Assigned application namespace | Allow | Development only; CI/GitOps preferred | Developer deployment is acceptable in development within namespace boundary |
| Application Developer | Human | Development | EKS | Delete | Assigned application namespace | Conditional Allow | Only non-production; resource-level RBAC; audit logging | Destructive action should be limited even in development |
| Application Developer | Human | Development | EKS | Exec | Assigned application pods | Conditional Allow | MFA/JIT; approved troubleshooting; session logging | Runtime access may be needed but must not become persistent unrestricted access |
| Application Developer | Human | Testing | EKS | View | Assigned application namespace | Allow | Read-only | Developers may investigate test failures without becoming test operators |
| Application Developer | Human | Testing | EKS | Deploy | Assigned application namespace | Deny | Deployment performed by CI/CD or release role | Separates development from controlled test promotion |
| Application Developer | Human | Staging | EKS | Deploy | Staging namespaces | Deny | Release approval required | Prevents developers bypassing release controls |
| Application Developer | Human | Production | EKS | Deploy | Production namespaces | Deny | Production deployment owned by release pipeline | Strong separation of development and production deployment |
| Application Developer | Human | Production | EKS | Exec | Production pods | Deny | Break-glass role only | Prevents normal developer access to production runtime |
| Application Developer | Human | Production | RDS | Read | Application production database | Deny | Support access via approved privileged role | Prevents direct production data exposure |
| Application Developer | Human | Production | IAM | Admin | AWS account | Deny | Separate IAM administrators only | Developers must never receive standing IAM administration |

| Senior Developer / Tech Lead | Human | Development | GitHub | Read | Assigned application repositories | Allow | SSO + MFA | Same development source access as developer |
| Senior Developer / Tech Lead | Human | Development | GitHub | Write | Assigned application repositories | Allow | PR controls enforced | Maintains application code |
| Senior Developer / Tech Lead | Human | Development | GitHub | Modify | Branch settings | Conditional Allow | Repository owner approval; security controls cannot be disabled | Limited maintainer responsibility without unrestricted repository administration |
| Senior Developer / Tech Lead | Human | Development | EKS | Write | Owned development namespaces | Allow | Namespace scoped | Supports technical troubleshooting |
| Senior Developer / Tech Lead | Human | Development | EKS | Deploy | Owned development namespaces | Allow | Development only | Allows technical validation |
| Senior Developer / Tech Lead | Human | Testing | EKS | Deploy | Assigned test namespaces | Conditional Allow | Approved test deployment workflow | May support complex testing, but not production |
| Senior Developer / Tech Lead | Human | Production | EKS | Deploy | Production namespaces | Deny | Release role required | Maintains separation between engineering and production release authorization |
| Senior Developer / Tech Lead | Human | Production | EKS | Exec | Production pods | Deny | Break-glass only | Prevents standing privileged production runtime access |

| QA Analyst / Tester | Human | Testing | GitHub | Read | Test-relevant repositories | Allow | Repository scoped | Testers need source visibility where required for validation |
| QA Analyst / Tester | Human | Testing | ECR | Read | Test artifact repositories | Allow | Test repositories only | Required to validate deployed application artifacts |
| QA Analyst / Tester | Human | Testing | EKS | View | Test namespaces | Allow | Namespace scoped | Test execution and validation require environment visibility |
| QA Analyst / Tester | Human | Testing | EKS | Read | Test namespaces | Allow | Read-only resource/data visibility | Supports functional and technical validation |
| QA Analyst / Tester | Human | Testing | EKS | Write | Test application resources | Conditional Allow | Only test data/resources defined for QA | Prevents broad cluster modifications |
| QA Analyst / Tester | Human | Testing | EKS | Deploy | Test namespaces | Conditional Allow | CI/CD or approved test deployment workflow | Allows test deployment without production rights |
| QA Analyst / Tester | Human | Testing | EKS | Delete | Test namespace test resources | Conditional Allow | Non-production; limited resource types | Required to reset test environments without broad destructive authority |
| QA Analyst / Tester | Human | Testing | EKS | Exec | Test pods | Conditional Allow | JIT + session logging | Permits controlled test diagnostics |
| QA Analyst / Tester | Human | Production | EKS | Deploy | Production namespaces | Deny | Release authorization required | QA does not own production deployment |
| QA Analyst / Tester | Human | Production | RDS | Write | Production database | Deny | No direct production data modification | Prevents accidental or unauthorized production data changes |
| QA Analyst / Tester | Human | Production | EKS | Exec | Production pods | Deny | Break-glass only | Production runtime access should not be part of normal QA role |

| Test Automation Engineer | Human | Testing | GitHub | Read | Test automation repositories | Allow | Repo scoped | Required to maintain automated tests |
| Test Automation Engineer | Human | Testing | GitHub | Write | Test automation repositories | Allow | Protected branches | Maintains test code |
| Test Automation Engineer | Human | Testing | ECR | Write | Test automation image repositories | Allow | Repository scoped | Publishes test execution artifacts where required |
| Test Automation Engineer | Human | Testing | EKS | Deploy | Test namespaces | Conditional Allow | CI workflow preferred | Supports automated test execution |
| Test Automation Engineer | Human | Production | EKS | Deploy | Production namespaces | Deny | Release process only | Test automation must not become production deployment authority |

| Security Analyst | Human | Development | All defined resources | Read | Security-relevant configuration/telemetry | Allow | Read-only; least privilege | Security requires visibility across environments |
| Security Analyst | Human | Testing | All defined resources | Read | Security-relevant configuration/telemetry | Allow | Read-only | Supports security validation |
| Security Analyst | Human | Staging | All defined resources | Read | Security-relevant configuration/telemetry | Allow | Read-only | Supports pre-production security validation |
| Security Analyst | Human | Production | All defined resources | Read | Security-relevant configuration/telemetry | Allow | Read-only; sensitive data minimized | Security monitoring and investigation require production visibility |
| Security Analyst | Human | All environments | EKS | View | Cluster/namespaces | Allow | Read-only | Security posture and configuration assessment |
| Security Analyst | Human | All environments | EKS | Read | Security configurations/logs | Allow | Sensitive-data filtering | Supports security investigations |
| Security Analyst | Human | Production | EKS | Exec | Production pods | Conditional Allow | JIT; incident ticket; session recording | Runtime access is for incident response, not routine administration |
| Security Analyst | Human | All environments | IAM | Read | Identities, roles, policies | Allow | Read-only | Supports IAM governance and review |
| Security Analyst | Human | All environments | IAM | Write | IAM policies/roles | Deny | IAM Administrator role required | Security monitoring does not equal IAM change authority |
| Security Analyst | Human | All environments | IAM | Admin | AWS account | Deny | Separate privileged IAM administrator | Enforces separation of duties |
| Security Analyst | Human | Production | EKS | Deploy | Production namespaces | Deny | Release role only | Security personnel should not routinely deploy application changes |

| Security / IAM Administrator | Human | All environments | IAM | Read | IAM configuration | Allow | MFA + privileged workstation | Required for IAM administration |
| Security / IAM Administrator | Human | All environments | IAM | Write | IAM roles/policies/groups | Allow | MFA + approval + change ticket | Performs controlled IAM administration |
| Security / IAM Administrator | Human | All environments | IAM | Admin | AWS account | Conditional Allow | JIT/PAM; dual control for high-risk changes; full audit | IAM administration is highly privileged and requires enhanced controls |
| Security / IAM Administrator | Human | Production | EKS | Admin | Cluster | Deny | Separate platform administrator | IAM admin should not automatically receive Kubernetes administration |
| Security / IAM Administrator | Human | Production | RDS | Admin | Database | Deny | Separate database administrator | Prevents privilege aggregation |

| Platform Engineer | Human | Development | EC2 | Read | Development instances | Allow | Environment scoped | Supports infrastructure engineering |
| Platform Engineer | Human | Development | EC2 | Write | Development instances | Allow | Resource/tag scoped | Required to manage development infrastructure |
| Platform Engineer | Human | Development | EKS | Read | Development cluster/namespaces | Allow | Cluster-wide read | Supports platform operations |
| Platform Engineer | Human | Development | EKS | Write | Development namespaces | Allow | Namespace/resource scoped | Manages platform resources without unrestricted cluster admin |
| Platform Engineer | Human | Development | EKS | Deploy | Development namespaces | Allow | Controlled deployment workflow | Supports development platform deployment |
| Platform Engineer | Human | Testing | EC2 | Read | Test instances | Allow | Environment scoped | Supports test infrastructure |
| Platform Engineer | Human | Testing | EC2 | Write | Test instances | Allow | Environment scoped | Infrastructure operations |
| Platform Engineer | Human | Testing | EKS | Write | Test namespaces | Allow | Namespace/resource scoped | Supports environment operations |
| Platform Engineer | Human | Staging | EC2 | Read | Staging instances | Allow | Environment scoped | Operational support |
| Platform Engineer | Human | Staging | EC2 | Write | Staging instances | Allow | Change-controlled | Supports staging infrastructure |
| Platform Engineer | Human | Staging | EKS | Write | Staging namespaces | Allow | Namespace/resource scoped | Platform support |
| Platform Engineer | Human | Production | EC2 | Read | Production instances | Allow | Read-first; sensitive actions restricted | Operational visibility |
| Platform Engineer | Human | Production | EC2 | Write | Production instances | Conditional Allow | Approved change; JIT where privileged | Production infrastructure changes require change control |
| Platform Engineer | Human | Production | EKS | Read | Production cluster/namespaces | Allow | Cluster read; sensitive resources restricted | Required for platform support |
| Platform Engineer | Human | Production | EKS | Write | Production platform resources | Conditional Allow | Approved change; JIT for privileged operations | Enables platform operations while restricting application-level change |
| Platform Engineer | Human | Production | EKS | Deploy | Production namespaces | Conditional Allow | Approved release/change; release ownership separated from application development | Production deployment is controlled, not standing unrestricted |
| Platform Engineer | Human | Production | EKS | Delete | Production resources | Conditional Allow | Break-glass/change approval; resource-specific | Destructive operations are high risk |
| Platform Engineer | Human | Production | EKS | Exec | Production nodes/pods | Conditional Allow | JIT + MFA + ticket + session logging | Operational runtime support requires elevated controls |
| Platform Engineer | Human | All environments | IAM | Admin | AWS account | Deny | IAM Admin role only | Infrastructure administration must not confer IAM administration |
| Platform Engineer | Human | All environments | ECR | Read | Platform/application repositories | Allow | Repository scoped | Required for deployment and troubleshooting |
| Platform Engineer | Human | All environments | ECR | Write | Production application repositories | Conditional Allow | CI/CD preferred; human push only by exception | Reduces direct artifact tampering risk |

| Release Engineer | Human | Staging | EKS | Deploy | Approved staging namespaces | Allow | Release workflow + approval | Owns controlled promotion into staging |
| Release Engineer | Human | Production | EKS | Deploy | Approved production namespaces | Allow | Approved change; separation from code author where required | Explicit production release authority |
| Release Engineer | Human | Production | ECR | Read | Production artifact repositories | Allow | Repository scoped | Verifies deployable artifacts |
| Release Engineer | Human | Production | GitHub | Read | Release repositories | Allow | Read-only | Release validation without broad source modification |
| Release Engineer | Human | Production | GitHub | Write | Application source repositories | Deny | Code owners/developers own source | Prevents release personnel from bypassing development controls |
| Release Engineer | Human | Production | IAM | Admin | AWS account | Deny | IAM Administrator only | Release role must not administer identities |
| Release Engineer | Human | Production | EKS | Exec | Production pods | Deny | Break-glass / Operations role only | Release activity should not require interactive production access |

| Site Reliability / Operations Engineer | Human | Production | All defined resources | View | Production | Allow | Production scope | Supports operational monitoring |
| Site Reliability / Operations Engineer | Human | Production | All defined resources | Read | Production | Allow | Sensitive data minimization | Production troubleshooting |
| Site Reliability / Operations Engineer | Human | Production | EC2 | Write | Production instances | Conditional Allow | Approved operational change | Operational infrastructure changes |
| Site Reliability / Operations Engineer | Human | Production | EKS | Write | Production platform resources | Conditional Allow | Approved change; namespace/resource scoped | Enables operations without cluster-wide unrestricted rights |
| Site Reliability / Operations Engineer | Human | Production | EKS | Exec | Production nodes/pods | Conditional Allow | JIT + ticket + MFA + session recording | Operations may require runtime access |
| Site Reliability / Operations Engineer | Human | Production | EKS | Delete | Production resources | Conditional Allow | Break-glass/change approval; limited resource types | High-risk destructive activity must be controlled |
| Site Reliability / Operations Engineer | Human | Production | EKS | Deploy | Production workloads | Deny | Release Engineer / GitOps path | Separates operations from software release authority |
| Site Reliability / Operations Engineer | Human | Production | RDS | Read | Production database | Allow | Least privilege; sensitive data restrictions | Supports troubleshooting |
| Site Reliability / Operations Engineer | Human | Production | RDS | Write | Production database | Conditional Allow | Specific operational procedures only | Direct data changes should be exceptional |
| Site Reliability / Operations Engineer | Human | Production | RDS | Admin | Database instance | Deny | DBA role required | Prevents excessive privilege accumulation |
| Site Reliability / Operations Engineer | Human | All environments | IAM | Admin | AWS account | Deny | IAM Administrator only | Separation of infrastructure and IAM administration |

| Database Administrator | Human | Development | RDS | Read | Development databases | Allow | Database scoped | Supports DB operations |
| Database Administrator | Human | Development | RDS | Write | Development databases | Allow | Environment scoped | Required for development database administration |
| Database Administrator | Human | Testing | RDS | Read | Test databases | Allow | Environment scoped | Supports test data validation |
| Database Administrator | Human | Testing | RDS | Write | Test databases | Allow | Controlled test scope | Supports test execution/reset |
| Database Administrator | Human | Production | RDS | Read | Production databases | Allow | MFA; sensitive-data controls | Production database support |
| Database Administrator | Human | Production | RDS | Write | Production databases | Conditional Allow | Approved change/ticket; no direct ad-hoc application data modification | Separates DBA operations from application users |
| Database Administrator | Human | Production | RDS | Admin | Production database | Conditional Allow | JIT/PAM + dual approval for critical actions | Database administration is privileged |
| Database Administrator | Human | All environments | IAM | Admin | AWS account | Deny | IAM Administrator only | Prevents privilege aggregation |

| CI Pipeline | Workload | Development / Testing / Staging / Production | GitHub | Read | Source repositories required by pipeline | Allow | Repository-scoped token; read-only | CI must consume source but should not have unnecessary source mutation rights |
| CI Pipeline | Workload | All environments | GitHub | Write | Repositories | Deny | Separate workflow-management identity if required | Build pipeline should not modify source code |
| CI Pipeline | Workload | All environments | GitHub | Modify | Branch/workflow controls | Deny | Dedicated repository administration process | Prevents CI compromise from changing security controls |
| CI Pipeline | Workload | Development | ECR | Write | Development image repositories | Allow | Repository scoped | Publishes development artifacts |
| CI Pipeline | Workload | Testing | ECR | Write | Test image repositories | Allow | Repository scoped | Publishes test artifacts |
| CI Pipeline | Workload | Staging | ECR | Write | Staging image repositories | Allow | Repository scoped | Publishes staging artifacts |
| CI Pipeline | Workload | Production | ECR | Write | Production image repositories | Conditional Allow | Immutable tags/signatures; release workflow | Production artifact publishing requires stronger controls |
| CI Pipeline | Workload | Development / Testing / Staging | EKS | Deploy | Pipeline-designated namespaces | Conditional Allow | Prefer GitOps promotion; no cluster-admin | Direct deployment only where architecture requires it |
| CI Pipeline | Workload | Production | EKS | Deploy | Production namespaces | Deny | ArgoCD/release workflow owns production deployment | Reduces CI blast radius |
| CI Pipeline | Workload | Any | EKS | Exec | Any namespace | Deny | No exception for normal CI | CI workloads should never need interactive runtime access |
| CI Pipeline | Workload | Any | IAM | Admin | AWS account | Deny | Workload identity restricted to required resources | Prevents pipeline compromise becoming account takeover |

| ArgoCD Service Account | Workload | Development | EKS | Deploy | GitOps-managed application namespaces | Allow | Namespace/resource scoped | ArgoCD is the deployment engine for GitOps-managed workloads |
| ArgoCD Service Account | Workload | Testing | EKS | Deploy | GitOps-managed test namespaces | Allow | Namespace/resource scoped | Controlled automated promotion |
| ArgoCD Service Account | Workload | Staging | EKS | Deploy | GitOps-managed staging namespaces | Allow | Namespace/resource scoped | Supports controlled staging release |
| ArgoCD Service Account | Workload | Production | EKS | Deploy | GitOps-managed production namespaces | Allow | Approved Git revision; protected repo; namespace scoped | Production deployment is centralized and auditable |
| ArgoCD Service Account | Workload | All environments | EKS | Write | GitOps-managed resource types only | Allow | Explicit Kubernetes RBAC resource allow-list | Deployment should not imply arbitrary cluster write |
| ArgoCD Service Account | Workload | All environments | EKS | Delete | GitOps-managed resources | Conditional Allow | Pruning enabled only for approved resource types | Delete capability is distinct and should be deliberately controlled |
| ArgoCD Service Account | Workload | All environments | EKS | Exec | Any pod/node | Deny | No interactive runtime access | GitOps controller has no operational shell requirement |
| ArgoCD Service Account | Workload | All environments | EKS | Admin | Cluster | Deny | Namespace-level RBAC preferred | Eliminates unnecessary cluster-admin privilege |
| ArgoCD Service Account | Workload | All environments | GitHub | Read | GitOps repositories | Allow | Deploy-key/service-account scoped | Reads desired-state configuration |
| ArgoCD Service Account | Workload | All environments | GitHub | Write | GitOps repositories | Deny | GitOps controller must not modify source of truth | Prevents control-plane tampering |
| ArgoCD Service Account | Workload | All environments | IAM | Admin | AWS account | Deny | Dedicated AWS workload permissions only | GitOps compromise must not expose IAM administration |

| Monitoring Service | Workload | Development | Application / Infrastructure Telemetry | Read | Development telemetry | Allow | Read-only | Required for monitoring |
| Monitoring Service | Workload | Testing | Application / Infrastructure Telemetry | Read | Test telemetry | Allow | Read-only | Required for monitoring |
| Monitoring Service | Workload | Staging | Application / Infrastructure Telemetry | Read | Staging telemetry | Allow | Read-only | Required for monitoring |
| Monitoring Service | Workload | Production | Application / Infrastructure Telemetry | Read | Production telemetry | Allow | Read-only; sensitive-data filtering | Monitoring needs observability without broad data access |
| Monitoring Service | Workload | All environments | Prometheus / Metrics Source | Read | Application + infrastructure metrics | Allow | Read-only | Required to collect metrics |
| Monitoring Service | Workload | All environments | RDS | Write | Metrics repository only | Conditional Allow | Only after confirming RDS is the metrics destination; DB/schema restricted | Original design did not uniquely identify the target database |
| Monitoring Service | Workload | All environments | RDS | Read | Metrics schema | Conditional Allow | Only if required for monitoring | Monitoring should not receive unrelated database access |
| Monitoring Service | Workload | All environments | IAM | Admin | AWS account | Deny | No IAM administration requirement | Monitoring workload should have no identity-management privilege |
| Monitoring Service | Workload | All environments | EKS | Deploy | Any namespace | Deny | Monitoring is observability-only | Prevents monitoring compromise from becoming deployment privilege |

| Internal Auditor | Human | Development / Testing / Staging / Production | IAM | Read | Roles, policies, access assignments | Allow | Read-only; privileged data masking | Required for access reviews and control testing |
| Internal Auditor | Human | Development / Testing / Staging / Production | GitHub | Read | Repository settings/audit evidence | Allow | Read-only; no source modification | Supports SoD and change-control testing |
| Internal Auditor | Human | Development / Testing / Staging / Production | EKS | View | Cluster RBAC/configuration | Allow | Read-only | Enables configuration and privilege review |
| Internal Auditor | Human | Production | RDS | Read | Audit-relevant metadata/access evidence | Allow | No direct business data access unless specifically authorized | Auditing should avoid unnecessary sensitive-data exposure |
| Internal Auditor | Human | All environments | ECR | Read | Repository configuration/audit metadata | Allow | Read-only | Supports artifact-control testing |
| Internal Auditor | Human | All environments | IAM | Write | Any IAM object | Deny | Auditor must remain independent | Prevents self-approval and management conflicts |
| Internal Auditor | Human | All environments | EKS | Deploy | Any namespace | Deny | No operational role | Preserves auditor independence |
| Internal Auditor | Human | All environments | EKS | Exec | Any pod/node | Deny | No operational runtime access | Auditing does not require interactive production access |

| Break-Glass Incident Responder | Human | Production | EKS | Exec | Approved production pods/nodes | Conditional Allow | PAM/JIT; incident ticket; MFA; session recording; emergency approval | Enables emergency response without standing privilege |
| Break-Glass Incident Responder | Human | Production | EKS | Write | Approved production resources | Conditional Allow | Incident scope only; time-bound | Emergency remediation must be constrained |
| Break-Glass Incident Responder | Human | Production | EKS | Delete | Approved production resources | Conditional Allow | Emergency approval + full logging | Destructive incident response requires strongest controls |
| Break-Glass Incident Responder | Human | Production | EC2 | Write | Approved production instances | Conditional Allow | JIT + incident ticket | Emergency infrastructure remediation |
| Break-Glass Incident Responder | Human | Production | RDS | Write | Specific emergency DB objects | Conditional Allow | DBA/security approval + session logging | Emergency database remediation without standing DBA access |
| Break-Glass Incident Responder | Human | Production | IAM | Admin | AWS account | Conditional Allow | Extremely restricted; dual authorization; PAM; post-event review | Account-level emergency privilege must be exceptional and audited |

| Application Workload Identity | Workload | Development | ECR | Read | Application image repository | Allow | Repository scoped | Application runtime needs to retrieve its image |
| Application Workload Identity | Workload | Testing | ECR | Read | Application image repository | Allow | Repository scoped | Runtime artifact consumption |
| Application Workload Identity | Workload | Staging | ECR | Read | Application image repository | Allow | Repository scoped | Runtime artifact consumption |
| Application Workload Identity | Workload | Production | ECR | Read | Production image repository | Allow | Immutable artifact model | Production runtime consumes approved image only |
| Application Workload Identity | Workload | Development / Testing / Staging / Production | IAM | Admin | AWS account | Deny | Application uses narrowly scoped workload role | Prevents application compromise from becoming IAM compromise |
| Application Workload Identity | Workload | Development / Testing / Staging / Production | EKS | Exec | Self/other pods | Deny | No interactive control-plane privilege | Application runtime identity must not administer Kubernetes |

| Shared / Generic Human Account | Human | Any | Any | Admin | Any resource | Deny | Individual named identity required | Shared accounts destroy accountability and complicate audit |
| Shared / Generic Human Account | Human | Production | EKS | Exec | Any namespace | Deny | Named privileged identity required | Prevents non-repudiation failures |
| Shared / Generic Human Account | Human | Production | IAM | Admin | AWS account | Deny | Named IAM admin + PAM required | Shared privileged credentials are unacceptable |