import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useI18n } from '../i18n/useI18n';
import { IconLeaf } from '../components/Icons';
import './ListPages.css';

export default function ExperiencesPage() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.getServices().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <section className="list-page vl-container">
      <header className="list-page__head">
        <h1>
          <IconLeaf className="vl-icon-leaf" /> {t('experiences.title')}
        </h1>
        <p>{t('experiences.subtitle')}</p>
      </header>
      <section className="service-grid">
        {items.map((s) => (
          <article key={s.id} className="service-card">
            <img src={s.iconUrl} alt="" width={48} height={48} />
            <strong>{s.name}</strong>
            <p>{s.description}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
