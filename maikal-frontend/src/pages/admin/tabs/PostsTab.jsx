import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = { title_en:'', title_hi:'', content_en:'', content_hi:'', image_url:'' };

export default function PostsTab() {
  const [posts, setPosts]     = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  const load = () => api.get('/posts').then(d => setPosts(d.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = (p = null) => {
    setEditing(p);
    setForm(p ? { title_en: p.title_en||'', title_hi: p.title_hi||'', content_en: p.content_en||'', content_hi: p.content_hi||'', image_url: p.image_url||'' } : EMPTY);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = { ...form, image_url: form.image_url || null };
      if (editing) await api.put(`/posts/${editing._id || editing.id}`, body);
      else         await api.post('/posts', body);
      toast(editing ? 'Post updated!' : 'Post added!');
      setModal(false); load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
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
        <div className="page-title">📰 Posts</div>
        <button className="add-btn" onClick={() => open()}>+ Add Post</button>
      </div>
      <table className="data-table">
        <thead><tr><th>Title</th><th>Date</th><th>Preview</th><th>Actions</th></tr></thead>
        <tbody>
          {posts.map(p => (
            <tr key={p._id || p.id}>
              <td><strong>{p.title_en || '—'}</strong><br/><small style={{color:'#6b7280'}}>{p.title_hi}</small></td>
              <td style={{fontSize:'.82rem',color:'#6b7280'}}>{new Date(p.published_at).toLocaleDateString('en-IN')}</td>
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
          <div className="form-group"><label>Image URL</label><input type="url" value={form.image_url} onChange={set('image_url')} placeholder="https://…" /></div>
          <div className="form-group"><label>Content (English)</label><textarea rows={4} value={form.content_en} onChange={set('content_en')} /></div>
          <div className="form-group"><label>सामग्री (हिंदी)</label><textarea rows={4} value={form.content_hi} onChange={set('content_hi')} /></div>
        </Modal>
      )}
    </div>
  );
}
