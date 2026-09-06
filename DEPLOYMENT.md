# SAFEMETE — cPanel Deployment Guide

Hosts the full stack behind the domain **https://rngroupinfo.com** on a cPanel (Apache + LiteSpeed) account using cPanel's **"Setup Node.js App" (Passenger)** feature.

## Architecture

```
rngroupinfo.com                       -> Node.js App (Passenger) #1
  /                                  -> public website (React SPA, client/dist)
  /api/...                           -> Express REST API
  /uploads/...                       -> uploaded product images

admin.rngroupinfo.com                -> Node.js App (Passenger) #2
   (same code deployed separately)   -> admin panel (React SPA, Safemete_Admin/dist)
  /api/...                           -> the SAME API (shared DB + data)
```

- **One codebase, one Express entry point (`dist/app.js`).** The app chooses which SPA to serve by inspecting the `Host` header (`ADMIN_HOSTS`), and it always serves the API + uploads.
- **Shared state between the two Passenger instances** via absolute paths in `.env`:
  - `UPLOADS_DIR` — product images
  - `DATA_DIR` — JSON product store
- **Users/auth** live in **MongoDB Atlas** (already configured in `server/.env`).

## 1. Build the deploy bundle

From your computer (or CI), in the repo root:

```bash
./build-deploy.sh
```

This builds the client, admin, and server, then assembles **`deploy/`**:

```
deploy/
  package.json          # server runtime manifest
  package-lock.json
  dist/                 # compiled Express API (run entry point)
  data/                 # JSON product store (products.json)
  uploads/products/     # uploaded images
  client/               # built public website (contains index.html)
  admin/                # built admin panel (contains index.html)
  .env.example          # production env template
```

Do **not** commit the `deploy/` folder (it is gitignored).

## 2. Create the admin subdomain

In cPanel → **Domains → Create a New Domain**:

- Domain: `admin.rngroupinfo.com`
- Document root: `admin.rngroupinfo.com` (default is fine — it just needs to exist)
- Ensure **SSL** (AutoSSL) covers the subdomain, or install a Let's Encrypt cert for it.

## 3. Upload the code

Upload the **contents of `deploy/`** to your host. Two copies are needed — one per Node app.

Recommended location (inside your home dir):

```
~/fire-safety/                 <- main domain app (upload deploy/* here)
~/fire-safety-admin/           <- admin subdomain app (upload deploy/* here again,
                                   or zip deploy/ and extract in each)
```

You can upload once to `~/fire-safety`, then copy that folder to `~/fire-safety-admin`
(they are identical; they differ only at runtime by env vars).

## 4. Install dependencies (in both folders)

Use cPanel → **Setup Node.js App** → **Run npm install** (recommended), or via SSH:

```bash
cd ~/fire-safety && npm install --omit=dev
cd ~/fire-safety-admin && npm install --omit=dev
```

Node.js v18+ is required (Node 20/22 LTS recommended). Both folders must have
`node_modules`.

## 5. Configure the two Node.js applications

### App #1 — main domain

cPanel → **Setup Node.js App** → **Create Application**:

| Setting          | Value                       |
|------------------|-----------------------------|
| Node.js version  | >= 18 (20/22 LTS preferred) |
| Application root | `fire-safety`               |
| Application URL  | `rngroupinfo.com`           |
| Application startup file | `dist/app.js`       |
| Environment variables | see below               |

### App #2 — admin subdomain

Create a **second application**:

| Setting          | Value                       |
|------------------|-----------------------------|
| Application root | `fire-safety-admin`         |
| Application URL  | `admin.rngroupinfo.com`     |
| Application startup file | `dist/app.js`       |
| Environment variables | see below               |

> The startup file is relative to the application root. Passenger passes a free
> `PORT` to the app automatically — the code already reads `process.env.PORT`.

### Environment variables (set in BOTH apps)

Create `~/fire-safety/.env` and `~/fire-safety-admin/.env` first (copy
`.env.example` from the bundle), **then** also add each key as an app
environment variable. The [Setup Node.js App] panel has an "Environment variables"
section where you paste each `KEY=VALUE` line.

