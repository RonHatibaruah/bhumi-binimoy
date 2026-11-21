# Cloudflare Pages Deployment Guide: BhumiBinimoy (Assam Land Exchange)

**Project Name:** `bhumi-binimoy`  
**Problem Statement:** NESFIC-D-52 (Stream 1 — Government Track)  
**Target Domain:** `https://bhumi-binimoy.pages.dev/`  
**GitHub Repository:** `https://github.com/RonHatibaruah/bhumi-binimoy`  

---

## 🚀 Deployment Options

### Option 1: Direct GitHub Integration via Cloudflare Dashboard (Recommended)

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation menu, go to **Workers & Pages** ➔ **Create application** ➔ select the **Pages** tab.
3. Click **Connect to Git** and choose **GitHub**.
4. Select the repository: `RonHatibaruah/bhumi-binimoy`.
5. In **Set up builds and deployments**, configure:
   - **Project name:** `bhumi-binimoy`
   - **Production branch:** `main`
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** *(leave blank / default)*
6. In **Environment variables (advanced)**, add:
   - `NODE_VERSION` = `20.18.0`
7. Click **Save and Deploy**. Cloudflare Pages will build and deploy your application to `https://bhumi-binimoy.pages.dev/`. Every future push to `main` will automatically trigger a zero-downtime deployment!

---

### Option 2: Command Line Deployment via Wrangler CLI

You can also deploy directly from your local terminal:

```bash
# 1. Build the production assets
npm run build

# 2. Deploy directly to Cloudflare Pages
npx wrangler pages deploy dist --project-name=bhumi-binimoy
```

If prompted to log in:
```bash
npx wrangler login
```

Or deploy non-interactively using your Cloudflare API token:
```bash
CLOUDFLARE_API_TOKEN="your_token" CLOUDFLARE_ACCOUNT_ID="your_account_id" npx wrangler pages deploy dist --project-name=bhumi-binimoy
```

---

### Option 3: Automated CI/CD via GitHub Actions

A ready-to-use GitHub Actions workflow is included at `.github/workflows/cloudflare-pages.yml`. To enable automated deployment on push:
1. In your GitHub repository (`RonHatibaruah/bhumi-binimoy`), go to **Settings** ➔ **Secrets and variables** ➔ **Actions**.
2. Add the following repository secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages edit permissions.
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (visible on your Cloudflare dashboard overview).
3. Every commit pushed to `main` will automatically build and deploy the latest version!

---

## ⚙️ Configuration Files Reference

- **`wrangler.toml`**: Specifies project name (`bhumi-binimoy`), compatibility date (`2024-11-01`), and output directory (`dist`).
- **`.nvmrc`**: Pins the Node.js runtime to `20.18.0` LTS.
- **`public/_redirects`**: Configures single-page application (SPA) routing (`/* /index.html 200`) so client-side routes never return 404s.
- **`public/_headers`**: Enforces security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Permissions-Policy`, `HSTS`) and long-term asset caching.
- **`functions/api/health.ts`**: Provides an edge serverless health check endpoint at `/api/health`.
