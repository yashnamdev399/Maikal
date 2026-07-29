import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = { image_url:'', caption_en:'', caption_hi:'', category:'' };

export default function GalleryTab() {
  const [imgs, setImgs]         = useState([]);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState('');
  const [saving, setSaving]     = useState(false);

  const load = () => api.get('/gallery').then(d => setImgs(d.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = () => {
    setForm(EMPTY);
    setFile(null);
    setPreview('');
    setModal(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const save = async () => {
    if (!file && !form.image_url) {
      toast('Please select an image file to upload', 'error');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      if (file) formData.append('image', file);
      if (form.caption_en) formData.append('caption_en', form.caption_en);
      if (form.caption_hi) formData.append('caption_hi', form.caption_hi);
      if (form.category) formData.append('category', form.category);

      await api.upload('POST', '/gallery', formData);
      toast('Image added!');
      setModal(false);
      load();
    } catch (e) {
      toast(e.message || 'Error uploading image', 'error');
    } finally {
      setSaving(false);
    }
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
          <div key={g._id || g.id} className="gallery-admin-item">
            <img src={g.image_url} alt={g.caption_en || ''} onError={e => { e.target.src='https://via.placeholder.com/160x160?text=Image'; }} />
            <button className="del-overlay" onClick={() => del(g._id || g.id)} title="Delete">🗑</button>
          </div>
        ))}
        {!imgs.length && <p style={{padding:20,color:'#6b7280'}}>No images yet. Add some!</p>}
      </div>

      {modal && (
        <Modal title="Add Gallery Image" onClose={() => setModal(false)} onSave={save} saving={saving}>
          <div className="form-group">
            <label>Upload Image *</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required />
            {preview && (
              <div style={{ marginTop: 8 }}>
                <img src={preview} alt="Preview" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 6 }} />
              </div>
            )}
          </div>
          <div className="form-group"><label>Caption (English)</label><input value={form.caption_en} onChange={set('caption_en')} /></div>
          <div className="form-group"><label>कैप्शन (हिंदी)</label><input value={form.caption_hi} onChange={set('caption_hi')} /></div>
          <div className="form-group"><label>Category</label><input value={form.category} onChange={set('category')} placeholder="Farm, Event, Products…" /></div>
        </Modal>
      )}
    </div>
  );
}
