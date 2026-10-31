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
      badge_en: s.badge_en || '', badge_hi: s.badge_hi || '',
      title_en: s.title_en || '', title_hi: s.title_hi || '',
      accent_en: s.accent_en || '', accent_hi: s.accent_hi || '',
      tagline_en: s.tagline_en || '', tagline_hi: s.tagline_hi || '',
      desc_en: s.desc_en || '', desc_hi: s.desc_hi || '',

      stat1_val_en: s.stat1_val_en || '13+',
      stat1_lbl_en: s.stat1_lbl_en || 'Years of Work',
      stat1_lbl_hi: s.stat1_lbl_hi || 'कार्य के वर्ष',

      stat2_val_en: s.stat2_val_en || 'Narmada Ecosystem',
      stat2_val_hi: s.stat2_val_hi || 'नर्मदा इकोसिस्टम',
      stat2_lbl_en: s.stat2_lbl_en || 'Operational Area',
      stat2_lbl_hi: s.stat2_lbl_hi || 'कार्यक्षेत्र',

      stat3_val_en: s.stat3_val_en || 'Section 8',
      stat3_lbl_en: s.stat3_lbl_en || 'Not for Profit',
      stat3_lbl_hi: s.stat3_lbl_hi || 'गैर-लाभकारी',
    });
    setImgFile(null);
    setModal(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm({
      badge_en: '', badge_hi: '',
      title_en: '', title_hi: '',
      accent_en: '', accent_hi: '',
      tagline_en: '', tagline_hi: '',
      desc_en: '', desc_hi: '',

      stat1_val_en: '13+',
      stat1_lbl_en: 'Years of Work',
      stat1_lbl_hi: 'कार्य के वर्ष',

      stat2_val_en: 'Narmada Ecosystem',
      stat2_val_hi: 'नर्मदा इकोसिस्टम',
      stat2_lbl_en: 'Operational Area',
      stat2_lbl_hi: 'कार्यक्षेत्र',

      stat3_val_en: 'सेक्शन 8',
      stat3_lbl_en: 'Not for Profit',
      stat3_lbl_hi: 'गैर-लाभकारी',
    });
    setImgFile(null);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
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
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (imgFile) fd.append('image', imgFile);
        await api.upload('POST', '/hero', fd);
      }
      toast(editing ? 'Slide updated!' : 'Slide added!');
      setModal(false);
      load();
    } catch (e) {
      toast(e.message || 'Failed to save slide', 'error');
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="tab-panel active">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <div className="page-title" style={{marginBottom: 0}}>🎨 Hero Slides</div>
        <button type="button" className="btn-primary" onClick={openNew}>+ Add Slide</button>
      </div>
      <p style={{color:'#6b7280',fontSize:'.85rem',marginBottom:20}}>
        Edit hero slider slides — change images, text, badges, and bottom stats.
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
                <button type="button" className="edit-btn" style={{flex: 1}} onClick={() => open(s)}>✏️ Edit</button>
                <button type="button" className="delete-btn" style={{padding: '8px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer'}} onClick={() => remove(s)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        {!slides.length && (
          <p style={{color:'#6b7280',padding:20}}>
            No hero slides found. Click '+ Add Slide' to create one.
          </p>
        )}
      </div>

      {modal && (
        <Modal
          title={editing ? `Edit Slide ${editing.sort_order || ''}` : 'Add New Slide'}
          onClose={() => setModal(false)}
          onSave={save}
          saving={saving}
        >
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

          {/* Dynamic 3 Stats Section */}
          <div style={{ margin: '20px 0 10px', borderTop: '2px solid #e5e7eb', paddingTop: 14 }}>
            <strong style={{ fontSize: '.9rem', color: '#0a7a6e' }}>📊 Bottom Stats (Hero Bar)</strong>
            <p style={{ fontSize: '.75rem', color: '#6b7280', margin: '2px 0 12px' }}>
              Directly edit the 3 stat numbers & labels displayed at the bottom of the hero banner.
            </p>
          </div>

          <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>1️⃣ First Stat</div>
            <div className="form-row">
              <div className="form-group"><label>Value</label><input value={form.stat1_val_en || ''} onChange={set('stat1_val_en')} placeholder="13+" /></div>
              <div className="form-group"><label>Label (English)</label><input value={form.stat1_lbl_en || ''} onChange={set('stat1_lbl_en')} placeholder="Years of Work" /></div>
              <div className="form-group"><label>Label (हिंदी)</label><input value={form.stat1_lbl_hi || ''} onChange={set('stat1_lbl_hi')} placeholder="कार्य के वर्ष" /></div>
            </div>
          </div>

          <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>2️⃣ Second Stat</div>
            <div className="form-row">
              <div className="form-group"><label>Value (English)</label><input value={form.stat2_val_en || ''} onChange={set('stat2_val_en')} placeholder="Narmada Ecosystem" /></div>
              <div className="form-group"><label>Value (हिंदी)</label><input value={form.stat2_val_hi || ''} onChange={set('stat2_val_hi')} placeholder="नर्मदा इकोसिस्टम" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Label (English)</label><input value={form.stat2_lbl_en || ''} onChange={set('stat2_lbl_en')} placeholder="Operational Area" /></div>
              <div className="form-group"><label>Label (हिंदी)</label><input value={form.stat2_lbl_hi || ''} onChange={set('stat2_lbl_hi')} placeholder="कार्यक्षेत्र" /></div>
            </div>
          </div>

          <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>3️⃣ Third Stat</div>
            <div className="form-row">
              <div className="form-group"><label>Value</label><input value={form.stat3_val_en || ''} onChange={set('stat3_val_en')} placeholder="Section 8" /></div>
              <div className="form-group"><label>Label (English)</label><input value={form.stat3_lbl_en || ''} onChange={set('stat3_lbl_en')} placeholder="Not for Profit" /></div>
              <div className="form-group"><label>Label (हिंदी)</label><input value={form.stat3_lbl_hi || ''} onChange={set('stat3_lbl_hi')} placeholder="गैर-लाभकारी" /></div>
            </div>
          </div>

          {/* Dynamic 3 Stats Section */}
          <div style={{ margin: '20px 0 10px', borderTop: '2px solid #e5e7eb', paddingTop: 14 }}>
            <strong style={{ fontSize: '.9rem', color: '#0a7a6e' }}>📊 Bottom Stats (Hero Bar)</strong>
            <p style={{ fontSize: '.75rem', color: '#6b7280', margin: '2px 0 12px' }}>
              Directly edit the 3 stat numbers & labels displayed at the bottom of the hero banner.
            </p>
          </div>

          <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>1️⃣ First Stat</div>
            <div className="form-row">
              <div className="form-group"><label>Value</label><input value={form.stat1_val_en || ''} onChange={set('stat1_val_en')} placeholder="13+" /></div>
              <div className="form-group"><label>Label (English)</label><input value={form.stat1_lbl_en || ''} onChange={set('stat1_lbl_en')} placeholder="Years of Work" /></div>
              <div className="form-group"><label>Label (हिंदी)</label><input value={form.stat1_lbl_hi || ''} onChange={set('stat1_lbl_hi')} placeholder="कार्य के वर्ष" /></div>
            </div>
          </div>

          <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>2️⃣ Second Stat</div>
            <div className="form-row">
              <div className="form-group"><label>Value (English)</label><input value={form.stat2_val_en || ''} onChange={set('stat2_val_en')} placeholder="Narmada Ecosystem" /></div>
              <div className="form-group"><label>Value (हिंदी)</label><input value={form.stat2_val_hi || ''} onChange={set('stat2_val_hi')} placeholder="नर्मदा इकोसिस्टम" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Label (English)</label><input value={form.stat2_lbl_en || ''} onChange={set('stat2_lbl_en')} placeholder="Operational Area" /></div>
              <div className="form-group"><label>Label (हिंदी)</label><input value={form.stat2_lbl_hi || ''} onChange={set('stat2_lbl_hi')} placeholder="कार्यक्षेत्र" /></div>
            </div>
          </div>

          <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>3️⃣ Third Stat</div>
            <div className="form-row">
              <div className="form-group"><label>Value</label><input value={form.stat3_val_en || ''} onChange={set('stat3_val_en')} placeholder="Section 8" /></div>
              <div className="form-group"><label>Label (English)</label><input value={form.stat3_lbl_en || ''} onChange={set('stat3_lbl_en')} placeholder="Not for Profit" /></div>
              <div className="form-group"><label>Label (हिंदी)</label><input value={form.stat3_lbl_hi || ''} onChange={set('stat3_lbl_hi')} placeholder="गैर-लाभकारी" /></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
