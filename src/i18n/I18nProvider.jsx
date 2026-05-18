import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import vi from './locales/vi';
import en from './locales/en';

const STORAGE_KEY = 'vietlocal-lang';
const MESSAGES = { vi, en };

export const I18nContext = createContext(null);

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function interpolate(template, params) {
  if (!params || typeof template !== 'string') return template;
  return Object.entries(params).reduce(
    (str, [key, value]) => str.replaceAll(`{{${key}}}`, String(value)),
    template,
  );
}

export default function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' ? 'en' : 'vi';
  });

  const setLang = useCallback((next) => {
    const value = next === 'en' ? 'en' : 'vi';
    setLangState(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key, params) => {
      const value = getNested(MESSAGES[lang], key) ?? getNested(MESSAGES.vi, key);
      if (value == null) return key;
      if (typeof value === 'string') return interpolate(value, params);
      return value;
    },
    [lang],
  );

  const translateRegion = useCallback(
    (region) => {
      if (!region) return '';
      return MESSAGES[lang].regions?.[region] ?? region;
    },
    [lang],
  );

  const tierLabel = useCallback(
    (tier) => {
      if (!tier) return t('tier.all');
      return t(`tier.${tier}`) || tier;
    },
    [t],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, translateRegion, tierLabel }),
    [lang, setLang, t, translateRegion, tierLabel],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
