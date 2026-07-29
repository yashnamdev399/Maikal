import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { api } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PubCard({ pub, lang }) {
  const title = lang === 'hi' ? (pub.title_hi || pub.title_en || '') : (pub.title_en || pub.title_hi || '');
  const desc  = lang === 'hi' ? (pub.description_hi || pub.description_en || '') : (pub.description_en || pub.description_hi || '');

  return (
    <div className="pub-card">
      <div className="pub-cover">
        {pub.cover_url
          ? <img src={pub.cover_url} alt={title} />
          : <div className="pub-cover-placeholder">📄</div>
        }
      </div>
      <div className="pub-body">
        <h3 className="pub-title">{title}</h3>
        {desc && <p className="pub-desc">{desc}</p>}
        <a
          href={pub.pdf_url}
          target="_blank"
          rel="noreferrer"
          download
          className="pub-download-btn"
        >
          ⬇️ {lang === 'hi' ? 'डाउनलोड करें' : 'Click To Download'}
        </a>
      </div>
    </div>
  );
}

export default function PublicationsPage() {
  const { lang, t } = useLang();
  const [pubs, setPubs]       = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);

  const load = (q = '') => {
    setLoading(true);
    api.get(`/publications${q ? `?search=${encodeURIComponent(q)}` : ''}`)
      .then(d => setPubs(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 66 }}>
        {/* Page Hero */}
        <div className="page-hero page-hero-publications">
          <div className="page-hero-content">
            <span className="section-tag">{t('Publications', 'प्रकाशन')}</span>
            <h1>{t('Our Magazines & Reports', 'हमारी पत्रिकाएं और रिपोर्ट')}</h1>
            <p>{t(
              'Download our publications on natural farming, Maa Narmada’s conservation, and women empowerment.',
              'प्राकृतिक खेती, माँ नर्मदा संरक्षण और महिला सशक्तिकरण पर हमारी प्रकाशनाएं डाउनलोड करें।'
            )}</p>
          </div>
        </div>

        {/* Search */}
        <div className="pub-search-wrap">
          <form onSubmit={handleSearch} className="pub-search-form">
            <input
              type="text"
              placeholder={t('Search publications...', 'प्रकाशन खोजें...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pub-search-input"
            />
            <button type="submit" className="pub-search-btn">🔍</button>
          </form>
        </div>

        {/* Publications Grid */}
        <section className="publications-section">
          {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
          {!loading && pubs.length === 0 && (
            <div className="empty-state">
              <div className="icon">📚</div>
              <p>{t('No publications found.', 'कोई प्रकाशन नहीं मिला।')}</p>
            </div>
          )}
          {!loading && pubs.length > 0 && (
            <div className="publications-grid">
              {pubs.map(p => <PubCard key={p._id || p.id} pub={p} lang={lang} />)}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
