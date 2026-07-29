import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';
import { api } from '../utils/api';
import Lightbox from './Lightbox';

function CarouselNav({ idx, maxIdx, move, setIdx }) {
  if (maxIdx <= 0) return null;
  return (
    <>
      <button className="carousel-btn carousel-prev" onClick={() => move(-1)}>&#8249;</button>
      <button className="carousel-btn carousel-next" onClick={() => move(1)}>&#8250;</button>
      <div className="carousel-dots">
        {Array.from({ length: maxIdx + 1 }).map((_, i) => (
          <button key={i} className={`carousel-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </>
  );
}

function PostCard({ p, lang }) {
  const title   = lang === 'hi' ? (p.title_hi || p.title_en || '') : (p.title_en || p.title_hi || '');
  const titleAlt= lang === 'hi' ? (p.title_en || '') : (p.title_hi || '');
  const content = lang === 'hi' ? (p.content_hi || p.content_en || '') : (p.content_en || p.content_hi || '');
  const date    = new Date(p.published_at || p.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="post-card">
      <div className="post-img">
        {p.image_url
          ? <img src={p.image_url} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          : <div className="post-placeholder-img">🌿</div>}
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
  const [tab, setTab]           = useState('posts');
  const [posts, setPosts]       = useState([]);
  const [gallery, setGallery]   = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading]   = useState(true);

  // Carousel States
  const [postIdx, setPostIdx]       = useState(0);
  const [galleryIdx, setGalleryIdx] = useState(0);

  const getSpv = () => (window.innerWidth <= 768 ? 1 : 3);
  const [slidesPerView, setSPV] = useState(getSpv());

  useEffect(() => {
    const onResize = () => setSPV(getSpv());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    Promise.all([api.get('/posts'), api.get('/gallery')])
      .then(([p, g]) => {
        setPosts(p.data || []);
        setGallery(g.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Post Navigation
  const maxPostIdx = Math.max(0, posts.length - slidesPerView);
  const movePosts = (dir) => setPostIdx(i => {
    let next = i + dir;
    if (next > maxPostIdx) next = 0;
    if (next < 0) next = maxPostIdx;
    return next;
  });

  // Gallery Navigation
  const maxGalleryIdx = Math.max(0, gallery.length - slidesPerView);
  const moveGallery = (dir) => setGalleryIdx(i => {
    let next = i + dir;
    if (next > maxGalleryIdx) next = 0;
    if (next < 0) next = maxGalleryIdx;
    return next;
  });

  const postPct    = (100 / slidesPerView) * postIdx;
  const galleryPct = (100 / slidesPerView) * galleryIdx;

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
        <div id="posts-panel" className="farm-carousel-wrap">
          {posts.length ? (
            <>
              <div className="farm-carousel" style={{ transform: `translateX(-${postPct}%)` }}>
                {posts.map(p => (
                  <div key={p._id || p.id} className="farm-slide" style={{ width: `${100 / slidesPerView}%`, flex: `0 0 ${100 / slidesPerView}%`, padding: '0 10px' }}>
                    <PostCard p={p} lang={lang} />
                  </div>
                ))}
              </div>
              <CarouselNav idx={postIdx} maxIdx={maxPostIdx} move={movePosts} setIdx={setPostIdx} />
            </>
          ) : (
            <div className="empty-state"><div className="icon">📰</div><p>{t('No posts yet', 'अभी कोई पोस्ट नहीं')}</p></div>
          )}
        </div>
      )}

      {!loading && tab === 'gallery' && (
        <div id="gallery-panel" className="farm-carousel-wrap">
          {gallery.length ? (
            <>
              <div className="farm-carousel" style={{ transform: `translateX(-${galleryPct}%)` }}>
                {gallery.map(g => {
                  const cap = lang === 'hi' ? (g.caption_hi || g.caption_en || '') : (g.caption_en || g.caption_hi || '');
                  return (
                    <div key={g._id || g.id} className="farm-slide" style={{ width: `${100 / slidesPerView}%`, flex: `0 0 ${100 / slidesPerView}%`, padding: '0 10px' }}>
                      <div className="gallery-slide-card" onClick={() => setLightbox(g.image_url)}>
                        <img src={g.image_url} alt={cap} loading="lazy" />
                        {cap && <div className="gallery-slide-caption">{cap}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <CarouselNav idx={galleryIdx} maxIdx={maxGalleryIdx} move={moveGallery} setIdx={setGalleryIdx} />
            </>
          ) : (
            <div className="empty-state"><div className="icon">🖼️</div><p>{t('Gallery coming soon', 'गैलरी जल्द आ रही है')}</p></div>
          )}
        </div>
      )}

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
