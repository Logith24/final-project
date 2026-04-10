# Render deploy — fix “Unknown command: build”

`npm build` is **invalid**. npm has no such command.

## Fix in the Render dashboard (required)

1. Open [Render Dashboard](https://dashboard.render.com) → your **Web Service**.
2. Go to **Settings** (left sidebar).
3. Find **Build & Deploy** → **Build Command**.
4. **Delete** whatever says `npm build`.
5. Type exactly one of these:

```text
npm install
```

or (if you use the script in `package.json`):

```text
npm run build
```

6. **Start Command** must be:

```text
npm start
```

7. **Root Directory** must be: `backend` (if your repo contains both `frontend` and `backend`).
8. Click **Save Changes**, then **Manual Deploy** → **Deploy latest commit**.

Until you change that field in Render, every deploy will keep failing — updating only GitHub does not change Render’s saved build command.
