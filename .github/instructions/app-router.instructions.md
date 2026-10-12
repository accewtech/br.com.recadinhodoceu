---
applyTo: "app/**/*.{ts,tsx}"
---

# Next.js App Router

- Follow the Next.js App Router conventions already used in this repository. Keep route handlers in `route.ts` and use the Web `Request`/`Response` APIs or `NextResponse` as appropriate.
- Keep modules server-side by default. Add the `use client` directive only when a component needs browser APIs, state, effects, or event handlers.
- Keep client components focused; move reusable domain logic and server-only work out of the client component tree.
- Treat request bodies, query parameters, form fields, uploaded files, and environment values as untrusted input. Validate before use and return deliberate HTTP status codes.
- Do not log credentials, full user-submitted content, or other sensitive values. Return generic error messages to clients while preserving useful server-side diagnostics.
- Preserve existing API contracts unless the task explicitly requests a breaking change. Update README API examples when a contract changes.
- Use semantic HTML, accessible labels, keyboard-operable controls, and responsive layouts for user-facing screens.
