import { useState, useEffect } from 'react';

export default function Lightbox({ src, images, initialIndex = 0, onClose }) {
  const [idx, setIdx] = useState(initialIndex);
  
  // Support both single src and array of images
  let imgList = [];
  if (images && images.length) imgList = images;
  else if (src) imgList = [{ image_url: src }];

  if (imgList.length === 0) return null;
  const currentImg = imgList[idx] || imgList[0];
  const url = typeof currentImg === 'string' ? currentImg : (currentImg.image_url || currentImg.img || currentImg.url);

  const move = (e, dir) => {
    e.stopPropagation();
    let next = idx + dir;
    if (next >= imgList.length) next = 0;
    if (next < 0) next = imgList.length - 1;
    setIdx(next);
  };

  return (
    <div className="lightbox open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="lightbox-close" onClick={onClose}>×</button>
      {imgList.length > 1 && (
        <button className="lightbox-prev" onClick={e => move(e, -1)}>&#8249;</button>
      )}
      <img src={url} alt="Gallery view" />
      {imgList.length > 1 && (
        <button className="lightbox-next" onClick={e => move(e, 1)}>&#8250;</button>
      )}
      {currentImg && currentImg.caption && (
        <div className="lightbox-caption">{currentImg.caption}</div>
      )}
    </div>
  );
}
