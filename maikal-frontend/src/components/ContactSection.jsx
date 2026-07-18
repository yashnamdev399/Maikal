import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { api } from '../utils/api';

export default function ContactSection() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', mobile: '', email: '', message: '' });
  const [msg, setMsg]   = useState({ text: '', ok: true });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', { ...form, email: form.email || null });
      setMsg({ text: t('✅ Message sent! We will contact you soon.', '✅ संदेश भेजा गया!'), ok: true });
      setForm({ name: '', mobile: '', email: '', message: '' });
    } catch {
      setMsg({ text: '❌ Something went wrong. Please try again.', ok: false });
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-header">
        <span className="section-tag">{t('Get in Touch', 'संपर्क करें')}</span>
        <h2>{t('Contact Us', 'हमसे संपर्क करें')}</h2>
        <div className="section-divider" />
      </div>
      <div className="contact-grid">
        <div className="contact-info">
          <h3>{t('Reach Us', 'हम तक पहुंचें')}</h3>
          {[
            { icon: '📍', label: t('Address', 'पता'),           val: t('Senior MIG 2, Shivaji Nagar, Bhopal, MP', 'सीनियर एम आई जी 2, शिवाजी नगर, भोपाल, म.प्र.') },
            { icon: '📞', label: t('Phone', 'फोन'),             val: '9926036075' },
            { icon: '✉️', label: t('Email', 'ईमेल'),            val: 'maikalnatural@gmail.com' },
            { icon: '💬', label: t('WhatsApp Order', 'व्हाट्सएप ऑर्डर'), val: '+91 9926036075', href: 'https://wa.me/919926036075' },
          ].map(item => (
            <div key={item.label} className="contact-item">
              <span className="icon">{item.icon}</span>
              <div className="detail">
                <div className="label">{item.label}</div>
                <div className="value">
                  {item.href ? <a href={item.href} style={{ color: 'var(--teal-pale)' }} target="_blank" rel="noreferrer">{item.val}</a> : item.val}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-form">
          <form onSubmit={submit}>
            {[
              { id: 'name',    label: t('Your Name', 'आपका नाम'),                   type: 'text',  ph: 'XXXX XXXXX',      req: true },
              { id: 'mobile',  label: t('Mobile Number', 'मोबाइल नंबर'),            type: 'tel',   ph: '9XXXXXXXXX',        req: true },
              { id: 'email',   label: t('Email (optional)', 'ईमेल (वैकल्पिक)'),    type: 'email', ph: 'you@example.com',   req: false },
            ].map(f => (
              <div key={f.id} className="form-group">
                <label>{f.label}</label>
                <input type={f.type} placeholder={f.ph} required={f.req}
                  value={form[f.id]} onChange={set(f.id)} />
              </div>
            ))}
            <div className="form-group">
              <label>{t('Message / Order Details', 'संदेश / ऑर्डर विवरण')}</label>
              <textarea placeholder="I would like to order..." required
                value={form.message} onChange={set('message')} />
            </div>
            <button type="submit" className="submit-btn">{t('📨 Send Message', '📨 संदेश भेजें')}</button>
            {msg.text && <p style={{ marginTop: 10, textAlign: 'center', fontSize: '.82rem', color: msg.ok ? '#86efac' : '#fca5a5' }}>{msg.text}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
