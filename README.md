# DPI Dashboard

A production-ready web dashboard for an existing C++ Deep Packet Inspection
(DPI) engine. This repo does **not** contain or modify the engine's logic —
it only adds a frontend and backend so the engine can be run entirely from a
browser instead of a terminal.

```
├── frontend/     React + TypeScript + Vite + Tailwind
├── backend/      Node.js + Express API that spawns the engine
└── README.md     you are here
```

## How it fits together

1. The **frontend** lets a user drag in a `.pcap` file and choose blocking
   rules (apps, domains, IPs).
2. It uploads that to the **backend** at `POST /api/analyze`.
3. The backend saves the upload, then runs your compiled engine with
   `child_process.spawn`, e.g.:
   ```
   dpi_engine input.pcap output.pcap --block-app YouTube --block-domain facebook --block-ip 192.168.1.50
   ```
4. The engine's stdout is parsed into JSON (see `backend/utils/parser.js`)
   and returned to the frontend along with a download link for the filtered
   `output.pcap`.
5. The frontend renders statistics, charts, and a detected-applications
   table, and lets the user download the result.

The frontend never talks to `child_process` or the filesystem directly —
only to the Express API.

---

## 1. Add your engine binary

Drop your compiled binary into `backend/cpp/`:

- Windows: `backend/cpp/dpi_engine.exe`
- Linux (what Render runs): `backend/cpp/dpi_engine` (must be executable —
  `chmod +x backend/cpp/dpi_engine`)

Point `DPI_ENGINE_PATH` in your `.env` at whichever one you use (see below).

> **Render runs Linux.** If your engine is currently only compiled for
> Windows, you'll need a Linux build (or a Docker image containing it) for
> the hosted backend to actually invoke it. Locally, on Windows, the `.exe`
> works as-is.

---

## 2. Local development

### Backend

```bash
cd backend
cp .env.example .env
# edit .env — at minimum confirm DPI_ENGINE_PATH points at your binary
npm install
npm run dev        # nodemon, restarts on file changes
# or: npm start
```

The API starts on `http://localhost:5000` (configurable via `PORT`).
Check it's alive: `curl http://localhost:5000/api/health`.

### Frontend

```bash
cd frontend
cp .env.example .env
# edit .env if your backend isn't on http://localhost:5000
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## 3. Environment variables

### `backend/.env`

| Variable            | Description                                             | Default                  |
|---------------------|----------------------------------------------------------|---------------------------|
| `PORT`              | Port Express listens on                                  | `5000`                    |
| `CORS_ORIGIN`       | Comma-separated allowed origins for the frontend          | `http://localhost:5173`   |
| `DPI_ENGINE_PATH`   | Path to the compiled engine binary                        | `./cpp/dpi_engine`        |
| `MAX_UPLOAD_BYTES`  | Max upload size in bytes                                  | `104857600` (100MB)       |
| `ENGINE_TIMEOUT_MS` | Kill the engine process if it runs longer than this        | `120000` (2 minutes)      |

### `frontend/.env`

| Variable              | Description                  | Default                 |
|-----------------------|-------------------------------|--------------------------|
| `VITE_API_BASE_URL`   | Base URL of the backend API   | `http://localhost:5000` |

---

## 4. API reference

### `POST /api/analyze`

`multipart/form-data` body:

| Field     | Type   | Notes                                      |
|-----------|--------|---------------------------------------------|
| `pcap`    | file   | required, `.pcap`/`.pcapng`/`.cap`, ≤100MB  |
| `apps`    | string | JSON array of app names to block, e.g. `["YouTube","TikTok"]` |
| `domains` | string | JSON array of domains to block               |
| `ips`     | string | JSON array of IPs to block                   |

Response:

```json
{
  "success": true,
  "statistics": {
    "totalPackets": 500,
    "tcpPackets": 480,
    "udpPackets": 20,
    "forwarded": 470,
    "dropped": 30,
    "applications": [{ "name": "GitHub", "packets": 150, "percentage": 30 }],
    "threads": [{ "thread": 0, "packets": 120 }]
  },
  "outputFile": "8f2c...-uuid.pcap",
  "originalName": "capture.pcap",
  "appliedRules": { "apps": ["YouTube"], "domains": [], "ips": [] }
}
```

Error responses use `{ "error": "...", "message": "..." }` with an
appropriate HTTP status (400 invalid file, 413 too large, 500 engine
crash/missing binary, 504 timeout).

### `GET /api/download/:filename`

Streams the filtered `output.pcap` produced by the most recent analysis.

---

## 5. Deployment

### Backend → Render

1. Push this repo to GitHub.
2. In Render: **New → Web Service**, point it at the repo, set the root
   directory to `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add the environment variables from the table above. Set `CORS_ORIGIN` to
   your deployed Vercel URL (e.g. `https://your-app.vercel.app`).
5. Make sure `backend/cpp/dpi_engine` (Linux build, executable) is committed
   to the repo, or added via Render's build step — Render's filesystem is
   ephemeral, so the binary must be restored on every deploy/restart.
6. `backend/render.yaml` is provided as a Render Blueprint if you'd rather
   deploy via `render.yaml` instead of the dashboard.

### Frontend → Vercel

1. In Vercel: **New Project**, point it at the repo, set the root directory
   to `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.
3. Add environment variable `VITE_API_BASE_URL` = your Render backend URL.
4. `frontend/vercel.json` is included so client-side routing (`/dashboard`,
   `/features`, etc.) works on refresh/direct link.

---

## 6. Error handling covered out of the box

- **Invalid PCAP** — magic-number check rejects non-PCAP uploads before the
  engine ever runs.
- **Engine crash** — non-zero exit code is surfaced as a 500 with stderr
  (truncated) for debugging.
- **Timeout** — a stuck engine process is killed after `ENGINE_TIMEOUT_MS`
  and reported as a 504.
- **Missing executable** — checked before spawning; returns a clear 500
  telling you to check `DPI_ENGINE_PATH`.
- **Large files** — rejected by Multer at `MAX_UPLOAD_BYTES` with a 413.
- **Uploads/outputs cleanup** — the uploaded input is deleted immediately
  after each run; old output files are swept hourly so disk doesn't fill up.

---

## 7. Suggested next step: JSON output mode

The engine currently prints human-readable text, which `backend/utils/parser.js`
scrapes with tolerant regexes. That's why the frontend works today, but a
`--json` output mode on the engine (see the note that came with this project)
would let `backend/controllers/analyzeController.js` simply
`JSON.parse(result.stdout)` instead of pattern-matching. When you're ready to
add that flag, `parser.js` is the only file that needs to change — swap its
regex-based parsing for a direct `JSON.parse`, keeping the same return shape
so nothing else in the app has to change.
