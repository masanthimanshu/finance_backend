# Finance Backend

A small Express + MongoDB backend for a personal finance assistant that accepts natural-language transaction inputs, categorizes them (via a Cloudflare AI worker), stores transactions, and exposes simple auth/OTP flows and token-based routes.

**Why this project is useful**

- **Simple auth & OTP:** Phone-based sign-up/login with short-lived OTP verification.
- **Token-based security:** Access and refresh token flows for protected endpoints.
- **AI-backed categorization:** Uses a Cloudflare LLM to convert freeform input into `Category -> SubCategory -> Amount`.
- **Minimal, extensible codebase:** Clear separation of routes, controllers, and models — easy to extend.

**Status & badges**

- **Version:** 1.0.0
- **License:** ISC

**Quick links**

- Code: [app.js](app.js#L1)
- Routes: [routes/export.js](routes/export.js#L1)
- Auth controller: [routes/auth/auth_controller.js](routes/auth/auth_controller.js#L1)
- Transaction controller: [routes/transaction/transaction_controller.js](routes/transaction/transaction_controller.js#L1)

**Requirements**

- Node.js (v18+ recommended)
- MongoDB (remote or local)
- An account and API token for Cloudflare AI if you want the AI categorization

**Environment variables**
Create a `.env` file in the project root with the following variables:

- `PORT` — port to run the server (e.g. `3000`)
- `DB_URL` — MongoDB connection URI (the app appends `?authSource=admin`)
- `AUTH_TOKEN_SECRET` — JWT secret for auth tokens
- `REFRESH_TOKEN_SECRET` — JWT secret for refresh tokens
- `VERIFICATION_SECRET` — JWT secret used for OTP verification tokens
- `ACCOUNT_ID` — numeric/string account id expected by the `account` middleware
- `AUTH_KEY_ID` and `AUTH_KEY_URL` — (optional) external SMS gateway credentials used in OTP flow
- `LLM_MODEL` — Cloudflare LLM model identifier used by `worker_ai.js`
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account id for the AI API
- `CLOUDFLARE_API_TOKEN` — API token for Cloudflare AI

Example `.env` (do not commit secrets):

```
PORT=3000
DB_URL=mongodb://localhost:27017/finance_db
AUTH_TOKEN_SECRET=replace_me
REFRESH_TOKEN_SECRET=replace_me
VERIFICATION_SECRET=replace_me
ACCOUNT_ID=local-account
LLM_MODEL=example-llm-id
CLOUDFLARE_ACCOUNT_ID=acct_123
CLOUDFLARE_API_TOKEN=cf_token_here
AUTH_KEY_ID=optional
AUTH_KEY_URL=https://sms.example/send?
```

**Install & run**

```
npm install
npm run dev
```

Or run in production:

```
npm start
```

There is a `Dockerfile` and `compose.yaml` for containerized runs.

**API overview & examples**

Public health check

```
GET /health
```

Auth & OTP (under `/account/auth`)

- POST `/account/auth/admin` — admin login

  Request JSON:

  ```json
  { "user": "admin@finance.com", "pass": "admin@1234" }
  ```

  Response: `{ authToken, refreshToken }` on success.

- POST `/account/auth/phone` — start phone OTP flow

  Request JSON:

  ```json
  { "code": "+91", "phone": 9988776610 }
  ```

  Response: `{ verId }` — verification id to use with `/verify-otp`.

- POST `/account/auth/verify-otp` — verify OTP

  Request JSON:

  ```json
  { "otp": 223344, "verId": "<verId>" }
  ```

  Response: returns `authToken` and `refreshToken` and a `type` indicating `Login` or `Signup`.

Token refresh

```
GET /jwt/refresh
Headers: authorization: <authToken>, refresh: <refreshToken>
```

Protected endpoints (require both headers `authorization` and `refresh`)

- POST `/secure/transaction/add-transaction` — add new transaction

  Body JSON:

  ```json
  { "input": "Bought groceries for 1200" }
  ```

  The backend calls the Cloudflare AI worker which must return a string formatted as `Category -> SubCategory -> Amount` (e.g. `Expense -> Groceries -> 1200`). The server parses and saves the values.

- GET `/secure/transaction/read-transaction` — returns stored transactions for the authenticated user

- GET `/secure/transaction/total-amount` — aggregate totals grouped by category

Notes on headers and middleware

- The `Middleware.jwt` requires both `authorization` and `refresh` headers for routes under `/secure`.
- The `Middleware.account` expects an `account` header matching `ACCOUNT_ID` for some routes.

**Data models**

- `user` (`database/user_model.js`): stores phone, country code, verification and activation flags.
- `otp` (`database/otp_model.js`): stores the one-time-password value for verification.
- `transaction` (`database/transaction_model.js`): stores `user`, `input`, `amount`, `category`, and `subCategory`.

See models in the `database/` folder for schema details.

**Extending & development notes**

- The AI prompt in `cloudflare/worker_ai.js` contains category rules. Change categories carefully to preserve the expected `Category -> SubCategory -> Amount` output format.
- Error handling: controllers return `502` for upstream errors; tokens throw `401` where appropriate.
- Validation: `zod` is used in route handlers for input validation.
