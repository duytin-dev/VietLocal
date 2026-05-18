import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/useI18n';
import { formatVnd } from '../utils/format';
import { IconBell } from './Icons';
import './NotificationBell.css';

export default function NotificationBell() {
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dismissingId, setDismissingId] = useState(null);
  const rootRef = useRef(null);

  const handleDismiss = async (bookingId) => {
    setDismissingId(bookingId);
    try {
      await api.dismissBookingNotification(bookingId);
      setItems((list) => list.filter((b) => b.bookingId !== bookingId));
    } catch {
      load();
    } finally {
      setDismissingId(null);
    }
  };

  const load = useCallback(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    api
      .getMyBookings()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load, user?.id]);

  useEffect(() => {
    const onUpdate = () => load();
    window.addEventListener('vietlocal:bookings-updated', onUpdate);
    return () => window.removeEventListener('vietlocal:bookings-updated', onUpdate);
  }, [load]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!isAuthenticated) return null;

  const unpaidCount = items.filter((b) => b.paymentStatus !== 'PAID').length;

  const paymentLabel = (status) =>
    status === 'PAID' ? t('notifications.paid') : t('notifications.unpaid');

  return (
    <div className="vl-notify" ref={rootRef}>
      <button
        type="button"
        className="vl-header__icon-btn vl-notify__btn"
        aria-label={t('common.notifications')}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) load();
        }}
      >
        <IconBell />
        {unpaidCount > 0 && <span className="vl-notify__badge">{unpaidCount}</span>}
      </button>

      {open && (
        <div className="vl-notify__panel" role="dialog" aria-label={t('notifications.title')}>
          <header className="vl-notify__head">
            <p className="vl-notify__greeting">{t('notifications.hello', { name: user.fullName })}</p>
            <p className="vl-notify__sub">{t('notifications.title')}</p>
          </header>

          <div className="vl-notify__body">
            {loading && <p className="vl-notify__empty">{t('common.loading')}</p>}

            {!loading && items.length === 0 && (
              <p className="vl-notify__empty">{t('notifications.empty')}</p>
            )}

            {!loading &&
              items.map((b) => (
                <article key={b.bookingId} className="vl-notify__trip-block">
                  <div className="vl-notify__item-top">
                    <h3 className="vl-notify__trip">{b.tripName}</h3>
                    {b.paymentStatus === 'PAID' && (
                      <button
                        type="button"
                        className="vl-notify__dismiss"
                        aria-label={t('notifications.remove')}
                        disabled={dismissingId === b.bookingId}
                        onClick={() => handleDismiss(b.bookingId)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <p className="vl-notify__price">{formatVnd(b.totalAmount)}</p>
                  <p
                    className={`vl-notify__status vl-notify__status--${b.paymentStatus === 'PAID' ? 'paid' : 'pending'}`}
                  >
                    {paymentLabel(b.paymentStatus)}
                  </p>
                  {b.paymentStatus !== 'PAID' && (
                    <Link
                      to={`/bookings/${b.bookingId}/pay`}
                      className="vl-notify__pay-link"
                      onClick={() => setOpen(false)}
                    >
                      {t('notifications.payNow')}
                    </Link>
                  )}
                </article>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
