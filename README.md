# Book Library — Full stack project

Monorepo layout:

- `frontend/` — React app (Open Library API, auth UI, favourites in `localStorage`)
- `backend/` — Express + MongoDB (`/books` REST route)

## Push to GitHub

1. Create an empty repository on GitHub (no README if you already have this one).
2. From the **project root** (`Final project/`):

```bash
git init
git add .
git commit -m "Initial commit: Book Library"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Do **not** commit `.env` files — they are listed in `.gitignore`. Use `backend/.env.example` and `frontend/.env.example` as templates.

## Frontend — GitHub Pages (automatic)

Workflow: `.github/workflows/deploy-frontend-pages.yml`

1. Push to branch `main`.
2. In the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. After the workflow runs, the site is at:

`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

The workflow patches `frontend/package.json` `homepage` during the build so asset paths work. `App.js` uses `BrowserRouter` `basename` from `PUBLIC_URL`.

## Backend — Render

1. Create **MongoDB Atlas** (or use local Mongo only for dev).
2. On [Render](https://render.com): **New → Web Service**, connect this repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install` (do **not** use `npm build` — that is not a valid npm command)
   - **Start Command:** `npm start`

   If you prefer a single convention, you can set **Build Command** to `npm run build` instead; the backend defines `build` to run `npm install`.
4. **Environment variables** (Dashboard → Environment):

| Key | Example |
|-----|---------|
| `MONGODB_URI` | `mongodb+srv://...` (Atlas) |
| `FRONTEND_URL` | `https://YOUR_USERNAME.github.io` or your Pages URL (no trailing path if you use repo root site; for project Pages use the exact origin you see in the browser, e.g. `https://user.github.io`) |
| `NODE_ENV` | `production` |

Optional blueprint: `render.yaml` at repo root.

5. After deploy, your API base URL is like `https://your-service.onrender.com`  
   - Health check: `GET /health`  
   - Books: `GET /books`

### CORS

`FRONTEND_URL` can be a **comma-separated** list of origins. If unset locally, the server allows all origins for easier development.

## Local development

**Backend**

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI, FRONTEND_URL=http://localhost:3000
npm install
npm start
```

**Frontend**

```bash
cd frontend
npm install
npm start
```

---

If your GitHub username or repo name uses mixed case, Pages URLs are case-sensitive in some browsers — use the exact URL GitHub shows after the first successful deploy.
