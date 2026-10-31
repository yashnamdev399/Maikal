import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { api } from '../utils/api';

const DEFAULT_COLLABORATORS = [
  {
    id: '1',
    name_en: 'NARMADA SAMAGRA',
    name_hi: 'नर्मदा समग्र',
    logo_url: '/images/collaborations/narmada-samagra.png',
  },
  {
    id: '2',
    name_en: 'MADHYA PRADESH BIODIVERSITY BOARD',
    name_hi: 'मध्य प्रदेश राज्य जैव विविधता बोर्ड',
    logo_url: '/images/collaborations/mp-biodiversity.png',
  },
  {
    id: '3',
    name_en: 'AIGGPA',
    name_hi: 'एआईजीजीपीए (AIGGPA)',
    logo_url: '/images/collaborations/aiggpa.png',
  },
  {
    id: '4',
    name_en: 'MINISTRY OF ENVIRONMENT, FOREST & CLIMATE CHANGE',
    name_hi: 'पर्यावरण, वन एवं जलवायु परिवर्तन मंत्रालय',
    logo_url: '/images/collaborations/moefcc.png',
  },
];

export default function CollaborationSection() {
  const { lang, t } = useLang();
  const [items, setItems] = useState(DEFAULT_COLLABORATORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.get('/collaborations')
      .then(res => {
        if (isMounted && res.data && res.data.length > 0) {
          setItems(res.data);
        }
      })
      .catch(() => {
        // Fallback to default items on error
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section className="collab-section" id="collaborations">
      <div className="collab-container">
        <div className="collab-header">
          <h2 className="collab-title">{t('OUR COLLABORATION', 'हमारा सहयोग')}</h2>
          <p className="collab-subtitle">{t('for greater impact', 'अधिक प्रभाव के लिए')}</p>
        </div>

        <div className="collab-grid">
          {items.map(item => {
            const name = lang === 'hi' ? (item.name_hi || item.name_en) : (item.name_en || item.name_hi);
            const CardWrapper = item.website_url ? 'a' : 'div';
            const cardProps = item.website_url ? {
              href: item.website_url,
              target: '_blank',
              rel: 'noopener noreferrer',
              title: name,
            } : {};

            return (
              <CardWrapper
                key={item._id || item.id}
                className="collab-card"
                {...cardProps}
              >
                <div className="collab-logo-box">
                  <img
                    src={item.logo_url}
                    alt={name}
                    className="collab-logo-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="collab-name">
                  {name}
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}

