"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {  useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

export default function CompanyDetailPage() {
  const params = useParams();

  const rawId = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const id = rawId ? Number(rawId) : null;
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
    company_logo: string;
    company_size?: string;
     company_type?: string;
     job_count?: number;
  };
  type Job = {
    id: string | number;
    title: string;
    description: string;
    location: string;
    salary: string;
    type: string;
    questions: any[];
    job_count?: number;
  };

  useEffect(() => {
    if (!id) return;

    setCompany(null);
    setJobs([]);
    setLoading(true);
    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem("user_token");
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

        const companies = rawCompanyData.data || rawCompanyData;

        const companyData = companies.find(
          (c: any) => String(c.id) === String(id)
        );

        // console.log("Matched Company:", companyData);

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
        // Country API
        const countryRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_MASTER}/countries/`
        );

        const countryData = await countryRes.json();

        const countries = countryData.data || countryData;

        const matchedCountry = countries.find(
          (c: any) => Number(c.id) === Number(companyData.company?.country)
        );

        // State API
        const stateRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_MASTER}/states/`
        );

        const stateData = await stateRes.json();

        const states = stateData.data || stateData;

        const matchedState = states.find(
          (s: any) => Number(s.id) === Number(companyData.company?.state)
        );

        const cityRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_MASTER}/cities/?state=${companyData.company?.state}`
        );

        const cityData = await cityRes.json();

        const cities =
          cityData.data || cityData.results || cityData;

        const matchedCity = cities.find(
          (c: any) =>
            String(c.id) ===
            String(companyData.company?.city)
        );

        const mappedCompany: Company = {
          id: companyData.company?.id,
          name: companyData.company?.company_name,
          type: companyData.company?.company_type,
          industry: companyData.company?.industry,
          size: companyData.company?.company_size,
          city: matchedCity?.name || "",
          state: matchedState?.name || "",
          country: matchedCountry?.name || "",
          website: companyData.company?.website,
          description: companyData.company?.description,
          company_logo: companyData.company?.company_logo
            ? process.env.NEXT_PUBLIC_URL + companyData.company.company_logo
            : "",
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
                  job_count: job.job_count || 0,
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
            <div className="flex items-center gap-4 mb-2">
            <div  className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                {company.company_logo ? (
                 <Image
                  src={company.company_logo}
                  alt="company logo"
                   width={32}
                   height={25}
                   className="w-12 h-12 rounded-full object-cover border"
                 />
              ) : (
                <User className="w-6 h-6 text-gray-700 hover:text-purple-600" />
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {company?.name || "Company name not available"}
            </h1>
            </div>
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
        {activeTab === "about" && company && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">About Company</h2>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">

              {company.industry && (
                <p><span className="font-medium">Industry:</span> {company.industry}</p>
              )}

              {company.size && (
                <p><span className="font-medium">Company Size:</span> {company.size}</p>
              )}

              {company.type && (
                <p><span className="font-medium">Type:</span> {company.type}</p>
              )}

              {(company.city || company.state || company.country) && (
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {[company.city, company.state, company.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

              {company.website && (
                <p>
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={company.website}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Visit
                  </a>
                </p>
              )}

              {/* Description */}
            {company.description && (
              <p ><span className="font-medium">description:</span>{company.description}</p>
            )}
            </div>
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
                    <div
                     className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 line-clamp-2 overflow-hidden"
                     dangerouslySetInnerHTML={{
                     __html: job.description || "",
                     }}
                     />

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
