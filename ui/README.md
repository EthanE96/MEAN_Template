# MEAN UI

Angular UI

## Commands 

- `npm run start` - Start the Angular dev server (ng serve)
- `npm run build` - Build the app for production (ng build)
- `npm run build:stage` - Build the app for staging environment
- `npm run build:prod` - Build the app for production environment
- `npm run watch` - Start the dev server with local configuration
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint on the project

---

# Mean UI CI/CD

## Azure Static Web Apps Deployment

This repository uses a GitHub Actions workflow to build and deploy the Angular UI to Azure Static Web Apps on every push to the `main` branch that affects the `ui/` directory. The workflow supports both staging and production deployments, with production gated on successful staging.

### Prerequisites

- Azure Static Web Apps resource created and configured.
- `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_RIVER_013F9EC0F` secret set in the repository for deployment authentication.
- UI source code located in the `ui/` directory.

### Flow of the Workflow

1. **Trigger:**

   - On push to `main` affecting `ui/**`.

2. **Staging Deployment:**

   - Checks out the repository code (including submodules if any).
   - Installs OIDC client dependencies for authentication.
   - Retrieves a GitHub OIDC ID token for secure Azure authentication.
   - Builds the Angular UI using `npm run build:stage`.
   - Deploys the built app from `dist/ui/browser` to the Azure Static Web App staging environment using the provided API token.

3. **Production Deployment:**

   - Runs only after successful staging deployment.
   - Checks out the repository code again.
   - Installs OIDC client dependencies for authentication.
   - Retrieves a GitHub OIDC ID token for secure Azure authentication.
   - Builds the Angular UI using `npm run build:prod`.
   - Deploys the built app from `dist/ui/browser` to the Azure Static Web App production environment using the provided API token.

4. **Environments:**
   - The workflow uses GitHub Environments for `Staging` and `Production` to provide stage gates, audit, and control over deployments.
