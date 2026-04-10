# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

La tablée de Carole is a French recipe-sharing web app. pnpm monorepo with a NestJS backend (MongoDB/Mongoose) and a React frontend (Vite + TanStack Router).

## Commands

### Root (runs across all workspaces)
```bash
pnpm install          # install all dependencies
pnpm lint             # lint backend + frontend
pnpm test             # test backend + frontend
pnpm build            # build backend + frontend
```

### Backend (`backend/`)
```bash
pnpm start:dev        # dev server with watch (port 5000)
pnpm test             # run all Jest specs
pnpm test -- --testPathPattern=auth   # run a single spec file by pattern
pnpm test:cov         # coverage report
pnpm lint             # eslint with --fix
```

### Frontend (`frontend/`)
```bash
pnpm dev              # Vite dev server
pnpm test             # run all Vitest specs
pnpm test -- src/features/auth   # run tests in a specific directory
pnpm test:watch       # watch mode
pnpm lint             # eslint
pnpm build            # tsc + vite build
```

## Architecture

### Backend (NestJS)
- **Modules**: `auth`, `recipes`, `users`, `upload`, `favorites` — each with controller/service/entity/dto pattern
- **Database**: MongoDB via Mongoose. Schemas in `entities/` with decorators (`@Schema`, `@Prop`)
- **Auth**: JWT in httpOnly cookies (access 15min, refresh 7d). `@Public()` decorator exempts routes from auth. `@Roles()` + `RolesGuard` for RBAC (USER, ADMIN). `JwtStrategy` extracts token from cookies
- **Validation**: `class-validator` + `class-transformer` on DTOs. Zod for env validation (`config/env.validation.ts`)
- **Image processing**: Sharp for resizing/thumbnails in `upload/`
- **Security**: Helmet, CORS (FRONTEND_URL), ThrottlerGuard (100 req/60s global)

### Frontend (React 19 + TypeScript)
- **Routing**: TanStack Router with file-based convention in `src/routes/`. Route tree auto-generated (`routeTree.gen.ts` — do not edit)
- **Feature structure**: `src/features/{name}/` with `api.ts` (service layer), `hooks.ts`, `schema.ts` (Zod), `types.ts`, `components/`
- **Forms**: React Hook Form + Zod resolvers. Schemas shared in `schema.ts` per feature
- **API client**: `src/lib/api-client.ts` — custom `apiFetch()` with error classes (`ApiError`, `NetworkError`), 10s timeout
- **Styling**: Tailwind CSS 4 with custom warm color palette and display font (Playfair Display). Component utilities in `src/index.css` (`@layer components`)
- **Path aliases**: `@/*` = `src/*`, `@recipes/*` = `src/features/recipes/*`

### Environment Variables
- Backend: `MONGO_URI`, `PORT`, `JWT_SECRET` (min 32 chars), `FRONTEND_URL`
- Frontend: `VITE_API_URL` (defaults to `http://localhost:5000`)

## Code Style
- Prettier: no semicolons, double quotes, trailing comma none
- Backend test files: `*.spec.ts` (Jest). Frontend test files: `*.test.ts(x)` (Vitest + Testing Library)
- UI text is in French
