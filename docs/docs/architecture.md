---
hide:
  - navigation
---

# Architecture

## Introduction

The MEAN_Template project provides a modern, cloud-native starting point for building scalable web applications using the MEAN stack (MongoDB, Express.js, Angular, Node.js) on Azure. It is designed for rapid development, secure deployment, and easy extensibility, making it suitable for both prototypes and production systems. This documentation describes the system's architecture, design decisions, and operational best practices to help developers, architects, and DevOps engineers understand and extend the solution.

## System Overview

### High-Level Architecture

The MEAN_Template project is a modular, cloud-native web application template built on the MEAN stack (MongoDB, Express.js, Angular, Node.js) and designed for rapid deployment on Azure.

The solution is deployed across two Azure resource groups:

- **MEAN_Template**: Contains all application-specific resources, including App Services, Static Web Apps, Cosmos DB (MongoDB API), Managed Identities, Application Insights, dashboards, and alerting resources.
- **Management**: Hosts shared infrastructure such as App Service Plans, Log Analytics, Network Security Perimeter, and Storage, which may be used by multiple applications.

<div align="center">
   <img src="/images/architecture/high-level-system-design.webp" alt="High-Level Architecture Diagram" width="80%"/>
</div>

### Design Principles and Goals

- **Separation of Concerns**: Clear separation between backend, frontend, and infrastructure
- **Cloud-Native**: Leverage Azure PaaS services for scalability, security, and maintainability
- **Extensibility**: Designed for easy addition of new features and services
- **Security by Default**: Use of managed identities, network security, and best practices
- **Observability**: Built-in monitoring, alerting, and diagnostics
- **Cost Efficiency**: Use of shared plans and free tiers where possible

## Component Architecture

### Backend (API) Architecture

- **Controllers** (`src/controllers/`): Handle HTTP requests, invoke services, and return API responses. Includes authentication, note management, and base endpoints.
- **Services** (`src/services/`): Encapsulate business logic and data access, providing reusable operations for controllers.
- **Models** (`src/models/`): Define TypeScript interfaces and classes for data structures, API responses, errors, and database entities.
- **Routes** (`src/routes/`): Map HTTP endpoints to controller actions, organize API structure, and apply middleware.
- **Middleware** (`src/middleware/`): Implement cross-cutting concerns such as authentication, CORS, logging, rate limiting, and session management.
- **Config** (`src/config/`): Centralize configuration for database, authentication, seeding, and Swagger documentation.
- **Utils** (`src/utils/`): Utility functions and helpers (e.g., caching global settings).
- **Entry Points** (`app.ts`, `server.ts`): Initialize the Express app, configure middleware, and start the server.

**File Structure**

```text
src/
│   app.ts
│   server.ts
│
├── controllers/
│     auth.controller.ts
│     note.controller.ts
│     base.controller.ts
│
├── services/
│     auth.service.ts
│     note.service.ts
│
├── models/
│     user.model.ts
│     note.model.ts
│     global-settings.model.ts
│     api-response.model.ts
│
├── routes/
│     auth.routes.ts
│     note.routes.ts
│     base.routes.ts
│
├── middleware/
│     auth.middleware.ts
│     cors.middleware.ts
│     logging.middleware.ts
│     rate-limit.middleware.ts
│     session.middleware.ts
│
├── config/
│     db.config.ts
│     auth.config.ts
│     seed.config.ts
│     swagger.config.ts
│
└── utils/
      cache.util.ts
      helpers.util.ts
```

### Frontend (UI) Architecture

- **Angular App** (`ui/src/app/`): Main application code, organized into feature modules, components, and services. Includes both landing and main app modules for separation of public and authenticated areas.]

  - **Controllers**: Handle requests, validation, and responses.
  - **Services**: Business logic and data access.
  - **Models**: Data structures for API and DB.
  - **Routes**: API structure and middleware.
  - **Middleware**: Auth, logging, CORS, rate limiting.
  - **Config**: Environment and integration settings.
  - **Utils**: Common helpers and caching.
  - **Angular App**: UI rendering, state, and API calls.

- **Environments** (`ui/src/envs/`): Environment-specific configuration for API endpoints and settings.
- **Static Assets** (`ui/public/`): Images, icons, and static files used by the frontend.

**File Structure**

