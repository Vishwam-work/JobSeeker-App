"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompanyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  console.log("Company ID:", id);
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");
  type Company = {
    id: string | number;
    name: string;
    type?: string;
    industry?: string;
    size?: string;
    city?: string;
    state?: string;
    country?: string;
    website?: string;
    description?: string;
  };
  type Job = {
    id: string | number;
    title: string;
    description: string;
    location: string;
    salary: string;
    type: string;
    questions: any[];
  };

  useEffect(() => {
    if (!id) return;

    setCompany(null);
    setJobs([]);
    setLoading(true);
    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [companyRes, jobsRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/companies/`,
            { headers },
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/companies/${id}/jobs/`,
            { headers },
          ),
        ]);

        const rawCompanyData = await companyRes.json();
        console.log("API Response:", rawCompanyData);

        const companyData = rawCompanyData.find(
          (c: any) => String(c.id) === String(id),
        );

        if (!companyData) {
          setCompany(null);
          setJobs([]);
          return;
        }

        if (!companyData) {
          setCompany(null);
          setJobs([]);
          return;
        }
        const jobsData = await jobsRes.json();
        console.log("Company Data:", companyData);

        const mappedCompany: Company = {
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
        };

        setCompany(mappedCompany);

        const jobList: Job[] =
          Array.isArray(jobsData) ||
          Array.isArray(jobsData.data) ||
          Array.isArray(jobsData.results)
            ? (jobsData.data || jobsData.results || jobsData).map(
                (job: any): Job => ({
                  id: job.id,
                  title: job.title || job.job_title || "Untitled Job",
                  description: job.description || "No description provided.",
                  location: job.location?.name || job.city?.name || "N/A",
                  salary: job.salary || "Not specified",
                  type: job.job_type || job.type || "Not specified",
                  questions: job.questions || [],
                }),
              )
            : [];

        setJobs(jobList);
      } catch (error) {
        console.error("Error fetching details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompanyDetails();
  }, [id]);

  const redirectToHomeWithSearch = (jobTitle?: string) => {
    if (!jobTitle) return;
    router.push(`/?search=${encodeURIComponent(jobTitle)}`);
  };

  if (loading)
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>

        <div className="space-y-4 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border rounded-lg p-4 shadow-sm flex justify-between items-center"
            >
              <div className="space-y-2 w-3/4">
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  if (!company) return <p className="p-6">Company not found.</p>;

  return (
    <div key={id} className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="px-4 sm:px-6 md:px-10 py-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-6 w-full">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {company?.name || "Company name not available"}
            </h1>

            <p className="text-gray-600 text-sm sm:text-base">
              {company?.industry || "N/A"} • {company?.type || "N/A"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {[company?.city, company?.state, company?.country]
                .filter(Boolean)
                .join(", ")}
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
        <div className="flex gap-6 border-b mt-6">
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-2 text-sm font-semibold ${
              activeTab === "about"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            About Company
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-2 text-sm font-semibold ${
              activeTab === "jobs"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Jobs ({jobs.length})
          </button>
        </div>
        {activeTab === "about" && company.description && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">About Company</h2>
            <p className="text-gray-700">{company.description}</p>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="mt-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3">
              {jobs.length} Job openings at {company.name}
            </h2>

            {Array.isArray(jobs) && jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {job.description}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      📍 {job.location} | 💰 {job.salary} | 🕒 {job.type}
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-0 sm:ml-4">
                    <button
                      onClick={() => redirectToHomeWithSearch(job.title)}
                      className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No jobs available for this company.
              </p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
