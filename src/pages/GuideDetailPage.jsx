import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { formatVnd } from '../utils/format';
import { useI18n } from '../i18n/useI18n';
import { IconStar } from '../components/Icons';

export default function GuideDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const destinationName = location.state?.destinationName || '';
  const { t, tierLabel } = useI18n();
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    api.getGuide(id).then(setGuide).catch(() => setGuide(null));
  }, [id]);

  if (!guide) return <p className="vl-loading vl-container">{t('common.loading')}</p>;

  const available = guide.available !== false;

  return (
    <article className="detail-page vl-container guide-detail">
      <section className="guide-detail__top">
        <img src={guide.imageUrl} alt={guide.name} />
        <section>
          <div className="guide-card__head guide-card__head--detail">
            <span className={`guide-card__tier guide-card__tier--${(guide.tier || '').toLowerCase()}`}>
              {tierLabel(guide.tier)}
            </span>
            <h1 className="guide-card__name">{guide.name}</h1>
          </div>
          <p className="list-card__rating">
            <IconStar size={14} /> {guide.rating} · {guide.languages}
          </p>
          <p className="guide-detail__price">
            {formatVnd(guide.pricePerDay)} {t('common.perDay')}
          </p>
          {!available && (
            <p className="guide-detail__unavailable">{t('guides.unavailableDetail')}</p>
          )}
          {available ? (
            <Link
              to={`/book/${guide.id}`}
              state={{ destinationName, guideName: guide.name }}
              className="vl-btn vl-btn--primary vl-btn--lg"
            >
              {t('guides.bookGuide')}
            </Link>
          ) : (
            <button type="button" className="vl-btn vl-btn--primary vl-btn--lg" disabled>
              {t('guides.onTour')}
            </button>
          )}
        </section>
      </section>
      <section>
        <h2>{t('common.intro')}</h2>
        <p>{guide.bio}</p>
        <h2>{t('common.style')}</h2>
        <p>{guide.styleDescription}</p>
      </section>
    </article>
  );
}
