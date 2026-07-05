# Deploy on Render

This guide deploys **both** the backend API and the React frontend on Render using the root [`render.yaml`](./render.yaml) Blueprint.

## Prerequisites

1. Code pushed to GitHub: [aashi-singh-web/DPI-Dashboard](https://github.com/aashi-singh-web/DPI-Dashboard)
2. **Linux DPI engine binary** at `backend/cpp/dpi_engine` (chmod +x)
   - Render runs Linux. The Windows `dpi_engine.exe` will **not** work in production.
   - Compile your C++ engine on Linux/WSL, then commit `backend/cpp/dpi_engine` to the repo.

## Step 1 — Create services from Blueprint

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Blueprint**
3. Connect the **DPI-Dashboard** GitHub repo
4. Render detects `render.yaml` and previews two services:
   - `dpi-dashboard-backend` (Node web service)
   - `dpi-dashboard-frontend` (static site)
5. You will be prompted for:
   - `CORS_ORIGIN` — leave blank for now (set in Step 2)
   - `VITE_API_BASE_URL` — leave blank for now (set in Step 2)
6. Click **Apply** and wait for both services to finish the first deploy

## Step 2 — Wire frontend ↔ backend URLs

After deploy, copy each service URL from the Render dashboard (e.g. `https://dpi-dashboard-backend-xxxx.onrender.com`).

### Backend (`dpi-dashboard-backend`)

| Variable | Example value |
|----------|----------------|
| `CORS_ORIGIN` | `https://dpi-dashboard-frontend-xxxx.onrender.com` |

Save → **Manual Deploy** → deploy latest.

### Frontend (`dpi-dashboard-frontend`)

| Variable | Example value |
|----------|----------------|
| `VITE_API_BASE_URL` | `https://dpi-dashboard-backend-xxxx.onrender.com` |

**No trailing slash.** Vite embeds this at build time.

Save → **Manual Deploy** → **Clear build cache & deploy**.

## Step 3 — Verify

1. Open the frontend URL → upload a PCAP → **Analyze Capture**
2. Backend health check: `https://<backend-url>/api/health` should return `{"status":"ok",...}`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error in browser | `CORS_ORIGIN` on backend must exactly match the frontend URL (including `https://`) |
| API calls go to localhost | Redeploy frontend after setting `VITE_API_BASE_URL` with **Clear build cache** |
| Engine unavailable (500) | Add Linux `backend/cpp/dpi_engine` to the repo; confirm `DPI_ENGINE_PATH=./cpp/dpi_engine` |
| Service sleeps (free tier) | First request after idle may take ~30s to wake up |

## Free tier notes

- Web services spin down after inactivity; cold starts are normal.
- Output PCAP files are stored on ephemeral disk and may be lost on redeploy/restart.
