# Copilot Instructions for MEAN_Template

## Project Overview

- **MEAN_Template** is a modular, production-focused SaaS starter using the MEAN stack (MongoDB, Express, Angular, Node.js) with Azure-first infrastructure.
- The repo is split into:
  - `api/`: Node.js/Express REST API (TypeScript)
  - `ui/`: Angular frontend (Angular 18+; Tailwind, DaisyUI; feature-based structure)
  - `infra/`: Azure ARM/Bicep templates for cloud infrastructure
  - `docs/`: MkDocs-based documentation site
  - `docker/`: API containerization and compose files

## Architecture & Key Workflows

- **API**: Modular Node.js/Express (TypeScript, Mongoose). Controllers, services, models, middleware, and utils are separated. Auth via Passport (GitHub, Google, Local). Centralized error handling in `api/src/models/errors.model.ts`. API routes in `api/src/routes/`. Built and deployed via Docker, published to GHCR on push to `main` affecting `api/`. Azure Web App pulls latest image.
- **UI**: Angular app (strict linting, feature-based, theming via Tailwind/DaisyUI). Built and deployed to Azure Static Web Apps on push to `main` affecting `ui/`.
- **Docs**: MkDocs site built and deployed to Azure Static Web Apps on push to `main` affecting `docs/`.
- **Infra**: ARM templates in `infra/` deployed via GitHub Actions workflow in `.github/workflows/arm-deployment`.

## Build & Test Commands

- **API** (from `api/`):
  - `npm install` — install dependencies
  - `npm run start` — start dev server
  - `npm run build` — build for production
  - `npm run test` — run tests
  - `npm run lint` — lint code
  - `npm run watch` — dev with nodemon/TypeScript
  - `npm run docker:build` / `npm run docker:up` — Docker workflows
- **UI** (from `ui/`):
  - `npm install` — install dependencies
  - `npm run start` — Angular dev server
  - `npm run build:stage` / `npm run build:prod` — build for staging/production
  - `npm run test` — run unit tests
  - `npm run lint` — lint code
  - `npm run watch` — dev server with local config
- **Docs** (from `docs/`):
  - `mkdocs serve` — live preview
  - `mkdocs build` — static site build

## Project Conventions & Patterns

- **API**:
  - Use ES module syntax and TypeScript throughout
  - Each file starts with a one-line comment of its path/filename (if present)
  - Comments describe purpose, not effect; add only where not obvious
  - Modular, DRY, and secure code; refactor and extract functions as needed
  - Use latest Node/ES features; add `TODO:` comments for incomplete code
  - Centralized error handling in `api/src/models/errors.model.ts`
  - Auth via Passport.js, configured in `api/src/config/passport.config.ts`
  - API routes defined in `api/src/routes/`
- **UI**:
  - Angular 18+ with strict linting/formatting
  - Prefer `forNext` from `libs/smart-ngrx/src/common/for-next.function.ts` for iteration (if present)
  - No function >4 params or >50 lines; no line >80 chars; no >2 levels nesting
  - Keep JSDoc comments intact when refactoring
  - All code must be clear, readable, and performant
  - Environment configs in `ui/src/envs/`, static assets in `ui/public/`
- **Infra**:
  - ARM templates organized by resource in `infra/individual/`
  - Nested templates in `infra/nestedTemplates/`
- **Docs**:
  - Edit markdown in `docs/docs/`, config in `docs/mkdocs.yml`

## Integration Points

- **API <-> UI**: REST endpoints, see `api/src/routes/` and Angular services
- **API <-> Infra**: Azure Web App pulls Docker image from GHCR
- **UI/Docs <-> Infra**: Deployed as Azure Static Web Apps
- **Secrets**: Managed via GitHub Actions secrets and `.env` files

## Examples

- Add a new API route: create controller/service/model, register in `api/src/routes/`
- Add a new Angular page: generate component, add to routing, update `ui/src/app/`
- Add new infra: create template in `infra/individual/`, update workflow if needed

## References

- See `README.md` files in each major directory for details and commands
- For CI/CD, see GitHub Actions workflows (not included in this summary)
- For Angular/TypeScript specifics, see `.github/instructions/Angular_Typescript.instructions.md` (if present)
- For Node/ESModule specifics, see `.github/instructions/Node_ESModule.instructions.md` (if present)

## AI / LLM Rule to Follow

1. When using agent mode, verify newer code using context7.
2. If necessary, provide options/solutions based on recommendations and best practices.

---

**When in doubt, prefer clarity, modularity, and alignment with the above conventions.**
