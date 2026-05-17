# Azure App Services Tutorials

Welcome to the Azure App Services Tutorials library. These tutorials are designed to help junior cloud engineers understand the core concepts, development workflows, and best practices for building, deploying, and managing applications on Azure App Services.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Workflows](#development-workflows)
3. [Scaling & Performance](#scaling--performance)
4. [Security & Compliance](#security--compliance)

## Getting Started

### 1. Creating Your First Web App
Learn how to provision a web app using the Azure Portal, CLI, or Terraform.
*   **Prerequisites:** Azure account, Basic knowledge of HTML/CSS/JS.
*   **Duration:** 15 minutes.
*   **Key Concepts:** Resource Group, App Service Plan, App Service.

### 2. Connecting a Custom Domain
Configure a custom domain (e.g., `myapp.cloud-lab.io`) to your Azure App Service.
*   **Prerequisites:** A registered domain name.
*   **Duration:** 10 minutes.
*   **Key Concepts:** DNS records, SSL/TLS bindings.

## Development Workflows

### 3. CI/CD with GitHub Actions
Automate your deployment pipeline using GitHub Actions to push code directly to Azure App Services.
*   **Prerequisites:** GitHub repository connected to Azure.
*   **Duration:** 20 minutes.
*   **Key Concepts:** Webhooks, Deployment Slots, Environment variables.

### 4. Local Development with VS Code
Use the Azure App Service extension for VS Code to debug and deploy code locally before pushing to the cloud.
*   **Prerequisites:** VS Code, Azure CLI installed.
*   **Duration:** 15 minutes.
*   **Key Concepts:** Remote Debugging, Local Emulator.

## Scaling & Performance

### 5. Scaling Your App (Horizontal vs Vertical)
Understand the difference between scaling up (changing the App Service Plan) and scaling out (adding instances).
*   **Prerequisites:** Active App Service Plan.
*   **Duration:** 10 minutes.
*   **Key Concepts:** Auto-scaling rules, Load Balancing.

### 6. Using Deployment Slots
Deploy to a "staging" slot and swap it with "production" to ensure zero downtime updates.
*   **Prerequisites:** Multi-slot App Service Plan.
*   **Duration:** 15 minutes.
*   **Key Concepts:** Blue-Green Deployment, Swap Slots.

## Security & Compliance

### 7. Configuring Authentication (Azure AD)
Secure your app using Azure Active Directory (Entra ID) for authentication and authorization.
*   **Prerequisites:** Azure AD Tenant.
*   **Duration:** 20 minutes.
*   **Key Concepts:** App Registrations, Access Tokens, Policies.

### 8. Application Insights Integration
Monitor application health, performance, and errors in real-time.
*   **Prerequisites:** App Service instance.
*   **Duration:** 10 minutes.
*   **Key Concepts:** Telemetry, Alerts, KQL Queries.

## Feedback & Suggestions
We want this library to be as helpful as possible. If you have a tutorial idea, found an error, or have a suggestion for a topic, please [open an issue on GitHub](https://github.com/[username]/cloud-lab/issues) or [submit a pull request](https://github.com/[username]/cloud-lab/pulls).