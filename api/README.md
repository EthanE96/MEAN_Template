# MEAN API

MEAN_Template API

---

# MEAN API CI/CD

## MEAN API Image to GHCR Workflow

### Overview

This repository uses a GitHub Actions workflow to build and publish the API Docker image to the GitHub Container Registry (GHCR) on every push to the `main` branch that affects the `api/` directory. The workflow supports both staging and production environments.

### Prerequisites

- A GitHub repository with the MEAN stack API in the `/api` directory.
- Dockerfile present in `/api`.
- GitHub Actions enabled for the repository.
- Sufficient permissions to publish to GHCR (GitHub Packages).
- Required secrets (e.g., `GITHUB_TOKEN`) are available by default in GitHub Actions.

### Runtime Usage Instructions

1. **Trigger:**

   - Push to `main` branch with changes in `api/**` will trigger the workflow.

2. **Image Access:**

   - Images are published to `ghcr.io/<owner>/<repo>/mean-api`.
   - Tags include `latest`, `staging`, `production`, and the commit SHA.

### Flow of the Workflow

1. **Trigger:**

   - On push to `main` affecting `api/**`.

2. **Staging Job:**

   - Checks out the repository.
   - Sets the image name to lowercase and appends `/mean-api`.
   - Logs in to GHCR using the GitHub Actions token.
   - Generates Docker image metadata and tags (`latest`, `staging`, SHA).
   - Builds and pushes the Docker image to GHCR.

3. **Production Job:**

   - Runs after staging completes.
   - Repeats the same steps as staging, but tags as `latest`, `production`, and SHA.

4. **Environments:**
   - Uses GitHub Environments for `Staging` and `Production` for better control and audit.

## Azure Web App Integration

The Azure Web App is configured to automatically pull the latest Docker image from the GitHub Container Registry (GHCR) at:

```
ghcr.io/EthanE96/mean_template/mean-api:production
```

or for staging:

```
ghcr.io/EthanE96/mean_template/mean-api:staging
```

### How It Works

- **Automatic Deployment:**

  - When a new image is published to GHCR with the `production` or `staging` tag, Azure Web App automatically pulls and deploys the latest container.
  - This ensures that the most recent code changes are reflected in the live environment without manual intervention.

- **Tag Usage:**

  - The `production` tag is used for stable releases intended for the live environment.
  - The `staging` tag is used for pre-production testing and validation.

- **Environment Stage Gates:**
  - The workflow uses GitHub Environments (`Staging` and `Production`) as stage gates, providing approval and audit controls before images are promoted and deployed.
  - Only after passing the respective environment gate is the image tagged and made available for Azure to pull.
