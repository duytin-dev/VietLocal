import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { getDestinationImage } from '../data/destinationImages';
import { useI18n } from '../i18n/useI18n';
import FavoriteButton from '../components/FavoriteButton';
import { IconLeaf, IconStar } from '../components/Icons';
import './ListPages.css';
import '../components/FavoriteButton.css';

export default function DestinationsPage() {
  const { t, translateRegion } = useI18n();
  const [params] = useSearchParams();
  const q = params.get('q')?.toLowerCase() || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDestinations(0, 50)
      .then((p) => {
        let list = p.content;
        if (q) list = list.filter((d) => d.name.toLowerCase().includes(q) || d.region?.toLowerCase().includes(q));
        setItems(list);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <section className="list-page vl-container">
      <header className="list-page__head">
        <h1>
          <IconLeaf className="vl-icon-leaf" /> {t('destinations.title')}
        </h1>
        <p>
          {q
            ? t('destinations.searchResult', { q: params.get('q') })
            : t('destinations.subtitle')}
        </p>
      </header>
      {loading ? (
        <p className="vl-loading">{t('common.loading')}</p>
      ) : (
        <section className="list-grid">
          {items.map((d) => (
            <article key={d.id} className="list-card list-card--dest">
              <FavoriteButton destination={d} className="list-card__fav" />
              <Link to={`/destinations/${d.slug}`} className="list-card__link">
                {d.featured && <span className="list-card__badge">{t('common.featured')}</span>}
                <img src={getDestinationImage(d.slug, d.imageUrl)} alt={d.name} loading="lazy" />
                <section>
                  <strong>{d.name}</strong>
                  <span>{translateRegion(d.region)}</span>
                  <span className="list-card__rating">
                    <IconStar size={12} /> 4.8
                  </span>
                </section>
              </Link>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}
