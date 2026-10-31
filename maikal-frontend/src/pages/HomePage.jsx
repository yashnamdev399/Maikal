import Navbar    from '../components/Navbar';
import Footer    from '../components/Footer';
import ToastContainer from '../components/Toast';
import AnnouncementBar from '../components/AnnouncementBar';
import HeroSlider from '../components/HeroSlider';
import StoriesSection  from '../components/StoriesSection';
import FarmCarousel    from '../components/FarmCarousel';
import CollaborationSection from '../components/CollaborationSection';
import ContactSection  from '../components/ContactSection';
import {
  StatsStrip, FeaturesStrip, TrustStrip, ProcessSection,
  PromoBanner, TrustBadges, AboutSection,
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
      <PromoBanner />
      <StoriesSection />
      <TrustBadges />
      <FarmCarousel />
      <AboutSection />
      <CollaborationSection />
      <ContactSection />
      <Footer />
    </>
  );
}
