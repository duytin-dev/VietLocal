/** Tên chuyến đi — chỉ tên chuyến từ Điểm đến (không ghép tên HDV). */
export function buildTripTitle(tripName) {
  return (tripName || '').trim();
}
