import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = { image_url:'', caption_en:'', caption_hi:'', category:'' };

export default function GalleryTab() {
  const [imgs, setImgs]       = useState([]);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  const load = () => api.get('/gallery').then(d => setImgs(d.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = () => { setForm(EMPTY); setModal(true); };

  const save = async () => {
    if (!form.image_url) { toast('Image URL is required', 'error'); return; }
    setSaving(true);
    try {
      await api.post('/gallery', { ...form, caption_en: form.caption_en||null, caption_hi: form.caption_hi||null, category: form.category||null });
      toast('Image added!');
      setModal(false); load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Remove this image?')) return;
    try { await api.delete(`/gallery/${id}`); toast('Removed'); load(); }
    catch (e) { toast(e.message, 'error'); }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="tab-panel active">
      <div className="toolbar">
        <div className="page-title">🖼️ Gallery</div>
        <button className="add-btn" onClick={open}>+ Add Image</button>
      </div>
      <div className="gallery-admin-grid">
        {imgs.map(g => (
          <div key={g.id} className="gallery-admin-item">
            <img src={g.image_url} alt={g.caption_en || ''} onError={e => { e.target.src='https://via.placeholder.com/160x160?text=Image'; }} />
            <button className="del-overlay" onClick={() => del(g.id)} title="Delete">🗑</button>
          </div>
        ))}
        {!imgs.length && <p style={{padding:20,color:'#6b7280'}}>No images yet. Add some!</p>}
      </div>

      {modal && (
        <Modal title="Add Gallery Image" onClose={() => setModal(false)} onSave={save} saving={saving}>
          <div className="form-group"><label>Image URL *</label><input type="url" value={form.image_url} onChange={set('image_url')} placeholder="https://…" required /></div>
          <div className="form-group"><label>Caption (English)</label><input value={form.caption_en} onChange={set('caption_en')} /></div>
          <div className="form-group"><label>कैप्शन (हिंदी)</label><input value={form.caption_hi} onChange={set('caption_hi')} /></div>
          <div className="form-group"><label>Category</label><input value={form.category} onChange={set('category')} placeholder="Farm, Event, Products…" /></div>
        </Modal>
      )}
    </div>
  );
}
