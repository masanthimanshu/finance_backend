# copilot-instructions.md — Quick agent guidance

Purpose

- Short, actionable instructions for Copilot / AI coding agents working on this repository.

What the agent should do first

- Install dependencies: run `npm install`.
- Start the app locally: `npm run dev` (requires a running MongoDB and proper `.env`).
- Read `app.js`, `routes/`, and `database/` before proposing changes.

Key conventions

- ES modules are used (`type: "module"` in `package.json`); prefer `import`/`export`.
- Keep changes small and well-tested. For behavior changes, include a short manual test or a minimal script demonstrating the change.
- Link to source files instead of embedding large extracts. Use existing docs where possible and update `AGENTS.md` for repo-wide guidance.

Environment notes

- MongoDB: local developer must provide a running MongoDB instance. If adding integration work, document required env vars in `.env` and reference them here.
- No automated test suite detected — if you add tests, include `npm test` script in `package.json`.

PR guidance

- Explain the intent and list manual verification steps in the PR description.
- Small refactors: include a smoke-test command or short script under `scripts/`.

Where to look

- Entry: `app.js`
- Routes: `routes/`, `auth/`, `transaction/`, `jwt/`
- Models: `database/user_model.js`, `database/transaction_model.js`, `database/otp_model.js`
- Utilities: `utils/`
- Container files: `Dockerfile`, `compose.yaml`
- Existing agent guidance: [AGENTS.md](AGENTS.md)

When to ask for help

- If a change requires running external services (payment gateways, 3rd-party APIs), ask the user before creating credentials or stubbing.
- Ask for approval before large refactors that touch multiple services or deployment configs.

Contact

- Leave a concise summary in the PR and request a human review for any behavior-changing change.
