import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import JobCategories from '@/components/JobCategories';
import TopCompanies from '@/components/TopCompanies';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SearchSection />
      <JobCategories />
      <TopCompanies />
    </div>
  );
}