import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/useI18n';
import './AuthPages.css';

export default function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      if (err.code === 'INVALID_CREDENTIALS') {
        setError(t('auth.invalidCredentials'));
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
        <h1>{t('auth.loginTitle')}</h1>
        <p className="auth-card__sub">{t('auth.loginSub')}</p>
        <form onSubmit={handleSubmit}>
          {error && <p className="auth-card__error" role="alert">{error}</p>}
          <label htmlFor="login-email">{t('auth.email')}</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="login-password">{t('auth.password')}</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
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
            {submitting ? t('common.loading') : t('auth.login')}
          </button>
        </form>
        <p className="auth-card__footer">
          {t('auth.noAccount')}{' '}
          <Link to="/register">{t('auth.register')}</Link>
        </p>
      </article>
    </div>
  );
}
