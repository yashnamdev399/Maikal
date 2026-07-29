import { useLang } from '../context/LangContext';
import { useState, useEffect } from 'react';
import { toast } from './Toast';

/* ── Stats Counter Strip ── */
export function StatsStrip() {
  const { t } = useLang();
  return (
    <div></div>
    // <div className="stats-counter-strip">
    //   <div className="stats-counter-grid">
    //     <div className="stats-counter-item"><span className="stats-counter-num">20+</span><span className="stats-counter-lbl">{t('Products','उत्पाद')}</span></div>
    //     <div className="stats-counter-div"/>
    //     <div className="stats-counter-item"><span className="stats-counter-num">150+</span><span className="stats-counter-lbl">{t('Health-Conscious Buyers','स्वास्थ्य-जागरूक ग्राहक')}</span></div>
    //     <div className="stats-counter-div"/>
    //     <div className="stats-counter-item"><span className="stats-counter-num">2013</span><span className="stats-counter-lbl">{t('Established','स्थापित')}</span></div>
    //     <div className="stats-counter-div"/>
    //     <div className="stats-counter-item"><span className="stats-counter-num">100%</span><span className="stats-counter-lbl">{t('Natural Farming','प्राकृतिक खेती')}</span></div>
    //   </div>
    // </div>
  );
}

