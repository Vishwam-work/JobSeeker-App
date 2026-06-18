import JobListings from "@/components/JobListings";
import Header from "@/components/Header";
import SearchPage from '@/components/Search';

export default function Page() {
  return (
    <>
      <Header />
      <SearchPage />
      <JobListings />
    </>
  );
}
