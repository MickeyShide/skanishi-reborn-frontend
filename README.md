# Skanshi Telegram Mini App

React 18 + Vite + Tailwind CSS 3 implementation of the Skanshi mobile-only Telegram Mini App.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

The app uses `window.Telegram.WebApp` from `https://telegram.org/js/telegram-web-app.js`, calls `ready()` and `expand()` on startup, listens to theme, viewport, and safe-area changes, and exposes layout offsets through CSS variables.
