import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = { title_en:'', title_hi:'', content_en:'', content_hi:'' };

const getImages = (imgs) => {
  if (Array.isArray(imgs)) return imgs.filter(Boolean);
  if (typeof imgs === 'string') {
    try {
      const parsed = JSON.parse(imgs);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {}
    return imgs ? [imgs] : [];
  }
  return [];
};

export default function ActivitiesTab() {
  const [items, setItems]               = useState([]);
  const [modal, setModal]               = useState(false);
  const [editing, setEditing]           = useState(null);
  const [form, setForm]                 = useState(EMPTY);
  const [existingImages, setExisting]   = useState([]);
  const [imgFiles, setImgFiles]         = useState([]);
  const [saving, setSaving]             = useState(false);

  const load = () => api.get('/activities').then(d => setItems(d.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = (a = null) => {
    setEditing(a);
    setForm(a ? { title_en: a.title_en||'', title_hi: a.title_hi||'', content_en: a.content_en||'', content_hi: a.content_hi||'' } : EMPTY);
    setExisting(a ? getImages(a.images) : []);
    setImgFiles([]);
    setModal(true);
  };

  const removeExistingImage = (idx) => {
    setExisting(prev => prev.filter((_, i) => i !== idx));
  };

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      imgFiles.forEach(f => fd.append('images', f));

      if (editing) {
        fd.append('existing_images', JSON.stringify(existingImages));
        await api.upload('PUT', `/activities/${editing._id || editing.id}`, fd);
      } else {
        await api.upload('POST', '/activities', fd);
      }
      toast(editing ? 'Activity updated!' : 'Activity added!');
      setModal(false);
      load();
    } catch (e) {
      toast(e.message || 'Error saving activity', 'error');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this activity?')) return;
    try {
      await api.delete(`/activities/${id}`);
      toast('Deleted');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="tab-panel active">
      <div className="toolbar">
        <div className="page-title">🌿 Activities</div>
        <button className="add-btn" onClick={() => open()}>+ Add Activity</button>
      </div>
      <table className="data-table">
        <thead><tr><th>Title</th><th>Images</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(a => {
            const imgs = getImages(a.images);
            return (
              <tr key={a._id || a.id}>
                <td><strong>{a.title_en || '—'}</strong><br/><small style={{color:'#6b7280'}}>{a.title_hi}</small></td>
                <td>
                  <div style={{display:'flex',gap:4}}>
                    {imgs.slice(0,3).map((img,i) => <img key={i} src={img} alt="" style={{width:40,height:40,objectFit:'cover',borderRadius:4}}/>)}
                    {imgs.length > 3 && <span style={{fontSize:'.75rem',color:'#6b7280',alignSelf:'center'}}>+{imgs.length-3}</span>}
                    {imgs.length === 0 && <span style={{fontSize:'.75rem',color:'#9ca3af'}}>No image</span>}
                  </div>
                </td>
                <td style={{fontSize:'.82rem',color:'#6b7280'}}>{new Date(a.createdAt || a.created_at).toLocaleDateString('en-IN')}</td>
                <td className="action-btns">
                  <button className="edit-btn" onClick={() => open(a)}>Edit</button>
                  <button className="del-btn"  onClick={() => del(a._id || a.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
          {!items.length && <tr><td colSpan={4} style={{textAlign:'center',padding:24,color:'#6b7280'}}>No activities yet</td></tr>}
        </tbody>
      </table>

      {modal && (
        <Modal title={editing ? 'Edit Activity' : 'Add Activity'} onClose={() => setModal(false)} onSave={save} saving={saving}>
          <div className="form-group"><label>Title (English)</label><input value={form.title_en} onChange={set('title_en')} /></div>
          <div className="form-group"><label>शीर्षक (हिंदी)</label><input value={form.title_hi} onChange={set('title_hi')} /></div>
          <div className="form-group"><label>Content (English)</label><textarea rows={4} value={form.content_en} onChange={set('content_en')} /></div>
          <div className="form-group"><label>सामग्री (हिंदी)</label><textarea rows={4} value={form.content_hi} onChange={set('content_hi')} /></div>
          <div className="form-group">
            <label>Images (up to 10)</label>
            {editing && existingImages.length > 0 && (
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10,marginTop:4}}>
                {existingImages.map((img, i) => (
                  <div key={i} style={{position:'relative',display:'inline-block'}}>
                    <img src={img} alt="" style={{width:64,height:64,objectFit:'cover',borderRadius:6,border:'1px solid #e5e7eb'}}/>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      title="Remove image"
                      style={{
                        position:'absolute',top:-6,right:-6,width:20,height:20,borderRadius:'50%',
                        background:'#dc2626',color:'#fff',border:'none',fontSize:'12px',
                        cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1
                      }}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
            <input type="file" accept="image/*" multiple onChange={e => setImgFiles(Array.from(e.target.files))} />
            {imgFiles.length > 0 && <small style={{color:'#6b7280',display:'block',marginTop:4}}>{imgFiles.length} new image(s) selected</small>}
          </div>
        </Modal>
      )}
    </div>
  );
}
