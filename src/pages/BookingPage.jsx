import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import MyTripCard, { MyTripLinks } from '../components/MyTripCard';
import { formatVnd } from '../utils/format';
import { useI18n } from '../i18n/useI18n';
import './BookingPage.css';

export default function BookingPage() {
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const { guideId } = useParams();
  const location = useLocation();
  const initialDestination = location.state?.destinationName || '';
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    itinerarySummary: '',
    customerNotes: '',
    estimatedDays: 3,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedTrip = useMemo(
    () => trips.find((trip) => String(trip.id) === String(selectedTripId)),
    [trips, selectedTripId],
  );

  const tripsByDestination = useMemo(() => {
    const groups = new Map();
    for (const trip of trips) {
      const key = trip.destinationName;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(trip);
    }
    return Array.from(groups.entries()).map(([destinationName, items]) => ({
      destinationName,
      items,
    }));
  }, [trips]);

  const tripTitle = selectedTrip?.title || '';

  useEffect(() => {
    api.getGuide(guideId).then(setGuide).catch(() => setGuide(null));
    api
      .getDestinationTrips()
      .then(setTrips)
      .catch(() => setTrips([]));
  }, [guideId]);

  useEffect(() => {
    if (!trips.length || selectedTripId) return;
    const match =
      trips.find((trip) => trip.destinationName === initialDestination) || trips[0];
    if (match) {
      setSelectedTripId(String(match.id));
      setForm((f) => ({ ...f, estimatedDays: match.durationDays || f.estimatedDays }));
    }
  }, [trips, initialDestination, selectedTripId]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((f) => ({
        ...f,
        customerName: user.fullName || f.customerName,
        email: user.email || f.email,
      }));
    }
  }, [isAuthenticated, user]);

  const total = guide ? Number(guide.pricePerDay) * form.estimatedDays : 0;

  const handleTripChange = (tripId) => {
    setSelectedTripId(tripId);
    const trip = trips.find((item) => String(item.id) === String(tripId));
    if (trip?.durationDays) {
      setForm((f) => ({ ...f, estimatedDays: trip.durationDays }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTrip) {
      setError(t('booking.tripRequired'));
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const booking = await api.createBooking({
        ...form,
        guideId: Number(guideId),
        estimatedDays: Number(form.estimatedDays),
        destinationName: selectedTrip.destinationName,
        tripTitle,
      });
      window.dispatchEvent(new CustomEvent('vivudi:bookings-updated'));
      navigate(`/bookings/${booking.id}/pay`);
    } catch (err) {
      if (err.code === 'GUIDE_NOT_AVAILABLE') {
        setError(t('guides.unavailableBooking'));
      } else {
        setError(err.message || t('booking.failed'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!guide) return <p className="vl-loading vl-container">{t('common.loading')}</p>;

  if (guide.available === false) {
    return (
      <article className="booking-page vl-container">
        <h1>{t('guides.unavailableDetail')}</h1>
        <p className="vl-error">{t('guides.unavailableBooking')}</p>
        <Link to="/guides" className="vl-btn vl-btn--outline">
          {t('guides.backToList')}
        </Link>
      </article>
    );
  }

  return (
    <article className="booking-page vl-container">
      <h1 className="booking-page__title">{t('booking.title', { name: guide.name })}</h1>

      <section className="my-trip-section">
        <h2 className="my-trip-section__title">{t('myTrip.sectionTitle')}</h2>

        <label className="my-trip-section__field">
          {t('booking.selectTrip')}
          <select
            required
            value={selectedTripId}
            onChange={(e) => handleTripChange(e.target.value)}
            disabled={!trips.length}
          >
            <option value="">{t('booking.selectTripPlaceholder')}</option>
            {tripsByDestination.map(({ destinationName, items }) => (
              <optgroup key={destinationName} label={destinationName}>
                {items.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        {selectedTrip && (
          <>
            <MyTripCard
              tripTitle={tripTitle}
              guideName={guide.name}
              destinationName={selectedTrip.destinationName}
              days={form.estimatedDays}
              onMessage={() => navigate(`/guides/${guide.id}`)}
              onCall={() => navigate(`/guides/${guide.id}`)}
            />
            {selectedTrip.summary && (
              <p className="booking-page__trip-summary">{selectedTrip.summary}</p>
            )}
            <MyTripLinks />
          </>
        )}
      </section>

      <p className="booking-page__price">
        {t('booking.estimate', {
          total: formatVnd(total),
          days: form.estimatedDays,
          perDay: formatVnd(guide.pricePerDay),
        })}
      </p>

      <form className="booking-form" onSubmit={handleSubmit}>
        <label>
          {t('booking.name')}
          <input
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          />
        </label>
        <label>
          {t('booking.email')}
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          {t('booking.phone')}
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        <label>
          {t('booking.days')}
          <input
            type="number"
            min={1}
            max={30}
            required
            value={form.estimatedDays}
            onChange={(e) => setForm({ ...form, estimatedDays: e.target.value })}
          />
        </label>
        <label>
          {t('booking.itinerary')}
          <textarea
            rows={4}
            placeholder={t('booking.itineraryPlaceholder')}
            value={form.itinerarySummary}
            onChange={(e) => setForm({ ...form, itinerarySummary: e.target.value })}
          />
        </label>
        <label>
          {t('booking.notes')}
          <textarea
            rows={2}
            value={form.customerNotes}
            onChange={(e) => setForm({ ...form, customerNotes: e.target.value })}
          />
        </label>
        {error && <p className="vl-error">{error}</p>}
        <button
          type="submit"
          className="vl-btn vl-btn--primary vl-btn--lg booking-page__submit"
          disabled={submitting || !selectedTripId}
        >
          {submitting ? t('booking.submitting') : t('booking.submit')}
        </button>
      </form>
    </article>
  );
}
