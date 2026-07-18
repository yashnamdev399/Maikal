import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { api } from '../utils/api';

const POEM = 'जहर घुल रहा नभ, जल, थल में जहर अन्न, सब्जी, फल में सोचो क्या खायें, क्या न खायें जहरों से कैसे जान बचायें...';

const FALLBACK = [
  {
    id: 1,
    badge_en: "Maa Narmada's Ecosystem", badge_hi: 'माँ नर्मदा का पारिस्थितिकी तंत्र',
    title_en: 'For Healthy Soil,',      title_hi: 'स्वस्थ मिट्टी से,',
    accent_en: 'To Healthy Home',       accent_hi: 'स्वस्थ घर तक',
    tagline_en: 'रसायन मुक्त / प्राकृतिक सामग्री उपलब्ध', tagline_hi: 'Chemical-free / Natural Products Available',
    desc_en: POEM, desc_hi: POEM,
    image_url: '/images/sanjoy-saha-Lk92eqwxMBc-unsplash.jpg',
    image_f1_url: '/images/equalstock-7KhazgCqCNA-unsplash.jpg',
    image_f2_url: '/images/markus-spiske-sFydXGrt5OA-unsplash.jpg',
    badge_float_en: '100% Natural Farming', badge_float_hi: '100% प्राकृतिक खेती',
    is_poem: true,
  },
  {
    id: 2,
    badge_en: 'Chemical-Free Harvest', badge_hi: 'रसायन मुक्त फसल',
    title_en: 'Naturally Grown,',      title_hi: 'प्राकृतिक रूप से उगाया,',
    accent_en: 'Full of Flavour',      accent_hi: 'स्वाद से भरपूर',
    tagline_en: 'मिट्टी का स्वाद, पीढ़ियों की परंपरा', tagline_hi: 'Taste of soil, tradition of generations',
    desc_en: 'Turmeric, mustard, besan, chana, gud — each product is grown with heirloom seeds and traditional methods. The way food was meant to taste.',
    desc_hi: 'हल्दी, सरसों, बेसन, चना, गुड़ — हर उत्पाद पारंपरिक बीजों और विधियों से उगाया जाता है।',
    image_url: '/images/gabriel-jimenez-jin4W1HqgL4-unsplash.jpg',
    image_f1_url: '/images/rajesh-ram-HOOKgN_zIY8-unsplash.jpg',
    image_f2_url: '/images/fernanda-martinez-yPPfWDSgUNw-unsplash.jpg',
    badge_float_en: '20+ Natural Products', badge_float_hi: '20+ प्राकृतिक उत्पाद',
  },
  {
    id: 3,
    badge_en: "Women's Enterprise", badge_hi: 'महिला उद्यम',
    title_en: 'Handcrafted by',     title_hi: 'हस्तनिर्मित',
    accent_en: 'Women of Narmada', accent_hi: 'नर्मदा की महिलाओं द्वारा',
    tagline_en: '150+ स्वास्थ्य-जागरूक ग्राहक, एक साझी कहानी', tagline_hi: '150+ health-conscious buyers, one shared story',
    desc_en: "Every product you order supports a natural farmer. Every rupee goes back into his cooperative, his children's school, his village.",
    desc_hi: 'आपका हर ऑर्डर एक प्राकृतिक किसान को सहारा देता है। हर रुपया उसके सहकारी, उसके बच्चों के स्कूल, उसके गांव में वापस जाता है।',
    image_url: '/images/gayatri-malhotra-P3acjTC_wWg-unsplash.jpg',
    image_f1_url: '/images/abhijeet-pHX3Rphlqn0-unsplash.jpg',
    image_f2_url: '/images/vivek-vk-7YV-1obuFlg-unsplash.jpg',
    badge_float_en: '150+ Health-Conscious Buyers', badge_float_hi: '150+ स्वास्थ्य-जागरूक ग्राहक',
  },
];

export default function HeroSlider() {
  const { t } = useLang();
  const [slides, setSlides] = useState(FALLBACK);
  const [idx, setIdx]       = useState(0);

  useEffect(() => {
    api.get('/hero').then(d => { if (d.data?.length) setSlides(d.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const go = (dir) => setIdx(i => ((i + dir) % slides.length + slides.length) % slides.length);
  const s = slides[idx];
  const isPoem = s.is_poem || s.id === 1;

  return (
    <section className="hero hero-slider" id="home">
      <div className="hero-glow" />

      <div className="hero-slide active">
        <div className="hero-left">
          <div className="hero-badge">
            <span>🌾</span>
            <span>{t(s.badge_en, s.badge_hi)}</span>
          </div>
          <h1>
            <span>{t(s.title_en, s.title_hi)}</span><br />
            <span className="h1-accent">{t(s.accent_en, s.accent_hi)}</span>
          </h1>
          <p className="hero-hi">{t(s.tagline_en, s.tagline_hi)}</p>
          <p className={`hero-desc hero-poem`}>
            {t(s.desc_en, s.desc_hi)}
          </p>
          <div className="hero-btns">
            <a href="#products" className="btn-primary">🛒 {t('Shop Now', 'अभी खरीदें')}</a>
            <a href="#about" className="btn-outline">🌿 {t('Our Story', 'हमारी कहानी')}</a>
          </div>
          <div className="hero-stats">
            <div className="hstat"><span className="hnum">20+</span><span className="hlbl">{t('Products', 'उत्पाद')}</span></div>
            <div className="hstat-div" />
            <div className="hstat"><span className="hnum">150+</span><span className="hlbl">{t('Health-Conscious Buyers', 'स्वास्थ्य-जागरूक ग्राहक')}</span></div>
            <div className="hstat-div" />
            <div className="hstat"><span className="hnum">2013</span><span className="hlbl">{t('Est.', 'स्थापित')}</span></div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-main">
            <img src={s.image_url} alt="hero" />
          </div>
          {s.image_f1_url && <div className="hero-img-f1"><img src={s.image_f1_url} alt="" /></div>}
          {s.image_f2_url && <div className="hero-img-f2"><img src={s.image_f2_url} alt="" /></div>}
          <div className="hero-badge-float">
            <span>✅</span>
            <span>{t(s.badge_float_en, s.badge_float_hi)}</span>
          </div>
        </div>
      </div>

      <div className="hero-slider-controls">
        <button className="hero-slider-btn" onClick={() => go(-1)}>&#8249;</button>
        <div className="hero-slider-dots">
          {slides.map((_, i) => (
            <button key={i} className={`hero-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
        <button className="hero-slider-btn" onClick={() => go(1)}>&#8250;</button>
      </div>

      {/* <div className="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1350,20 1440,40 L1440,80 L0,80 Z" fill="#f0f7ec" />
        </svg>
      </div> */}
    </section>
  );
}