/* ── Features Strip ── */
export function FeaturesStrip() {
  const { t } = useLang();
  const cards = [
    { bg:'linear-gradient(135deg,#e8f5e0,#c8e6c9)', icon:'🌱', en:'Naturally Grown',  hi:'प्राकृतिक रूप से उगाया', den:'Adhering to non-chemical, natural methods',       dhi:'रसायन मुक्त, प्राकृतिक विधियों का पालन' },
    { bg:'linear-gradient(135deg,#fff9c4,#fff176)', icon:'👩‍🌾',en:'Self Help Groups', hi:'स्वयं सहायता समूह',      den:'Promoting the Empowerment of Women SHGs',         dhi:'महिला SHG के सशक्तिकरण को बढ़ावा देना' },
    { bg:'linear-gradient(135deg,#e0f2f1,#b2dfdb)', icon:'🏔️', en:'Healthy Narmada',  hi:'स्वस्थ नर्मदा',          den:'Awareness for a chemical-free catchment',         dhi:'रसायन मुक्त जलग्रहण क्षेत्र के लिए जागरूकता' },
    { bg:'linear-gradient(135deg,#fce4ec,#f8bbd0)', icon:'🚜', en:'Farm to Home',      hi:'खेत से घर तक',           den:'Direct delivery from farm to doorstep',           dhi:'खेत से दरवाजे तक सीधी डिलीवरी' },
  ];
  return (
    <div className="features-strip">
      <div className="features-grid">
        {cards.map(c => (
          <div key={c.en} className="feature-card">
            <div className="feature-icon-wrap" style={{ background: c.bg }}>{c.icon}</div>
            <h3>{t(c.en, c.hi)}</h3>
            <p>{t(c.den, c.dhi)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Trust Strip ── */
export function TrustStrip() {
  const { t } = useLang();
  const items = [
    { icon:'🌱', en:'100% Natural',          hi:'100% प्राकृतिक' },
    { icon:'💬', en:'WhatsApp Order',         hi:'व्हाट्सएप ऑर्डर' },
    { icon:'👩‍🌾',en:'Crafted by Women SHGs', hi:'महिला SHG द्वारा निर्मित' },
    { icon:'🚜', en:'Farm Direct',            hi:'खेत से सीधे' },
  ];
  return (<div></div>
    // <div className="trust-strip">
    //   <div className="trust-items">
    //     {items.map(i => (
    //       <div key={i.en} className="trust-item">
    //         <span className="ti">{i.icon}</span>
    //         <span>{t(i.en, i.hi)}</span>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}

/* ── Process Section ── */
export function ProcessSection() {
  const { t } = useLang();
  const steps = [
    { icon:'🌱', en:'Heirloom Seeds',      hi:'पारंपरिक बीज',           den:'Traditional seed varieties, no GMO, no hybrids — saved from season to season.',  dhi:'पारंपरिक बीज किस्में, कोई GMO नहीं — मौसम दर मौसम संरक्षित।' },
    { icon:'🌾', en:'Natural Farming',     hi:'प्राकृतिक खेती',         den:'Grown by Narmada basin farmers using biological inputs, traditional wisdom & chemical free practices',       dhi:'नर्मदा जल-ग्रहण क्षेत्र के किसानों द्वारा पारंपरिक ज्ञान, जैविक एवं रसायन-मुक्त कृषि पद्धतियों के माध्यम से संवर्धित।' },
    { icon:'👐', en:'Handmade Processing', hi:'हस्तनिर्मित प्रसंस्करण', den:'Stone-ground, sun-dried, winnowed — traditional methods that protect flavour & authenticity.',  dhi:'पत्थर पर पिसा, धूप में सुखाया — पारंपरिक तरीके जो स्वाद की रक्षा करते हैं।' },
    { icon:'📦', en:'Careful Packaging',   hi:'सावधानीपूर्ण पैकेजिंग',  den:'Hygienic, minimal, honest. No fancy wrapping — just what protects the product.',dhi:'स्वच्छ, न्यूनतम, ईमानदार। कोई फैंसी रैपिंग नहीं।' },
    { icon:'🏠', en:'To Your Home',        hi:'आपके घर तक',             den:'Direct delivery. No middlemen. Every rupee reaches the farmer/SHG who grew it.',      dhi:'सीधी डिलीवरी। कोई बिचौलिया नहीं।' },
  ];
  return (
    <section className="process-section">
      <div className="section-header">
        <span className="section-tag">{t('Our Process','हमारी प्रक्रिया')}</span>
        <h2>{t('From Farm to Your Kitchen','बीज से आपकी रसोई तक')}</h2>
        <p>{t('Every product you receive travels a careful five-step journey — nothing added, nothing sprayed, nothing rushed.','आपको मिलने वाला हर उत्पाद एक सावधानीपूर्ण पाँच-चरण की यात्रा से गुजरता है।')}</p>
        <div className="section-divider"/>
      </div>
      <div className="process-steps">
        {steps.map((s, i) => (
          <div key={s.en} className="process-step">
            <div className="process-icon">{s.icon}</div>
            {i < steps.length - 1 && <div className="process-connector"/>}
            <h3>{t(s.en, s.hi)}</h3>
            <p>{t(s.den, s.dhi)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Promo Banner ── */
export function PromoBanner() {
  const { t } = useLang();
  const copy = () => {
    navigator.clipboard.writeText('MAIKAL20')
      .then(() => toast('Code MAIKAL20 copied!', 'success'))
      .catch(() => toast('Code: MAIKAL20', 'success'));
  };
  return (
    <div></div>
    // <section className="promo-section">
    //   <div className="promo-tag">{t('LIMITED TIME OFFER','सीमित समय का ऑफर')}</div>
    //   <h2>{t('Narmada Harvest Sale — Up to 20% Off','नर्मदा हार्वेस्ट सेल — 20% तक छूट')}</h2>
    //   <p>{t('Fresh stocks, best prices. Order on WhatsApp and mention the code!','ताजा स्टॉक, बेहतरीन कीमतें। व्हाट्सएप पर ऑर्डर करें और कोड बताएं!')}</p>
    //   <div className="promo-code-box">
    //     <span className="code-icon">🌾</span>
    //     <span className="code-text">MAIKAL20</span>
    //     <button className="copy-btn" onClick={copy}>Copy code</button>
    //   </div>
    //   <br/>
    //   <a href="https://wa.me/919926036075?text=Hello! I want to order with code MAIKAL20"
    //      target="_blank" rel="noreferrer" className="promo-shop-btn">
    //     {t('🛒 Order Now on WhatsApp','🛒 व्हाट्सएप पर ऑर्डर करें')}
    //   </a>
    // </section>
  );
}

/* ── Testimonials — DYNAMIC from API ── */
const STATIC_TESTIMONIALS = [
  { id:'s1', quote_en:'The turmeric and mustard from Maikal are absolutely pure. You can taste the difference — no bitterness, just natural flavour. My whole family loves it!', quote_hi:'मेकल की हल्दी और राई बिल्कुल शुद्ध हैं। फर्क साफ महसूस होता है — कोई कड़वाहट नहीं, बस प्राकृतिक स्वाद।', name:'Sunita Verma', meta_en:'Bhopal • Customer since 2023', meta_hi:'भोपाल • 2023 से ग्राहक', avatar:'👩', rating:5 },
  { id:'s2', quote_en:"Ordered the desi chana and besan together. Delivery was quick and the packaging was thoughtful. The besan makes the softest rotis I've ever had!", quote_hi:'देसी चना और बेसन एक साथ मंगाया। डिलीवरी जल्दी हुई और पैकेजिंग बहुत अच्छी थी।', name:'Rajesh Patel', meta_en:'Indore • Customer since 2022', meta_hi:'इंदौर • 2022 से ग्राहक', avatar:'👨', rating:5 },
  { id:'s3', quote_en:"As a farmer from Narmada valley, I'm proud to be part of this initiative. Maikal supports us fairly and helps us reach customers who truly value natural produce.", quote_hi:'नर्मदा घाटी के किसान के रूप में, मुझे इस पहल का हिस्सा होने पर गर्व है।', name:'Ramesh Yadav', meta_en:'Hoshangabad • Farmer Partner', meta_hi:'होशंगाबाद • किसान साझेदार', avatar:'👨‍🌾', rating:5 },
];

export function Testimonials() {
  const { lang, t } = useLang();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx]         = useState(0);

  const getSpv = () => (window.innerWidth <= 768 ? 1 : 3);
  const [slidesPerView, setSPV] = useState(getSpv());

  useEffect(() => {
    const onResize = () => setSPV(getSpv());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(d => setItems(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = items.length ? items : STATIC_TESTIMONIALS;
  const maxIdx = Math.max(0, cards.length - slidesPerView);

  const move = (dir) => setIdx(i => {
    let next = i + dir;
    if (next > maxIdx) next = 0;
    if (next < 0) next = maxIdx;
    return next;
  });

  const pct = (100 / slidesPerView) * idx;

  return (
    <section className="testimonials-section">
      <div className="section-header">
        <span className="section-tag">{t('Customer Love','ग्राहक प्रेम')}</span>
        <h2>{t('What Families Say','परिवार क्या कहते हैं')}</h2>
        <p>{t('Real stories from households who switched to natural, farm-fresh products.','उन परिवारों की असली कहानियाँ जिन्होंने प्राकृतिक उत्पाद अपनाए।')}</p>
        <div className="section-divider"/>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner"/></div>
      ) : (
        <div className="farm-carousel-wrap">
          <div className="farm-carousel" style={{ transform: `translateX(-${pct}%)` }}>
            {cards.map(c => {
              const quote = lang === 'hi' ? (c.quote_hi || c.quote_en) : c.quote_en;
              const meta  = lang === 'hi' ? (c.meta_hi  || c.meta_en  || '') : (c.meta_en || '');
              const stars = '★'.repeat(Math.min(5, Math.max(1, c.rating || 5)));
              return (
                <div key={c._id || c.id} className="carousel-slide" style={{ width: `${100 / slidesPerView}%`, flex: `0 0 ${100 / slidesPerView}%`, padding: '0 10px' }}>
                  <div className="testimonial-card" style={{ height: '100%' }}>
                    <p className="testimonial-text">{quote}</p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">{c.avatar || '👤'}</div>
                      <div>
                        <div className="testimonial-name">{c.name}</div>
                        <div className="testimonial-meta">{meta}</div>
                        <div className="testimonial-stars">{stars}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
    </section>
  );
}

/* ── Trust Badges ── */
export function TrustBadges() {
  const { t } = useLang();
  const badges = [
    { icon:'✓',   main:'FSSAI Certified',   mhi:'FSSAI प्रमाणित',   sub:'Food safety',      shi:'खाद्य सुरक्षा',    text:false },
    { icon:'🌱',  main:'Natural Farming',   mhi:'प्राकृतिक खेती',  sub:'Zero chemicals',   shi:'शून्य रसायन',      text:false },
    { icon:'SHG', main:'Women SHG',         mhi:'महिला SHG',        sub:'150+ members',     shi:'150+ सदस्य',       text:true  },
    { icon:'§8',  main:'Section 8 Company', mhi:'धारा 8 कंपनी',     sub:'Registered 2013',  shi:'2013 में पंजीकृत', text:true  },
    { icon:'MP',  main:'MSME Registered',   mhi:'MSME पंजीकृत',     sub:'Madhya Pradesh',   shi:'मध्य प्रदेश',      text:true  },
  ];
  return (
    <div></div>
    // <section className="trust-badges-section">
    //   <p className="trust-badges-title">{t('Trusted, registered, and proudly accountable','विश्वसनीय, पंजीकृत और गर्व से जवाबदेह')}</p>
    //   <div className="trust-badges-grid">
    //     {badges.map(b => (
    //       <div key={b.main} className="trust-badge-item">
    //         <span className={`trust-badge-icon${b.text ? ' trust-badge-text-icon' : ''}`}>{b.icon}</span>
    //         <span className="trust-badge-main">{t(b.main, b.mhi)}</span>
    //         <span className="trust-badge-sub">{t(b.sub, b.shi)}</span>
    //       </div>
    //     ))}
    //   </div>
    // </section>
  );
}

/* ── About Section ── */
export function AboutSection() {
  const { t } = useLang();
  return (
    <section className="about-section" id="about">
      <div className="about-grid">
        <div className="about-img-col">
          <div className="about-img-main">
            <img src="/images/jonathan-kemper-1HHrdIoLFpU-unsplash.jpg" alt="Maikal Natural Foundation"/>
          </div>
          <div className="about-img-small">
            <img src="/images/gowtham-agm-_bd9U-w9a50-unsplash.jpg" alt="Women farmers"/>
          </div>
          <div className="about-badge-float">
            <span className="ab-num">12+</span>
            <span className="ab-lbl">{t('Years of trust','वर्षों का विश्वास')}</span>
          </div>
        </div>
        <div className="about-content">
          <span className="section-tag">{t('About Us','हमारे बारे में')}</span>
          <h2>{t('Maikal Natural Foundation','मेकल नेचुरल फाउंडेशन')}</h2>
          <p className="about-tagline">{t("A Product from Maa Narmada's Ecosystem","माँ नर्मदा के पारिस्थितिकी तंत्र का एक उत्पाद")}</p>
         <p>{t('The organization promotes natural farming through farmer awareness and training, empowers women Self-Help Groups (SHGs) for livelihood generation and value-added production using traditional practices such as preparing non-polished pulses through ghatti, and enables market access for natural produce, including direct sales to consumers. It also supports environmental conservation, focusing on soil health, biodiversity, and river catchment protection.','मेकल नेचुरल फाउंडेशन मध्य प्रदेश में प्राकृतिक, रसायन मुक्त खेती को बढ़ावा देने और महिला स्वयं सहायता समूहों को सशक्त बनाने के लिए समर्पित है।')}</p>
          <div className="about-stats-row cin-box">
            {[['2013',t('Established','स्थापित')],['100+',t('Women Empowered','महिलाएं सशक्त')],['20+',t('Natural Products','प्राकृतिक उत्पाद')],['Bhopal',t('Madhya Pradesh','मध्य प्रदेश')]].map(([n,l])=>(
              <div key={l} className="astat"><span className="anum">{n}</span><span className="albl">{l}</span></div>
            ))}
          </div>
          {/* <div className="cin-box">
            <p><strong>CIN:</strong> U01400MP2013NPL031718</p>
            <p><strong>{t('Registered:','पंजीकृत:')}</strong> {t('Khasra No. 330, Kolu Khedi, Khajuri Sadak, Bhopal, MP 462030','खसरा नं. 330, कोलू खेड़ी, खजूरी सड़क, भोपाल, म.प्र. 462030')}</p>
            <p><strong>{t('Directors:','निदेशक:')}</strong> Rashmi Sapre, Arpita Kartik Sapre</p>
          </div> */}
        </div>
      </div>
    </section>
  );
}
