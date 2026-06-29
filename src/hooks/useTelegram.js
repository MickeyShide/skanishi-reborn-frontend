import { useCallback, useEffect, useMemo, useState } from 'react';

function getWebApp() {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp ?? null;
}

function toPx(value) {
  return `${Number(value) || 0}px`;
}

function normalizeInsets(value) {
  return {
    top: Number(value?.top) || 0,
    bottom: Number(value?.bottom) || 0,
    left: Number(value?.left) || 0,
    right: Number(value?.right) || 0,
  };
}

function setInsetVars(prefix, inset) {
  const root = document.documentElement;
  root.style.setProperty(`--tg-${prefix}-top`, toPx(inset.top));
  root.style.setProperty(`--tg-${prefix}-bottom`, toPx(inset.bottom));
  root.style.setProperty(`--tg-${prefix}-left`, toPx(inset.left));
  root.style.setProperty(`--tg-${prefix}-right`, toPx(inset.right));
}

function applyTelegramState(webApp) {
  const root = document.documentElement;
  const colorScheme = 'dark';
  root.dataset.theme = colorScheme;

  const viewportHeight = Number(webApp?.viewportHeight) || window.innerHeight;
  const viewportStableHeight = Number(webApp?.viewportStableHeight) || viewportHeight;
  root.style.setProperty('--tg-viewport-height', `${viewportHeight}px`);
  root.style.setProperty('--tg-viewport-stable-height', `${viewportStableHeight}px`);

  setInsetVars('safe-area', normalizeInsets(webApp?.safeAreaInset));
  setInsetVars('content-safe-area', normalizeInsets(webApp?.contentSafeAreaInset ?? webApp?.contentSafeArea));

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', colorScheme === 'light' ? '#F1F4FC' : '#0A0912');
}

export function useTelegram() {
  const [state, setState] = useState(() => {
    const webApp = getWebApp();

    return {
      webApp,
      colorScheme: 'dark',
      themeParams: webApp?.themeParams ?? {},
      viewportHeight: webApp?.viewportHeight ?? (typeof window !== 'undefined' ? window.innerHeight : 0),
      user: webApp?.initDataUnsafe?.user ?? null,
      isTelegram: Boolean(webApp),
    };
  });

  const syncState = useCallback(() => {
    const webApp = getWebApp();

    if (!webApp) {
      document.documentElement.dataset.theme = 'dark';
      return;
    }

    applyTelegramState(webApp);
    setState({
      webApp,
      colorScheme: 'dark',
      themeParams: webApp.themeParams ?? {},
      viewportHeight: webApp.viewportHeight ?? window.innerHeight,
      user: webApp.initDataUnsafe?.user ?? null,
      isTelegram: true,
    });
  }, []);

  useEffect(() => {
    const webApp = getWebApp();

    if (!webApp) {
      document.documentElement.dataset.theme = 'dark';
      return undefined;
    }

    syncState();

    try {
      webApp.ready();
      webApp.expand();
      webApp.setHeaderColor?.('#0A0912');
      webApp.setBackgroundColor?.('#0A0912');
      webApp.disableVerticalSwipes?.();
    } catch (error) {
      console.warn('[telegram] initialization failed', error);
    }

    const events = ['themeChanged', 'viewportChanged', 'safeAreaChanged', 'contentSafeAreaChanged'];
    events.forEach((eventName) => webApp.onEvent?.(eventName, syncState));

    return () => {
      events.forEach((eventName) => webApp.offEvent?.(eventName, syncState));
    };
  }, [syncState]);

  return useMemo(() => state, [state]);
}

export function useTelegramBackButton(visible, onClick) {
  useEffect(() => {
    const webApp = getWebApp();
    const backButton = webApp?.BackButton;

    if (!backButton) return undefined;

    const handleClick = () => onClick?.();
    backButton.offClick?.(handleClick);

    if (visible) {
      backButton.show();
      backButton.onClick(handleClick);
    } else {
      backButton.hide();
    }

    return () => {
      backButton.offClick?.(handleClick);
    };
  }, [visible, onClick]);
}
