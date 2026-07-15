import { getApiBaseUrl, getPaymentWebhookSecret } from './config';

const BASE = getApiBaseUrl();
const TOKEN_KEY = 'vivudi_auth_token';

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function networkError(cause) {
  const err = new Error(
    'Không kết nối được API. Kiểm tra VITE_API_BASE_URL và CORS_ORIGIN trên backend (Render).',
  );
  err.code = 'NETWORK_ERROR';
  err.cause = cause;
  return err;
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
      ...options,
    });
  } catch (e) {
    throw networkError(e);
  }

  let json;
  try {
    json = await res.json();
  } catch {
    const err = new Error(res.ok ? 'Invalid API response' : `API error ${res.status}`);
    err.code = 'INVALID_RESPONSE';
    err.status = res.status;
    throw err;
  }

  if (!json.success) {
    const err = new Error(json.message || 'Request failed');
    err.code = json.errorCode;
    err.status = res.status;
    throw err;
  }
  return json.data;
}

export const api = {
  getAbout: () => request('/api/about'),
  getDestinations: (page = 0, size = 20) =>
    request(`/api/destinations?page=${page}&size=${size}`),
  getDestination: (slug) => request(`/api/destinations/${slug}`),
  getDestinationTrips: () => request('/api/destination-trips'),
  getBlogs: (page = 0, size = 20) => request(`/api/blogs?page=${page}&size=${size}`),
  getBlog: (slug) => request(`/api/blogs/${slug}`),
  getServices: () => request('/api/services'),
  getGuides: (tier, page = 0, size = 20) => {
    const q = new URLSearchParams({ page, size });
    if (tier) q.set('tier', tier);
    return request(`/api/guides?${q}`);
  },
  getGuide: (id) => request(`/api/guides/${id}`),
  createBooking: (body) =>
    request('/api/bookings', { method: 'POST', body: JSON.stringify(body) }),
  getBooking: (id) => request(`/api/bookings/${id}`),
  getPaymentQr: (id) => request(`/api/bookings/${id}/payment-qr`),
  confirmPayment: (bookingId) =>
    request(`/api/bookings/${bookingId}/confirm-payment`, {
      method: 'POST',
      headers: { 'X-Payment-Secret': getPaymentWebhookSecret() },
    }),
  aiChat: (body) =>
    request('/api/ai/chat', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/api/auth/me'),
  getFavorites: () => request('/api/favorites'),
  addFavorite: (destinationId) =>
    request(`/api/favorites/${destinationId}`, { method: 'POST' }),
  removeFavorite: (destinationId) =>
    request(`/api/favorites/${destinationId}`, { method: 'DELETE' }),
  getMyBookings: () => request('/api/bookings/my'),
  dismissBookingNotification: (bookingId) =>
    request(`/api/bookings/${bookingId}/notification`, { method: 'DELETE' }),
};

export { BASE as apiBaseUrl };
