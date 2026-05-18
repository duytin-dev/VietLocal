import { getApiBaseUrl } from './config';

const BASE = getApiBaseUrl();
const STORAGE_KEY = 'vietlocal_admin_secret';

export function getAdminSecret() {
  return sessionStorage.getItem(STORAGE_KEY) || '';
}

export function setAdminSecret(secret) {
  sessionStorage.setItem(STORAGE_KEY, secret);
}

export function clearAdminSecret() {
  sessionStorage.removeItem(STORAGE_KEY);
}

async function adminFetch(path, { page, size } = {}) {
  const secret = getAdminSecret();
  if (!secret) {
    const err = new Error('Chưa đăng nhập admin');
    err.code = 'UNAUTHORIZED';
    throw err;
  }
  const params = new URLSearchParams();
  if (page !== undefined) params.set('page', String(page));
  if (size !== undefined) params.set('size', String(size));
  const qs = params.toString();
  const url = `${BASE}${path}${qs ? `?${qs}` : ''}`;
  let res;
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': secret,
      },
    });
  } catch (e) {
    const err = new Error(
      'Không kết nối được API admin. Kiểm tra VITE_API_BASE_URL và CORS_ORIGIN trên Render.',
    );
    err.code = 'NETWORK_ERROR';
    err.cause = e;
    throw err;
  }
  let json;
  try {
    json = await res.json();
  } catch {
    const err = new Error(`API admin lỗi ${res.status}`);
    err.code = res.status === 401 ? 'UNAUTHORIZED' : 'INVALID_RESPONSE';
    err.status = res.status;
    throw err;
  }
  if (res.status === 401 || json.errorCode === 'UNAUTHORIZED') {
    const err = new Error(
      json.message ||
        'Mã admin sai. Nhập đúng ADMIN_SECRET trên Render (không phải vietlocal-admin-dev).',
    );
    err.code = 'UNAUTHORIZED';
    err.status = 401;
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

export const adminApi = {
  getDashboard: () => adminFetch('/api/admin/dashboard'),
  listBookings: (page, size = 20) => adminFetch('/api/admin/bookings', { page, size }),
  listUsers: (page, size = 20) => adminFetch('/api/admin/users', { page, size }),
  listAiChats: (page, size = 20) => adminFetch('/api/admin/ai-chats', { page, size }),
};
