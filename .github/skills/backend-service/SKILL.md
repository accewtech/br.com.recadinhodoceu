---
name: backend-service
description: Design or implement a dedicated backend service that follows this project's Node.js, TypeScript, Nx, Fastify, MongoDB/Mongoose, Zod, OpenAPI, and ReDoc standards.
---

# Backend Service Workflow

1. Confirm the task concerns a dedicated backend service. The existing `app/api/**` endpoints are Next.js Route Handlers and must remain so unless migration is explicitly requested.
2. Inspect the Nx workspace and installed versions before selecting generators, plugins, or commands. Consult current Nx documentation for Nx-specific configuration.
3. Define request and response contracts with Zod first, then infer TypeScript types and use the same schemas for validation and `fastify-zod-openapi` documentation.
4. Keep Fastify handlers thin. Put business rules in testable services and access MongoDB only through Mongoose models/repositories.
5. Apply authentication and authorization at the boundary, validate configuration at startup, and avoid leaking secrets or sensitive data in logs and errors.
6. Add focused tests for schemas, business logic, and HTTP behavior. Run the affected Nx test, lint, and build targets.
7. Ensure generated OpenAPI documentation is available through ReDoc and document service setup and API behavior.