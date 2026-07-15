import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { resolveBlogCover } from '../data/blogCoverImages';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.getBlog(slug).then(setPost).catch(() => setPost(null));
  }, [slug]);

  if (!post) return <p className="vl-loading vl-container">Đang tải...</p>;

  return (
    <article className="detail-page vl-container">
      <img src={resolveBlogCover(post)} alt="" className="detail-page__hero" />
      {post.destinationName && <span className="detail-page__region">{post.destinationName}</span>}
      <h1>{post.title}</h1>
      <p className="detail-page__excerpt">{post.excerpt}</p>
      <section className="detail-page__body">
        <p>{post.content}</p>
      </section>
    </article>
  );
}