```text
ui/
│
├── src/
│   ├── app/
│   │   ├── app.module.ts
│   │   ├── app.component.ts
│   │   ├── app-routing.module.ts
│   │   ├── core/
│   │   │   ├── core.module.ts
│   │   │   ├── services/
│   │   │   └── guards/
│   │   ├── features/
│   │   │   ├── notes/
│   │   │   │   ├── notes.module.ts
│   │   │   │   ├── notes.component.ts
│   │   │   │   └── ...
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── login.component.ts
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── shared/
│   │   │   ├── shared.module.ts
│   │   │   └── components/
│   │   └── landing/
│   │       ├── landing.module.ts
│   │       └── landing.component.ts
│   ├── assets/
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
│
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── ...
│
└── angular.json
```

### Database Architecture

#### Models and Schemas

The backend defines TypeScript models for all major entities in `src/models/`, including:

- **User**: Application users, authentication details, and user settings.
- **Note**: User-created notes, content, metadata, and ownership.
- **Global Settings**: Application-wide configuration and feature flags.
- **API Response & Errors**: Standardized API responses and error handling.

#### Database Collections and Layout

The solution uses the following collections in each environment (e.g., `mean-dev`, `mean-stage`, `mean-prod`):

Each environment (dev, stage, prod) maintains its own set of these collections to ensure separation of data and configuration.

- `global_settings`: Single-document or small set of documents for global config, feature toggles, and system-wide flags.
- `notes`: Each document represents a note, typically with fields for user ID, content, timestamps, and tags.
- `sessions`: Session documents track active user sessions, tokens, and expiry.
- `user_settings`: Per-user documents for UI preferences, notification settings, and other customizable options.
- `users`: User records with authentication credentials, roles, and profile information.

## Component Interactions

<div align="center">
   <img src="/images/architecture/component-interactions.png" alt="High-Level Component Interaction Diagram" width="80%"/>
</div>

The frontend Angular application communicates with the backend API by sending HTTP requests for authentication, data management, and user features. It processes RESTful API responses and manages the user interface state accordingly. Static assets are served from the frontend's public directory, with the option to extend asset storage to Azure Storage if required.

On the backend, Express controllers handle incoming requests, validate input, and call service functions. These services contain the business logic and interact with data models. Middleware is applied either globally or to specific routes to provide security, logging, CORS, and rate limiting. The backend returns standardized API responses to the frontend. User authentication and session data are managed either in the database or with tokens, depending on the configuration.

Backend services perform CRUD operations on Cosmos DB (using the MongoDB API) and enforce application-level schemas. Data is validated and transformed before being written to the database. Frequently accessed data, such as global settings, may be cached in memory to improve performance.

## Security Architecture

### Authentication and Authorization

- **Backend**: Uses Passport.js for authentication strategies (local, OAuth, etc.).
- **Managed Identity**: Azure Managed Identity is used for secure, passwordless access to Azure resources.
- **Session Management**: Sessions are managed via middleware, with support for secure cookies and token-based auth.
- **Role-Based Access**: API endpoints are protected by middleware enforcing user roles and permissions.

### Data Protection

- **Database Security**: Cosmos DB is secured with network rules and access keys; sensitive data is never exposed in code.
- **Transport Security**: All communication between frontend, backend, and Azure resources is encrypted via HTTPS.
- **Secrets Management**: Sensitive configuration is managed via environment variables and Azure Key Vault (recommended for production).

### Security Best Practices

- **Least Privilege**: Managed Identities and service principals are granted only necessary permissions.
- **Input Validation**: All user input is validated and sanitized at the API layer.
- **Rate Limiting**: Middleware enforces rate limits to prevent abuse.
- **CORS**: Configured to restrict cross-origin requests to trusted domains.
- **Monitoring & Alerts**: Application Insights and Azure Monitor are used to detect and alert on suspicious activity.
- **Regular Updates**: Dependencies and base images are kept up to date to mitigate vulnerabilities.

## Error Handling and Logging

- Centralized Express middleware for error handling and standardized API responses.
- Angular interceptors for frontend error management.
- Application Insights and Log Analytics for monitoring, diagnostics, and alerting.

**Azure Logging & Monitoring Flow**

<div align="center">
   <img src="/images/architecture/logging-flow.webp" alt="High-Level Component Interaction Diagram" width="80%"/>
</div>

## Appendix

### Glossary

- **MEAN Stack**: MongoDB, Express.js, Angular, Node.js
- **PaaS**: Platform as a Service
- **SPA**: Single Page Application
- **CI/CD**: Continuous Integration / Continuous Deployment
- **IAM**: Identity and Access Management
