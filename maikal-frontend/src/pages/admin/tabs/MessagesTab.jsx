import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { toast } from '../../../components/Toast';

export default function MessagesTab() {
  const [msgs, setMsgs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/contact')
      .then(d => setMsgs(d.data || []))
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="tab-panel active">
      <div className="page-title" style={{marginBottom:16}}>💬 Contact Messages</div>
      {loading
        ? <div className="spinner-wrap"><div className="spinner"/></div>
        : <table className="data-table">
            <thead><tr><th>Name</th><th>Mobile</th><th>Email</th><th>Message</th><th>Date</th></tr></thead>
            <tbody>
              {msgs.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.name || '—'}</strong></td>
                  <td>{m.mobile || '—'}</td>
                  <td>{m.email || '—'}</td>
                  <td style={{maxWidth:250}}>{m.message}</td>
                  <td style={{fontSize:'.78rem',color:'#6b7280'}}>{new Date(m.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {!msgs.length && <tr><td colSpan={5} style={{textAlign:'center',padding:24,color:'#6b7280'}}>No messages yet</td></tr>}
            </tbody>
          </table>
      }
    </div>
  );
}
