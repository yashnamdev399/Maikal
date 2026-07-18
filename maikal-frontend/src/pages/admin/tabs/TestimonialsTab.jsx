import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = { quote_en:'', quote_hi:'', name:'', meta_en:'', meta_hi:'', avatar:'👤', rating:'5', sort_order:'0', is_active:'1' };
const AVATARS = ['👤','👩','👨','👩‍🌾','👨‍🌾','👴','👵','🧑'];

export default function TestimonialsTab() {
  const [items, setItems]     = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  const load = () =>
    api.get('/testimonials/all')
      .then(d => setItems(d.data || []))
      .catch(() => {});

  useEffect(() => { load(); }, []);

  const open = (t = null) => {
    setEditing(t);
    setForm(t ? {
      quote_en:   t.quote_en   || '',
      quote_hi:   t.quote_hi   || '',
      name:       t.name       || '',
      meta_en:    t.meta_en    || '',
      meta_hi:    t.meta_hi    || '',
      avatar:     t.avatar     || '👤',
      rating:     String(t.rating     ?? 5),
      sort_order: String(t.sort_order ?? 0),
      is_active:  t.is_active ? '1' : '0',
    } : EMPTY);
    setModal(true);
  };

  const save = async () => {
    if (!form.quote_en || !form.name) { toast('Quote (English) and Name are required', 'error'); return; }
    setSaving(true);
    try {
      const body = { ...form, rating: parseInt(form.rating), sort_order: parseInt(form.sort_order), is_active: form.is_active === '1' };
      if (editing) await api.put(`/testimonials/${editing.id}`, body);
      else         await api.post('/testimonials', body);
      toast(editing ? 'Testimonial updated!' : 'Testimonial added!');
      setModal(false); load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try { await api.delete(`/testimonials/${id}`); toast('Deleted'); load(); }
    catch (e) { toast(e.message, 'error'); }
  };

  const toggle = async (item) => {
    try {
      await api.put(`/testimonials/${item.id}`, { ...item, is_active: !item.is_active });
      toast(item.is_active ? 'Hidden from website' : 'Now visible on website');
      load();
    } catch (e) { toast(e.message, 'error'); }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="tab-panel active">
      <div className="toolbar">
        <div className="page-title">⭐ Testimonials</div>
        <button className="add-btn" onClick={() => open()}>+ Add Testimonial</button>
      </div>

      <p style={{ color:'#6b7280', fontSize:'.82rem', marginBottom:16 }}>
        Testimonials marked <strong>Active</strong> appear on the website. Drag sort_order to reorder.
      </p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Quote (English)</th>
            <th>Rating</th>
            <th>Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ fontSize:'1.4rem', textAlign:'center' }}>{item.avatar || '👤'}</td>
              <td>
                <strong>{item.name}</strong>
                {item.meta_en && <><br/><small style={{ color:'#6b7280' }}>{item.meta_en}</small></>}
              </td>
              <td style={{ maxWidth:260, fontSize:'.82rem', color:'#374151' }}>
                {item.quote_en?.length > 100 ? item.quote_en.slice(0, 100) + '…' : item.quote_en}
              </td>
              <td style={{ textAlign:'center', color:'#f59e0b' }}>
                {'★'.repeat(Math.min(5, item.rating || 5))}
              </td>
              <td style={{ textAlign:'center', color:'#6b7280' }}>{item.sort_order}</td>
              <td>
                <span className={`badge-stock ${item.is_active ? 'badge-yes' : 'badge-no'}`}>
                  {item.is_active ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td className="action-btns">
                <button className="edit-btn" onClick={() => open(item)}>Edit</button>
                <button
                  className="edit-btn"
                  style={{ background: item.is_active ? '#fef3c7' : '#d1fae5', color: item.is_active ? '#92400e' : '#065f46' }}
                  onClick={() => toggle(item)}
                >
                  {item.is_active ? 'Hide' : 'Show'}
                </button>
                <button className="del-btn" onClick={() => del(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!items.length && (
            <tr><td colSpan={7} style={{ textAlign:'center', padding:24, color:'#6b7280' }}>No testimonials yet</td></tr>
          )}
        </tbody>
      </table>

      {modal && (
        <Modal
          title={editing ? 'Edit Testimonial' : 'Add Testimonial'}
          onClose={() => setModal(false)}
          onSave={save}
          saving={saving}
        >
          {/* Avatar picker */}
          <div className="form-group">
            <label>Avatar Emoji</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:4 }}>
              {AVATARS.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, avatar: a }))}
                  style={{
                    fontSize:'1.4rem', padding:'4px 8px', borderRadius:8, cursor:'pointer',
                    border: form.avatar === a ? '2px solid #0a7a6e' : '2px solid #e5e7eb',
                    background: form.avatar === a ? '#f0faf8' : '#fff',
                  }}
                >{a}</button>
              ))}
            </div>
            <input value={form.avatar} onChange={set('avatar')} placeholder="Or type any emoji" style={{ marginTop:4 }} />
          </div>

          <div className="form-group">
            <label>Customer Name *</label>
            <input value={form.name} onChange={set('name')} placeholder="e.g. Sunita Verma" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location / Role (English)</label>
              <input value={form.meta_en} onChange={set('meta_en')} placeholder="Bhopal • Customer since 2023" />
            </div>
            <div className="form-group">
              <label>स्थान / भूमिका (हिंदी)</label>
              <input value={form.meta_hi} onChange={set('meta_hi')} placeholder="भोपाल • 2023 से ग्राहक" />
            </div>
          </div>

          <div className="form-group">
            <label>Quote (English) *</label>
            <textarea rows={3} value={form.quote_en} onChange={set('quote_en')} placeholder="What did the customer say?" required />
          </div>
          <div className="form-group">
            <label>उद्धरण (हिंदी)</label>
            <textarea rows={3} value={form.quote_hi} onChange={set('quote_hi')} placeholder="ग्राहक ने क्या कहा?" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rating (1–5)</label>
              <select value={form.rating} onChange={set('rating')}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Sort Order</label>
              <input type="number" min="0" value={form.sort_order} onChange={set('sort_order')} />
            </div>
          </div>

          <div className="form-group">
            <label>Visibility</label>
            <select value={form.is_active} onChange={set('is_active')}>
              <option value="1">Active — visible on website</option>
              <option value="0">Hidden — not shown</option>
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
}