```
PORT                                     # leave blank/auto — Passenger manages this
NODE_ENV=production
APP_URL=https://rngroupinfo.com
CORS_ORIGIN=https://rngroupinfo.com,https://www.rngroupinfo.com,https://admin.rngroupinfo.com
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.mongodb.net/rngroup?authSource=admin
JWT_SECRET=<long random hex string — openssl rand -hex 64>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
JWT_MFA_TEMP_EXPIRY=5m
BCRYPT_ROUNDS=12
OTP_EXPIRY_MINUTES=5
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-otp-sender@gmail.com
SMTP_PASS=your-16-char-gmail-app-password
OTP_FROM=your-otp-sender@gmail.com
SEED_ADMIN_EMAIL=admin@rngroupinfo.com
SEED_ADMIN_PASSWORD=<strong password>
# The absolute (shared) paths below MUST be identical in both apps:
UPLOADS_DIR=/home/USERNAME/fire-safety/uploads
DATA_DIR=/home/USERNAME/fire-safety/data
CLIENT_DIST_DIR=/home/USERNAME/fire-safety/client
ADMIN_DIST_DIR=/home/USERNAME/fire-safety/admin
ADMIN_HOSTS=admin.rngroupinfo.com
```

**`ADMIN_HOSTS` decides which SPA is served.** On app #2 set it to
`admin.rngroupinfo.com`; on app #1 you can leave it unset (any host beginning
with `admin.` is treated as the admin panel).

## 6. Start & verify

1. Click **Restart Application** on both apps (or just save them).
2. Visit:
   - `https://rngroupinfo.com/` → SAFEMETE public website
   - `https://rngroupinfo.com/api/health` → `{"success":true,...}`
   - `https://rngroupinfo.com/about` → anchors correctly (SPA fallback works)
   - `https://admin.rngroupinfo.com/` → redirects to `/login`
   - Log in with the seeded admin, add a product, upload an image → image URL
     should be `https://rngroupinfo.com/uploads/products/...`

## 7. Post-deploy checklist

- [ ] SSL active on both domains (AutoSSL / Let's Encrypt).
- [ ] Force HTTPS — enable on your host's "Force HTTPS Redirect" or in
      cPanel → Domains. The app generates absolute URLs from `APP_URL` (https).
- [ ] `CORS_ORIGIN` includes exactly the origins you use (`www` included above).
- [ ] Backups: `data/products.json` and `uploads/` are your critical files —
      enable cPanel backups for `~/fire-safety/data` and `~/fire-safety/uploads`.
- [ ] Set `NODE_ENV=production`.
- [ ] Change the admin password after first login and enable MFA in the profile page.
- [ ] Never commit `.env`; the bundle's `.env.example` is provided as a template
      and must be copied, not committed.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Blank page on main site | Check app is "Running" (green) in Setup Node.js App; check the app log output for startup errors. |
| API returns 404 for unknown `/api/...` | Expected — `notFoundHandler` returns `404 {"success":false}`. If you see Express HTML 404 (Cannot GET), the SPA route hit a file miss. |
| Admin shows the public site (or vice versa) | `ADMIN_HOSTS` not matching the actual subdomain host — set it to `admin.rngroupinfo.com` and restart. |
| CORS / blocked by browser | `CORS_ORIGIN` must list the exact origin (scheme+host). With `admin.rngroupinfo.com` talking to `/api` on the same origin you generally won't hit CORS at all. |
| Uploads 404 after image upload | `UPLOADS_DIR` differs between app #1 and #2 — use the same absolute path in both. |
| JSON store empty after restart | `DATA_DIR` env points to a folder without `products.json`; copy it from the bundle into that folder. |
| 503 / "Application failed to start" | Check the Node log; commonly missing `node_modules` or a bad `.env` value. |
| Need to rebuild after a frontend change | Re-run `./build-deploy.sh`, re-upload `client/` and `admin/` folders, restart apps (no DB change needed). |

## Optional: Apache static mode (not recommended)

If you prefer to serve the SPAs from Apache directly instead of through Passenger,
copy the built `client/` and `admin/` folders into `public_html` and use the
reference rewrite files in `htaccess-reference/` (rename to `.htaccess`). You
will then ALSO need the Node API running as a separate Passenger app and to
reverse-proxy `/api` and `/uploads` to it — which is why the single-Node-app
setup above is recommended instead.