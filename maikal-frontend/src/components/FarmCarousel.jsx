import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';

const SLIDES = [
  { img: '/images/equalstock-7KhazgCqCNA-unsplash.jpg',          icon: '👩‍🌾', en: 'Natural Farmers of Maa Narmada',  hi: 'माँ नर्मदा के प्राकृतिक किसान' },
  { img: '/images/rajesh-ram-HOOKgN_zIY8-unsplash.jpg',           icon: '🚜',   en: 'Natural Farming Methods',   hi: 'प्राकृतिक खेती के तरीके' },
  { img: '/images/sanjoy-saha-Lk92eqwxMBc-unsplash.jpg',          icon: '🏔️',  en: 'Maa Narmada’s Valley Fields',     hi: 'माँ नर्मदा घाटी के खेत' },
  { img: '/images/markus-spiske-sFydXGrt5OA-unsplash.jpg',         icon: '💧',   en: 'Pure Water Irrigation',     hi: 'शुद्ध जल सिंचाई' },
  { img: '/images/fernanda-martinez-yPPfWDSgUNw-unsplash.jpg',     icon: '🍅',   en: 'Fresh Natural Produce',     hi: 'ताजा प्राकृतिक उपज' },
  { img: '/images/steven-weeks-DUPFowqI6oI-unsplash.jpg',          icon: '🌱',   en: 'Chemical Free Fields',      hi: 'रसायन मुक्त खेत' },
  { img: '/images/gowtham-agm-_bd9U-w9a50-unsplash.jpg',           icon: '👨‍🌾', en: 'Our Dedicated Farmers',     hi: 'हमारे समर्पित किसान' },
  { img: '/images/hari-gaddigopula-xZEYonpj41o-unsplash.jpg',      icon: '🌾',   en: 'Lush Green Farmlands',      hi: 'हरे-भरे खेत' },
];

export default function FarmCarousel() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const spv = () => window.innerWidth <= 768 ? 1 : 3;
  const [slidesPerView, setSPV] = useState(spv());

  useEffect(() => {
    const onResize = () => setSPV(spv());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => move(1), 3800);
    return () => clearInterval(timerRef.current);
  }, [slidesPerView]);

  const maxIdx = SLIDES.length - slidesPerView;
  const move = (dir) => setIdx(i => {
    let next = i + dir;
    if (next > maxIdx) next = 0;
    if (next < 0) next = maxIdx;
    return next;
  });

  const pct = (100 / slidesPerView) * idx;

  return (
    <section className="farm-section" id="farm">
      <div className="section-header">
        <span className="section-tag">{t('Photo Gallery', 'फोटो गैलरी')}</span>
        <h2>{t("Straight From Nature's Heart", 'प्रकृति के हृदय से सीधे')}</h2>
        <p>{t('Real farms, real people, real purity', 'असली खेत, असली लोग, असली शुद्धता')}</p>
      </div>
      <div className="farm-carousel-wrap">
        <div className="farm-carousel" style={{ transform: `translateX(-${pct}%)` }}>
          {SLIDES.map((s, i) => (
            <div key={i} className="farm-slide" style={{ width: `${100 / slidesPerView}%`, flex: `0 0 ${100 / slidesPerView}%` }}>
              <img src={s.img} alt={s.en} />
              <div className="farm-slide-caption">
                <span>{s.icon}</span>
                <span>{t(s.en, s.hi)}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-btn carousel-prev" onClick={() => move(-1)}>&#8249;</button>
        <button className="carousel-btn carousel-next" onClick={() => move(1)}>&#8250;</button>
        <div className="carousel-dots">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} className={`carousel-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
