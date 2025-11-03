"use client";

// import Image from "next/image";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

export default function CompanyDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        console.log("Using token:", token);

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [companyRes, jobsRes] = await Promise.all([
          fetch(
            `https://jobseeker-backend-jy1y.onrender.com/employeer/api/companies/${id}/`,
            { headers }
          ),
          fetch(
            `https://jobseeker-backend-jy1y.onrender.com/employeer/api/companies/${id}/jobs/`,
            { headers }
          ),
        ]);

        const companyData = await companyRes.json();
        const jobsData = await jobsRes.json();

        console.log("Company Detail Response:", companyData);
        console.log("Company Jobs Response:", jobsData);

        const mappedCompany = {
          id: companyData.id,
          name: companyData.company_name,
          type: companyData.company_type,
          industry: companyData.industry,
          size: companyData.company_size,
          city: companyData.city,
          state: companyData.state,
          country: companyData.country,
          website: companyData.website,
          description: companyData.description,
          // logo: companyData.logo_url || "/placeholder-company.png",
        };

        setCompany(mappedCompany);

        // ✅ Map jobs safely
        const jobList =
          Array.isArray(jobsData) ||
          Array.isArray(jobsData.data) ||
          Array.isArray(jobsData.results)
            ? (jobsData.data || jobsData.results || jobsData).map((job) => ({
                id: job.id,
                title: job.title || job.job_title,
                description: job.description || "No description provided.",
                location: job.location.name || job.city.name || "N/A",
                salary: job.salary || "Not specified",
                type: job.job_type || job.type || "",
              }))
            : [];

        setJobs(jobList);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompanyDetails();
  }, [id]);

  if (loading) return <p className="p-6">Loading company details...</p>;
  if (!company) return <p className="p-6">Company not found.</p>;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="px-4 sm:px-6 md:px-10 py-6 w-full max-w-7xl mx-auto">
        {/* Company Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-6 w-full">
          {/* <Image
            src={company.logo}
            alt={company.name}
            width={100}
            height={100}
            className="rounded-md bg-gray-100 p-2 object-contain w-20 h-20 sm:w-24 sm:h-24"
          /> */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {company.industry} • {company.type}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {company.city?.name || company.city}, {company.state?.name || company.state}, {company.country?.name || company.country}
            </p>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline mt-1 block"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">About Company</h2>
            <p className="text-gray-700">{company.description}</p>
          </div>
        )}

        {/* Jobs Section */}
        <div className="mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            {jobs.length} Job openings at {company.name}
          </h2>

          {Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition mb-3"
              >
                <h3 className="font-semibold text-base">{job.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  📍 {job.location} | 💰 {job.salary} | 🕒 {job.type}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No jobs available for this company.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
