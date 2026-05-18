import { stage1Images } from './aboutStage1Assets';
import {
  IconPersonalize,
  IconLocal,
  IconFreedom,
  IconSupport,
  IconLeafBadge,
  IconTargetBadge,
  IconVisionBadge,
  IconAiWhy,
  IconPinWhy,
  IconGuideWhy,
  IconShieldWhy,
} from '../components/about/AboutIcons';
import AboutProcessSection from '../components/about/AboutProcessSection';
import './AboutPage.css';

const HERO_FEATURES = [
  {
    title: 'Cá nhân hóa',
    desc: 'AI gợi ý lịch trình theo sở thích và ngân sách',
    Icon: IconPersonalize,
  },
  {
    title: 'Bản địa & chân thực',
    desc: 'Kết nối với hướng dẫn viên địa phương phù hợp',
    Icon: IconLocal,
  },
  {
    title: 'Tự do lựa chọn',
    desc: 'Chủ động chọn hoạt động, địa điểm, phong cách trải nghiệm',
    Icon: IconFreedom,
  },
  {
    title: 'Đồng hành 24/7',
    desc: 'Hỗ trợ trong suốt hành trình của bạn',
    Icon: IconSupport,
  },
];

const MISSION_POINTS = [
  'Dễ dàng lên kế hoạch hành trình cá nhân hóa',
  'Kết nối với hướng dẫn viên địa phương phù hợp',
  'Trải nghiệm văn hóa bản địa một cách chân thực và tôn trọng',
  'Được đồng hành và hỗ trợ trong suốt chuyến đi',
];

const WHY_ITEMS = [
  {
    title: 'AI cá nhân hóa',
    desc: 'Gợi ý lịch trình phù hợp với sở thích của bạn',
    Icon: IconAiWhy,
  },
  {
    title: 'Trải nghiệm địa phương',
    desc: 'Khám phá những điểm đến và hoạt động bản địa độc đáo',
    Icon: IconPinWhy,
  },
  {
    title: 'Hướng dẫn viên bản địa',
    desc: 'Kết nối với những người địa phương thân thiện và chuyên nghiệp',
    Icon: IconGuideWhy,
  },
  {
    title: 'Hỗ trợ 24/7',
    desc: 'Đồng hành cùng bạn trong suốt chuyến đi',
    Icon: IconSupport,
  },
  {
    title: 'Thanh toán an toàn',
    desc: 'Bảo mật tuyệt đối, đa dạng phương thức thanh toán',
    Icon: IconShieldWhy,
  },
];

export default function AboutPage() {
  return (
    <article className="about">
      <section className="about-hero">
        <img src={stage1Images.heroBg} alt="" className="about-hero__bg" />
        <div className="about-hero__overlay" />
        <div className="vl-container about-hero__inner">
          <div className="about-hero__content">
            <h1>VietLocal – Du lịch theo cách của người bản địa</h1>
            <p>
              VietLocal là nền tảng du lịch công nghệ giúp bạn dễ dàng lên kế hoạch và trải nghiệm những
              hành trình chân thực, gần gũi với đời sống địa phương.
            </p>
            <p>
              Chúng tôi kết hợp trí tuệ nhân tạo với mạng lưới hướng dẫn viên bản địa để mang đến trải
              nghiệm cá nhân hóa, linh hoạt và đáng nhớ.
            </p>
            <p>
              Với VietLocal, mỗi chuyến đi không chỉ là tham quan, mà là cơ hội để bạn sống, cảm và kết
              nối trọn vẹn với văn hóa và con người Việt Nam.
            </p>
            <div className="about-hero__features">
              {HERO_FEATURES.map(({ title, desc, Icon }) => (
                <div className="about-hero__feat" key={title}>
                  <span className="about-hero__feat-icon">
                    <Icon />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <span>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-section vl-container">
        <div className="about-section__grid">
          <img src={stage1Images.philosophyImg} alt="Phố cổ Hội An" className="about-section__img" />
          <div className="about-section__panel about-section__panel--gray">
            <span className="about-section__badge">
              <IconLeafBadge />
            </span>
            <h2>TRIẾT LÝ THƯƠNG HIỆU</h2>
            <p>
              Mọi điều tốt đẹp đều bắt đầu từ sự thật và tình yêu dành cho con người.
            </p>
            <p>
              VietLocal tin rằng khi trở về với gốc rễ tự nhiên, con người mới tìm lại được sự cân bằng
              và vẻ đẹp thật sự của mình.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section vl-container">
        <div className="about-section__grid about-section__grid--mission">
          <div className="about-section__panel">
            <span className="about-section__badge">
              <IconTargetBadge />
            </span>
            <h2>SỨ MỆNH</h2>
            <p>
              VietLocal phát triển nền tảng du lịch công nghệ tích hợp AI, giúp du khách:
            </p>
            <ul className="about-checklist">
              {MISSION_POINTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="about-mission-gallery">
            <img src={stage1Images.missionMain} alt="Trải nghiệm địa phương" className="about-mission-gallery__main" />
            <img src={stage1Images.missionBoat} alt="Khám phá vịnh" />
            <img src={stage1Images.missionLocal} alt="Kết nối bản địa" />
          </div>
        </div>
      </section>

      <section className="about-section vl-container">
        <div className="about-section__grid">
          <img src={stage1Images.visionImg} alt="Ruộng bậc thang" className="about-section__img" />
          <div className="about-section__panel about-section__panel--gray">
            <span className="about-section__badge">
              <IconVisionBadge />
            </span>
            <h2>TẦM NHÌN</h2>
            <p>
              Trở thành nền tảng du lịch công nghệ hàng đầu tại Việt Nam và khu vực, kiến tạo hệ sinh
              thái trải nghiệm địa phương hóa, nơi du khách dễ dàng khám phá - kết nối - và yêu mến
              Việt Nam qua những hành trình chân thực và bền vững.
            </p>
          </div>
        </div>
      </section>

      <AboutProcessSection />

      <section className="about-why-bar vl-container">
        <div className="about-why-bar__inner">
          <h2 className="about-why-bar__title">Tại sao chọn VietLocal?</h2>
          <div className="about-why-bar__items">
            {WHY_ITEMS.map(({ title, desc, Icon }) => (
              <div key={title} className="about-why-bar__item">
                <span className="about-why-bar__icon">
                  <Icon />
                </span>
                <strong>{title}</strong>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <img src={stage1Images.whySideImg} alt="" className="about-why-bar__photo" />
        </div>
      </section>
    </article>
  );
}
