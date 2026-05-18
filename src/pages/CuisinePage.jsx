import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useI18n } from '../i18n/useI18n';
import { IconLeaf, IconStar } from '../components/Icons';
import './ListPages.css';
import './HomePage.css';

export default function CuisinePage() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .getBlogs(0, 20)
      .then((p) => setItems(p.content))
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="list-page vl-container">
      <header className="list-page__head">
        <h1>
          <IconLeaf className="vl-icon-leaf" /> {t('cuisine.title')}
        </h1>
        <p>{t('cuisine.subtitle')}</p>
      </header>
      <section className="home-food-grid">
        {items.map((b) => (
          <Link key={b.id} to={`/blog/${b.slug}`} className="home-food-card">
            <section className="home-food-card__img">
              <img src={b.coverImageUrl} alt={b.title} />
              <span className="home-food-card__rating">
                <IconStar size={12} /> 4.8
              </span>
            </section>
            <strong>{b.title}</strong>
            <span>{b.destinationName || t('common.vietnam')}</span>
          </Link>
        ))}
      </section>
    </section>
  );
}
