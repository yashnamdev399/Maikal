export default function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div className="lightbox open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="lightbox-close" onClick={onClose}>×</button>
      <img src={src} alt="" />
    </div>
  );
}
