/** BE production (Render) — dùng khi deploy Vercel mà thiếu VITE_API_BASE_URL */
const RENDER_API_BASE = 'https://be123-vietlocal.onrender.com';

/** API base — không có slash cuối. Vite: VITE_API_BASE_URL */
export function getApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv && !isLocalhostUrl(fromEnv)) {
    return String(fromEnv).replace(/\/+$/, '');
  }

  // Vercel deploy nhưng build thiếu env → tránh gọi localhost:8080
  if (typeof window !== 'undefined' && isVercelHost(window.location.hostname)) {
    return RENDER_API_BASE;
  }

  if (fromEnv) {
    return String(fromEnv).replace(/\/+$/, '');
  }
  return 'http://localhost:8080';
}

function isLocalhostUrl(url) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

function isVercelHost(hostname) {
  return hostname.endsWith('.vercel.app') || hostname === 'viet-local.vercel.app';
}

export function getPaymentWebhookSecret() {
  return import.meta.env.VITE_PAYMENT_WEBHOOK_SECRET || 'vietlocal-dev-secret';
}

export function isProductionApi() {
  const base = getApiBaseUrl();
  return !base.includes('localhost') && !base.includes('127.0.0.1');
}
