# Skanshi Telegram Mini App

React 18 + Vite + Tailwind CSS 3 implementation of the Skanshi mobile-only Telegram Mini App.

## Backend integration

The frontend is wired to the local backend from `../backend` and uses its routes directly:

- `POST /api/v1/auth/init`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/app/state`
- `GET /api/v1/map/points`
- `POST /api/v1/scan/claim`
- `GET /map/api-key`

For local development the Vite dev server proxies these requests to `http://localhost:4000` by default.
If your backend runs on another address, set:

```bash
VITE_DEV_BACKEND_URL=http://localhost:4000
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

Run the backend locally, for example from `../backend`:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 4000
```

The app uses `window.Telegram.WebApp` from `https://telegram.org/js/telegram-web-app.js`, calls `ready()` and `expand()` on startup, listens to theme, viewport, and safe-area changes, and exposes layout offsets through CSS variables.
