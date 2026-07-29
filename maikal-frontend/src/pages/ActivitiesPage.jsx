import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { api } from '../utils/api';
import Navbar  from '../components/Navbar';
import Footer  from '../components/Footer';
import Lightbox from '../components/Lightbox';

function ActivityCard({ act, lang }) {
  const title   = lang === 'hi' ? (act.title_hi || act.title_en || '') : (act.title_en || act.title_hi || '');
  const content = lang === 'hi' ? (act.content_hi || act.content_en || '') : (act.content_en || act.content_hi || '');
  const images  = (() => { try { return JSON.parse(act.images || '[]'); } catch { return []; } })();
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="activity-card">
      {images.length > 0 && (
        <div className="activity-img-wrap">
          <img src={images[imgIdx]} alt={title} onClick={() => setLightbox(images[imgIdx])} />
          {images.length > 1 && (
            <div className="activity-img-nav">
              <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}>&#8249;</button>
              <span>{imgIdx + 1} / {images.length}</span>
              <button onClick={() => setImgIdx(i => (i + 1) % images.length)}>&#8250;</button>
            </div>
          )}
        </div>
      )}
      <div className="activity-body">
        <h3 className="activity-title">{title}</h3>
        <p className="activity-content">{content}</p>
        <div className="activity-date">
          📅 {new Date(act.createdAt || act.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}

export default function ActivitiesPage() {
  const { lang, t } = useLang();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/activities')
      .then(d => setActivities(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 66 }}>
        {/* Page Hero */}
        <div className="page-hero">
          <div className="page-hero-content">
            <span className="section-tag">{t('Our Activities', 'हमारी गतिविधियां')}</span>
            <h1>{t('Natural Farming & Community Work', 'प्राकृतिक खेती और सामुदायिक कार्य')}</h1>
            <p>{t(
              'Awareness campaigns, natural farming demonstrations, women empowerment drives and more — from the heart of Maa Narmada’s valley.',
              'जागरूकता अभियान, प्राकृतिक खेती प्रदर्शन, महिला सशक्तिकरण और बहुत कुछ — माँ नर्मदा घाटी के हृदय से।'
            )}</p>
          </div>
        </div>

        {/* Activities Grid */}
        <section className="activities-section">
          {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
          {!loading && activities.length === 0 && (
            <div className="empty-state">
              <div className="icon">🌿</div>
              <p>{t('No activities posted yet. Check back soon!', 'अभी कोई गतिविधि नहीं। जल्द वापस आएं!')}</p>
            </div>
          )}
          {!loading && activities.length > 0 && (
            <div className="activities-grid">
              {activities.map(act => <ActivityCard key={act._id || act.id} act={act} lang={lang} />)}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
