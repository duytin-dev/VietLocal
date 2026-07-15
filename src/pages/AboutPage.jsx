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

const CORE_VALUES = [
  {
    title: 'Khám phá',
    desc: 'Khuyến khích du khách bước ra khỏi những hành trình quen thuộc để khám phá vẻ đẹp thiên nhiên, văn hóa và con người tại từng địa phương.',
    Icon: IconPinWhy,
  },
  {
    title: 'Kết nối',
    desc: 'Xây dựng cầu nối giữa du khách với local guide và cộng đồng địa phương, tạo nên những trải nghiệm gần gũi, ý nghĩa và giàu giá trị văn hóa.',
    Icon: IconGuideWhy,
  },
  {
    title: 'Tin cậy',
    desc: 'Cam kết cung cấp thông tin minh bạch, dịch vụ chất lượng và môi trường giao dịch an toàn, giúp khách hàng yên tâm trong suốt hành trình.',
    Icon: IconShieldWhy,
  },
  {
    title: 'Đổi mới',
    desc: 'Không ngừng ứng dụng công nghệ và cải tiến dịch vụ nhằm mang đến trải nghiệm du lịch thuận tiện, hiện đại và cá nhân hóa cho người dùng.',
    Icon: IconAiWhy,
  },
  {
    title: 'Bền vững',
    desc: 'Hướng đến phát triển du lịch có trách nhiệm, góp phần bảo tồn văn hóa, bảo vệ môi trường và nâng cao đời sống của cộng đồng địa phương.',
    Icon: IconSupport,
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
            <h1>VivuDi – Du lịch như người bản xứ</h1>
            <p>
              Mỗi chuyến đi không chỉ là khám phá điểm đến mà còn là cơ hội kết nối với con người và
              văn hóa địa phương.
            </p>
            <p>
              VivuDi mang đến trải nghiệm bản địa chân thực nhất thông qua sự đồng hành của người dân
              địa phương, cùng ứng dụng công nghệ để hành trình của bạn trở nên thuận tiện và đáng nhớ.
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
            <p className="about-section__lead">
              “Mỗi chuyến đi không chỉ là khám phá điểm đến mà còn là cơ hội kết nối với con người và
              văn hóa địa phương.”
            </p>
            <p>
              Tại VivuDi, hành trình không chỉ là check-in điểm đến, mà là cơ hội để chạm vào văn hóa và
              kết nối sâu sắc với con người bản địa. Chúng tôi tin rằng giá trị lớn nhất của mỗi chuyến
              đi nằm ở trải nghiệm thực tế, những câu chuyện kể và sự gắn kết chân thành. Đây chính là
              điểm khác biệt định hình nên VivuDi.
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
            <p className="about-section__lead">“Du lịch như người bản xứ.”</p>
            <p>
              VivuDi mang đến cho du khách những trải nghiệm bản địa chân thực nhất thông qua sự đồng
              hành của người dân địa phương. Song song đó, chúng tôi đồng hành cùng cộng đồng để quảng
              bá văn hóa, tạo việc làm và nâng cao thu nhập bền vững cho người dân tại các điểm đến.
            </p>
          </div>
          <div className="about-mission-gallery">
            <img
              src={stage1Images.missionMain}
              alt="Trải nghiệm địa phương"
              className="about-mission-gallery__main"
            />
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
            <p className="about-section__lead">
              “Kiến tạo hệ sinh thái du lịch bản địa thông minh, nơi mỗi hành trình đều trở thành một
              trải nghiệm đáng nhớ.”
            </p>
            <p>
              VivuDi mong muốn trở thành nền tảng được du khách tin tưởng lựa chọn khi khám phá văn hóa
              địa phương. Thông qua việc ứng dụng công nghệ và kết nối với local guide, dự án góp phần
              nâng cao trải nghiệm du lịch, quảng bá văn hóa và phát triển cộng đồng địa phương.
            </p>
          </div>
        </div>
      </section>

      <section className="about-values vl-container">
        <header className="about-values__head">
          <h2>GIÁ TRỊ CỐT LÕI</h2>
          <p className="about-section__lead about-values__slogan">
            Khám phá — Kết nối — Tin cậy — Đổi mới — Bền vững
          </p>
        </header>
        <div className="about-values__grid">
          {CORE_VALUES.map(({ title, desc, Icon }) => (
            <article key={title} className="about-values__card">
              <span className="about-values__icon">
                <Icon />
              </span>
              <strong>{title}</strong>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <AboutProcessSection />

      <section className="about-why-bar vl-container">
        <div className="about-why-bar__inner">
          <h2 className="about-why-bar__title">Tại sao chọn VivuDi?</h2>
          <div className="about-why-bar__items">
            {CORE_VALUES.map(({ title, desc, Icon }) => (
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
