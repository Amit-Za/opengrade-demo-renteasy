# RentEasy — OpenGrade Reference Integration

RentEasy is a fake Israeli rental platform built to demonstrate how a third
party integrates the [OpenGrade Provider API](https://opengrade.cs.colman.ac.il/docs).

It is a tiny React + Vite app with two Cloudflare Pages Functions that proxy
calls to OpenGrade so the API key stays server-side.

## Local setup

1. **Clone & install**
   ```bash
   git clone https://github.com/Amit-Za/opengrade-demo-renteasy.git
   cd opengrade-demo-renteasy
   npm install
   ```

2. **Get an OpenGrade API key.** Sign in at
   `https://opengrade.cs.colman.ac.il/dashboard/settings/api`, generate a key,
   copy it.

3. **Buy credits** (one-time). On the same OpenGrade account, visit
   `/dashboard/credits` and buy a starter pack (10 credits / ₪35). The demo
   spends one credit per signup.

4. **Run locally**
   ```bash
   echo "OPENGRADE_API_KEY=<your-key>" > .dev.vars
   npx wrangler pages dev -- npm run dev
   ```
   Open http://localhost:8788. Wrangler proxies Vite and serves the Pages
   Functions at `/api/*`.

## Deploy

Push to `main`. Cloudflare Pages auto-deploys the project after Git
integration is configured. In the Pages dashboard, set the env var
`OPENGRADE_API_KEY` (Production scope) and re-deploy if you set it after the
first build.

## Files of interest

- `src/pages/signup.tsx` — collects name + email, calls `/api/start-check`.
- `src/pages/processing.tsx` — opens the OpenGrade applicant flow in a new
  tab and polls `/api/check-status` until the score lands.
- `functions/api/start-check.ts` — POST proxy to `/v1/checks`.
- `functions/api/check-status.ts` — GET proxy to `/v1/checks/:id` with a
  thin projection.

## Warning

The API key has full client privileges. Never commit it. The `.dev.vars`
file is ignored by `.gitignore`.
