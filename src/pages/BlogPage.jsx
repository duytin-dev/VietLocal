import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useI18n } from '../i18n/useI18n';
import { IconLeaf } from '../components/Icons';
import './ListPages.css';

export default function BlogPage() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBlogs(0, 20)
      .then((p) => setItems(p.content))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="list-page vl-container">
      <header className="list-page__head">
        <h1>
          <IconLeaf className="vl-icon-leaf" /> {t('blog.title')}
        </h1>
        <p>{t('blog.subtitle')}</p>
      </header>
      {loading ? (
        <p className="vl-loading">{t('common.loading')}</p>
      ) : (
        <section className="list-grid list-grid--blog">
          {items.map((b) => (
            <Link key={b.id} to={`/blog/${b.slug}`} className="blog-card">
              <img src={b.coverImageUrl} alt={b.title} />
              <section>
                <strong>{b.title}</strong>
                <p>{b.excerpt}</p>
                {b.destinationName && <span>{b.destinationName}</span>}
              </section>
            </Link>
          ))}
        </section>
      )}
    </section>
  );
}
