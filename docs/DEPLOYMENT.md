# Deployment notes

Live at [zellige-hotels.vercel.app](https://zellige-hotels.vercel.app), API at
[zellige-hotels.onrender.com](https://zellige-hotels.onrender.com): Render (backend,
Docker) + Neon (Postgres) + Vercel (frontend) + Brevo (SMTP). All on free tiers, no card
required. Checked July 2026 — Koyeb dropped its free tier when Mistral acquired it, and
Fly.io stopped offering one to new accounts, which is why this combination and not those.

Backend runs as a Docker web service on Render, pointed at a pooled Neon connection
string (Neon sleeps on idle and the pool needs to tolerate that, hence the small pool
size and generous timeouts in `application-prod.yml`). Frontend is a static Vite build on
Vercel with `VITE_API_URL` pointing at the Render service; CORS on the backend is locked
to the Vercel origin. Flyway runs the schema and reference-data migrations on first boot.
Mail goes through Brevo's SMTP relay — free tier caps at 300/day, which is plenty for a
demo.

Render's free tier sleeps after 15 minutes idle and takes 30–50s to wake up, which is a
bad first impression for anyone clicking the demo link cold. Worked around with an
external cron hitting `/api/health` every 10 minutes — well under the 750 free hours/month,
so it stays up around the clock.

Env vars the backend needs in prod: `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` (Neon pooled),
`APP_JWT_SECRET` (64 random bytes, base64), `APP_CORS_ORIGINS` (the Vercel URL),
`MAIL_HOST` / `MAIL_PORT` / `MAIL_USERNAME` / `MAIL_PASSWORD` / `APP_MAIL_FROM` (Brevo).

Smoke test after any redeploy: `/api/health` returns `UP`, login as
`client@hotel-erp.dev` from the Vercel URL, a test booking triggers a confirmation email
through Brevo, and the admin dashboard loads with real numbers.

Mail is still on placeholder SMTP credentials in prod — the app boots fine (mail failures
are logged, not fatal) but confirmation emails won't actually send until Brevo is wired
in with a real SMTP key.
