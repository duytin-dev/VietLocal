/** Ảnh đại diện điểm đến — URL Unsplash đã kiểm tra load được */
const Q = '?auto=format&fit=crop&w=1000&q=80';

export const DESTINATION_IMAGES = {
  'da-nang': `https://images.unsplash.com/photo-1569154941061-e231b4725ef1${Q}`,
  'ha-noi': `https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac${Q}`,
  'sa-pa': `https://images.unsplash.com/photo-1506905925346-21bda4d32df4${Q}`,
  'hoi-an': `https://images.unsplash.com/photo-1528127269322-539801943592${Q}`,
  'hue': `https://images.unsplash.com/photo-1524231757912-21f4fe3a7200${Q}`,
  'nha-trang': `https://images.unsplash.com/photo-1583212292454-1fe6229603b7${Q}`,
  'phu-quoc': `https://images.unsplash.com/photo-1514282401047-d79a71a590e8${Q}`,
  'da-lat': `https://images.unsplash.com/photo-1472214103451-9374bd1c798e${Q}`,
  'can-tho': `https://images.unsplash.com/photo-1507525428034-b723cf961d3e${Q}`,
  'ha-long': `https://images.unsplash.com/photo-1524231757912-21f4fe3a7200${Q}`,
};

const FALLBACK = `https://images.unsplash.com/photo-1501785888041-af3ef245b9d2${Q}`;

export function getDestinationImage(slug, imageUrlFromApi) {
  return DESTINATION_IMAGES[slug] || imageUrlFromApi || FALLBACK;
}
