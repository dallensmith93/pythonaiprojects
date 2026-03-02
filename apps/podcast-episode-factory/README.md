# Podcast Episode Factory

ID: 11
Slug: podcast-episode-factory

Generate outlines, segments, hooks, and clip ideas with consistency checks.

## Stack Defaults
- Backend: FastAPI
- UI: Next.js (React)
- Agents runtime: Python (async), tool-router pattern
- Storage: SQLite + SQLAlchemy (local dev)
- Auth: optional (disabled by default)
- Logging: structlog + json logs
- Tracing UI: agent events panel

## Core Modules
- templates
- topic_bank
- outline_builder
- consistency_checks
- exports

## App Structure
- src/app
- src/domain
- src/features
- src/test
- backend/app
- agents/runtime

## Scripts
- pnpm --filter @apps/podcast-episode-factory dev
- pnpm --filter @apps/podcast-episode-factory build
- pnpm --filter @apps/podcast-episode-factory lint
- pnpm --filter @apps/podcast-episode-factory typecheck
- pnpm --filter @apps/podcast-episode-factory test
- pnpm --filter @apps/podcast-episode-factory test:coverage
- pnpm --filter @apps/podcast-episode-factory e2e
