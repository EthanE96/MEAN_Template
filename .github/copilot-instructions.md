# Copilot Instructions for MEAN_Template

## Overview

This repository is a MEAN stack SaaS template with a strong focus on API, infrastructure, and monitoring. The UI and API are developed and deployed independently. The project is optimized for Azure deployments and uses ARM templates for infrastructure as code.

## Architecture

- **API** (`/api`): Node.js, TypeScript, Express, MongoDB (via Mongoose). Modular structure: `controllers/`, `models/`, `routes/`, `services/`, `middleware/`, `utils/`.
- **UI** (`/ui`): Angular 19, Tailwind, DaisyUI. Organized by feature: `pages/`, `services/`, `shared/`, `utils/`.
- **Infra** (`/infra`): ARM templates for Azure resources.
- **Docker**: API containerization and compose files in `/docker`.

## Developer Workflows

- **API**
  - Install: `npm i` in `/api`
  - Dev: `npm run watch` (nodemon, TypeScript)
  - Build: `npm run build`
  - Lint: `npm run lint`
  - Docker: `npm run docker:build` and `npm run docker:up`
- **UI**
  - Install: `npm i` in `/ui`
  - Dev: `npm run watch` or `ng serve`
  - Build: `npm run build` or `ng build`
  - Lint: `npm run lint`
  - Test: `ng test` (Karma)

## Conventions & Patterns

- **API**
  - Use ES module syntax.
  - Each file starts with a one-line comment of its path/filename.
  - Comments describe purpose, not effect. Only add where not obvious.
  - Modular, DRY, and secure code. Refactor and extract functions as needed.
  - Use latest Node/ES features. If incomplete, add `TODO:` comments.
- **UI**
  - Angular 18+ with strict linting and formatting rules.
  - Prefer `forNext` from `libs/smart-ngrx/src/common/for-next.function.ts` for iteration.
  - No function >4 params or >50 lines. No line >80 chars. No >2 levels nesting.
  - Keep JSDoc comments intact when refactoring.
  - All code must be clear, readable, and performant.

## CI/CD

- **API**: Docker image built and published to GHCR on push/tag. (See `.github/workflows/api-build-container.yml`)
- **UI**: Deployed to Azure Static Web Apps on push/PR to `main`. (See `.github/workflows/ui-swa-deploy.yml`)

## Integration Points

- **API**: Uses Passport for auth (GitHub, Google, Local). MongoDB for persistence. Swagger for API docs.
- **UI**: Auth and API calls via Angular services. Theming via Tailwind/DaisyUI.
- **Secrets**: Managed via GitHub Actions secrets and `.env` files.

## References

- See `/README.md` and `/ui/README.md` for more details on running and building each part.
- For Angular/TypeScript specifics, see `.github/instructions/Angular_Typescript.instructions.md`.
- For Node/ESModule specifics, see `.github/instructions/Node_ESModule.instructions.md`.

## Agent Mode

When using agent mode verify newer code using context7.

---

**When in doubt, prefer clarity, modularity, and alignment with the above conventions.**
