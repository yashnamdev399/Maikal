import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = { title_en:'', title_hi:'', description_en:'', description_hi:'' };

export default function PublicationsTab() {
  const [pubs, setPubs]       = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile]     = useState(null);
  const [saving, setSaving]   = useState(false);

  const load = () => api.get('/publications').then(d => setPubs(d.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = (p = null) => {
    setEditing(p);
    setForm(p ? { title_en: p.title_en||'', title_hi: p.title_hi||'', description_en: p.description_en||'', description_hi: p.description_hi||'' } : EMPTY);
    setCoverFile(null); setPdfFile(null);
    setModal(true);
  };

  const save = async () => {
    if (!editing && !pdfFile) { toast('PDF file is required', 'error'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (coverFile) fd.append('cover', coverFile);
      if (pdfFile)   fd.append('pdf', pdfFile);
      if (editing) await api.upload('PUT', `/publications/${editing.id}`, fd);
      else         await api.upload('POST', '/publications', fd);
      toast(editing ? 'Publication updated!' : 'Publication added!');
      setModal(false); load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this publication?')) return;
    try { await api.delete(`/publications/${id}`); toast('Deleted'); load(); }
    catch (e) { toast(e.message, 'error'); }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="tab-panel active">
      <div className="toolbar">
        <div className="page-title">📚 Publications</div>
        <button className="add-btn" onClick={() => open()}>+ Add Publication</button>
      </div>
      <table className="data-table">
        <thead><tr><th>Cover</th><th>Title</th><th>PDF</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          {pubs.map(p => (
            <tr key={p.id}>
              <td>{p.cover_url && <img src={p.cover_url} alt="" style={{width:48,height:64,objectFit:'cover',borderRadius:4}}/>}</td>
              <td><strong>{p.title_en}</strong><br/><small style={{color:'#6b7280'}}>{p.title_hi}</small></td>
              <td><a href={p.pdf_url} target="_blank" rel="noreferrer" style={{color:'#0a7a6e',fontSize:'.82rem'}}>⬇️ Download</a></td>
              <td style={{fontSize:'.82rem',color:'#6b7280'}}>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
              <td className="action-btns">
                <button className="edit-btn" onClick={() => open(p)}>Edit</button>
                <button className="del-btn"  onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!pubs.length && <tr><td colSpan={5} style={{textAlign:'center',padding:24,color:'#6b7280'}}>No publications yet</td></tr>}
        </tbody>
      </table>

      {modal && (
        <Modal title={editing ? 'Edit Publication' : 'Add Publication'} onClose={() => setModal(false)} onSave={save} saving={saving}>
          <div className="form-group"><label>Title (English)</label><input value={form.title_en} onChange={set('title_en')} /></div>
          <div className="form-group"><label>शीर्षक (हिंदी)</label><input value={form.title_hi} onChange={set('title_hi')} /></div>
          <div className="form-group"><label>Description (English)</label><textarea rows={3} value={form.description_en} onChange={set('description_en')} /></div>
          <div className="form-group"><label>विवरण (हिंदी)</label><textarea rows={3} value={form.description_hi} onChange={set('description_hi')} /></div>
          <div className="form-group">
            <label>Cover Image {editing ? '(leave blank to keep existing)' : ''}</label>
            {editing?.cover_url && !coverFile && <img src={editing.cover_url} alt="" style={{width:60,height:80,objectFit:'cover',borderRadius:4,marginBottom:6,display:'block'}}/>}
            <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label>PDF File {editing ? '(leave blank to keep existing)' : '*'}</label>
            {editing?.pdf_url && !pdfFile && <p style={{fontSize:'.8rem',color:'#6b7280',marginBottom:4}}>Current: <a href={editing.pdf_url} target="_blank" rel="noreferrer">View PDF</a></p>}
            <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} />
          </div>
        </Modal>
      )}
    </div>
  );
}
