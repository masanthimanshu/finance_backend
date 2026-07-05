# AGENTS.md — Agent instructions for this repository

Purpose

- Provide concise, actionable guidance for AI coding agents working on this repo.

How to run

- Install dependencies: `npm install`
- Start app (production): `npm start`
- Start app (development): `npm run dev` (uses `nodemon`)

Quick architecture overview

- **Entrypoint:** [app.js](../../app.js) — bootstraps Express, connects MongoDB, mounts routes
- **Routes:** [routes/](../../routes/) (auth, transaction, jwt) — see route modules for handler patterns
- **Database models:** [database/](../../database/) (user_model.js, transaction_model.js, otp_model.js) — Mongoose schemas
- **Utilities:** [utils/](../../utils/) (middleware.js for JWT/account validation, tokens.js for JWT ops)
- **Network abstraction:** [network/requests.js](../../network/requests.js) — shared HTTP client
- **Cloudflare AI:** [cloudflare/worker_ai.js](../../cloudflare/worker_ai.js) — LLM categorization for transactions

## Code conventions

### Class-based controllers

- Controllers are classes (e.g., `AuthController`, `TransactionController`)
- Private methods use `#` prefix (e.g., `#manageOTP`, `#token`, `#verID`)
- **Example:** [auth_controller.js](../../routes/auth/auth_controller.js), [transaction_controller.js](../../routes/transaction/transaction_controller.js)

### Error handling

- Use try-catch in controllers; respond with `res.status(code).send({ error: message })`
- Always include meaningful error messages; 502 for external service failures
- **Tip:** Async errors not caught will crash the server — wrap external API calls carefully

### Database patterns

- Mongoose models defined in `database/`; use `.save()` for create, `.findOneAndUpdate()` for upserts
- Use aggregation for analytics queries (`$match`, `$group`) — see [transaction_controller.js](../../routes/transaction/transaction_controller.js)
- Validation should be added at schema level (required fields, unique constraints)

### Validation

- Zod is installed but not yet integrated into controllers — add input validation via Zod schemas in route handlers as controllers grow
- Currently minimal validation; this is a development opportunity for agents

### Response format

- Success: `res.send({ message: "...", data: ... })`
- Error: `res.status(code).send({ error: "message" })`
- All responses are JSON

## Common pitfalls & troubleshooting

1. **Missing environment variables:** Many features depend on env vars (JWT secrets, Cloudflare credentials, DB URL). Always verify `.env` setup matches [README.md](../../README.md#environment-variables).
2. **Unhandled promise rejections:** Ensure async operations in middleware/controllers catch errors — uncaught rejections will crash the server.
3. **Mongoose connection:** MongoDB must be running and accessible at `DB_URL` for app to start. Check connection logs.
4. **Hardcoded secrets:** Never commit `.env` or API tokens. Use environment variables exclusively.
5. **Cloudflare API errors:** If transaction categorization fails, verify Cloudflare credentials and account balance.

## Testing

- **Current status:** No automated test suite exists.
- **Approach for agents:** When adding features, include small manual test scripts or document curl commands in PR description.
- **Test account:** Phone `9988776610` is hardcoded as test phone in [auth_controller.js](../../routes/auth/auth_controller.js) — returns OTP `223344` without SMS.

## Cloudflare AI integration

- Configured in [worker_ai.js](../../cloudflare/worker_ai.js)
- Takes freeform transaction text, returns `category -> subcategory -> amount` string
- Requires: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `LLM_MODEL`
- Failures return 502 error; check Cloudflare account credentials and balance

Agent conventions (high level)

- **Link, don't duplicate:** Reference source files instead of copying large blocks.
- **Small, focused changes:** Make minimal edits; add test harnesses when changing behavior.
- **Preserve style:** Follow ES modules + modern JS + class-based patterns.
- **Environment:** Assume local dev runs with MongoDB instance and proper `.env`.

Useful files

- [app.js](../../app.js) — server bootstrap and route mounting
- [package.json](../../package.json) — scripts and dependencies
- [Dockerfile](../../Dockerfile), [compose.yaml](../../compose.yaml) — containerization
- [README.md](../../README.md) — full API docs and environment variable reference

When to create other customization files

- If specialized workflows emerge (e.g., data migrations, external integrations), add targeted docs under `docs/agents/`

Contact / Feedback

- After making non-trivial changes, leave a short summary in PR explaining intent and tests performed.
- For complex refactors, request human review.
