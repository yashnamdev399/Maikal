import { useEffect } from 'react';
import { useLang } from '../context/LangContext';

const INSTAGRAM_URL = 'https://www.instagram.com/maikalnaturalfoundation';
const FACEBOOK_PAGE_URL = 'https://www.facebook.com/people/Maikal-Natural-Foundation/100092711359842/';
const FACEBOOK_PAGE_ID = '100092711359842';

export default function SocialSection() {
  const { t } = useLang();

  useEffect(() => {
    // Load Facebook SDK
    if (window.FB) {
      window.FB.XFBML.parse();
      return;
    }
    window.fbAsyncInit = function () {
      window.FB.init({ xfbml: true, version: 'v19.0' });
    };
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    if (!document.getElementById('facebook-jssdk')) {
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="social-section">
      <div className="container">
        {/* Header */}
        <div className="social-header">
          <span className="section-eyebrow">
            {t('Connect With Us', 'हमसे जुड़ें')}
          </span>
          <h2>{t('Follow Our Journey', 'हमारी यात्रा से जुड़ें')}</h2>
          <p>
            {t(
              'Stay updated with our latest activities, products and stories from nature.',
              'हमारी नवीनतम गतिविधियों, उत्पादों और प्रकृति की कहानियों से अपडेट रहें।'
            )}
          </p>
        </div>

        {/* Two column grid */}
        <div className="social-grid">

          {/* ── Instagram Column ── */}
          <div className="social-card instagram-card">
            <div className="social-card-header">
              <div className="social-icon-wrap instagram-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <h3>Instagram</h3>
                <span className="social-handle">@maikalnaturalfoundation</span>
              </div>
            </div>

            {/* Instagram visual grid placeholder */}
            <div className="insta-mosaic">
              {['🌿', '🌾', '🍃', '🌺', '🌻', '🍂'].map((emoji, i) => (
                <a
                  key={i}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="insta-tile"
                  aria-label="View on Instagram"
                >
                  <span className="insta-tile-emoji">{emoji}</span>
                  <div className="insta-tile-overlay">
                    <span>View on Instagram</span>
                  </div>
                </a>
              ))}
            </div>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="social-follow-btn instagram-btn"
              id="instagram-follow-btn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              {t('Follow on Instagram', 'Instagram पर फॉलो करें')}
            </a>
          </div>

          {/* ── Facebook Column ── */}
          <div className="social-card facebook-card">
            <div className="social-card-header">
              <div className="social-icon-wrap facebook-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <h3>Facebook</h3>
                <span className="social-handle">Maikal Natural Foundation</span>
              </div>
            </div>

            {/* Official Facebook Page Plugin */}
            <div className="fb-page-wrapper">
              <div id="fb-root" />
              <div
                className="fb-page"
                data-href={FACEBOOK_PAGE_URL}
                data-tabs="timeline"
                data-width="380"
                data-height="380"
                data-small-header="true"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="false"
              />
            </div>

            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="social-follow-btn facebook-btn"
              id="facebook-follow-btn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {t('Follow on Facebook', 'Facebook पर फॉलो करें')}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
