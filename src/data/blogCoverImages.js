/** Cover images for seed blog posts — used as FE fallback when BE still serves one shared image. */
const Q = '?auto=format&fit=crop&w=800&q=80';

export const BLOG_COVER_BY_SLUG = {
  '5-mon-an-da-nang': `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
  'hoi-an-ve-dem': `https://images.unsplash.com/photo-1528127269322-539801943592${Q}`,
  'trekking-fansipan': `https://images.unsplash.com/photo-1506905925346-21bda4d32df4${Q}`,
  'am-thuc-ha-noi': `https://images.unsplash.com/photo-1582878826629-29ae7d1620f9${Q}`,
  'homestay-tay-bac': `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b${Q}`,
  'phu-quoc-3-ngay': `https://images.unsplash.com/photo-1514282401047-d79a71a590e8${Q}`,
  'hue-mot-ngay': `https://images.unsplash.com/photo-1559592413-7cec4d0cae2b${Q}`,
  'da-lat-cafe-thac': `https://images.unsplash.com/photo-1472214103451-9374bd1c798e${Q}`,
  'cho-noi-cai-rang': `https://images.unsplash.com/photo-1507525428034-b723cf961d3e${Q}`,
  'du-thuyen-ha-long': `https://images.unsplash.com/photo-1544551763-46a013bb70d5${Q}`,
};

export function resolveBlogCover(blog) {
  if (!blog) return '';
  return BLOG_COVER_BY_SLUG[blog.slug] || blog.coverImageUrl || '';
}
