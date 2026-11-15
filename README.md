# Make My Marriage

Make My Marriage is a responsive wedding planning and management platform for couples, families, planners, guests, venues, vendors, and administrators. This repository contains the initial scaffold; product behavior will be implemented in later milestones using the approved documents in [`docs/`](docs/).

## Technology and architecture

- **Monorepo:** pnpm Workspaces with a modular monolith backend.
- **Web:** React, TypeScript, Vite, React Router, TanStack Query, Zustand, Tailwind CSS, React Hook Form, and Zod.
- **API:** Node.js, Express, TypeScript, MongoDB/Mongoose, session cookies with connect-mongo, Zod, and OpenAPI.
- **Worker:** Independent BullMQ process backed by Redis.
- **Storage:** AWS S3 is reserved for a later private-media workflow; no credentials are needed to start the scaffold.

The API and worker are separately started processes. API features follow the documented domain modules and enforce workspace isolation as features are implemented. No authentication or wedding business workflows are implemented yet.

## Repository layout

```text
apps/web/                 React application
apps/api/                 Modular Express API and API tests
apps/worker/              BullMQ worker process
packages/shared-types/    Cross-app TypeScript types
packages/validators/      Shared Zod schemas
packages/config/          Shared TypeScript configuration
docs/                     Original approved project documents
.github/workflows/        CI checks
```

## Prerequisites

- Node.js 22 or newer
- pnpm 10.22 (or a compatible pnpm 10 release)
- MongoDB for API session storage and persistence
- Redis for running the worker

The web app does not require MongoDB, Redis, or AWS credentials. The API requires a valid MongoDB URI and session secret at startup. The worker requires Redis at startup.

## Install and configure

```bash
pnpm install
Copy-Item .env.example .env
```

Set `MONGODB_URI` and `SESSION_SECRET` in `.env` before starting the API. The session secret must contain at least 32 characters. Configure `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` for the worker. `VITE_API_URL` points the web app to the versioned API, and `WEB_PORT` controls the Vite development server. AWS values may remain empty until S3 functionality is introduced. `.env` is ignored by Git.

## Development

```bash
pnpm dev          # run web, API, and worker concurrently
pnpm dev:web      # frontend only
pnpm dev:api      # API only
pnpm dev:worker   # worker only
```

The frontend is available at `http://localhost:5173`, the API at `http://localhost:5000`, health at `/api/v1/health`, and API documentation at `/api/v1/docs`.

## Quality checks and builds

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format
```

`pnpm test` runs the API health endpoint test and frontend smoke test. CI runs lint, type checks, tests, and builds. No deployment workflow is configured.
