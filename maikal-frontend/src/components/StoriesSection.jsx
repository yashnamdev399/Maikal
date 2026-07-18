import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { api } from '../utils/api';
import Lightbox from './Lightbox';

function PostCard({ p, lang }) {
  const title   = lang === 'hi' ? (p.title_hi || p.title_en || '') : (p.title_en || p.title_hi || '');
  const titleAlt= lang === 'hi' ? (p.title_en || '') : (p.title_hi || '');
  const content = lang === 'hi' ? (p.content_hi || p.content_en || '') : (p.content_en || p.content_hi || '');
  const date    = new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="post-card">
      <div className="post-img">
        {p.image_url
          ? <img src={p.image_url} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          : '🌿'}
      </div>
      <div className="post-body">
        <div className="post-date">📅 {date}</div>
        <div className="post-title">{title}</div>
        {titleAlt && <div className="post-title-hi">{titleAlt}</div>}
        <div className="post-excerpt">{content}</div>
      </div>
    </div>
  );
}

export default function StoriesSection() {
  const { lang, t } = useLang();
  const [tab, setTab]         = useState('posts');
  const [posts, setPosts]     = useState([]);
  const [gallery, setGallery] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/posts'), api.get('/gallery')])
      .then(([p, g]) => { setPosts(p.data || []); setGallery(g.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="story-section" id="stories">
      <div className="section-header">
        <span className="section-tag">{t('Stories & Gallery', 'कहानियाँ और गैलरी')}</span>
        <h2>{t('From Our Fields & Community', 'हमारे खेतों और समुदाय से')}</h2>
        <p>{t('Updates, stories and moments from Maikal Natural Foundation', 'मेकल नेचुरल फाउंडेशन की खबरें, कहानियाँ और पल')}</p>
        <div className="section-divider" />
      </div>

      <div className="story-tabs">
        <button className={`story-tab${tab === 'posts' ? ' active' : ''}`} onClick={() => setTab('posts')}>
          {t('📰 Posts', '📰 पोस्ट')}
        </button>
        <button className={`story-tab${tab === 'gallery' ? ' active' : ''}`} onClick={() => setTab('gallery')}>
          {t('🖼️ Gallery', '🖼️ गैलरी')}
        </button>
      </div>

      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {!loading && tab === 'posts' && (
        <div id="posts-panel">
          {posts.length
            ? <div className="posts-grid">{posts.map(p => <PostCard key={p.id} p={p} lang={lang} />)}</div>
            : <div className="empty-state"><div className="icon">📰</div><p>{t('No posts yet', 'अभी कोई पोस्ट नहीं')}</p></div>
          }
        </div>
      )}

      {!loading && tab === 'gallery' && (
        <div id="gallery-panel">
          {gallery.length
            ? <div className="masonry-grid">
                {gallery.map(g => {
                  const cap = lang === 'hi' ? (g.caption_hi || g.caption_en || '') : (g.caption_en || g.caption_hi || '');
                  return (
                    <div key={g.id} className="masonry-item" onClick={() => setLightbox(g.image_url)}>
                      <img src={g.image_url} alt={cap} loading="lazy" />
                      {cap && <div className="masonry-caption">{cap}</div>}
                    </div>
                  );
                })}
              </div>
            : <div className="empty-state"><div className="icon">🖼️</div><p>{t('Gallery coming soon', 'गैलरी जल्द आ रही है')}</p></div>
          }
        </div>
      )}

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
