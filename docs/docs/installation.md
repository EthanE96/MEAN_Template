---
hide:
  - navigation
---

# Installation

## Prerequisites

- Node.js 20+
- NPM 9+
- MongoDB (local or Azure CosmosDB)
- Azure account (for cloud deployment)

## Clone & Install

```bash
git clone https://github.com/EthanE96/MEAN_Template.git
cd MEAN_Template
# Install API dependencies
cd api && npm i
# Install UI dependencies
cd ../ui && npm i
```

## Run Locally

### API

```bash
cd api
npm run watch
# or: npm run docker:up (for Docker Compose)
# API: http://localhost:3000/api
```

### UI

```bash
cd ui
npm run watch
# or: npm run start
# UI: http://localhost:4200/
```

### Documentation

```bash
cd docs
mkdocs serve
# Docs: http://127.0.0.1:8000
```

---

## Infrastructure



