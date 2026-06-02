"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {  useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Send,
  ExternalLink,
  CheckCircle,
  User,
  MapPin,
  Banknote    ,
  Clock3
} from "lucide-react";
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
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
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
    location: string ;
    currency: {
      code?: string;
      symbol_native: string;
    };
    salary: string;
    salary_max?: string;
    type: string;
    questions: any[];
    job_count?: number;
    website_apply?: string;
  };

 const REQUIRED_PROFILE_FIELDS = [
  "full_name",
  "phone",
  "resume",
  "skills",
  "country",
  "state",
  "city",
  "experiences",
];

const isProfileComplete = (profile: Record<string, any>) => {
  return REQUIRED_PROFILE_FIELDS.every((field) => {
    const value = profile?.[field];

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "object") {
      return value !== null && Object.keys(value).length > 0;
    }

    return value !== null && value !== undefined && value !== "";
  });
};

const formatNumber = (
  value: string | number,
  currency: string = "INR"
): string => {
  if (!value) return "";

  return new Intl.NumberFormat(
    currency === "INR" ? "en-IN" : "en-US"
  ).format(Number(String(value).replace(/,/g, "")));
};

const fetchUserProfile = async () => {
  setLoadingUserData(true);

  try {
    const token = localStorage.getItem("user_token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_APP}/profile/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) return;

    const profile = await response.json();

    const resumePath = profile.resume;

    const resumeUrl = resumePath
      ? resumePath.startsWith("http")
        ? resumePath
        : `${process.env.NEXT_PUBLIC_URL}${resumePath}`
      : null;

    setUserData({
      ...profile,
      resume: resumeUrl,
    });
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingUserData(false);
  }
};

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("user_token");
    const email = localStorage.getItem("user_email");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/employer/applications/all/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) return;

    const data = await response.json();

    const myApplications = data.filter(
      (app: any) => app.user_email === email
    );

    const appliedIDs = myApplications.map((app: any) =>
      Number(app.job)
    );

    setAppliedJobs(appliedIDs);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchUserProfile();
  fetchUserData();
}, []);

const handleApply = (job: any) => {
  const token = localStorage.getItem("user_token");

  if (!token) {
    setShowLoginPopup(true);
    return;
  }

  if (!userData || !isProfileComplete(userData)) {
    toast.warning(
      "Please complete your profile before applying."
    );

    router.push("/profile");
    return;
  }

  setSelectedJob(job);
  setAnswers({});
  setIsApplyModalOpen(true);
};

const handleAnswerChange = (
  questionIndex: number,
  value: string
) => {
  setAnswers((prev) => ({
    ...prev,
    [questionIndex]: value,
  }));
};

const submitApplication = async () => {
  try {
    const token = localStorage.getItem("user_token");

    if (!token) {
      toast.error("Login required");
      return;
    }

    if (!selectedJob) return;

    const applicationData = {
      job_id: selectedJob.id,
      answers:
        selectedJob.questions?.map(
          (question: string, index: number) => ({
            question,
            answer: answers[index] || "",
          })
        ) || [],
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/applications/submit/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      }
    );

    const result = await response.json();

    if (response.ok) {
      toast.success("Application Submitted");

      setIsApplyModalOpen(false);

      setAppliedJobs((prev) => [
        ...prev,
        Number(selectedJob.id),
      ]);
    } else {
      toast.error(
        result?.error || "Something went wrong"
      );
    }
  } catch (error) {
    console.error(error);
  }
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

        // Fetch company first
        const companyRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/companies/`,
          { headers }
        );

        const rawCompanyData = await companyRes.json();

        const companies = rawCompanyData.data || rawCompanyData;

        const companyData = companies.find(
          (c: any) => String(c.id) === String(id)
        );

        if (!companyData) {
          setCompany(null);
          setJobs([]);
  return;
}

// Fetch jobs using company name
const jobsRes = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/companies/${id}/${encodeURIComponent(
    companyData.company?.company_name
  )}/jobs/`,
  { headers }
);

