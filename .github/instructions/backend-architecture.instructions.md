---
applyTo: "apps/**/*-api/**/*.ts,apps/**/*-backend/**/*.ts,services/**/*.ts,libs/**/*-api/**/*.ts,libs/**/*-backend/**/*.ts"
---

# Dedicated Backend Services

These requirements apply to dedicated backend services and libraries. They do not apply to the existing Next.js Route Handlers under `app/api/` unless the application is intentionally migrated.

- Use Node.js and TypeScript. Organize multi-project repositories as an Nx monorepo and follow the installed Nx version and existing workspace conventions.
- Use Fastify for HTTP services. Keep handlers thin and move business logic into focused services with explicit dependencies.
- Use MongoDB through Mongoose only. Do not access the MongoDB driver directly from application features.
- Declare request, response, and domain validation schemas with Zod as the single source of truth. Infer TypeScript types from schemas where practical instead of maintaining duplicate definitions.
- Generate OpenAPI documentation from Zod schemas with `fastify-zod-openapi` and render the published API documentation with ReDoc.
- Keep authentication, authorization, validation, and error handling explicit at service boundaries. Never trust client-provided identifiers or permissions.
- Keep secrets in environment variables, validate required configuration at startup, and never commit secret values.
- Name libraries and files in `kebab-case`; use descriptive `camelCase` variables/functions and `PascalCase` types/classes. Keep all code and comments in English.
- Add focused tests for schemas, business rules, and HTTP behavior. Verify the relevant Nx targets before considering a backend change complete.
- Add or change these backend dependencies only when the backend service is actually being established; do not add them to this Next.js app solely to satisfy this guidance.
