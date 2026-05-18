import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useI18n } from '../i18n/useI18n';
import { formatVnd } from '../utils/format';

export default function PaymentPage() {
  const { t } = useI18n();
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [booking, setBooking] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  const load = () => {
    api.getPaymentQr(id).then((p) => {
      setPayment(p);
      if (p?.status === 'PAID') {
        window.dispatchEvent(new CustomEvent('vietlocal:bookings-updated'));
      }
    }).catch(() => setPayment(null));
    api.getBooking(id).then(setBooking).catch(() => setBooking(null));
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [id]);

  const handleDemoConfirm = async () => {
    setConfirming(true);
    setConfirmError('');
    try {
      await api.confirmPayment(id);
      load();
      window.dispatchEvent(new CustomEvent('vietlocal:bookings-updated'));
    } catch (err) {
      setConfirmError(err.message || t('payment.confirmFailed'));
    } finally {
      setConfirming(false);
    }
  };

  if (!payment) return <p className="vl-loading vl-container">{t('common.loading')}</p>;

  const paid = payment.status === 'PAID';
  const tripName =
    booking?.tripTitle ||
    (booking?.guideName
      ? t('notifications.tripWithGuide', { name: booking.guideName })
      : t('notifications.tripDefault'));

  return (
    <article className="payment-page vl-container">
      <h1>{t('payment.title')}</h1>
      {booking && (
        <p className="payment-page__trip">
          <strong>{tripName}</strong> · {booking.estimatedDays} {t('payment.days')}
        </p>
      )}
      <section className="payment-page__box">
        <p className="payment-page__amount">{formatVnd(payment.amount)}</p>
        <p>{t('payment.ref')}: <strong>{payment.transactionRef}</strong></p>
        <p>
          {t('payment.status')}:{' '}
          <strong className={paid ? 'payment-page__status--paid' : ''}>
            {paid ? t('notifications.paid') : t('notifications.unpaid')}
          </strong>
        </p>
        {!paid && payment.qrCodeUrl && (
          <img src={payment.qrCodeUrl} alt={t('payment.qrAlt')} className="payment-page__qr" />
        )}
        {paid ? (
          <p className="payment-page__success">{t('payment.success')}</p>
        ) : (
          <>
            <p className="payment-page__hint">{t('payment.hint')}</p>
            <button
              type="button"
              className="vl-btn vl-btn--primary payment-page__demo-btn"
              disabled={confirming}
              onClick={handleDemoConfirm}
            >
              {confirming ? t('common.loading') : t('payment.demoConfirm')}
            </button>
            {confirmError && <p className="vl-error">{confirmError}</p>}
          </>
        )}
      </section>
      <Link to="/" className="vl-btn vl-btn--outline">
        {t('payment.backHome')}
      </Link>
    </article>
  );
}
