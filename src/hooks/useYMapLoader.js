import { useEffect, useState } from 'react';

let scriptLoading = null;
let cachedApiKey = null;

const SCRIPT_SELECTOR = 'script[data-ymap-loader="true"]';
const YMAP_SCRIPT_URL = 'https://api-maps.yandex.ru/v3/';

function getRuntimeApiKey() {
  return (
    window.RUNTIME_CONFIG?.VITE_YMAP_API_KEY ||
    window.RUNTIME_CONFIG?.YMAP_API_KEY ||
    import.meta.env.VITE_YMAP_API_KEY ||
    import.meta.env.VITE_YANDEX_MAPS_API_KEY ||
    ''
  );
}

async function fetchApiKey() {
  if (cachedApiKey) return cachedApiKey;

  const runtimeKey = getRuntimeApiKey();
  if (runtimeKey) {
    cachedApiKey = runtimeKey;
    return cachedApiKey;
  }

  const backendUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${backendUrl}/map/api-key`, { credentials: 'include' });
  if (!response.ok) {
    throw new Error('Yandex Maps API key is not configured');
  }

  const payload = await response.json().catch(() => null);
  if (!payload || typeof payload.api_key !== 'string' || !payload.api_key) {
    throw new Error('Invalid response when fetching Yandex Maps API key');
  }

  cachedApiKey = payload.api_key;
  return cachedApiKey;
}

async function waitForExistingScript(script) {
  if (window.ymaps3?.ready) {
    await window.ymaps3.ready;
    return;
  }

  await new Promise((resolve, reject) => {
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', () => reject(new Error('Failed to load Yandex Maps script')), { once: true });
  });

  if (window.ymaps3?.ready) {
    await window.ymaps3.ready;
  }
}

async function loadScript() {
  const existing = document.querySelector(SCRIPT_SELECTOR);
  if (existing) {
    await waitForExistingScript(existing);
    return;
  }

  const apiKey = await fetchApiKey();

  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.dataset.ymapLoader = 'true';
    script.src = `${YMAP_SCRIPT_URL}?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Yandex Maps script'));
    document.head.appendChild(script);
  });

  if (window.ymaps3?.ready) {
    await window.ymaps3.ready;
  }
}

function ensureScriptLoaded() {
  if (!scriptLoading) {
    scriptLoading = loadScript().catch((error) => {
      scriptLoading = null;
      throw error;
    });
  }

  return scriptLoading;
}

export function useYMapLoader() {
  const [state, setState] = useState({ ready: false, error: null });

  useEffect(() => {
    let canceled = false;

    ensureScriptLoaded()
      .then(() => {
        if (!canceled) setState({ ready: true, error: null });
      })
      .catch((error) => {
        if (!canceled) {
          console.error('[ymaps]', error);
          setState({ ready: false, error });
        }
      });

    return () => {
      canceled = true;
    };
  }, []);

  return state;
}

export default useYMapLoader;
