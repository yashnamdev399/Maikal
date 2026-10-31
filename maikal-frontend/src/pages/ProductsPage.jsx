import { useEffect } from 'react';
import { useLang } from '../context/LangContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductsSection from '../components/ProductsSection';
import { Testimonials } from '../components/StaticSections';

export default function ProductsPage() {
  const { t } = useLang();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 66 }}>
        {/* Page Hero */}
        <div className="page-hero">
          <div className="page-hero-content">
            <span className="section-tag">{t('Our Products', 'हमारे उत्पाद')}</span>
            <h1>{t("Nature's Best, Naturally Grown", 'प्रकृति का सर्वश्रेष्ठ, प्राकृतिक रूप से उगाया गया')}</h1>
            <p>{t(
              "Handpicked, chemical-free and naturally grown products straight from the heart of Narmada Valley.",
              "माँ नर्मदा के पारिस्थितिकी तंत्र से हस्तचयनित, प्राकृतिक व रसायन-मुक्त उत्पाद सीधे आपके घर तक।"
            )}</p>
          </div>
        </div>

        {/* Products Catalog with Categories and WhatsApp Ordering */}
        <div style={{ padding: '20px 0 20px' }}>
          <ProductsSection showHeader={false} />
        </div>

        {/* Customer Love (Testimonials Segment) */}
        <Testimonials />
      </div>
      <Footer />
    </>
  );
}
