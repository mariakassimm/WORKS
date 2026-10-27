# WORKS

A premium automotive-parts catalogue and showcase website. Customers browse
used engine and body parts and contact the business directly, there is no
cart, checkout, payment gateway, or customer account system, by design.

# WORKS

Used automotive parts catalogue with an admin inventory panel.

🔗 **Live demo:** [works-ten-navy.vercel.app](https://works-ten-navy.vercel.app)

**Tech stack:** React, Vite, Tailwind CSS, Framer Motion, Node.js, Express, MongoDB Atlas, Cloudinary, Vercel

## Documentation

This README covers running the project locally. For everything else, see:

- **[`CLIENT_ADMIN_GUIDE.md`](./CLIENT_ADMIN_GUIDE.md)** — for the business
  owner, plain-English guide to running the admin panel.

## Features

- Public catalogue with category browsing and per-part detail pages
- On-site inquiry form (emails the business directly — no `mailto:`)
- WhatsApp as a secondary contact option
- Admin panel: product/category/review CRUD, drag-and-drop image upload,
  dashboard stats, visibility toggling
- English-only, fully responsive, dark/burgundy design system with a
  cinematic animated hero

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Images | Cloudinary |
| Email | Resend |
| Auth | JWT in an httpOnly cookie |

```

## Local Setup

### Backend
```bash
cd server
cp .env.example .env      # fill in MongoDB, Cloudinary, Resend, JWT secret
npm install
npm run seed                # DEV ONLY — creates 33 demo parts + a demo admin
npm run dev                  # http://localhost:5000
```

### Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev                  # http://localhost:5173
```

Visit `/admin/login` with the demo admin credentials from `npm run seed`.

## Environment Variables

Quick reference — `server/.env`: `MONGO_URI`, `JWT_SECRET`,
`CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`,
`BUSINESS_EMAIL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`.
`client/.env`: `VITE_API_URL`, `VITE_SITE_URL` and the public business-contact
display values (not secrets) — see `client/.env.example` for the full list.

## Branding & Contact Details

The brand is **WORKS**. Brand name, contact details and social links live in
one file, `client/src/config/site.js`, and are overridden with `VITE_*`
variables at build time. **The built-in contact details are fictional
demonstration values** (`hello@example.com`, `+1 (202) 555-0147`,
`100 Example Avenue, Sample City, ZZ 00000`); set real ones before launch.
WhatsApp buttons and "Get Directions" stay hidden until a real WhatsApp number /
address is configured, and social icons stay disabled until a URL is set.
The logo is `client/src/components/Logo.jsx` (+ `public/favicon.svg`); the
wheel artwork is `components/WheelGraphic.jsx`.

## Admin Panel

Full instructions in `CLIENT_ADMIN_GUIDE.md`. In short: `/admin/login`,
then manage parts, categories, and reviews. Inquiries aren't stored in the
admin panel — they're emailed directly to `BUSINESS_EMAIL`.

**Creating the production admin:** use `npm run create-admin`, **not**
`npm run seed` — the seed script wipes product data every time it runs.
`create-admin` only ever touches the Admin account and is safe to re-run.

## Database

MongoDB via Mongoose. `npm run seed` is strictly development-only, it
deletes all existing products/categories before repopulating demo data.
Never run it against a database with real content.

## Cloudinary

Used for all product images. Uploads stream directly from the browser
through the backend to Cloudinary (in memory, never written to disk) —
only the resulting URL is stored in MongoDB. Required env vars:
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

## Resend (Email)

Powers the on-site inquiry form. Requires a verified sending domain — see
`DEPLOYMENT_HANDOFF.md` §11 for setup steps and what has/hasn't been
tested (no real send has been verified; the integration itself has been
tested end-to-end against Resend's actual API surface).

## Build Commands

```bash
cd client && npm run build   # production frontend build
cd client && npm run lint    # 0 errors expected
cd server && npm start       # production backend start
```

## Production Notes

- The server will not accept traffic until it successfully connects to
  MongoDB (no broken-state requests are served).
- Every admin-mutating API endpoint requires authentication — verified via
  live testing against all 17 protected routes.
- CORS only allows origins listed in `CLIENT_URL`.
- Unrecognized server errors return a generic message in production;
  real errors are always logged server-side, never sent to the client.

## Security Notes

- Passwords hashed with bcrypt, never returned by any API.
- Auth token lives in an httpOnly cookie, not localStorage.
- Rate limiting on login (10/15min) and the public inquiry endpoint (5/15min).
- `helmet` and `express-mongo-sanitize` applied globally.
- No secrets in this repository — `.env` is git-ignored, `.env.example`
  files contain placeholders only.

## Known Limitation

Cloudinary images uploaded during an unsaved product form aren't
auto-deleted if the admin cancels instead of saving — not a security issue, just a storage
housekeeping note.

## Dependency Note

Requires **Node 20.19+** (client: Vite 7 / React Router 7; server runs on 18+).
`npm audit --omit=dev` reports **0 vulnerabilities** for both the client and
the server. `npm audit` on the client still lists dev-only advisories in
Tailwind CSS 3's own transitive build dependencies (`braces`, `micromatch`,
`postcss-selector-parser`…). They are not shipped to browsers; the fix is a
migration to Tailwind 4, a separate piece of work.

## Tests

- `cd server && npm test` — 20 API tests (validation, header injection, CORS,
  rate limits, CSRF, error handling). No database or email account needed.
- `cd client && npm run lint && npm run build`.
