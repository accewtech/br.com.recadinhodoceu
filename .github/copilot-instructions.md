# Project Instructions

## Project Context

- This repository is the `Message from Heaven` web application built with Next.js App Router, React, and TypeScript.
- Keep the current application architecture intact. In particular, `app/api/**/route.ts` files are Next.js Route Handlers; do not replace them with Fastify as part of routine feature work.
- The Fastify, MongoDB/Mongoose, Zod, `fastify-zod-openapi`, and ReDoc standards apply to dedicated backend services when they are introduced. They do not describe dependencies currently present in this repository.
- Review `package.json` and nearby implementation before choosing a library, command, or architectural pattern.

## Engineering Standards

- Write all source code, identifiers, filenames, and code comments in English. User-facing copy may be Portuguese when it serves the product audience.
- Use descriptive names. Variables and functions use `camelCase`; types and components use `PascalCase`; constants use `UPPER_SNAKE_CASE` when they represent fixed configuration. Boolean names start with `is`, `has`, or `should`; arrays use plural names and single objects use singular names.
- Name functions with an action verb and make units explicit in variable names or structured values.
- Keep TypeScript strict and prefer explicit domain types over `any` or unchecked casts.
- Validate untrusted input at system boundaries. Keep validation, error responses, and status codes consistent with the existing route patterns.
- Keep server-only code and secrets out of client components. Read secrets from environment variables and never expose them through `NEXT_PUBLIC_` variables unless they are explicitly safe for browsers.
- Explain why with comments only when the reason is not clear from the code. Do not commit commented-out code; use a `TODO` only when it states the reason and a concrete resolution condition.
- Make the smallest focused change that solves the request. Avoid unrelated refactors and new dependencies without a demonstrated need.
- For visual changes, preserve the established product design and verify responsive behavior, keyboard access, and semantic HTML.

## Verification

- Use the scripts already declared in `package.json`; do not assume scripts or tools that are not installed.
- Run the narrowest relevant check first, then run `npm run lint` or `npm run build` when appropriate and practical.
- Add or update tests for behavior changes when a suitable test setup exists. Do not claim checks passed unless they were run.
- Update `README.md` when a change affects setup, supported behavior, or API usage.
