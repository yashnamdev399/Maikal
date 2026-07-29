import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { api } from '../utils/api';

const CAT_EMOJI = { Pulses: '🫘', Spices: '🌶️', Sweeteners: '🍯', Flour: '🌾', Grains: '🌾' };
const HI_LABELS = { Pulses: 'दालें', Spices: 'मसाले', Sweeteners: 'मिठास', Flour: 'आटा', Grains: 'अनाज' };

function ProductCard({ p, lang }) {
  const name    = lang === 'hi' ? (p.name_hi || p.name_en) : (p.name_en || p.name_hi);
  const nameAlt = lang === 'hi' ? p.name_en : p.name_hi;
  const emoji   = CAT_EMOJI[p.category] || '🌿';
  const waMsg   = encodeURIComponent(`Hello! I want to order *${p.name_en}* - Rs.${p.price} ${p.unit || ''}`);

  return (
    <div className="product-card">
      <div className="product-img">
        {p.image_url
          ? <img src={p.image_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }} />
          : <span className="cat-emoji">{emoji}</span>
        }
        <span className={`product-badge${p.in_stock ? '' : ' out'}`}>
          {p.in_stock ? (lang === 'hi' ? 'उपलब्ध' : 'In Stock') : (lang === 'hi' ? 'अनुपलब्ध' : 'Out of Stock')}
        </span>
      </div>
      <div className="product-body">
        <div className="product-category">{p.category || ''}</div>
        <div className="product-name">{name}</div>
        <div className="product-name-hi">{nameAlt || ''}</div>
        <div className="product-stars">★★★★★</div>
        <div className="product-footer">
          <div>
            <span className="product-price">Rs.{p.price}</span>
            <span className="product-unit">{p.unit || ''}</span>
          </div>
          <a href={`https://wa.me/919926036075?text=${waMsg}`} target="_blank" rel="noreferrer" className="order-btn">
            {lang === 'hi' ? '+ ऑर्डर' : '+ Order'}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const { lang, t } = useLang();
  const [all, setAll]         = useState([]);
  const [cat, setCat]         = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(d => setAll(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cats = [...new Set(all.map(p => (p.category || '').trim()).filter(Boolean))];

  const visible = cat
    ? all.filter(p => (p.category || '').trim().toLowerCase() === cat.trim().toLowerCase())
    : all;

  const handleCatChange = (selectedCat) => {
    setCat(selectedCat);
  };

  return (
    <section className="products-section" id="products">
      <div className="section-header">
        <span className="section-tag">{t('Our Products', 'हमारे उत्पाद')}</span>
        <h2>{t("Nature's Best, Naturally Grown", 'प्रकृति का सर्वश्रेष्ठ, प्राकृतिक रूप से उगाया गया')}</h2>
        <p>{t("Handpicked, naturally grown products from Narmada's Ecosystem", "माँ नर्मदा के पारिस्थितिकी तंत्र से हस्तचयनित, प्राकृतिक रूप से उगाए गए उत्पाद")}</p>
        <div className="section-divider" />
      </div>

      <div className="category-tabs">
        <button className={`cat-tab${cat === '' ? ' active' : ''}`} onClick={() => handleCatChange('')}>
          {t('All', 'सभी')} ({all.length})
        </button>
        {cats.map(c => {
          const count = all.filter(p => (p.category || '').trim().toLowerCase() === c.toLowerCase()).length;
          return (
            <button key={c} className={`cat-tab${cat.toLowerCase() === c.toLowerCase() ? ' active' : ''}`} onClick={() => handleCatChange(c)}>
              {CAT_EMOJI[c] || '🌿'} {lang === 'hi' ? (HI_LABELS[c] || c) : c} ({count})
            </button>
          );
        })}
      </div>

      <div id="products-container">
        {loading
          ? <div className="spinner-wrap"><div className="spinner" /></div>
          : visible.length
            ? <div className="products-grid">{visible.map(p => <ProductCard key={p._id || p.id} p={p} lang={lang} />)}</div>
            : <div className="empty-state"><div className="icon">🌿</div><p>{t('No products found', 'कोई उत्पाद नहीं मिला')}</p></div>
        }
      </div>
    </section>
  );
}
