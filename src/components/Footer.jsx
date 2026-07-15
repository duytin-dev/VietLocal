import { Link } from 'react-router-dom';
import { IconPin } from './Icons';
import { useI18n } from '../i18n/useI18n';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="vl-footer">
      <div className="vl-container vl-footer__grid">
        <div className="vl-footer__brand">
          <span className="vl-logo__icon">
            <IconPin size={24} />
          </span>
          <div>
            <strong>VivuDi</strong>
            <p>{t('common.tagline')}</p>
          </div>
        </div>
        <div>
          <h4>{t('footer.explore')}</h4>
          <Link to="/destinations">{t('nav.destinations')}</Link>
          <Link to="/experiences">{t('nav.experiences')}</Link>
          <Link to="/guides">{t('nav.guides')}</Link>
        </div>
        <div>
          <h4>{t('footer.support')}</h4>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/process">{t('footer.process')}</Link>
          <Link to="/ai-planner">{t('footer.aiPlanner')}</Link>
        </div>
        <div>
          <h4>{t('footer.contact')}</h4>
          <p>hello@vivudi.vn</p>
          <p>1900 xxxx</p>
        </div>
      </div>
      <div className="vl-footer__copy">
        <div className="vl-container">
          © {year} VivuDi. {t('common.allRights')}
        </div>
      </div>
    </footer>
  );
}
