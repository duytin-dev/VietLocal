import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import FavoritesBell from './FavoritesBell';
import NotificationBell from './NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/useI18n';
import './Header.css';

export default function Header({ variant = 'default' }) {
  const { t } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/destinations', label: t('nav.destinations') },
    { to: '/experiences', label: t('nav.experiences') },
    { to: '/cuisine', label: t('nav.cuisine') },
    { to: '/guides', label: t('nav.guides') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/about', label: t('nav.about') },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`vl-header ${variant === 'planner' ? 'vl-header--planner' : ''}`}>
      <div className="vl-header__inner">
        <Link to="/" className="vl-logo" aria-label="VivuDi" onClick={closeMenu}>
          <img src="/logo-vivudi.png" alt="VivuDi" className="vl-logo__img" />
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
              <button type="button" className="vl-btn vl-btn--outline vl-btn--sm vl-header__auth-btn" onClick={logout}>
                {t('auth.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="vl-btn vl-btn--outline vl-btn--sm vl-header__auth-btn">
                {t('auth.login')}
              </Link>
              <Link to="/register" className="vl-btn vl-btn--primary vl-btn--sm vl-header__auth-btn">
                {t('auth.register')}
              </Link>
            </>
          )}
          <button
            type="button"
            className={`vl-header__burger${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`vl-header__drawer${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="vl-header__drawer-nav" aria-label={t('nav.mainAria')}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `vl-header__drawer-link${isActive ? ' vl-header__drawer-link--active' : ''}`
              }
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="vl-header__drawer-auth">
          {isAuthenticated ? (
            <>
              <p className="vl-header__drawer-user">{user.fullName}</p>
              <button
                type="button"
                className="vl-btn vl-btn--outline"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                {t('auth.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="vl-btn vl-btn--outline" onClick={closeMenu}>
                {t('auth.login')}
              </Link>
              <Link to="/register" className="vl-btn vl-btn--primary" onClick={closeMenu}>
                {t('auth.register')}
              </Link>
            </>
          )}
        </div>
      </div>
      {menuOpen ? <button type="button" className="vl-header__backdrop" aria-label="Đóng menu" onClick={closeMenu} /> : null}
    </header>
  );
}
