# Matcha Dashboard — Next.js Setup Guide

## Project structure

```
matcha-next/
  app/
    page.jsx                    ← public view (Overview + Collection tabs)
    layout.jsx                  ← root layout with session provider
    private/
      page.jsx                  ← your private dashboard (auth-gated)
    api/
      auth/[...nextauth]/       ← NextAuth Google sign-in
      public-data/route.js      ← serves field-filtered public data
      private-data/route.js     ← serves full data, owner-only
    components/
      shared.js                 ← helpers, constants, styles
      SessionProvider.jsx       ← client session wrapper
  lib/
    sheets.js                   ← server-side Google Sheets client
  next.config.js
  package.json
```

---

## Step 1 — Finish the private dashboard

Open `app/private/page.jsx` and find this placeholder near the bottom:

```jsx
{/* PASTE YOUR FULL TAB JSX FROM App.jsx HERE */}
```

Copy all the `{activeTab==="overview"&&...}` blocks from your current `App.jsx`
and paste them there. The state variables, data derivations, and helper functions
are already set up identically above it.

**One change needed:** replace all Google API write calls with the new server API:

| Old (Vite/gapi)                        | New (Next.js)                              |
|----------------------------------------|--------------------------------------------|
| `appendRow(SHEETS.raw_data, row)`      | `apiAppend(SHEETS.raw_data, row)`          |
| `updateRow(SHEETS.raw_data, idx, row)` | `apiUpdate(SHEETS.raw_data, idx, row)`     |
| `deleteRow(SHEETS.raw_data, idx)`      | `apiDelete(SHEETS.raw_data, idx)`          |

The `apiAppend`, `apiUpdate`, `apiDelete` functions are already defined at the
top of `private/page.jsx`.

---

## Step 2 — Google Service Account (replaces OAuth client-side)

The new architecture uses a **Service Account** instead of OAuth for reading/writing
your sheet server-side. This means your credentials never touch the browser.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Your existing project → **APIs & Services → Credentials**
3. Click **+ Create Credentials → Service Account**
   - Name: `matcha-dashboard`
   - Role: **Editor** (or just Viewer if you want read-only)
4. Click the service account → **Keys tab → Add Key → JSON**
5. Download the JSON file
6. Open it and copy the entire contents (it's one JSON object)

Then **share your Google Sheet** with the service account email:
- The email looks like `matcha-dashboard@your-project.iam.gserviceaccount.com`
- Open your sheet → Share → paste that email → Editor

---

## Step 3 — Google OAuth (for your sign-in to /private)

You still need OAuth for *your* login button. In Google Cloud Console:

1. **APIs & Services → Credentials → your existing OAuth 2.0 Client ID**
2. Add to **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://your-vercel-url.vercel.app`
3. Add to **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-vercel-url.vercel.app/api/auth/callback/google`

---

## Step 4 — Environment variables

Create `.env.local` in the project root (copy from `.env.local.example`):

```bash
# Your Google OAuth credentials (from Cloud Console)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=  # run: openssl rand -base64 32

# Service account — paste the entire JSON as one line, escaped
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}

# Your sheet ID (from the URL: /spreadsheets/d/SHEET_ID/edit)
SPREADSHEET_ID=...

# Owner email — only this account can access /private
OWNER_EMAIL=minicraftetsy@gmail.com
```

**Tip for the service account JSON:** The easiest way to get it as one line:
```bash
cat your-service-account.json | tr -d '\n'
```

---

## Step 5 — Run locally

```bash
cd matcha-next
npm install
npm run dev
```

- Public view: http://localhost:3000
- Private dashboard: http://localhost:3000/private

---

## Step 6 — Deploy to Vercel

```bash
# Push to GitHub first
git init && git add . && git commit -m "initial"
# Create repo on github.com, then:
git remote add origin https://github.com/yourname/matcha-dashboard.git
git push -u origin main
```

Then on [vercel.com](https://vercel.com):
1. **Add New Project** → import your repo
2. Framework preset: **Next.js** (auto-detected)
3. **Environment Variables** — add all 6 variables from `.env.local`
   - For `NEXTAUTH_URL` use your Vercel URL: `https://matcha-dashboard.vercel.app`
   - For `NEXTAUTH_SECRET` generate a new one for production
4. Deploy

Update your Google OAuth redirect URIs to include the Vercel URL (Step 3).

---

## How privacy works

```
Browser (anyone)          Server (Vercel)           Google Sheet
      |                        |                          |
      |-- GET /api/public-data→|                          |
      |                        |-- service account ------>|
      |                        |<-- all rows -------------|
      |                        | (strips private fields)  |
      |<-- brand/name/status --|                          |
      |   (no prices/grams)    |                          |
      
      |-- GET /api/private-data|                          |
      |   (with session cookie)|                          |
      |                        | checks email === owner   |
      |                        |-- service account ------>|
      |<-- full data -----------|<-- all rows ------------|
```

Private data **never** leaves the server for public requests.
Even with DevTools open, the network tab only shows the filtered public fields.
