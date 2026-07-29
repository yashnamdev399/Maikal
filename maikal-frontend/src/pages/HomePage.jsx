import Navbar    from '../components/Navbar';
import Footer    from '../components/Footer';
import ToastContainer from '../components/Toast';
import AnnouncementBar from '../components/AnnouncementBar';
import HeroSlider from '../components/HeroSlider';
import ProductsSection from '../components/ProductsSection';
import StoriesSection  from '../components/StoriesSection';
import FarmCarousel    from '../components/FarmCarousel';
import ContactSection  from '../components/ContactSection';
import SocialSection   from '../components/SocialSection';
import {
  StatsStrip, FeaturesStrip, TrustStrip, ProcessSection,
  PromoBanner, Testimonials, TrustBadges, AboutSection,
} from '../components/StaticSections';

export default function HomePage() {
  return (
    <>
      <ToastContainer />
      <a href="https://wa.me/919926036075" target="_blank" rel="noreferrer" className="wa-float" title="Order on WhatsApp">💬</a>

      <AnnouncementBar />
      <Navbar />
      <HeroSlider />
      <StatsStrip />
      <FeaturesStrip />
      <TrustStrip />
      <ProcessSection />
      <ProductsSection />
      <PromoBanner />
      <StoriesSection />
      <Testimonials />
      <SocialSection />
      <TrustBadges />
      <FarmCarousel />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  );
}
