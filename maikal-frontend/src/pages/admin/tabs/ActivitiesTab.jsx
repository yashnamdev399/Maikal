import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = { title_en:'', title_hi:'', content_en:'', content_hi:'' };

export default function ActivitiesTab() {
  const [items, setItems]     = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [imgFiles, setImgFiles] = useState([]);
  const [saving, setSaving]   = useState(false);

  const load = () => api.get('/activities').then(d => setItems(d.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = (a = null) => {
    setEditing(a);
    setForm(a ? { title_en: a.title_en||'', title_hi: a.title_hi||'', content_en: a.content_en||'', content_hi: a.content_hi||'' } : EMPTY);
    setImgFiles([]);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      imgFiles.forEach(f => fd.append('images', f));
      // Keep existing images when editing
      if (editing) {
        const existing = (() => { try { return JSON.parse(editing.images || '[]'); } catch { return []; } })();
        fd.append('existing_images', JSON.stringify(existing));
        await api.upload('PUT', `/activities/${editing._id || editing.id}`, fd);
      } else {
        await api.upload('POST', '/activities', fd);
      }
      toast(editing ? 'Activity updated!' : 'Activity added!');
      setModal(false); load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this activity?')) return;
    try { await api.delete(`/activities/${id}`); toast('Deleted'); load(); }
    catch (e) { toast(e.message, 'error'); }
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
            const imgs = (() => { try { return JSON.parse(a.images || '[]'); } catch { return []; } })();
            return (
              <tr key={a._id || a.id}>
                <td><strong>{a.title_en}</strong><br/><small style={{color:'#6b7280'}}>{a.title_hi}</small></td>
                <td>
                  <div style={{display:'flex',gap:4}}>
                    {imgs.slice(0,3).map((img,i) => <img key={i} src={img} alt="" style={{width:40,height:40,objectFit:'cover',borderRadius:4}}/>)}
                    {imgs.length > 3 && <span style={{fontSize:'.75rem',color:'#6b7280',alignSelf:'center'}}>+{imgs.length-3}</span>}
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
            {editing && (() => { try { return JSON.parse(editing.images||'[]'); } catch { return []; } })().length > 0 && (
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
                {(() => { try { return JSON.parse(editing.images||'[]'); } catch { return []; } })().map((img,i) => (
                  <img key={i} src={img} alt="" style={{width:60,height:60,objectFit:'cover',borderRadius:6}}/>
                ))}
                <small style={{color:'#6b7280',alignSelf:'center'}}>Existing images (kept on save)</small>
              </div>
            )}
            <input type="file" accept="image/*" multiple onChange={e => setImgFiles(Array.from(e.target.files))} />
            {imgFiles.length > 0 && <small style={{color:'#6b7280'}}>{imgFiles.length} new image(s) selected</small>}
          </div>
        </Modal>
      )}
    </div>
  );
}
