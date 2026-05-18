import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/useI18n';
import './AuthPages.css';

export default function RegisterPage() {
  const { t } = useI18n();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(fullName.trim(), email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      if (err.code === 'EMAIL_ALREADY_EXISTS') {
        setError(t('auth.emailExists'));
      } else {
        setError(err.message || t('auth.genericError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <article className="auth-card">
        <h1>{t('auth.registerTitle')}</h1>
        <p className="auth-card__sub">{t('auth.registerSub')}</p>
        <form onSubmit={handleSubmit}>
          {error && <p className="auth-card__error" role="alert">{error}</p>}
          <label htmlFor="reg-name">{t('auth.fullName')}</label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <label htmlFor="reg-email">{t('auth.email')}</label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="reg-password">{t('auth.password')}</label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="vl-btn vl-btn--primary auth-card__submit"
            disabled={submitting}
          >
            {submitting ? t('common.loading') : t('auth.register')}
          </button>
        </form>
        <p className="auth-card__footer">
          {t('auth.hasAccount')}{' '}
          <Link to="/login">{t('auth.login')}</Link>
        </p>
      </article>
    </div>
  );
}
