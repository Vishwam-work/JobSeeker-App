import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import JobCategories from '@/components/JobCategories';
import HeroCarousel from '@/components/Carousel';
import SearchPage from '@/components/Search';
import TopCompanies from '@/components/TopCompanies';
import JobListings from '@/components/JobListings';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/Cookie';
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* <SearchSection /> */}
      {/* <HeroCarousel /> */}
      <SearchPage />

      <JobListings />
      {/* <JobCategories /> */}
      <TopCompanies />
      <Footer />
      <CookieConsent />
    </div>
  );
}