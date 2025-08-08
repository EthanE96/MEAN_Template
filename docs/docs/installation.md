---
hide:
  - navigation
---

# Installation

## Introduction

This guide provides step-by-step instructions for installing and running the MEAN Template project, both locally and in the cloud. You'll learn how to set up the required tools, install dependencies, and deploy the application using Azure infrastructure. Whether you're developing locally or preparing for production, this documentation will help you get started quickly and securely.

## Code Install

### Prerequisites

- Node.js 20+
- NPM 9+
- MongoDB (local or Azure CosmosDB)
- Azure account (for cloud deployment)

### Clone & Install

```bash
git clone https://github.com/EthanE96/MEAN_Template.git
cd MEAN_Template
# Install API dependencies
cd api && npm i
# Install UI dependencies
cd ../ui && npm i
```

### Run Locally

#### API

```bash
cd api
npm run watch
# or: npm run docker:up (for Docker Compose)
# API: http://localhost:3000/api
```

#### UI

```bash
cd ui
npm run watch
# or: npm run start
# UI: http://localhost:4200/
```

#### Documentation

```bash
cd docs
mkdocs serve
# Docs: http://127.0.0.1:8000
```

---

## Azure Infrastructure

This project provides reusable Azure ARM templates for deploying cloud infrastructure. You can use these templates directly or adapt them for your own Azure environments and CI/CD pipelines.

- **Templates Location:** All ARM templates are in `infra/individual/` (for main resources) and `infra/nestedTemplates/` (for shared/nested resources).
- **CI/CD:** A GitHub Actions workflow (`.github/workflows/arm-deployment`) automates deployment to Azure.
- **Reusable:** You can use these templates and workflow in your own repo or Azure subscription.

### Prerequisites

- **Azure Subscription:** You need an Azure subscription with permissions to deploy resources.
- **Storage Account:** Used for storing nested templates and deployment artifacts.
- **Custom Role:** Assign a custom role (see below) to allow ARM deployments.
- **GitHub Secrets:** Store credentials and configuration as GitHub secrets.

#### Storage Account

The storage account is used to store nested templates and deployment artifacts. You can create it using the Azure Portal or CLI. Configure the storage account with the following settings:

- **Type:** `Standard_LRS`
- **Access Tier:** `Hot`
- **Networking:** Allow access from your deployment method. (GitHub-hosted runners require public access, or use a self-hosted runner for enhanced network security.)
- **Permissions:** Assign the **Storage Blob Data Contributor** role (on the Storage Account) to your deployment identity (Managed Identity or Service Principal).
- **Anonymous Blob Access:** Enable anonymous blob access to allow GitHub Actions to upload and access nested templates.
- **Security:** Disable storage account key access to enforce best practices.

#### Custom Role Example

This is an example of a custom role you can create in Azure to allow ARM template deployments:

```json
{
  "roleName": "ARM Template Deployment",
  "description": "Custom role to manage ARM template deployments.",
  "assignableScopes": ["/subscriptions/<your-subscription-id>"],
  "permissions": [
    {
      "actions": ["Microsoft.Authorization/*", "Microsoft.Resources/deployments/*"],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ]
}
```

#### Required GitHub Secrets

- `AZURE_MGMT_MI`: Managed Identity or Service Principal with deployment permissions

  ```json
  {
    "clientId": "00000000-0000-0000-0000-000000000000",
    "tenantId": "11111111-1111-1111-1111-111111111111",
    "subscriptionId": "22222222-2222-2222-2222-222222222222"
  }
  ```

- Required Roles on the Manged Identity (MI)
  - Storage Blob Data Contributor (on Storage Account)
  - ARM Template Deployment (on Subscription, custom role as shown above)
  - Contributor (on Subscription)

#### Federated Credentials

Set up federated credentials in Azure AD for GitHub Actions OIDC authentication. This allows secure, passwordless deployments from GitHub Actions to Azure. This is required to grant the MI permissions to the GitHub Workflow / Action.

### Using the ARM Templates

1.  **Clone the repository** (or copy the `infra/` folder to your own project).
2.  **Customize parameters** in the relevant `parameters.json` files under `infra/individual/<template>/`.
3.  **Deploy** manaully or using the GitHub Actions workflow.

#### Manual Deployment

Manual Azure CLI Bash Command:

```bash
az deployment group create \
--resource-group <your-resource-group> \
--template-file infra/individual/<template>/azuredeploy.json \
--parameters infra/individual/<template>/parameters.json
```

#### Using GitHub Actions

The github workflow `.github/workflows/arm-deployment` automates Azure deployments. This allows you to deploy ARM templates directly from your GitHub repository without needing to manually run Azure CLI commands.

- The workflow `.github/workflows/arm-deployment` automates Azure deployments.
- It supports manual and triggered runs, and can deploy any template in `infra/individual/`.
- **Inputs:**
  - `Azure Resource Group` (where to deploy)
  - `ARM deployment folder path` (e.g., `infra/individual/300-ID`)

#### How to Use

1. Go to GitHub Actions > `Azure ARM Deployment` workflow
2. Click "Run workflow"
3. Enter the resource group and template path
4. Monitor deployment status in Actions tab

### Security & Best Practices

- Use federated credentials for secure, passwordless CI/CD
- Store all secrets in GitHub Actions secrets, never in code
- Assign least-privilege roles to your deployment identity
- Review and customize templates before deploying to production

---
