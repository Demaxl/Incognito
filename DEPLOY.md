# Free production deploy — Incognito (incgt.link)

Stack (all free tiers):

| Piece        | Service              | Public URL              |
|-------------|----------------------|-------------------------|
| Frontend    | Vercel               | https://incgt.link      |
| API         | Render               | https://api.incgt.link  |
| Database    | Neon                 | (private connection)    |
| Media files | Cloudflare R2        | public r2.dev (or CDN)  |

You already own **incgt.link** on Namecheap. Do the steps below in order.

---

## 1. Database — Neon (free)

1. Sign up at https://neon.tech
2. Create a project (region closest to you).
3. Copy the connection string (enable SSL). It looks like:
   `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
4. Keep it for Render env vars as `DATABASE_URL`.

---

## 2. Media storage — Cloudflare R2 (free)

User uploads (images / audio / video) must not live on Render’s disk — it is ephemeral.

1. Sign up at https://dash.cloudflare.com
2. **R2** → Create bucket, e.g. `incognito-media`
3. **Settings** on the bucket → **Public access** → Allow Access → note the `*.r2.dev` public URL (or attach a custom domain later)
4. **R2** → **Manage R2 API Tokens** → Create API token with Object Read & Write on that bucket
5. Note:
   - Access Key ID
   - Secret Access Key
   - Endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` (Account ID is on the R2 overview page)

---

## 3. Backend — Render (free)

1. Push this repo to GitHub (if it is not already).
2. Sign up at https://render.com with GitHub.
3. **New** → **Blueprint** → select the repo (uses `render.yaml`), **or** create a **Web Service** manually:
   - Root Directory: `backend`
   - Runtime: Python 3
   - Build Command: `chmod +x build.sh && ./build.sh`
   - Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
   - Instance type: **Free**
4. Set environment variables (Dashboard → Environment). Use `backend/.env.prod.dist` as the checklist:

| Key | Value |
|-----|--------|
| `DJANGO_SETTINGS_MODULE` | `config.settings_prod` |
| `DJANGO_SECRET_KEY` | long random string (Render can generate) |
| `ALLOWED_HOSTS` | `api.incgt.link,<your-service>.onrender.com` |
| `FRONTEND_URL` | `https://incgt.link` |
| `COOKIE_DOMAIN` | `.incgt.link` |
| `CORS_ALLOWED_ORIGINS` | `https://incgt.link,https://www.incgt.link` |
| `CSRF_TRUSTED_ORIGINS` | `https://incgt.link,https://www.incgt.link` |
| `DATABASE_URL` | Neon connection string |
| `USE_S3_MEDIA` | `True` |
| `R2_ACCESS_KEY_ID` | from Cloudflare |
| `R2_SECRET_ACCESS_KEY` | from Cloudflare |
| `R2_BUCKET_NAME` | `incognito-media` |
| `R2_ENDPOINT_URL` | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `R2_REGION_NAME` | `us-east-1` |
| `R2_CUSTOM_DOMAIN` | `media.incgto.xyz` (no `https://`) |

5. Deploy. Open `https://<your-service>.onrender.com/admin/` — you should get Django’s login (or a redirect). First request on the free tier can take ~30–60s (cold start).

6. **R2 CORS (required for share cards / canvas / downloads)**

   Share cards use `html2canvas`, which reads images from `media.incgto.xyz` in the browser. Without bucket CORS, Chrome blocks with:
   `No 'Access-Control-Allow-Origin' header is present`.

   **Option A — Cloudflare dashboard**

   1. R2 → your bucket → **Settings** → **CORS Policy**
   2. Paste the contents of `backend/r2-cors.json` (or add origins `https://www.incgto.xyz`, `https://incgto.xyz`, methods `GET`/`HEAD`)
   3. Save

   **Option B — script (uses your R2 S3 API keys)**

   ```bash
   cd backend
   export R2_ACCESS_KEY_ID=...
   export R2_SECRET_ACCESS_KEY=...
   export R2_BUCKET_NAME=incognito-media
   export R2_ENDPOINT_URL=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   export R2_REGION_NAME=us-east-1
   python configure_r2_cors.py
   ```

7. **Custom domain** on the Render service:
   - Add `api.incgto.xyz`
   - Render shows a CNAME target (usually `xxx.onrender.com`)

### DNS for the API

In your DNS host for **incgto.xyz**:

