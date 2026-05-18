import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../favorites/FavoritesContext';
import { getDestinationImage } from '../data/destinationImages';
import { useI18n } from '../i18n/useI18n';
import { IconHeart } from './Icons';
import './FavoritesBell.css';

export default function FavoritesBell() {
  const { t, translateRegion } = useI18n();
  const { items, loading, reload } = useFavorites();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="vl-favorites" ref={rootRef}>
      <button
        type="button"
        className={`vl-header__icon-btn vl-favorites__btn${open ? ' vl-favorites__btn--open' : ''}`}
        aria-label={t('common.favorites')}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) reload();
        }}
      >
        <IconHeart filled={items.length > 0} />
        {items.length > 0 && <span className="vl-favorites__badge">{items.length}</span>}
      </button>
      {open && (
        <div className="vl-favorites__panel">
          <header className="vl-favorites__head">
            <h2>{t('favorites.title')}</h2>
            <p>{t('favorites.subtitle')}</p>
          </header>
          <div className="vl-favorites__body">
            {loading ? (
              <p className="vl-favorites__empty">{t('common.loading')}</p>
            ) : items.length === 0 ? (
              <p className="vl-favorites__empty">{t('favorites.empty')}</p>
            ) : (
              <ul className="vl-favorites__list">
                {items.map((d) => (
                  <li key={d.id}>
                    <Link
                      to={`/destinations/${d.slug}`}
                      className="vl-favorites__item"
                      onClick={() => setOpen(false)}
                    >
                      <img src={getDestinationImage(d.slug, d.imageUrl)} alt="" loading="lazy" />
                      <span>
                        <strong>{d.name}</strong>
                        <small>{translateRegion(d.region)}</small>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {items.length > 0 && (
            <footer className="vl-favorites__foot">
              <Link to="/destinations" className="vl-favorites__all" onClick={() => setOpen(false)}>
                {t('favorites.viewAll')}
              </Link>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}
