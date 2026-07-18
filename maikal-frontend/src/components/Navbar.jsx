import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LangContext';

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { href: '/#home',        en: 'Home',           hi: 'होम' },
    { href: '/#products',    en: 'Products',        hi: 'उत्पाद' },
    { href: '/activities',   en: 'Our Activities',  hi: 'हमारी गतिविधियां' },
    { href: '/publications', en: 'Publications',    hi: 'प्रकाशन' },
    { href: '/#stories',     en: 'Stories',         hi: 'कहानियाँ' },
    { href: '/#about',       en: 'About',           hi: 'हमारे बारे में' },
    { href: '/#contact',     en: 'Contact',         hi: 'संपर्क' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <Link to="/" className="nav-logo">
        <img src="/images/Maikal Logo.png" alt="Maikal" style={{ height: 50, width: 160 }}
          onError={e => { e.target.style.display = 'none'; }} />
      </Link>

      <ul className={`nav-links${menuOpen ? ' open' : ''}`} id="nav-links">
        {navLinks.map(l => (
          <li key={l.en}>
            {l.href.startsWith('/#') ? (
              <a href={l.href}>{t(l.en, l.hi)}</a>
            ) : (
              <Link to={l.href}>{t(l.en, l.hi)}</Link>
            )}
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <button className="lang-toggle" onClick={toggleLang}>
          {lang === 'hi' ? 'English' : 'हिंदी'}
        </button>
        <Link to="/admin" className="nav-admin-btn">{t('Admin', 'एडमिन')}</Link>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
