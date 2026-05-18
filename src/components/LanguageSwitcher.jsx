import { useEffect, useRef, useState } from 'react';
import { IconGlobe, IconChevronDown } from './Icons';
import { useI18n } from '../i18n/useI18n';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const pick = (code) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div className="lang-switch" ref={rootRef}>
      <button
        type="button"
        className="vl-header__icon-btn lang-switch__btn"
        aria-label={t('lang.switchLabel')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <IconGlobe />
        <span>{lang === 'en' ? t('lang.en') : t('lang.vi')}</span>
        <IconChevronDown size={12} />
      </button>
      {open && (
        <ul className="lang-switch__menu" role="listbox">
          <li>
            <button
              type="button"
              role="option"
              aria-selected={lang === 'vi'}
              className={lang === 'vi' ? 'is-active' : ''}
              onClick={() => pick('vi')}
            >
              {t('lang.vi')} — Tiếng Việt
            </button>
          </li>
          <li>
            <button
              type="button"
              role="option"
              aria-selected={lang === 'en'}
              className={lang === 'en' ? 'is-active' : ''}
              onClick={() => pick('en')}
            >
              {t('lang.en')} — English
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