| Type  | Host | Value                         | TTL  |
|-------|------|-------------------------------|------|
| CNAME | api  | `<your-service>.onrender.com` | Auto |

Wait for DNS (often a few minutes, sometimes up to an hour). Then in Render, verify the domain / enable HTTPS.

Update `ALLOWED_HOSTS` to include `api.incgto.xyz` if you have not already.

Optional: create a Django superuser from your laptop against Neon (Render free has no shell):

```bash
# see earlier guidance — point DATABASE_URL at Neon and run createsuperuser
python manage.py createsuperuser
```

---

## 4. Frontend — Vercel (free)

1. Sign up at https://vercel.com with GitHub.
2. **Add New Project** → import this repo.
3. Configure:
   - **Root Directory**: `frontend`
   - Framework Preset: Nuxt.js (auto-detected)
4. Environment Variables (Production):

| Key | Value |
|-----|--------|
| `NUXT_PUBLIC_BACKEND_URL` | `https://api.incgt.link` |
| `NUXT_PUBLIC_SITE_DOMAIN` | `https://incgt.link` |
| `NUXT_SITE_URL` | `https://incgt.link` |

5. Deploy. You get a `*.vercel.app` URL first — fine for a smoke test, but **auth cookies only work once the custom domain is on `incgt.link`** (shared `COOKIE_DOMAIN=.incgt.link`).

### Namecheap DNS for the site

In Vercel → Project → **Settings** → **Domains** → add:

- `incgt.link`
- `www.incgt.link` (optional; redirect www → apex or the reverse)

Vercel will show the records. Typical Namecheap setup:

**Apex (`incgt.link`)** — use Vercel’s A record:

| Type | Host | Value       |
|------|------|-------------|
| A    | `@`  | `76.76.21.21` |

(Confirm the IP in the Vercel UI; it can change.)

**www** (optional):

| Type  | Host | Value                |
|-------|------|----------------------|
| CNAME | www  | `cname.vercel-dns.com` |

Remove any old AWS/CloudFront records that conflict.

After DNS verifies, HTTPS is automatic on Vercel.

---

## 5. Smoke test checklist

1. Open https://incgt.link — landing page loads.
2. Sign up / log in — session should stick (cookies on `.incgt.link`).
3. Open your `/@username` link, send a text message and an image.
4. Confirm the image URL is on your R2 public domain.
5. Dashboard shows the message.

If login works on `*.vercel.app` but not on `incgt.link` (or the reverse), check `COOKIE_DOMAIN`, `CORS_*`, and that both front and API use HTTPS.

---

## 6. Day-to-day deploys

- **Frontend**: push to `main` → Vercel rebuilds automatically.
- **Backend**: push changes under `backend/` → Render rebuilds if auto-deploy is on.
- Optional GitHub secret `RENDER_DEPLOY_HOOK_URL` triggers Render from `.github/workflows/deploy.yml`.

---

## Free-tier caveats (no cost, but limits)

- **Render free** web services **sleep after ~15 minutes** idle. The next request is slow (cold start). Fine for a personal/demo app; upgrade later if you need always-on.
- **Neon free** has storage/compute limits; enough to start.
- **R2 free**: 10 GB storage / month + a generous Class A/B ops allowance; egress to the internet is free on R2.
- **Vercel hobby**: fine for this Nuxt app; bandwidth limits apply.
- Heavy deps (`opencv-python`, video tooling) can make Render builds slow or memory-tight. If builds fail, switch `opencv-python` → `opencv-python-headless` in `requirements.txt` and redeploy.

---

## Local production-like env

Backend:

```bash
cp backend/.env.prod.dist backend/.env
# edit values, then:
export DJANGO_SETTINGS_MODULE=config.settings_prod
```

Frontend:

```bash
cp frontend/.env.production.example frontend/.env
npm run build && npm run preview
```

---

## What changed in the repo (AWS removed)

- `backend/config/settings_prod.py` — WhiteNoise static files + Cloudflare R2 media (no S3/CloudFront).
- `backend/.env.prod.dist` — new env checklist.
- `backend/build.sh`, `backend/Procfile`, `backend/runtime.txt`, `render.yaml` — Render deploy.
- `frontend/vercel.json`, `frontend/.env.production.example` — Vercel.
- `frontend/nuxt.config.ts` / `app.vue` — production URL / SEO fixes.
- `.github/workflows/deploy.yml` — optional Render hook (EC2/AWS flow removed).
