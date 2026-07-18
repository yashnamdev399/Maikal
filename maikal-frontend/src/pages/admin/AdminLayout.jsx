import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/admin/products',      label: '🛒 Products' },
  { to: '/admin/posts',         label: '📰 Posts' },
  { to: '/admin/gallery',       label: '🖼️ Gallery' },
  { to: '/admin/activities',    label: '🌿 Activities' },
  { to: '/admin/publications',  label: '📚 Publications' },
  { to: '/admin/hero',          label: '🎨 Hero Slides' },
  { to: '/admin/testimonials',  label: '⭐ Testimonials' },
  { to: '/admin/messages',      label: '💬 Messages' },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-wrap" style={{ paddingTop: 0 }}>
      <header className="admin-header" style={{ top: 0, position: 'sticky', zIndex: 200 }}>
        <div className="brand">
          <img src="/images/Maikal Logo.png" alt="Maikal" style={{ height: 32, width: 'auto', marginRight: 8, verticalAlign: 'middle' }}
            onError={e => { e.target.style.display = 'none'; }} />
          Maikal Admin
        </div>
        <div className="right">
          <span className="user-chip">{admin?.name || 'Admin'}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
          <a href="/" target="_blank" rel="noreferrer" className="sidebar-item">🌐 View Website</a>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
