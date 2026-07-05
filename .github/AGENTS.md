# AGENTS.md — Agent instructions for this repository

Purpose

- Provide concise, actionable guidance for AI coding agents working on this repo.

How to run

- Install dependencies: `npm install`
- Start app (production): `npm start`
- Start app (development): `npm run dev` (uses `nodemon`)

Quick architecture overview

- Entrypoint: `app.js`
- Routes: `routes/`, `auth/`, `transaction/`, `jwt/` — see route modules for handlers and patterns.
- Database models: `database/` (user_model.js, transaction_model.js, otp_model.js)
- Utilities: `utils/` (middleware.js, tokens.js, otp_ver_id.js)
- Network abstraction: `network/requests.js`
- Cloudflare worker: `cloudflare/worker_ai.js`

Agent conventions (high level)

- Link, don’t duplicate: When documenting behavior, prefer linking to source files instead of copying large blocks.
- Small, focused changes: Make minimal, well-tested edits; update tests or add small test harnesses when changing behavior.
- Preserve style: Follow existing code style (ES modules, modern JS).
- Environment: Assume local dev runs with a running MongoDB instance and `.env` settings when necessary. If not present, document what env vars are required.

Useful files

- `app.js` — server bootstrap
- `package.json` — scripts and dependencies
- `Dockerfile`, `compose.yaml` — containerization (if editing deployment-related code)

When to create other customization files

- If you need to add specialized agent workflows (e.g., frontend vs backend), create a `/docs/agents/` folder and add targeted `AGENT.md` or skill files.

Contact / Feedback

- After making non-trivial changes, leave a short summary in the PR description explaining the intent and tests performed.
