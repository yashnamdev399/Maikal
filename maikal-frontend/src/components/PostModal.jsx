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
        {imgUrl && (
          <div className="post-modal-img">
            <img src={imgUrl} alt={title} />
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