const jobsData = await jobsRes.json();
console.log("Jobs Data:", jobsData);

        // const rawCompanyData = await companyRes.json();

        // const companies = rawCompanyData.data || rawCompanyData;

        // const companyData = companies.find(
        //   (c: any) => String(c.id) === String(id)
        // );

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
        // const jobsData = await jobsRes.json();
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
                  location: job.location ,
                  website_apply: job.website_apply || "",
                  currency: {
                    symbol_native:
                      job.currency?.symbol_native || "",
                      code: job.currency?.code || "",
                  },
                  salary: job.salary || "Not disclosed",
                  salary_max : job.salary_max || "Not disclosed",
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
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {company.website}
                  </a>
                </p>
              )}
              {/* Description */}
            {company.description && (
              <p ><span className="font-medium">Description:</span>{company.description}</p>
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

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>

                      <div className="flex items-center gap-1">

                        {job.currency?.symbol_native}{" "}
                          {job.salary && (
                      <span className="flex items-center gap-1">
                         {`${formatNumber(
                            job.salary,
                            job.currency?.code
                          )}`} -
                      </span>
                    )}

                      {job.salary_max && (
                      <span className="flex items-center gap-1">
                          {`${formatNumber(
                            job.salary_max,
                            job.currency?.code
                          )}`} / yr
                      </span>
                    )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock3 className="w-4 h-4" />

                        <span>
                          {Array.isArray(job.type)
                            ? job.type
                                .map(
                                  (type: string) =>
                                    type
                                      .split("-")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1).toLowerCase()
                                      )
                                      .join(" ")
                                )
                                .join(", ")
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-2">
                  {/* View Details */}
                  <button
                    onClick={() => router.push(`/job-details?id=${job.id}`)}
                    className="border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition w-full sm:w-auto"
                  >
                    View Details
                  </button>

                  {/* Apply */}
                  <button
                    onClick={() => {
                      if (appliedJobs.includes(Number(job?.id))) {
                        toast.info("You have already applied for this job");
                        return;
                      }

                      // External website apply
                      if (job?.website_apply) {
                        window.open(job.website_apply, "_blank");
                        return;
                      }

                      // Internal apply modal
                      handleApply(job);
                    }}
                    className={`text-sm font-medium px-4 py-2 rounded-md transition w-full sm:w-auto
                      ${
                        appliedJobs.includes(Number(job?.id))
                          ? "bg-green-500 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                  >
                    {appliedJobs.includes(Number(job?.id))
                      ? "Applied"
                      : job?.website_apply
                      ? "Apply Now"
                      : "Apply Now"}
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
      <Dialog
        open={isApplyModalOpen}
        onOpenChange={setIsApplyModalOpen}
      >
        <DialogContent className="max-w-2xl w-full h-[90vh] overflow-y-auto p-6">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Apply for {selectedJob.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Your profile and resume will be sent
                  to employer.
                </p>

                {loadingUserData ? (
                  <div className="flex justify-center py-6">
                    Loading...
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-lg bg-gray-50 space-y-2">
                      <div>
                        <strong>Name:</strong>{" "}
                        {userData?.full_name}
                      </div>

                      <div>
                        <strong>Email:</strong>{" "}
                        {userData?.email}
                      </div>

                      <div>
                        <strong>Phone:</strong> +
                        {userData?.phone_code}{" "}
                        {userData?.phone}
                      </div>
                    </div>

                    {userData?.resume ? (
                      <a
                        href={userData.resume}
                        target="_blank"
                        className="text-blue-600 underline flex items-center gap-1"
                      >
                        View Resume
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <p>No Resume Uploaded</p>
                    )}
                  </>
                )}

                {selectedJob.questions &&
                  selectedJob.questions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold">
                        Additional Questions
                      </h4>

                      {selectedJob.questions.map(
                        (question: string, index: number) => (
                          <div key={index}>
                            <Label>
                              {index + 1}. {question}
                            </Label>

                            <Input
                              value={answers[index] || ""}
                              onChange={(e) =>
                                handleAnswerChange(
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder="Type your answer..."
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={submitApplication}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      setIsApplyModalOpen(false)
                    }
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={showLoginPopup}
        onOpenChange={setShowLoginPopup}
      >
        <DialogContent className="max-w-md">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Login Required
            </h2>

            <p className="text-sm text-gray-600">
              Please login before applying.
            </p>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={() => {
                  setShowLoginPopup(false);
                  window.open("/login", "_blank");
                }}
              >
                Login
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  setShowLoginPopup(false)
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
