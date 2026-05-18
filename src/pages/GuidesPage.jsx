import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { formatVnd } from '../utils/format';
import { useI18n } from '../i18n/useI18n';
import { IconStar } from '../components/Icons';
import './ListPages.css';

const TIERS = ['', 'PREMIUM', 'MID', 'BUDGET'];

export default function GuidesPage() {
  const { t, tierLabel } = useI18n();
  const [params, setParams] = useSearchParams();
  const tier = params.get('tier') || '';
  const destinationName = params.get('destination') || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getGuides(tier || undefined, 0, 50)
      .then((p) => setItems(p.content))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [tier]);

  return (
    <section className="list-page vl-container">
      <header className="list-page__head">
        <h1>{t('guides.title')}</h1>
        <p>
          {destinationName
            ? t('guides.subtitleDestination', { destination: destinationName })
            : t('guides.subtitle')}
        </p>
      </header>
      <nav className="filter-tabs">
        {TIERS.map((tierKey) => (
          <button
            key={tierKey || 'all'}
            type="button"
            className={tier === tierKey ? 'active' : ''}
            onClick={() => (tierKey ? setParams({ tier: tierKey }) : setParams({}))}
          >
            {tierKey ? tierLabel(tierKey) : t('tier.all')}
          </button>
        ))}
      </nav>
      {loading ? (
        <p className="vl-loading">{t('common.loading')}</p>
      ) : (
        <section className="list-grid list-grid--guides">
          {items.map((g) => (
            <Link
              key={g.id}
              to={`/guides/${g.id}`}
              state={{ destinationName }}
              className={`guide-card${g.available === false ? ' guide-card--busy' : ''}`}
            >
              <img src={g.imageUrl} alt={g.name} />
              {g.available === false && (
                <span className="guide-card__busy">{t('guides.onTour')}</span>
              )}
              <section className="guide-card__body">
                <div className="guide-card__head">
                  <span className={`guide-card__tier guide-card__tier--${(g.tier || '').toLowerCase()}`}>
                    {tierLabel(g.tier)}
                  </span>
                  <strong className="guide-card__name">{g.name}</strong>
                </div>
                <p className="guide-card__languages">{g.languages}</p>
                <span className="guide-card__rating">
                  <IconStar size={14} /> {g.rating}
                </span>
                <span className="guide-card__price">
                  {formatVnd(g.pricePerDay)}
                  {t('common.perDay')}
                </span>
              </section>
            </Link>
          ))}
        </section>
      )}
    </section>
  );
}
