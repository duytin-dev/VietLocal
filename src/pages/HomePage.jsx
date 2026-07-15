import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { getDestinationImage } from '../data/destinationImages';
import { resolveBlogCover } from '../data/blogCoverImages';
import { useI18n } from '../i18n/useI18n';
import FavoriteButton from '../components/FavoriteButton';
import { IconSparkle, IconLeaf, IconArrowRight, IconStar } from '../components/Icons';
import './HomePage.css';
import '../components/FavoriteButton.css';

const HERO_IMG =
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80';

const FOOD_FALLBACK = [
  { title: 'Phở Hà Nội', place: 'Hà Nội', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', rating: 4.9 },
  { title: 'Bún chả', place: 'Hà Nội', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', rating: 4.8 },
  { title: 'Cao lầu', place: 'Hội An', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', rating: 4.9 },
  { title: 'Bánh xèo', place: 'Miền Trung', image: 'https://images.unsplash.com/photo-1604908176997-125f29cc4c3c?w=400&q=80', rating: 4.7 },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { t, translateRegion, lang } = useI18n();
  const [destinations, setDestinations] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ where: '', days: '3', people: '2', budget: '' });

  const aiPrompts = useMemo(
    () => [t('home.aiPrompt1'), t('home.aiPrompt2'), t('home.aiPrompt3')],
    [t, lang],
  );

  const heroFeatures = useMemo(
    () => [t('home.featAi'), t('home.featLocal'), t('home.featGuide'), t('home.featSupport')],
    [t, lang],
  );

  const whyItems = useMemo(
    () => [
      { title: t('home.why1Title'), desc: t('home.why1Desc') },
      { title: t('home.why2Title'), desc: t('home.why2Desc') },
      { title: t('home.why3Title'), desc: t('home.why3Desc') },
      { title: t('home.why4Title'), desc: t('home.why4Desc') },
      { title: t('home.why5Title'), desc: t('home.why5Desc') },
    ],
    [t, lang],
  );

  useEffect(() => {
    Promise.all([api.getDestinations(0, 20), api.getBlogs(0, 8)])
      .then(([dest, blogPage]) => {
        const featured = dest.content.filter((d) => d.featured);
        setDestinations(featured.length ? featured : dest.content.slice(0, 6));
        setBlogs(blogPage.content);
      })
      .catch(() => {
        setDestinations([]);
        setBlogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.where.trim();
    if (q) navigate(`/destinations?q=${encodeURIComponent(q)}`);
    else navigate('/destinations');
  };

  const foodItems = blogs.length
    ? blogs.slice(0, 4).map((b) => ({
        title: b.title,
        place: b.destinationName || t('common.vietnam'),
        image: resolveBlogCover(b),
        rating: 4.8,
        slug: b.slug,
      }))
    : FOOD_FALLBACK;

  return (
    <div className="home">
      <section className="home-hero">
        <img src={HERO_IMG} alt="" className="home-hero__bg" />
        <div className="home-hero__overlay" />
        <div className="vl-container home-hero__content">
          <div className="home-hero__left">
            <h1>
              {t('home.heroTitle1')}
              <span>{t('home.heroTitle2')}</span>
            </h1>
            <p>{t('home.heroDesc')}</p>
            <div className="home-hero__features">
              {heroFeatures.map((label) => (
                <div key={label} className="home-hero__feat">
                  <span className="home-hero__feat-icon" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="home-hero__ai-card">
            <div className="home-hero__ai-head">
              <IconSparkle />
              <div>
                <strong>{t('home.aiCardTitle')}</strong>
                <p>{t('home.aiCardDesc')}</p>
              </div>
            </div>
            <div className="home-hero__prompts">
              {aiPrompts.map((text) => (
                <button
                  key={text}
                  type="button"
                  className="home-hero__prompt"
                  onClick={() => navigate('/ai-planner', { state: { message: text } })}
                >
                  {text}
                </button>
              ))}
            </div>
            <Link to="/ai-planner" className="vl-btn vl-btn--primary vl-btn--block vl-btn--lg">
              {t('home.startChat')}
            </Link>
          </div>
        </div>
        <form className="home-search vl-container" onSubmit={handleSearch}>
          <div className="home-search__field">
            <label>{t('home.whereLabel')}</label>
            <input
              placeholder={t('home.wherePlaceholder')}
              value={search.where}
              onChange={(e) => setSearch((s) => ({ ...s, where: e.target.value }))}
            />
          </div>
          <div className="home-search__field">
            <label>{t('home.datesLabel')}</label>
            <input placeholder={t('home.datesPlaceholder')} readOnly value={`${search.days} ${t('common.days')}`} />
          </div>
          <div className="home-search__field">
            <label>{t('home.peopleLabel')}</label>
            <input
              placeholder={t('home.peoplePlaceholder')}
              value={`${search.people} ${t('common.people')}`}
              readOnly
            />
          </div>
          <div className="home-search__field">
            <label>{t('home.budgetLabel')}</label>
            <input
              placeholder={t('home.budgetPlaceholder')}
              value={search.budget}
              onChange={(e) => setSearch((s) => ({ ...s, budget: e.target.value }))}
            />
          </div>
          <button type="submit" className="home-search__btn">
            {t('common.search')}
          </button>
        </form>
      </section>

      <section className="vl-page-section vl-container">
        <div className="vl-section-head">
          <div>
            <h2>
              <IconLeaf className="vl-icon-leaf" /> {t('home.destTitle')}
            </h2>
            <p>{t('home.destSubtitle')}</p>
          </div>
          <Link to="/destinations" className="vl-link-more">
            {t('common.viewAll')} <IconArrowRight />
          </Link>
        </div>
        {loading ? (
          <p className="vl-loading">{t('common.loading')}</p>
        ) : (
          <div className="home-dest-grid">
            {destinations.map((d, i) => (
              <article key={d.id} className="home-dest-card">
                <FavoriteButton destination={d} className="home-dest-card__fav" />
                <Link to={`/destinations/${d.slug}`} className="home-dest-card__link">
                  {i < 3 && <span className="home-dest-card__hot">{t('common.hot')}</span>}
                  <img src={getDestinationImage(d.slug, d.imageUrl)} alt={d.name} loading="lazy" />
                  <div className="home-dest-card__info">
                    <strong>{d.name}</strong>
                    <span>{translateRegion(d.region)}</span>
                    <span className="home-dest-card__rating">
                      <IconStar size={12} /> 4.8 <small>({120 + i * 50})</small>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="vl-page-section vl-page-section--soft">
        <div className="vl-container">
          <div className="vl-section-head">
            <div>
              <h2>
                <IconLeaf className="vl-icon-leaf" /> {t('home.foodTitle')}
              </h2>
              <p>{t('home.foodSubtitle')}</p>
            </div>
            <Link to="/cuisine" className="vl-link-more">
              {t('common.viewAll')} <IconArrowRight />
            </Link>
          </div>
          <div className="home-food-grid">
            {foodItems.map((item) => (
              <Link
                key={item.slug || item.title}
                to={item.slug ? `/blog/${item.slug}` : '/cuisine'}
                className="home-food-card"
              >
                <div className="home-food-card__img">
                  <img src={item.image} alt={item.title} />
                  <span className="home-food-card__rating">
                    <IconStar size={12} /> {item.rating}
                  </span>
                </div>
                <strong>{item.title}</strong>
                <span>{item.place}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-why vl-container">
        <h2>{t('home.whyTitle')}</h2>
        <div className="home-why__grid">
          {whyItems.map((f) => (
            <div key={f.title} className="home-why__item">
              <span className="home-why__icon" />
              <strong>{f.title}</strong>
              <p>{f.desc}</p>
            </div>
          ))}
          <img
            className="home-why__img"
            src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80"
            alt=""
          />
        </div>
      </section>
    </div>
  );
}
