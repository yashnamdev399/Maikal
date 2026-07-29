import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

export default function HeroTab() {
  const [slides, setSlides]   = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [saving, setSaving]   = useState(false);

  const load = () => api.get('/hero').then(d => setSlides(d.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = (s) => {
    setEditing(s);
    setForm({
      badge_en: s.badge_en||'', badge_hi: s.badge_hi||'',
      title_en: s.title_en||'', title_hi: s.title_hi||'',
      accent_en: s.accent_en||'', accent_hi: s.accent_hi||'',
      tagline_en: s.tagline_en||'', tagline_hi: s.tagline_hi||'',
      desc_en: s.desc_en||'', desc_hi: s.desc_hi||'',
    });
    setImgFile(null);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append('image', imgFile);

      if (editing) {
        // Save text content
        await api.put(`/hero/${editing._id || editing.id}`, form);
        // Upload image if selected
        if (imgFile) {
          const imgFd = new FormData();
          imgFd.append('image', imgFile);
          await api.upload('PUT', `/hero/${editing._id || editing.id}/image`, imgFd);
        }
      } else {
        await api.upload('POST', '/hero', fd);
      }
      toast(editing ? 'Slide updated!' : 'Slide added!');
      setModal(false); load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const remove = async (s) => {
    if (!window.confirm('Delete this slide?')) return;
    try {
      await api.delete(`/hero/${s._id || s.id}`);
      toast('Slide deleted!');
      load();
    } catch (e) { toast(e.message, 'error'); }
  };

  const openNew = () => {
    setEditing(null);
    setForm({
      badge_en: '', badge_hi: '',
      title_en: '', title_hi: '',
      accent_en: '', accent_hi: '',
      tagline_en: '', tagline_hi: '',
      desc_en: '', desc_hi: '',
    });
    setImgFile(null);
    setModal(true);
  };

  return (
    <div className="tab-panel active">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <div className="page-title" style={{marginBottom: 0}}>🎨 Hero Slides</div>
        <button className="btn-primary" onClick={openNew}>+ Add Slide</button>
      </div>
      <p style={{color:'#6b7280',fontSize:'.85rem',marginBottom:20}}>
        Edit hero slider slides — change images, text, and badges.
      </p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
        {slides.map((s, i) => (
          <div key={s._id || s.id} style={{background:'#fff',borderRadius:12,overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,.08)',border:'1px solid #e5e7eb'}}>
            {s.image_url
              ? <img src={s.image_url} alt="" style={{width:'100%',height:160,objectFit:'cover'}}/>
              : <div style={{width:'100%',height:160,background:'linear-gradient(135deg,#0a7a6e,#1a6fa8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem'}}>🌾</div>
            }
            <div style={{padding:14}}>
              <div style={{fontSize:'.7rem',color:'#0a7a6e',fontWeight:700,textTransform:'uppercase',marginBottom:4}}>Slide {i+1}</div>
              <div style={{fontWeight:700,fontSize:'.9rem',marginBottom:2}}>{s.title_en} {s.accent_en}</div>
              <div style={{fontSize:'.78rem',color:'#6b7280',marginBottom:12}}>{s.badge_en}</div>
              <div style={{display:'flex', gap: '8px'}}>
                <button className="edit-btn" style={{flex: 1}} onClick={() => open(s)}>✏️ Edit</button>
                <button className="delete-btn" style={{padding: '8px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer'}} onClick={() => remove(s)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        {!slides.length && (
          <p style={{color:'#6b7280',padding:20}}>
            No slides found. Run the new SQL in init.sql to seed hero slides, then refresh.
          </p>
        )}
      </div>

      {(modal && (editing || !editing)) && (
        <Modal title={editing ? `Edit Slide ${editing.sort_order || ''}` : 'Add New Slide'} onClose={() => setModal(false)} onSave={save} saving={saving}>
          <div className="form-group">
            <label>Hero Image</label>
            {editing?.image_url && !imgFile && (
              <img src={editing.image_url} alt="" style={{width:'100%',height:120,objectFit:'cover',borderRadius:8,marginBottom:8}}/>
            )}
            <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])} />
            <small style={{color:'#6b7280'}}>Recommended: 1200×700px or wider</small>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Badge (English)</label><input value={form.badge_en} onChange={set('badge_en')} /></div>
            <div className="form-group"><label>बैज (हिंदी)</label><input value={form.badge_hi} onChange={set('badge_hi')} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Title (English)</label><input value={form.title_en} onChange={set('title_en')} /></div>
            <div className="form-group"><label>शीर्षक (हिंदी)</label><input value={form.title_hi} onChange={set('title_hi')} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Accent Line (English)</label><input value={form.accent_en} onChange={set('accent_en')} /></div>
            <div className="form-group"><label>एक्सेंट (हिंदी)</label><input value={form.accent_hi} onChange={set('accent_hi')} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Tagline (English)</label><input value={form.tagline_en} onChange={set('tagline_en')} /></div>
            <div className="form-group"><label>टैगलाइन (हिंदी)</label><input value={form.tagline_hi} onChange={set('tagline_hi')} /></div>
          </div>
          <div className="form-group"><label>Description (English)</label><textarea rows={3} value={form.desc_en} onChange={set('desc_en')} /></div>
          <div className="form-group"><label>विवरण (हिंदी)</label><textarea rows={3} value={form.desc_hi} onChange={set('desc_hi')} /></div>
        </Modal>
      )}
    </div>
  );
}
