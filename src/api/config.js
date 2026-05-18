/** API base — không có slash cuối. Vite: VITE_API_BASE_URL */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return String(raw).replace(/\/+$/, '');
}

export function getPaymentWebhookSecret() {
  return import.meta.env.VITE_PAYMENT_WEBHOOK_SECRET || 'vietlocal-dev-secret';
}

export function isProductionApi() {
  const base = getApiBaseUrl();
  return !base.includes('localhost') && !base.includes('127.0.0.1');
}
