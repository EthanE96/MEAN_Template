# Azure Infrastructure Deployment

## Overview

This folder contains ARM templates designed for deploying infrastructure to Azure. The workflow allows for the selection of different Azure environments and deployment templates. It them proceeds to deploy the selected template using the parameter file that corresponds to the selected environment. The corresponding workflow is located in `.github/workflows/arm-deployment`.

## Prerequisites

**Resources**

- An Azure subscription with appropriate permissions to deploy resources.
- A Storage Account created in Azure to store transient deployments.
- ARM Template Deployment Custom Role (Below)

```json
{
  "id": "/subscriptions/your-subscription-id/providers/Microsoft.Authorization/roleDefinitions/role-id",
  "properties": {
    "roleName": "ARM Template Deployment",
    "description": "Custom role to manage ARM template deployments.",
    "assignableScopes": ["/subscriptions/your-subscription-id"],
    "permissions": [
      {
        "actions": ["Microsoft.Authorization/*", "Microsoft.Resources/deployments/*"],
        "notActions": [],
        "dataActions": [],
        "notDataActions": []
      }
    ]
  }
}
```

**Secrets**

- AZURE_MGMT_MI: Service Principle object for the MI with necessary deployment permissions.
  - Storage Blob Data Contributor (Assigned to the Storage Account)
  - Contributor (Assigned to the Subscription)
  - ARM Template Deployment (Assigned to the Subscription)

## Repository Layout

```mermaid
---deployment/cicd/infrastructure
    │   README.md                                         # This file
    |
    ├───individual
    │   ├───<###-Template Name 1>                         # Template Folder
    │   │       azuredeploy.json                          # Resource Group scope template
    │   │       parameters.json                           # Parameters
    │   │
    │   └───<###-Template Name 2>                         # Template Folder
    │           azuredeploy.json                          # Resource Group scope template
    │   │       parameters.json                           # Parameters
    │
    └───nestedTemplates                                   # Nested Templates
        ├───<Template Name 1>                             # Template Folder
        │       <template>-nested.json                    # Nested template
        │
        └───<Template Name 2>                             # Template Folder
                template>-nested.json                    # Nested template
```

## Template Definitions

**Individual Templates**: Templates that create coupled resources or a single resources.

- Coupled resources are infrastructure that will always be deployed together, for example, a Virtual Machine with a Network Interface Card and Disks.

**Linked Templates**: Templates that are inherited in various Individual Templates

- Templates that will be created many times, for example, a Storage Account or Private Endpoint with Network Interface Card.

## Deployment Storage

A Storage Account is storing deployment data and nested templates. The `Upload Nested ARM template` job will deploy the nested template to the `MGMT_STORAGE_ACCOUNT` variable and the given `MGMT_STORAGE_CONTAINER` variable container.

## Template Sequencing

Each Individual Template has an number attached to the name. This decision aims to help facilitate the grouping of resources while managing deployment order.

- Each 100 multiplier delineates a different resource
  - For example, all individual template with 100 are UI Static Web Apps.
- Each 10 multiplier delineates a configuration resource
  - For example, all individual template with xx10 are configuration templates for the higher level xxxx resource. 300 is Managed Identity while 310 Configures the Custom Role for the MI.

Note this is not a perfect relation, but it helps maintain organization.

## Runtime Usage Instructions

1.  Run the `Azure ARM Deployment` workflow manually in Github Workflows.
2.  Insert `Azure Resource Group` to deploy the resource to.
3.  Insert the `ARM deployment folder path` to deploy a specified resource. This parameter is expecting the relative path of the Template. For example, `infra/individual/300-ID`.

## Flow of the Workflow

The workflow is designed to automate the deployment of Azure infrastructure using ARM templates. The flow of the pipeline includes:

1. **Checkout Code**: The pipeline checks out the code from the repository.
2. **Login to Azure**: Logins into Azure CLI using Federated Credentials on a Managed Identity.
3. **Upload Nested ARM Template**: Uploads the templates in `nestTemplates` to the Storage Account.
4. **Deploy to Azure**: Action to publish the Deployment Template to Azure.
