# LeadForge — Landing Page

Standalone marketing page for LeadForge. Deployed separately from the app
itself; every CTA links out to the app's own `/register` and `/login`.

## Stack

React 18 + Vite + Tailwind CSS + `lucide-react`. No routing, no state
management, no backend — this is a static site once built.

## Develop

```bash
npm install
cp .env.example .env   # set VITE_APP_URL to the deployed app's origin
npm run dev
```

## Build

```bash
npm run build
```

Outputs static files to `dist/`.

## Deploy (Vercel)

Import this repo at [vercel.com/new](https://vercel.com/new). It's a plain
Vite app at the repo root, so the defaults (build command `npm run build`,
output directory `dist`) work with no configuration. Set `VITE_APP_URL` in
the project's Environment Variables before the first deploy.
