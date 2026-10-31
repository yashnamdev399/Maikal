import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';
import { api } from '../utils/api';
import PostModal from './PostModal';

export default function FarmCarousel() {
  const { lang, t } = useLang();
  const [idx, setIdx] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const [lightboxIndex, setLightboxIndex] = useState(null);

  const spv = () => window.innerWidth <= 768 ? 1 : 3;
  const [slidesPerView, setSPV] = useState(spv());

  useEffect(() => {
    const onResize = () => setSPV(spv());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    Promise.all([
      api.get('/activities').catch(() => ({ data: [] })),
      api.get('/gallery').catch(() => ({ data: [] }))
    ])
      .then(([actRes, galRes]) => {
        const activities = actRes.data || [];
        const gallery = galRes.data || [];

        // Dynamic activity slides
        const actSlides = activities
          .filter(a => a.images && a.images.length > 0)
          .flatMap(a => {
            const imgs = Array.isArray(a.images) ? a.images : [a.images];
            return imgs.map(img => ({
              ...a,
              img,
              icon: '🌱',
              en: a.title_en || 'Activity',
              hi: a.title_hi || 'गतिविधि',
              content_en: a.content_en,
              content_hi: a.content_hi,
            }));
          });

        // Dynamic gallery slides
        const galSlides = gallery
          .filter(g => g.image_url)
          .map(g => ({
            ...g,
            img: g.image_url,
            icon: '📸',
            en: g.caption_en || 'Gallery',
            hi: g.caption_hi || 'गैलरी',
            content_en: g.caption_en,
            content_hi: g.caption_hi,
          }));

        setSlides([...actSlides, ...galSlides]);
      })
      .catch(() => {
        setSlides([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (slides.length <= slidesPerView) return;
    timerRef.current = setInterval(() => move(1), 3800);
    return () => clearInterval(timerRef.current);
  }, [slidesPerView, slides]);

  const maxIdx = Math.max(0, slides.length - slidesPerView);

  useEffect(() => {
    if (idx > maxIdx) {
      setIdx(0);
    }
  }, [maxIdx, idx]);

  const move = (dir) => setIdx(i => {
    let next = i + dir;
    if (next > maxIdx) next = 0;
    if (next < 0) next = maxIdx;
    return next;
  });

  const pct = (100 / slidesPerView) * idx;

  // Only render dynamically when images exist; no default fallback images
  if (!loading && slides.length === 0) {
    return null;
  }

  return (
    <section className="farm-section" id="farm">
      <div className="section-header">
        <span className="section-tag">{t('Photo Gallery', 'फोटो गैलरी')}</span>
        <h2>{t("Straight From Nature's Heart", 'प्रकृति के हृदय से सीधे')}</h2>
        <p>{t('Real farms, real people, real purity', 'असली खेत, असली लोग, असली शुद्धता')}</p>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className="farm-carousel-wrap">
          <div className="farm-carousel" style={{ transform: `translateX(-${pct}%)`, justifyContent: slides.length < slidesPerView ? 'center' : 'flex-start' }}>
            {slides.map((s, i) => (
              <div key={i} className="farm-slide" style={{ width: `${100 / slidesPerView}%`, flex: `0 0 ${100 / slidesPerView}%`, cursor: 'pointer' }} onClick={() => setLightboxIndex(i)}>
                <img src={s.img} alt={lang === 'hi' ? s.hi : s.en} />
                <div className="farm-slide-caption">
                  <span>{s.icon}</span>
                  <span>{lang === 'hi' ? s.hi : s.en}</span>
                </div>
              </div>
            ))}
          </div>
          {maxIdx > 0 && (
            <>
              <button className="carousel-btn carousel-prev" onClick={() => move(-1)}>&#8249;</button>
              <button className="carousel-btn carousel-next" onClick={() => move(1)}>&#8250;</button>
              <div className="carousel-dots">
                {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                  <button key={i} className={`carousel-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      
      {lightboxIndex !== null && (
        <PostModal 
          p={slides[lightboxIndex]} 
          lang={lang} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </section>
  );
}
