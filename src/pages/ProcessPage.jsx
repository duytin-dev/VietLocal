import { Link } from 'react-router-dom';
import './ProcessPage.css';

const STEPS = [
  { num: 1, title: 'Tìm kiếm & truy cập VivuDi', desc: 'Khám phá điểm đến và dịch vụ.', visual: 'search' },
  { num: 2, title: 'Nhập thông tin & nhu cầu', desc: 'Điểm đến, thời gian, ngân sách.', visual: 'form' },
  { num: 3, title: 'AI đề xuất lịch trình', desc: 'Lịch trình cá nhân hóa theo ngày.', visual: 'ai' },
  { num: 4, title: 'Chọn hướng dẫn viên', desc: 'So sánh tier, rating, giá.', visual: 'guides' },
  { num: 5, title: 'Xác nhận & thanh toán', desc: 'Quét QR và hoàn tất.', visual: 'pay' },
  { num: 6, title: 'Tận hưởng chuyến đi', desc: 'Đồng hành 24/7.', visual: 'trip' },
];

const MOCK = {
  search: 'Bạn muốn đi đâu?',
  form: 'Đà Nẵng · 3N2Đ · 2 người',
  ai: 'Ngày 1–3 · ~4.25M',
  guides: '★ 4.9 · 500k/ngày',
  pay: 'QR · 4.75M VND',
  trip: 'Chuyến đi của tôi',
};

export default function ProcessPage() {
  return (
    <article className="process-page vl-container">
      <header className="process-page__head">
        <h1>QUY TRÌNH SỬ DỤNG WEBSITE CỦA DU KHÁCH</h1>
        <p>Từ tìm kiếm đến trải nghiệm — 6 bước cùng VivuDi</p>
      </header>
      <section className="process-steps">
        {STEPS.map((step, i) => (
          <article key={step.num} className="process-step">
            <span className="process-step__icon">{step.num}</span>
            <h3>{step.title}</h3>
            <p className="process-step__desc">{step.desc}</p>
            <section className="process-step__card">
              <span className="process-mock">{MOCK[step.visual]}</span>
            </section>
            {i < STEPS.length - 1 && <span className="process-step__arrow">&#8250;</span>}
          </article>
        ))}
      </section>
      <section className="process-cta">
        <Link to="/ai-planner" className="vl-btn vl-btn--primary vl-btn--lg">
          Bắt đầu với AI Planner
        </Link>
        <Link to="/guides" className="vl-btn vl-btn--outline vl-btn--lg">
          Xem hướng dẫn viên
        </Link>
      </section>
    </article>
  );
}
