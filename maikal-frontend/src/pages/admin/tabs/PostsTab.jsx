import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = { title_en:'', title_hi:'', content_en:'', content_hi:'', image_url:'' };

export default function PostsTab() {
  const [posts, setPosts]         = useState([]);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState('');
  const [saving, setSaving]       = useState(false);

  const load = () => api.get('/posts').then(d => setPosts(d.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = (p = null) => {
    setEditing(p);
    setForm(p ? { title_en: p.title_en||'', title_hi: p.title_hi||'', content_en: p.content_en||'', content_hi: p.content_hi||'', image_url: p.image_url||'' } : EMPTY);
    setFile(null);
    setPreview(p?.image_url || '');
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
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title_en', form.title_en);
      formData.append('title_hi', form.title_hi);
      formData.append('content_en', form.content_en);
      formData.append('content_hi', form.content_hi);
      if (file) {
        formData.append('image', file);
      } else if (form.image_url) {
        formData.append('image_url', form.image_url);
      }

      if (editing) {
        await api.upload('PUT', `/posts/${editing._id || editing.id}`, formData);
      } else {
        await api.upload('POST', '/posts', formData);
      }

      toast(editing ? 'Post updated!' : 'Post added!');
      setModal(false);
      load();
    } catch (e) {
      toast(e.message || 'Error saving post', 'error');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this post?')) return;
    try { await api.delete(`/posts/${id}`); toast('Deleted'); load(); }
    catch (e) { toast(e.message, 'error'); }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="tab-panel active">
      <div className="toolbar">
        <div className="page-title">📰 Posts / Stories</div>
        <button className="add-btn" onClick={() => open()}>+ Add Post</button>
      </div>
      <table className="data-table">
        <thead><tr><th>Title</th><th>Date</th><th>Preview</th><th>Actions</th></tr></thead>
        <tbody>
          {posts.map(p => (
            <tr key={p._id || p.id}>
              <td><strong>{p.title_en || '—'}</strong><br/><small style={{color:'#6b7280'}}>{p.title_hi}</small></td>
              <td style={{fontSize:'.82rem',color:'#6b7280'}}>{new Date(p.published_at || p.createdAt || Date.now()).toLocaleDateString('en-IN')}</td>
              <td style={{maxWidth:200,fontSize:'.82rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.content_en}</td>
              <td className="action-btns">
                <button className="edit-btn" onClick={() => open(p)}>Edit</button>
                <button className="del-btn"  onClick={() => del(p._id || p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!posts.length && <tr><td colSpan={4} style={{textAlign:'center',padding:24,color:'#6b7280'}}>No posts yet</td></tr>}
        </tbody>
      </table>

      {modal && (
        <Modal title={editing ? 'Edit Post' : 'Add Post'} onClose={() => setModal(false)} onSave={save} saving={saving}>
          <div className="form-group"><label>Title (English)</label><input value={form.title_en} onChange={set('title_en')} /></div>
          <div className="form-group"><label>शीर्षक (हिंदी)</label><input value={form.title_hi} onChange={set('title_hi')} /></div>
          
          <div className="form-group">
            <label>Image Upload</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <div style={{ marginTop: 8 }}>
                <img src={preview} alt="Preview" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 6 }} />
              </div>
            )}
          </div>

          <div className="form-group"><label>Content (English)</label><textarea rows={4} value={form.content_en} onChange={set('content_en')} /></div>
          <div className="form-group"><label>सामग्री (हिंदी)</label><textarea rows={4} value={form.content_hi} onChange={set('content_hi')} /></div>
        </Modal>
      )}
    </div>
  );
}
