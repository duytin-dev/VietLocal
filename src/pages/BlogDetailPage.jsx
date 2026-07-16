import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { resolveBlogCover } from '../data/blogCoverImages';
import { useI18n } from '../i18n/useI18n';
import './ListPages.css';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { t } = useI18n();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .getBlog(slug)
      .then(setPost)
      .catch(() => {
        setPost(null);
        setError(true);
      });
  }, [slug]);

  if (error) return <p className="vl-error vl-container">{t('common.notFound')}</p>;
  if (!post) return <p className="vl-loading vl-container">{t('common.loading')}</p>;

  const paragraphs = (post.content || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="detail-page vl-container">
      <img src={resolveBlogCover(post)} alt="" className="detail-page__hero" />
      {post.destinationName && <span className="detail-page__region">{post.destinationName}</span>}
      <h1>{post.title}</h1>
      {post.excerpt && <p className="detail-page__excerpt">{post.excerpt}</p>}
      {paragraphs.length > 0 && (
        <section className="detail-page__body">
          <div className="detail-page__description">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
