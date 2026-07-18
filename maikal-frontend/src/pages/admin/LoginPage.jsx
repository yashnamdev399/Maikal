import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ email: 'admin@maikalnatural.org', password: '' });
  const [err, setErr]       = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      login(data.token, data.admin);
      navigate('/admin/products');
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-bg" />
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <img src="/images/Maikal Logo.png" alt="Maikal Natural Foundation"
            onError={e => { e.target.style.display = 'none'; }} />
        </div>
        <h2>Maikal Natural Foundation</h2>
        <p>Admin Panel — Sign in to continue</p>
        <form onSubmit={submit}>
          <div className="admin-login-field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              autoComplete="email"
            />
          </div>
          <div className="admin-login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Signing in…' : '🔐 Sign In'}
          </button>
          {err && <p className="admin-login-err">{err}</p>}
        </form>
        <p className="admin-login-back">
          <a href="/">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
