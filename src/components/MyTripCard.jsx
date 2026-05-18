import { useI18n } from '../i18n/useI18n';
import './MyTripCard.css';

export default function MyTripCard({
  tripTitle,
  guideName,
  destinationName,
  days,
  onMessage,
  onCall,
  showActions = true,
}) {
  const { t } = useI18n();

  const durationLabel =
    destinationName && days
      ? t('myTrip.durationLabel', { destination: destinationName, days })
      : null;

  return (
    <article className="my-trip-card">
      <strong className="my-trip-card__title">{tripTitle}</strong>
      {durationLabel && <p className="my-trip-card__duration">{durationLabel}</p>}
      {guideName && (
        <p className="my-trip-card__guide">{t('myTrip.guideLabel', { name: guideName })}</p>
      )}
      {showActions && (
        <div className="my-trip-card__actions">
          <button type="button" className="my-trip-card__btn my-trip-card__btn--outline" onClick={onMessage}>
            {t('myTrip.message')}
          </button>
          <button type="button" className="my-trip-card__btn my-trip-card__btn--primary" onClick={onCall}>
            {t('myTrip.call')}
          </button>
        </div>
      )}
    </article>
  );
}

export function MyTripLinks() {
  const { t } = useI18n();
  const items = t('myTrip.links');
  if (!Array.isArray(items)) return null;
  return (
    <ul className="my-trip-links">
      {items.map((label) => (
        <li key={label}>{label}</li>
      ))}
    </ul>
  );
}
