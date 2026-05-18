import { Link, NavLink } from 'react-router-dom';
import { IconPin } from './Icons';
import FavoritesBell from './FavoritesBell';
import NotificationBell from './NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/useI18n';
import './Header.css';

export default function Header({ variant = 'default' }) {
  const { t } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();

  const nav = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/destinations', label: t('nav.destinations') },
    { to: '/experiences', label: t('nav.experiences') },
    { to: '/cuisine', label: t('nav.cuisine') },
    { to: '/guides', label: t('nav.guides') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/about', label: t('nav.about') },
  ];

  return (
    <header className={`vl-header ${variant === 'planner' ? 'vl-header--planner' : ''}`}>
      <div className="vl-header__inner">
        <Link to="/" className="vl-logo">
          <span className="vl-logo__icon">
            <IconPin size={28} />
          </span>
          <span className="vl-logo__text">
            <strong>VietLocal</strong>
            <small>{t('common.tagline')}</small>
          </span>
        </Link>

        <nav className="vl-nav" aria-label={t('nav.mainAria')}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `vl-nav__link${isActive ? ' vl-nav__link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="vl-header__actions">
          <LanguageSwitcher />
          <FavoritesBell />
          <NotificationBell />
          {isAuthenticated ? (
            <>
              <span className="vl-header__user" title={user.email}>
                {user.fullName}
              </span>
              <button type="button" className="vl-btn vl-btn--outline vl-btn--sm" onClick={logout}>
                {t('auth.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="vl-btn vl-btn--outline vl-btn--sm">
                {t('auth.login')}
              </Link>
              <Link to="/register" className="vl-btn vl-btn--primary vl-btn--sm">
                {t('auth.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
