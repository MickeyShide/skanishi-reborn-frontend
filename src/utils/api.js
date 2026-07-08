const BACKEND_URL = window.RUNTIME_CONFIG?.VITE_API_URL || import.meta.env.VITE_API_URL || '';
const API_BASE = `${BACKEND_URL}/api/v1`;
const ACCESS_TOKEN_KEY = 'skanishi_access_token';

let refreshPromise = null;

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getCookie(name) {
  if (typeof document === 'undefined') return '';

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function getErrorMessage(payload, fallbackMessage) {
  return payload?.error?.message || payload?.detail || fallbackMessage;
}

function buildUrl(path, query) {
  const search = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });

  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

export function getStoredAccessToken() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
}

function setStoredAccessToken(token) {
  if (typeof window === 'undefined') return;

  if (token) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function clearAccessToken() {
  setStoredAccessToken('');
}

export function getTelegramInitData() {
  if (typeof window === 'undefined') return '';
  const data = window.Telegram?.WebApp?.initData;
  if (!data && import.meta.env.DEV) {
    return 'mock_local_data';
  }
  return data ?? '';
}

async function parseResponse(response, fallbackMessage) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload, fallbackMessage), response.status, payload);
  }

  return payload;
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const csrfToken = getCookie('csrf_token');
      const headers = csrfToken ? { 'X-CSRF-Token': csrfToken } : {};

      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      const payload = await parseResponse(response, 'Не удалось обновить сессию.');
      setStoredAccessToken(payload?.access_token ?? '');
      return payload;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    query,
    headers = {},
    auth = true,
    csrf = false,
    retry = true,
    fallbackMessage = 'Не удалось выполнить запрос.',
  } = options;

  const nextHeaders = new Headers(headers);
  const token = auth ? getStoredAccessToken() : '';
  const csrfToken = csrf ? getCookie('csrf_token') : '';

  if (token) nextHeaders.set('Authorization', `Bearer ${token}`);
  if (csrfToken) nextHeaders.set('X-CSRF-Token', csrfToken);

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isFormData && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: nextHeaders,
    body: body === undefined ? undefined : isFormData || typeof body === 'string' ? body : JSON.stringify(body),
    credentials: 'include',
  });

  if (
    retry &&
    auth &&
    (response.status === 401 || response.status === 403) &&
    path !== `${API_BASE}/auth/init` &&
    path !== `${API_BASE}/auth/refresh`
  ) {
    try {
      await refreshAccessToken();
      return apiRequest(path, { ...options, retry: false });
    } catch (error) {
      clearAccessToken();
      throw error;
    }
  }

  return parseResponse(response, fallbackMessage);
}

export async function loginWithTelegram(initData = getTelegramInitData()) {
  if (!initData) {
    throw new Error('Открой мини-приложение внутри Telegram, чтобы выполнить вход.');
  }

  const payload = await apiRequest(`${API_BASE}/auth/init`, {
    method: 'POST',
    body: { tg_web_app_data: initData },
    auth: false,
    fallbackMessage: 'Не удалось выполнить вход через Telegram.',
  });

  setStoredAccessToken(payload?.access_token ?? '');
  return payload;
}

export async function fetchAppState() {
  return apiRequest(`${API_BASE}/app/state`, {
    fallbackMessage: 'Не удалось загрузить состояние приложения.',
  });
}

export async function fetchMapPoints(params = {}) {
  return apiRequest(`${API_BASE}/map/points`, {
    query: params,
    fallbackMessage: 'Не удалось загрузить точки карты.',
  });
}

export async function fetchXpHistory(params = {}) {
  return apiRequest(`${API_BASE}/xp/history`, {
    query: params,
    fallbackMessage: 'Не удалось загрузить историю XP.',
  });
}

export async function fetchMyItems(params = {}) {
  return apiRequest(`${API_BASE}/items/my`, {
    query: params,
    fallbackMessage: 'Не удалось загрузить инвентарь.',
  });
}

export async function collectItemBySecret(token) {
  const secret = extractSecret(token);
  return apiRequest(`${API_BASE}/scan/claim`, {
    method: 'POST',
    body: { token: secret },
    csrf: true,
    fallbackMessage: 'Не удалось получить предмет по QR-коду.',
  });
}

export async function logout() {
  const result = await apiRequest(`${API_BASE}/auth/logout`, {
    method: 'POST',
    csrf: true,
    fallbackMessage: 'Не удалось выйти из аккаунта.',
  });
  clearAccessToken();
  return result;
}

export async function getPrivacySettings() {
  return apiRequest(`${API_BASE}/users/settings/privacy`, {
    fallbackMessage: 'Не удалось загрузить настройки приватности.',
  });
}

export async function updatePrivacySettings(privacy) {
  return apiRequest(`${API_BASE}/users/settings/privacy`, {
    method: 'PATCH',
    body: { privacy },
    csrf: true,
    fallbackMessage: 'Не удалось обновить настройки приватности.',
  });
}

export function extractSecret(token) {
  if (!token) return '';
  const str = String(token).trim();

  // match t.me/bot/app?startapp=SECRET
  const startAppMatch = str.match(/[?&]startapp=([^&]+)/);
  if (startAppMatch) return startAppMatch[1];
  
  // match t.me/bot/app/SECRET
  const pathMatch = str.match(/t\.me\/[^/]+\/[^/]+\/([^/?]+)/);
  if (pathMatch) return pathMatch[1];

  // match https://domain/qr/SECRET
  const directMatch = str.match(/\/qr\/([^/?]+)/);
  if (directMatch) return directMatch[1];

  return str;
}
