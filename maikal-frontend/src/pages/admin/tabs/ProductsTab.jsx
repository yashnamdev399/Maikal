import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = { name_en:'', name_hi:'', price:'', unit:'', category:'Pulses', in_stock:'1', description_en:'', description_hi:'' };
const CATS  = ['Pulses','Spices','Sweeteners','Flour','Grains'];

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [imgFile, setImgFile]   = useState(null);
  const [saving, setSaving]     = useState(false);

  const load = () => api.get('/products').then(d => setProducts(d.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = (p = null) => {
    setEditing(p);
    setForm(p ? { name_en: p.name_en, name_hi: p.name_hi, price: p.price, unit: p.unit || '', category: p.category || 'Pulses', in_stock: p.in_stock ? '1' : '0', description_en: p.description_en || '', description_hi: p.description_hi || '' } : EMPTY);
    setImgFile(null);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append('image', imgFile);
      else if (editing?.image_url) fd.append('image_url', editing.image_url);
      if (editing) {
        const prodId = editing._id || editing.id || editing.product_id;
        if (!prodId) { toast('Product ID missing. Please refresh page.', 'error'); return; }
        await api.upload('PUT', `/products/${prodId}`, fd);
      } else {
        await api.upload('POST', '/products', fd);
      }
      toast(editing ? 'Product updated!' : 'Product added!');
      setModal(false); load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!id) { toast('Product ID missing. Please refresh page.', 'error'); return; }
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast('Deleted'); load(); }
    catch (e) { toast(e.message, 'error'); }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="tab-panel active">
      <div className="toolbar">
        <div className="page-title">🛒 Products</div>
        <button className="add-btn" onClick={() => open()}>+ Add Product</button>
      </div>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Image</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id || p.id}>
              <td><strong>{p.name_en}</strong><br/><small style={{color:'#6b7280'}}>{p.name_hi}</small></td>
              <td>{p.category}</td>
              <td>₹{p.price} <small>{p.unit}</small></td>
              <td><span className={`badge-stock ${p.in_stock ? 'badge-yes' : 'badge-no'}`}>{p.in_stock ? 'Yes' : 'No'}</span></td>
              <td>{p.image_url && <img src={p.image_url} alt="" style={{width:48,height:48,objectFit:'cover',borderRadius:6}}/>}</td>
              <td className="action-btns">
                <button className="edit-btn" onClick={() => open(p)}>Edit</button>
                <button className="del-btn"  onClick={() => del(p._id || p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={() => setModal(false)} onSave={save} saving={saving}>
          <div className="form-row">
            <div className="form-group"><label>Name (English) *</label><input value={form.name_en} onChange={set('name_en')} required /></div>
            <div className="form-group"><label>नाम (हिंदी) *</label><input value={form.name_hi} onChange={set('name_hi')} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Price *</label><input type="number" step="0.01" value={form.price} onChange={set('price')} required /></div>
            <div className="form-group"><label>Unit</label><input value={form.unit} onChange={set('unit')} placeholder="per kg, per 250g…" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Category</label>
              <select value={form.category} onChange={set('category')}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
            </div>
            <div className="form-group"><label>In Stock</label>
              <select value={form.in_stock} onChange={set('in_stock')}><option value="1">Yes</option><option value="0">No</option></select>
            </div>
          </div>
          <div className="form-group">
            <label>Product Image</label>
            {editing?.image_url && !imgFile && <img src={editing.image_url} alt="" style={{width:80,height:80,objectFit:'cover',borderRadius:8,marginBottom:6,display:'block'}}/>}
            <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])} />
          </div>
          <div className="form-group"><label>Description (English)</label><textarea value={form.description_en} onChange={set('description_en')} /></div>
          <div className="form-group"><label>विवरण (हिंदी)</label><textarea value={form.description_hi} onChange={set('description_hi')} /></div>
        </Modal>
      )}
    </div>
  );
}
