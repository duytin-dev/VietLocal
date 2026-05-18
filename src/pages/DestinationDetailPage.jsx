import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { getDestinationImage } from '../data/destinationImages';
import FavoriteButton from '../components/FavoriteButton';
import { useI18n } from '../i18n/useI18n';
import '../components/FavoriteButton.css';

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const { t, translateRegion } = useI18n();
  const [dest, setDest] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .getDestination(slug)
      .then(setDest)
      .catch(() => setError(true));
  }, [slug]);

  if (error) return <p className="vl-error vl-container">{t('destinations.notFound')}</p>;
  if (!dest) return <p className="vl-loading vl-container">{t('common.loading')}</p>;

  return (
    <article className="detail-page vl-container">
      <img
        src={getDestinationImage(dest.slug, dest.imageUrl)}
        alt={dest.name}
        className="detail-page__hero"
      />
      <header>
        <span className="detail-page__region">{translateRegion(dest.region)}</span>
        <div className="detail-page__title-row">
          <h1>{dest.name}</h1>
          <FavoriteButton destination={dest} />
        </div>
        {dest.summary && <p className="detail-page__summary">{dest.summary}</p>}
      </header>
      {dest.description && (
        <section className="detail-page__body">
          <h2>{t('common.intro')}</h2>
          <p className="detail-page__description">{dest.description}</p>
        </section>
      )}
      <section className="detail-page__actions">
        <Link to="/ai-planner" className="vl-btn vl-btn--primary">
          {t('destinations.planAi')}
        </Link>
        <Link
          to={`/guides?destination=${encodeURIComponent(dest.name)}`}
          className="vl-btn vl-btn--outline"
        >
          {t('destinations.chooseGuide')}
        </Link>
      </section>
    </article>
  );
}
