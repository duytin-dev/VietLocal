import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatVnd } from '../utils/format';
import { useI18n } from '../i18n/useI18n';
import { IconSparkle, IconRobot, IconSend } from '../components/Icons';
import './AiPlannerPage.css';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1501785888041-af3ef245b9d2?auto=format&fit=crop&w=400&q=80';

function countDays(itinerary) {
  const dayMatches = itinerary?.match(/(?:Ngày|Day)\s*\d+/gi) || [];
  return dayMatches.length || 3;
}

function buildPlanFromResponse(res) {
  const itinerary = res.suggestedItinerary || '';
  return {
    destinationName: res.detectedDestinationName || '',
    destinationId: res.detectedDestinationId || null,
    destinationImageUrl: res.detectedDestinationImageUrl || '',
    itinerary,
    days: countDays(itinerary),
    guideIds: res.suggestedGuideIds || [],
    selectedGuideId: res.suggestedGuideIds?.[0] ?? null,
    activeTab: 0,
  };
}

function PlannerTripCard({
  plan,
  guides,
  tabs,
  t,
  interactive,
  onTabChange,
  onSelectGuide,
  onBook,
}) {
  const selectedGuide =
    guides.find((g) => g.id === plan.selectedGuideId) || guides[0] || null;
  const imageUrl = plan.destinationImageUrl || FALLBACK_IMAGE;

  return (
    <section className={`planner-trip-card${interactive ? ' planner-trip-card--active' : ''}`}>
      {plan.destinationName && (
        <span className="planner-trip-card__destination">
          {t('planner.destinationTag', { name: plan.destinationName })}
        </span>
      )}
      {interactive && (
        <p className="planner-trip-card__selected">{t('planner.tripAutoSelected')}</p>
      )}
      <nav className="planner-tabs">
        {Array.isArray(tabs) &&
          tabs.map((tabLabel, i) => (
            <button
              key={tabLabel}
              type="button"
              className={i === plan.activeTab ? 'active' : ''}
              onClick={() => interactive && onTabChange(i)}
              disabled={!interactive}
            >
              {tabLabel}
            </button>
          ))}
      </nav>
      {plan.activeTab === 0 ? (
        <section className="planner-overview">
          <img src={imageUrl} alt="" />
          <section>
            <h3>
              {plan.destinationName
                ? t('planner.overviewFor', { destination: plan.destinationName })
                : t('planner.overviewTitle')}
            </h3>
            <ul>
              <li>{t('planner.duration', { days: plan.days })}</li>
              <li>{t('planner.themes')}</li>
            </ul>
            <p className="planner-budget">
              {t('planner.budgetHint', {
                amount: selectedGuide
                  ? formatVnd(selectedGuide.pricePerDay * plan.days)
                  : '—',
              })}
            </p>
          </section>
        </section>
      ) : (
        <pre className="planner-itinerary-text">{plan.itinerary}</pre>
      )}
      {interactive && guides.length > 0 && (
        <section className="planner-trip-card__guides">
          <h4>{t('planner.suggestedGuides')}</h4>
          <div className="planner-trip-card__guide-picks">
            {guides.map((g) => (
              <button
                key={g.id}
                type="button"
                className={
                  g.id === (plan.selectedGuideId ?? guides[0]?.id)
                    ? 'planner-guide-pick planner-guide-pick--selected'
                    : 'planner-guide-pick'
                }
                onClick={() => onSelectGuide(g.id)}
              >
                <img src={g.imageUrl} alt="" />
                <span>
                  <strong>{g.name}</strong>
                  <small>
                    {formatVnd(g.pricePerDay)}
                    {t('common.perDay')}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      {interactive && selectedGuide && (
        <button type="button" className="vl-btn vl-btn--primary vl-btn--block" onClick={onBook}>
          {t('planner.viewBook')}
        </button>
      )}
    </section>
  );
}

export default function AiPlannerPage() {
  const { t, lang } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const sidebar = useMemo(
    () => [
      { to: '/ai-planner', label: t('planner.sidebarTitle'), active: true },
      { to: '/guides', label: t('nav.guides') },
      { to: '/destinations', label: t('nav.destinations') },
      { to: '/blog', label: t('nav.blog') },
    ],
    [t, lang],
  );

  const tabs = useMemo(() => t('planner.tabs'), [t, lang]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const initial = location.state?.message;
    if (initial) {
      sendMessage(initial);
      window.history.replaceState({}, '');
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePlan]);

  useEffect(() => {
    if (!activePlan?.guideIds?.length) {
      setGuides([]);
      return;
    }
    Promise.all(activePlan.guideIds.map((id) => api.getGuide(id).catch(() => null))).then((g) => {
      const available = g.filter((x) => x && x.available !== false);
      setGuides(available);
      if (available.length > 0) {
        setActivePlan((p) =>
          p
            ? {
                ...p,
                selectedGuideId: available.some((x) => x.id === p.selectedGuideId)
                  ? p.selectedGuideId
                  : available[0].id,
              }
            : p,
        );
      }
    });
  }, [activePlan?.guideIds]);

  async function sendMessage(text) {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await api.aiChat({ sessionId, message: msg });
      const plan = buildPlanFromResponse(res);
      setSessionId(res.sessionId);
      setActivePlan(plan);
      setAiProvider(res.provider || 'stub');
      setMessages((m) => [...m, { role: 'ai', text: res.reply, plan }]);
    } catch {
      setMessages((m) => [...m, { role: 'ai', text: t('planner.error') }]);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const updateActivePlan = (patch) => {
    setActivePlan((p) => {
      if (!p) return p;
      const next = { ...p, ...patch };
      setMessages((msgs) => {
        const last = msgs.length - 1;
        if (last < 0 || msgs[last].role !== 'ai') return msgs;
        return msgs.map((m, i) => (i === last ? { ...m, plan: next } : m));
      });
      return next;
    });
  };

  const selectedGuide =
    guides.find((g) => g.id === activePlan?.selectedGuideId) || guides[0] || null;

  const bookTrip = () => {
    if (!selectedGuide) return;
    navigate(`/book/${selectedGuide.id}`, {
      state: {
        destinationName: activePlan?.destinationName || '',
        itinerarySummary: activePlan?.itinerary || '',
        estimatedDays: activePlan?.days || 3,
      },
    });
  };

  const lastAiIndex = messages.reduce((acc, m, i) => (m.role === 'ai' ? i : acc), -1);

  return (
    <article className="planner">
      <aside className="planner-sidebar">
        <nav>
          {sidebar.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={
                item.active
                  ? 'planner-sidebar__link planner-sidebar__link--active'
                  : 'planner-sidebar__link'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <section className="planner-promo">
          <p>{t('planner.promo')}</p>
          <Link to="/destinations" className="vl-btn vl-btn--primary vl-btn--sm">
            {t('planner.exploreNow')}
          </Link>
        </section>
      </aside>

      <section className="planner-main">
        <header className="planner-main__head">
          <h1>
            <IconSparkle /> AI Planner
          </h1>
          <p>{t('planner.headDesc')}</p>
        </header>

        {aiProvider === 'stub' && (
          <p className="planner-demo-banner" role="status">
            {t('planner.demoMode')}
          </p>
        )}

        <section className="planner-chat">
          {messages.length === 0 && (
            <p className="planner-chat__empty">{t('planner.chatEmpty')}</p>
          )}
          {messages.map((m, i) => (
            <Fragment key={i}>
              <article className={`planner-bubble planner-bubble--${m.role}`}>
                {m.role === 'ai' && (
                  <span className="planner-bubble__avatar">
                    <IconRobot />
                  </span>
                )}
                <p>{m.text}</p>
              </article>
              {m.plan && (
                <PlannerTripCard
                  plan={i === lastAiIndex ? activePlan || m.plan : m.plan}
                  guides={i === lastAiIndex ? guides : []}
                  tabs={tabs}
                  t={t}
                  interactive={i === lastAiIndex}
                  onTabChange={(tab) => updateActivePlan({ activeTab: tab })}
                  onSelectGuide={(id) => updateActivePlan({ selectedGuideId: id })}
                  onBook={bookTrip}
                />
              )}
            </Fragment>
          ))}
          {loading && <p className="planner-chat__typing">{t('planner.thinking')}</p>}
          <span ref={bottomRef} />
        </section>

        <form className="planner-input" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('planner.inputPlaceholder')}
          />
          <button type="submit" className="vl-btn vl-btn--primary" disabled={loading}>
            <IconSend />
          </button>
        </form>
      </section>

      <aside className="planner-summary">
        <header>
          <h2>{t('planner.summaryTitle')}</h2>
          <button type="button" className="vl-btn vl-btn--outline vl-btn--sm">
            {t('planner.saveTrip')}
          </button>
        </header>
        {activePlan ? (
          <>
            {activePlan.destinationName && (
              <span className="planner-summary__destination">
                {t('planner.destinationTag', { name: activePlan.destinationName })}
              </span>
            )}
            <section className="planner-summary__card">
              <strong>{t('planner.suggestedTrip')}</strong>
              <span>
                {activePlan.days} {t('planner.dayUnit')}
              </span>
            </section>
            <section className="planner-summary__days">
              {activePlan.itinerary.split('\n').filter(Boolean).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </section>
            {guides.length > 0 && (
              <section className="planner-summary__guides">
                <h3>{t('planner.suggestedGuides')}</h3>
                {guides.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={
                      g.id === activePlan.selectedGuideId
                        ? 'planner-guide-mini planner-guide-mini--selected'
                        : 'planner-guide-mini'
                    }
                    onClick={() => updateActivePlan({ selectedGuideId: g.id })}
                  >
                    <img src={g.imageUrl} alt="" />
                    <span>
                      <strong>{g.name}</strong>
                      <small>
                        {formatVnd(g.pricePerDay)}
                        {t('common.perDay')}
                      </small>
                    </span>
                  </button>
                ))}
              </section>
            )}
            <button
              type="button"
              className="vl-btn vl-btn--primary vl-btn--block"
              onClick={bookTrip}
              disabled={!selectedGuide}
            >
              {t('planner.viewBook')}
            </button>
          </>
        ) : (
          <p className="planner-summary__empty">{t('planner.empty')}</p>
        )}
      </aside>
    </article>
  );
}
