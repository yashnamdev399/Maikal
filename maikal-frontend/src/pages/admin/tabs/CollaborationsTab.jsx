import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';
import Modal from '../Modal';

const EMPTY = {
  name_en: '',
  name_hi: '',
  website_url: '',
  sort_order: '0',
  is_active: '1',
};

export default function CollaborationsTab() {
  const [items, setItems]       = useState([]);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState('');
  const [saving, setSaving]     = useState(false);
  const [loading, setLoading]   = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/collaborations/all')
      .then(d => setItems(d.data || []))
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      ...EMPTY,
      sort_order: String(items.length + 1),
    });
    setFile(null);
    setPreview('');
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name_en: item.name_en || '',
      name_hi: item.name_hi || '',
      website_url: item.website_url || '',
      sort_order: String(item.sort_order ?? 0),
      is_active: item.is_active ? '1' : '0',
    });
    setFile(null);
    setPreview(item.logo_url || '');
    setModal(true);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const save = async () => {
    if (!form.name_en.trim()) {
      toast('Organization Name (English) is required', 'error');
      return;
    }
    if (!editing && !file) {
      toast('Please upload a logo image', 'error');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name_en', form.name_en);
      formData.append('name_hi', form.name_hi);
      formData.append('website_url', form.website_url);
      formData.append('sort_order', form.sort_order);
      formData.append('is_active', form.is_active);

      if (file) {
        formData.append('logo', file);
      } else if (editing?.logo_url) {
        formData.append('logo_url', editing.logo_url);
      }

      if (editing) {
        await api.upload('PUT', `/collaborations/${editing._id || editing.id}`, formData);
        toast('Collaborator updated!');
      } else {
        await api.upload('POST', '/collaborations', formData);
        toast('Collaborator added!');
      }

      setModal(false);
      load();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Are you sure you want to delete this collaborator?')) return;
    try {
      await api.delete(`/collaborations/${id}`);
      toast('Collaborator deleted');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const toggleActive = async (item) => {
    try {
      await api.put(`/collaborations/${item._id || item.id}`, {
        ...item,
        is_active: !item.is_active,
      });
      toast(item.is_active ? 'Hidden from homepage' : 'Visible on homepage');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="tab-panel active">
      <div className="toolbar">
        <div>
          <div className="page-title">🤝 Collaborations & Partners</div>
          <p style={{ color: '#6b7280', fontSize: '.84rem', margin: '4px 0 0' }}>
            Manage the organizations and partners shown in the "Our Collaboration" section on the homepage.
            Upload any logo size — it is automatically contained and scaled without distortion.
          </p>
        </div>
        <button className="add-btn" onClick={openNew}>+ Add Collaborator</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading collaborations…</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '1.1rem', color: '#374151', margin: '0 0 12px' }}>No collaborations added yet</p>
          <button className="add-btn" onClick={openNew}>+ Add First Collaborator</button>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Logo</th>
                <th>Organization Name</th>
                <th>Hindi Name</th>
                <th>Website</th>
                <th style={{ width: '70px', textAlign: 'center' }}>Order</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Status</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id || item.id}>
                  <td>
                    <div style={{
                      width: '64px',
                      height: '50px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                    }}>
                      <img
                        src={item.logo_url}
                        alt={item.name_en}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </td>
                  <td>
                    <strong style={{ fontSize: '.9rem', color: '#111827' }}>{item.name_en}</strong>
                  </td>
                  <td style={{ color: '#4b5563', fontSize: '.85rem' }}>
                    {item.name_hi || <span style={{ color: '#9ca3af' }}>—</span>}
                  </td>
                  <td>
                    {item.website_url ? (
                      <a
                        href={item.website_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--teal)', fontSize: '.82rem', textDecoration: 'underline' }}
                      >
                        Visit Link ↗
                      </a>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '.82rem' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.sort_order ?? 0}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => toggleActive(item)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '.74rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: item.is_active ? '#dcfce7' : '#fee2e2',
                        color: item.is_active ? '#15803d' : '#b91c1c',
                      }}
                    >
                      {item.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => openEdit(item)}
                      title="Edit collaborator"
                      style={{ marginRight: 6 }}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => del(item._id || item.id)}
                      title="Delete collaborator"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={editing ? '✏️ Edit Collaborator' : '🤝 Add New Collaborator'}
          onClose={() => setModal(false)}
          onSave={save}
          saving={saving}
        >
          <div className="form-group">
            <label>Organization Name (English) *</label>
            <input
              type="text"
              value={form.name_en}
              onChange={set('name_en')}
              placeholder="e.g. NARMADA SAMAGRA"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Organization Name (Hindi)</label>
            <input
              type="text"
              value={form.name_hi}
              onChange={set('name_hi')}
              placeholder="e.g. नर्मदा समग्र"
            />
          </div>

          <div className="form-group">
            <label>Logo Image * (No resizing needed — auto-scaled)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {preview && (
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '.75rem', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  Live Card Preview:
                </span>
                <div style={{
                  width: '180px',
                  height: '140px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  boxSizing: 'border-box',
                }}>
                  <div style={{
                    width: '100%',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                      src={preview}
                      alt="Logo preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '55px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <div style={{
                    fontSize: '.68rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    marginTop: '8px',
                    lineHeight: 1.2,
                  }}>
                    {form.name_en || 'ORGANIZATION NAME'}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Website URL (Optional)</label>
            <input
              type="url"
              value={form.website_url}
              onChange={set('website_url')}
              placeholder="https://example.org"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={set('sort_order')}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.is_active} onChange={set('is_active')}>
                <option value="1">Active (Visible)</option>
                <option value="0">Hidden</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

