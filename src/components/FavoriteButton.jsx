import { useState } from 'react';
import { useFavorites } from '../favorites/FavoritesContext';
import { useI18n } from '../i18n/useI18n';
import { IconHeart } from './Icons';
import './FavoriteButton.css';

export default function FavoriteButton({ destination, className = '' }) {
  const { t } = useI18n();
  const { isFavorite, toggle } = useFavorites();
  const [busy, setBusy] = useState(false);
  const active = isFavorite(destination.id);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      await toggle(destination);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={`vl-fav-btn${active ? ' vl-fav-btn--active' : ''}${className ? ` ${className}` : ''}`}
      aria-label={active ? t('favorites.remove') : t('favorites.add')}
      aria-pressed={active}
      disabled={busy}
      onClick={handleClick}
    >
      <IconHeart filled={active} />
    </button>
  );
}
