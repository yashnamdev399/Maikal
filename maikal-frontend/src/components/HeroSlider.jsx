import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    image_url: null,
    image_f1_url: null,
    image_f2_url: null,
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
    image_url: null,
    image_f1_url: null,
    image_f2_url: null,
  },
  {
    id: 3,
    badge_en: "Women's Enterprise", badge_hi: 'महिला उद्यम',
    title_en: 'Handcrafted by',     title_hi: 'हस्तनिर्मित',
    accent_en: 'Women of Narmada',  accent_hi: 'नर्मदा की महिलाओं द्वारा',
    tagline_en: '150+ स्वास्थ्य-जागरूक ग्राहक, एक साझी कहानी', tagline_hi: '150+ health-conscious buyers, one shared story',
    desc_en: "Every product you order supports a natural farmer. Every rupee goes back into his cooperative, his children's school, his village.",
    desc_hi: 'आपका हर ऑर्डर एक प्राकृतिक किसान को सहारा देता है। हर रुपया उसके सहकारी, उसके बच्चों के स्कूल, उसके गांव में वापस जाता है।',
    image_url: null,
    image_f1_url: null,
    image_f2_url: null,
  },
];

export default function HeroSlider() {
  const { lang, t } = useLang();
  const [slides, setSlides] = useState(FALLBACK);
  const [idx, setIdx]       = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    api.get('/hero').then(d => { if (d.data?.length) setSlides(d.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const go = (dir) => setIdx(i => ((i + dir) % slides.length + slides.length) % slides.length);
  const s = slides[idx] || slides[0] || {};
  const isPoem = s.is_poem || s.id === 1;

  // Dynamic hero stats (customizable from admin, with clean defaults)
  const stat1Val = t(s.stat1_val_en, s.stat1_val_hi) || '13+';
  const stat1Lbl = t(s.stat1_lbl_en || 'Years of Work', s.stat1_lbl_hi || 'कार्य के वर्ष');

  const stat2Val = t(s.stat2_val_en || 'Narmada Ecosystem', s.stat2_val_hi || 'नर्मदा इकोसिस्टम');
  const stat2Lbl = t(s.stat2_lbl_en || 'Operational Area', s.stat2_lbl_hi || 'कार्यक्षेत्र');

  const stat3Val = t(s.stat3_val_en, s.stat3_val_hi) || 'सेक्शन 8';
  const stat3Lbl = t(s.stat3_lbl_en || 'Not for Profit', s.stat3_lbl_hi || 'गैर-लाभकारी');

  return (
    <section
      className="hero hero-slider"
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
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
          <p className="hero-desc hero-poem">
            {t(s.desc_en, s.desc_hi)}
          </p>
          <div className="hero-btns">
            <Link to="/activities" className="btn-primary">🌱 {t('Explore Our Work', 'हमारी गतिविधियां')}</Link>
            <a href="#contact" className="btn-outline">🌿 {t('Support Our Mission', 'कार्य में सहयोग करें')}</a>
          </div>
          <div className="hero-stats">
            <div className="hstat">
              <span className="hnum">{stat1Val}</span>
              <span className="hlbl">{stat1Lbl}</span>
            </div>
            <div className="hstat-div" />
            <div className="hstat">
              <span className="hnum">{stat2Val}</span>
              <span className="hlbl">{stat2Lbl}</span>
            </div>
            <div className="hstat-div" />
            <div className="hstat">
              <span className="hnum">{stat3Val}</span>
              <span className="hlbl">{stat3Lbl}</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-main">
            {s?.image_url ? (
              <img src={s.image_url} alt="hero" />
            ) : (
              <span style={{ fontSize: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🌾</span>
            )}
          </div>
          {s?.image_f1_url && <div className="hero-img-f1"><img src={s.image_f1_url} alt="" /></div>}
          {s?.image_f2_url && <div className="hero-img-f2"><img src={s.image_f2_url} alt="" /></div>}
        </div>
      </div>

      <div className="hero-slider-controls">
        <button type="button" className="hero-slider-btn" onClick={() => go(-1)} aria-label="Previous slide">&#8249;</button>
        <div className="hero-slider-dots">
          {slides.map((_, i) => (
            <button
              type="button"
              key={i}
              className={`hero-dot${i === idx ? ' active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button type="button" className="hero-slider-btn" onClick={() => go(1)} aria-label="Next slide">&#8250;</button>
      </div>
    </section>
  );
}
