import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { stage1Images } from '../../pages/aboutStage1Assets';
import { useI18n } from '../../i18n/useI18n';
import './AboutProcessSection.css';

const STEP_CARDS = ['search', 'form', 'ai', 'guides', 'pay', 'trip'];

const GUIDE_MOCK = [
  { name: 'Minh Anh', place: 'Đà Nẵng', rate: '4.9', price: '500.000' },
  { name: 'Hoàng Nam', place: 'Hội An', rate: '4.8', price: '450.000' },
  { name: 'Thu Trang', place: 'Huế', rate: '4.9', price: '480.000' },
];

function StepMockup({ type }) {
  switch (type) {
    case 'search':
      return (
        <article className="proc-mock proc-mock--search">
          <img src={stage1Images.heroBg} alt="" />
          <div className="proc-mock__search-bar">
            <span>Bạn muốn đi đâu?</span>
            <button type="button">Tìm</button>
          </div>
        </article>
      );
    case 'form':
      return (
        <article className="proc-mock proc-mock--form">
          <label>
            <span>Điểm đến</span>
            <strong>Đà Nẵng</strong>
          </label>
          <label>
            <span>Thời gian</span>
            <strong>3 ngày 2 đêm</strong>
          </label>
          <label>
            <span>Sở thích</span>
            <strong>Ẩm thực, Văn hóa, Biển</strong>
          </label>
          <label>
            <span>Ngân sách</span>
            <strong>3.000.000 – 5.000.000 VND</strong>
          </label>
          <label>
            <span>Số người</span>
            <strong>2 người</strong>
          </label>
          <Link to="/ai-planner" className="proc-mock__btn">
            Gửi cho AI
          </Link>
        </article>
      );
    case 'ai':
      return (
        <article className="proc-mock proc-mock--ai">
          <nav className="proc-mock__tabs">
            <span className="active">Tổng quan</span>
            <span>Lịch trình</span>
          </nav>
          <ul>
            <li><strong>Ngày 1:</strong> Sơn Trà · Biển Mỹ Khê</li>
            <li><strong>Ngày 2:</strong> Phố cổ Hội An</li>
            <li><strong>Ngày 3:</strong> Bà Nà Hills</li>
          </ul>
          <p className="proc-mock__price">Ước tính: 4.250.000 VND</p>
          <div className="proc-mock__actions">
            <button type="button">Lưu lịch trình</button>
            <button type="button" className="primary">
              Chỉnh sửa
            </button>
          </div>
        </article>
      );
    case 'guides':
      return (
        <article className="proc-mock proc-mock--guides">
          {GUIDE_MOCK.map((g) => (
            <div key={g.name} className="proc-mock__guide">
              <span className="proc-mock__avatar" />
              <div>
                <strong>{g.name}</strong>
                <span>{g.place} · ★ {g.rate}</span>
                <span className="proc-mock__guide-price">{g.price} VND/ngày</span>
              </div>
            </div>
          ))}
          <Link to="/guides" className="proc-mock__link">
            Xem tất cả hướng dẫn viên
          </Link>
        </article>
      );
    case 'pay':
      return (
        <article className="proc-mock proc-mock--pay">
          <p>
            <span>Lịch trình</span>
            <strong>4.250.000 VND</strong>
          </p>
          <p>
            <span>Hướng dẫn viên</span>
            <strong>500.000 VND</strong>
          </p>
          <p className="proc-mock__total">
            <span>Tổng cộng</span>
            <strong>4.750.000 VND</strong>
          </p>
          <div className="proc-mock__pay-methods">
            <label>
              <input type="radio" name="pay" readOnly checked /> Thẻ nội địa / quốc tế
            </label>
            <label>
              <input type="radio" name="pay" readOnly /> Ví điện tử
            </label>
            <label>
              <input type="radio" name="pay" readOnly /> Chuyển khoản
            </label>
          </div>
          <button type="button" className="proc-mock__btn">
            Thanh toán ngay
          </button>
        </article>
      );
    case 'trip':
      return (
        <article className="proc-mock proc-mock--trip">
          <header>Chuyến đi của tôi</header>
          <div className="proc-mock__trip-card">
            <strong>Đà Nẵng · 3 ngày 2 đêm</strong>
            <span>HDV: Minh Anh</span>
            <div className="proc-mock__trip-actions">
              <button type="button">Nhắn tin</button>
              <button type="button" className="primary">
                Gọi điện
              </button>
            </div>
          </div>
          <ul>
            <li>Chi tiết lịch trình</li>
            <li>Thông tin dịch vụ</li>
            <li>Ghi chú chuyến đi</li>
          </ul>
        </article>
      );
    default:
      return null;
  }
}

export default function AboutProcessSection() {
  const { t, lang } = useI18n();
  const steps = useMemo(() => {
    const items = t('process.steps');
    if (!Array.isArray(items)) return [];
    return items.map((step, i) => ({
      num: i + 1,
      title: step.title,
      desc: step.desc,
      card: STEP_CARDS[i],
    }));
  }, [t, lang]);

  return (
    <section className="about-process vl-container">
      <header className="about-process__head">
        <h2>{t('process.title')}</h2>
        <p>{t('process.subtitle')}</p>
      </header>

      <div className="about-process__track">
        {steps.map((step, i) => (
          <article key={step.num} className="about-process__step">
            <span className="about-process__num">{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
            <StepMockup type={step.card} />
            {i < steps.length - 1 && <span className="about-process__arrow" aria-hidden />}
          </article>
        ))}
      </div>

      <footer className="about-process__cta">
        <Link to="/ai-planner" className="vl-btn vl-btn--primary vl-btn--lg">
          {t('process.startAi')}
        </Link>
        <Link to="/guides" className="vl-btn vl-btn--outline vl-btn--lg">
          {t('process.viewGuides')}
        </Link>
      </footer>
    </section>
  );
}
