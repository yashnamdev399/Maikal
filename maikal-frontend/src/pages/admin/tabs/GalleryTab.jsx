import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = { caption_en:'', caption_hi:'', category:'' };

export default function GalleryTab() {
  const [imgs, setImgs]         = useState([]);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState('');
  const [saving, setSaving]     = useState(false);

  const load = () => api.get('/gallery').then(d => setImgs(d.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setFile(null);
    setPreview('');
    setModal(true);
  };

  const openEdit = (g) => {
    setEditing(g);
    setForm({
      caption_en: g.caption_en || '',
      caption_hi: g.caption_hi || '',
      category: g.category || '',
    });
    setFile(null);
    setPreview(g.image_url || '');
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
    if (!editing && !file) {
      toast('Please select an image file to upload', 'error');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      if (file) formData.append('image', file);
      formData.append('caption_en', form.caption_en);
      formData.append('caption_hi', form.caption_hi);
      formData.append('category', form.category);

      if (editing) {
        await api.upload('PUT', `/gallery/${editing._id || editing.id}`, formData);
        toast('Image updated!');
      } else {
        await api.upload('POST', '/gallery', formData);
        toast('Image added!');
      }
      setModal(false);
      load();
    } catch (e) {
      toast(e.message || 'Error saving image', 'error');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Remove this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast('Removed');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="tab-panel active">
      <div className="toolbar">
        <div className="page-title">🖼️ Gallery</div>
        <button className="add-btn" onClick={openNew}>+ Add Image</button>
      </div>
      <div className="gallery-admin-grid">
        {imgs.map(g => (
          <div key={g._id || g.id} className="gallery-admin-item">
            <img src={g.image_url} alt={g.caption_en || ''} onError={e => { e.target.src='https://via.placeholder.com/160x160?text=Image'; }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              color: '#fff', padding: '16px 8px 6px', fontSize: '0.75rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'70%'}}>
                {g.caption_en || g.caption_hi || 'No caption'}
              </span>
              <button
                type="button"
                onClick={() => openEdit(g)}
                title="Edit details"
                style={{
                  background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
                  borderRadius: 4, padding: '2px 6px', fontSize: '11px', cursor: 'pointer'
                }}
              >✏️</button>
            </div>
            <button className="del-overlay" onClick={() => del(g._id || g.id)} title="Delete">🗑</button>
          </div>
        ))}
        {!imgs.length && <p style={{padding:20,color:'#6b7280'}}>No images yet. Add some!</p>}
      </div>

      {modal && (
        <Modal title={editing ? "Edit Gallery Image" : "Add Gallery Image"} onClose={() => setModal(false)} onSave={save} saving={saving}>
          <div className="form-group">
            <label>{editing ? "Replace Image (optional)" : "Upload Image *"}</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required={!editing} />
            {preview && (
              <div style={{ marginTop: 8 }}>
                <img src={preview} alt="Preview" style={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 6 }} />
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
