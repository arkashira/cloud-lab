# Tech Spec: cloud-lab Enterprise Portfolio Template

## Stack

- **Infrastructure as Code (IaC)**: Terraform (v1.0.11) for provisioning and managing AWS resources declaratively.
- **Configuration Management**: Ansible (v2.10.7) for automating configuration and deployment tasks.
- **Container Orchestration**: Amazon Elastic Kubernetes Service (EKS) (v1.21) for managing and scaling containerized applications.
- **CI/CD**: GitLab CI/CD (v13.0.0) for automating the software delivery process.
- **Version Control**: Git (v2.31.1) with GitLab as the remote repository.
- **Programming Language**: Bash (v5.0.3) for scripting and automation tasks.

## Hosting

- **Free-Tier-First**: The template will be designed to work within the AWS free tier limits to minimize costs for users learning and experimenting.
- **Platforms**: AWS (us-east-1 region) for infrastructure provisioning and management.

## Data Model

### Tables/Collections

1. **Projects**
   - `id` (PK)
   - `name`
   - `description`
   - `created_at`
   - `updated_at`

2. **Environment Variables**
   - `id` (PK)
   - `project_id` (FK)
   - `name`
   - `value`
   - `created_at`
   - `updated_at`

3. **Terraform State**
   - `id` (PK)
   - `project_id` (FK)
   - `key`
   - `value`
   - `created_at`
   - `updated_at`

## API Surface

1. **GET /projects**
   - Purpose: Retrieve a list of projects.
   - Response: JSON array of project objects.

2. **POST /projects**
   - Purpose: Create a new project.
   - Request Body: JSON object containing project details.
   - Response: JSON object of the created project.

3. **GET /projects/{id}**
   - Purpose: Retrieve a single project by ID.
   - Response: JSON object of the project.

4. **PUT /projects/{id}**
   - Purpose: Update an existing project.
   - Request Body: JSON object containing updated project details.
   - Response: JSON object of the updated project.

5. **DELETE /projects/{id}**
   - Purpose: Delete a project by ID.

6. **GET /projects/{id}/terraform-state**
   - Purpose: Retrieve the Terraform state for a project.
   - Response: JSON object containing the Terraform state.

7. **POST /projects/{id}/deploy**
   - Purpose: Trigger a deployment for a project.
   - Request Body: JSON object containing deployment parameters.

## Security Model

- **Authentication**: GitLab CI/CD pipelines will use GitLab personal access tokens for authentication.
- **Secrets**: Sensitive data like AWS credentials will be stored in GitLab CI/CD secret variables and accessed via environment variables.
- **IAM**: AWS IAM roles and policies will be used to control access to AWS resources. The template will follow the principle of least privilege.

## Observability

- **Logs**: CloudWatch Logs will be used to collect and store logs from AWS resources and GitLab CI/CD pipelines.
- **Metrics**: CloudWatch Metrics will be used to monitor AWS resources and GitLab CI/CD pipelines.
- **Traces**: X-Ray will be used to trace requests and analyze performance.

## Build/CI

- **Build**: Builds will be triggered automatically via GitLab CI/CD pipelines whenever changes are pushed to the main branch.
- **CI**: The CI/CD pipeline will consist of the following stages:
  1. Lint and format Terraform and Ansible code.
  2. Validate Terraform code.
  3. Plan Terraform infrastructure changes.
  4. Apply Terraform infrastructure changes.
  5. Deploy application to EKS cluster.
  6. Run tests.
  7. Generate and publish test results.
  8. Notify stakeholders of deployment status.