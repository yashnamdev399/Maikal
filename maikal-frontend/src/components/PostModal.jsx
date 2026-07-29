import { useLang } from '../context/LangContext';

export default function PostModal({ p, lang, onClose }) {
  if (!p) return null;
  const title   = lang === 'hi' ? (p.title_hi || p.title_en || '') : (p.title_en || p.title_hi || '');
  const titleAlt= lang === 'hi' ? (p.title_en || '') : (p.title_hi || '');
  const content = lang === 'hi' ? (p.content_hi || p.content_en || '') : (p.content_en || p.content_hi || '');
  
  // Support both posts (image_url) and activities (images array)
  const imgUrl = p.image_url || (p.images && p.images.length > 0 ? p.images[0] : p.img);
  
  const date = new Date(p.published_at || p.createdAt || p.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  
  return (
    <div className="lightbox open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="lightbox-close" onClick={onClose}>×</button>
      <div className="post-modal-content" onClick={e => e.stopPropagation()}>
        <div className="post-modal-img" style={{ display: 'flex', overflowX: 'auto', snapType: 'x mandatory', gap: 4 }}>
          {(p.images && p.images.length > 0) ? (
            p.images.map((img, i) => (
              <img key={i} src={img} alt={`${title} - ${i + 1}`} style={{ flex: '0 0 100%', width: '100%', objectFit: 'contain', scrollSnapAlign: 'center', background: '#000' }} />
            ))
          ) : imgUrl ? (
            <img src={imgUrl} alt={title} style={{ flex: '0 0 100%', width: '100%', objectFit: 'contain', background: '#000' }} />
          ) : null}
        </div>
        {(p.images && p.images.length > 1) && (
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginTop: 4, fontStyle: 'italic' }}>
            👈 Swipe/Scroll for more images ({p.images.length}) 👉
          </div>
        )}
        <div className="post-modal-body">
          <div className="post-date">📅 {date}</div>
          <h2>{title}</h2>
          {titleAlt && <h4 className="text-muted">{titleAlt}</h4>}
          <div className="post-full-content">{content}</div>
        </div>
      </div>
    </div>
  );
}
