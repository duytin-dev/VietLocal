export function formatVnd(amount) {
  if (amount == null) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function tierLabel(tier) {
  const map = { PREMIUM: 'Cao cấp', MID: 'Tầm trung', BUDGET: 'Phổ thông' };
  return map[tier] || tier;
}
