"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent,CardTitle,CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import TiptapEditor from "@/components/TiptapEditor";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  Briefcase,
  Clock,
  Building2,
  Users,
  Calendar,
  Bookmark,
  ExternalLink,
  Filter,
  Search,
  CheckCircle,
  Eye,
  Send,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";

export default function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [userData, setUserData] = useState<any>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  // const { savedJobs, addJob, removeJob } = useSavedJobs();
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search");
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Filter states
  const defaultFilters = {
    search: "",
    location: "",
    max_experience: "",
    min_experience: "",
    experience: [] as string[],
    jobType: [] as string[],
    workMode: [] as string[],
    salaryRange: [] as string[],
    companies: [] as string[],
    skills: [] as string[],
    postedWithin: [] as string[],
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  // Sample job data - in real app, this would come from API
  const [companies, setCompanies] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [skillsList, setSkillsList] = useState<string[]>([]);

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [searchCompany, setSearchCompany] = useState("");
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [searchSkill, setSearchSkill] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showMoreExperience, setShowMoreExperience] = useState(false);
  const [showMoreJobType, setShowMoreJobType] = useState(false);
  const [showMoreWorkMode, setShowMoreWorkMode] = useState(false);
  const [showMorePosted, setShowMorePosted] = useState(false);
  const [showMoreCompanies, setShowMoreCompanies] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [dateFilter, setDateFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const experienceList = ["fresher","1-2", "3-5", "6-10", "10+"];
  const [showMoreSalary, setShowMoreSalary] = useState(false);
  const jobTypes = ["Full Time", "Part Time", "Contract", "Internship"];
  const workModes = ["Remote", "Hybrid", "Office"];
  const salaryRanges = [
  "0-3 LPA",
  "3-6 LPA",
  "6-10 LPA",
  "10-15 LPA",
  "15-20 LPA",
  "20+ LPA",
];
  const postedOptions = [
    { label: "Last 24 hours", value: "1" },
    { label: "Last 3 days", value: "3" },
    { label: "Last week", value: "7" },
    { label: "Last month", value: "30" },
  ];
const now = new Date();

const sortedJobs = [...jobs]
  .filter((job) => {
    if (!job.created_at || dateFilter === "all") return true;

    const jobDate = new Date(job.created_at);
    const diffDays =
      (now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24);

    if (dateFilter === "24h") return diffDays <= 1;
    if (dateFilter === "7d") return diffDays <= 7;
    if (dateFilter === "30d") return diffDays <= 30;
    if (dateFilter === "year") return diffDays <= 365;

    return true;
  })
  .sort((a, b) => {
    if (sortBy === "date") {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

      return dateB - dateA;
    }
    return 0;
  });
  const sortedExperience = [
    ...experienceList.filter((e) => filters.experience.includes(e)),
    ...experienceList.filter((e) => !filters.experience.includes(e)),
  ];

  const visibleExperience = showMoreExperience
    ? sortedExperience
    : sortedExperience.slice(0, 4);

  const handleExperienceFilter = (exp: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      experience: checked
        ? [...prev.experience, exp]
        : prev.experience.filter((e) => e !== exp),
    }));
  };
  const handleJobTypeFilter = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      jobType: checked
        ? [...prev.jobType, type]
        : prev.jobType.filter((t) => t !== type),
    }));
  };
  const handleWorkModeFilter = (mode: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      workMode: checked
        ? [...prev.workMode, mode]
        : prev.workMode.filter((m) => m !== mode),
    }));
  };
  const handleSalaryFilter = (range: string, checked: boolean) => {
  setFilters((prev) => ({
    ...prev,
    salaryRange: checked
      ? [...prev.salaryRange, range]
      : prev.salaryRange.filter((r: string) => r !== range),
  }));
};
  const handlePostedFilter = (value: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      postedWithin: checked
        ? [...prev.postedWithin, value]
        : prev.postedWithin.filter((p) => p !== value),
    }));
  };
  const handleCompanyFilter = (company: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      companies: checked
        ? [...prev.companies, company]
        : prev.companies.filter((c) => c !== company),
    }));
  };


  interface Location {
    id: string | number;
    name: string;
  }

  interface Job {
    id: number | string;
    title: string;
    company: string;
    skills: string[];
    location?: string;
    experience?: string;
    max_experience: string;
    min_experience: string;
    work_mode?: string;
    job_type?: string;
    salary?: string;
    salary_max?: string;
    currencyCode?: string;
    created_at?: string;
    description?: string;
    vacancies?: number;
    website_apply?: string;
    urgentHiring?: boolean;
    requirements?: string[];
    benefits?: string[];
    questions?: string[];
    currency?:{
      code: string;
      symbol_native: string;
    }
    company_user?: {
      company_logo: string;
    }
  }
  interface Filters {
    skills: string[];
    companies: string[];
    experience?: string;
    workMode?: string;
  }
  interface Application {
    id: number | string;
    user_email: string;
    job: number | string;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("user_email");
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    const storedApplied = localStorage.getItem("applied_jobs");
    if (storedApplied) {
      setAppliedJobs(JSON.parse(storedApplied));
    }
  }, []);
  useEffect(() => {
    if (searchFromUrl) {
      setFilters((prev) => ({
        ...prev,
        search: searchFromUrl,
      }));
    }
  }, [searchFromUrl]);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/all-jobs/`,
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const jobResults = Array.isArray(data.results)
          ? data.results
          : Array.isArray(data)
            ? data
            : [];

        const companyNames: string[] = Array.from(
          new Set(
            jobResults
              .map((item: { company?: string }) => item.company)
              .filter((c: string | undefined): c is string => Boolean(c)),
          ),
        );

        setCompanies(companyNames);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_APP}/saved-jobs/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) return;
        const data = await res.json();

        // Store the IDs of saved jobs
        const jobIds = data.map((item: any) => item.job);
        setSavedJobIds(jobIds);
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      }
    };

    fetchCompanies();
    fetchSavedJobs();
  }, []);

  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs_category/`,
        );
        const data = await response.json();

        const skillNames = data.map((skill: any) => skill.name);

        setSkillsList(skillNames);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    fetchJobs(page);
  }, [page, appliedFilters,searchFromUrl]);

  const fetchJobs = async (page : number) => {
    try {
      setLoading(true);
      console.log("Fetching jobs with filters:", appliedFilters);
      const params = new URLSearchParams();

      params.append("page", page.toString());
      if (searchFromUrl) {
        params.append("search", searchFromUrl);
      }

      if (appliedFilters.location) params.append("location", appliedFilters.location);

      appliedFilters.jobType.forEach(j => params.append("job_type", j));
      appliedFilters.workMode.forEach(w => params.append("work_mode", w));
      appliedFilters.salaryRange.forEach(s => params.append("salary_range", s.split(" ")[0]));
      if (appliedFilters.postedWithin.length > 0) {
        appliedFilters.postedWithin.forEach(p => params.append("posted_within", p));
      }

      if (appliedFilters.companies.length > 0) {
        appliedFilters.companies.forEach(company => params.append("company", company));
      }

      if (appliedFilters.min_experience) {
        params.append("min_experience", appliedFilters.min_experience);
      }

      if (appliedFilters.max_experience) {
        params.append("max_experience", appliedFilters.max_experience);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/all-jobs/?${params.toString()}`,
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = Array.isArray(data.results)
        ? data.results
        : Array.isArray(data)
          ? data
          : [];

      const locationNames: string[] = results
        .map((job: any): string | undefined => job?.location)
        .filter((loc: string | undefined): loc is string => {
          return typeof loc === "string" && loc.trim() !== "";
        });
      const companyNames: string[] = results
        .map((job: any): string | undefined => job?.company)
        .filter((company: string | undefined): company is string => {
          return typeof company === "string" && company.trim() !== "";
        });

      const uniqueCompanies: string[] = Array.from(new Set(companyNames));
       const uniqueLocations: Location[] = Array.from(
          new Set(locationNames)
        ).map((name) => ({
          id: name,
          name,
        }));

      console.log("Jobs data:", results);
      setJobs(results);
      setAllLocations((prev) => {
        const merged = [...prev, ...uniqueLocations];

        const unique = Array.from(
          new Map(merged.map((item) => [item.name, item])).values()
        );

        return unique;
      });
      setCompanies((prev) => {
        const merged = [...prev, ...uniqueCompanies];
        return Array.from(new Set(merged));
      });
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setTotalCount(data.count || 0);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / 7));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load applied jobs per user
  useEffect(() => {
    const email = localStorage.getItem("user_email");

    if (!email) {
      setAppliedJobs([]);
      return;
    }

    const saved = localStorage.getItem(`applied_jobs_${email}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((id: any) => Number(id));
        setAppliedJobs(parsed);
      } catch {
        setAppliedJobs([]);
      }
    } else {
      setAppliedJobs([]);
    }
  }, [userEmail]);

  useEffect(() => {
    setPage(1);
  }, [filters]);


useEffect(() => {
  if (searchFromUrl) {
    setFilters((prev) => ({
      ...prev,
      search: searchFromUrl,
    }));
  }
}, [searchFromUrl]);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  const clearAllFilters = () => {
  setFilters(defaultFilters);
  setAppliedFilters(defaultFilters);

  setSearchLocation("");
  setSearchCompany("");

  setPage(1);
};

  const saveJob = async (jobId: number) => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toast.warning("Please login to save jobs", {
        description: "You need to be logged in to save a job.",
      });

      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/saved-jobs/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ job: jobId }),
        },
      );

      if (res.status === 400) {
        const data = await res.json();
        console.log(data.detail || "Already saved.");
        return;
      }

      if (!res.ok) throw new Error("Failed to save job");

      setSavedJobIds((prev) => [...prev, jobId]);
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  const unsaveJob = async (jobId: number) => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    try {
      // We need to find the savedJobId (record ID) for this job
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/saved-jobs/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const savedData = await res.json();
      const record = savedData.find((item: any) => item.job === jobId);

      if (!record) return;

      const delRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/saved-jobs/${record.id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!delRes.ok && delRes.status !== 204)
        throw new Error("Failed to unsave job");

      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
    } catch (err) {
      console.error("Error unsaving job:", err);
    }
  };

  useEffect(() => {
    if (!userEmail) {
      setAppliedJobs([]);
      return;
    }

    const saved = localStorage.getItem(`applied_jobs_${userEmail}`);
    setAppliedJobs(saved ? JSON.parse(saved) : []);
  }, [userEmail]);

  const handleApply = (job: Job) => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }
    if (!userData || !isProfileComplete(userData)) {
      toast.warning(
        "Please complete your profile (Name, Phone, Resume, Skills, Experience) before applying.",
      );
      router.push("/profile");
      return;
    }
    setSelectedJob(job);
    setAnswers({});
    fetchUserData();
    setIsApplyModalOpen(true);
  };

  const handleViewDetails = async (
    job: Job,
    openModal = true
  ) => {

    if (openModal) {
      setSelectedJob(job);
      // setIsJobDetailOpen(true);
    }

    const storageKey = `job_request_id_${job.id}`;

    let requestId = localStorage.getItem(storageKey);

    if (!requestId) {
      requestId = uuidv4();
      localStorage.setItem(storageKey, requestId);
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/${job.id}/click/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request_id: requestId,
          }),
        }
      );
    } catch (err) {
      console.error("Error incrementing job views:", err);
    }
  };

   const handleShare = (job: any) => {
  const shareUrl = `${window.location.origin}/job-details?id=${job.id}`;

  if (navigator.share) {
    navigator.share({
      title: job.title,
      text: `Check out this job at ${job.company}`,
      url: shareUrl,
    });
  } else {
    navigator.clipboard?.writeText(shareUrl);
    toast.success("Job link copied to clipboard");
  }
};

  const REQUIRED_PROFILE_FIELDS = [
    "full_name",
    "phone",
    "resume",
    "skills",
    "country",
    "state",
    "city",
    // "education",
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
        },
      );

      if (!response.ok) {
        console.log("Profile API failed:", response.status);
        return;
      }

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
      console.error("Profile fetch error:", error);
    } finally {
      setLoadingUserData(false);
    }
  };

  const fetchUserData = async () => {
    setLoadingUserData(true);
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
        },
      );

      if (!response.ok) {
        console.log("Applied API failed:", response.status);
        return;
      }

      const data = await response.json();
      console.log("ALL applications from backend:", data);

      const myApplications = data.filter(
        (app: Application) => app.user_email === email,
      );

      console.log("MY Applications:", myApplications);

      const appliedIDs = myApplications.map((app: Application) =>
        Number(app.job),
      );

      localStorage.setItem(`applied_jobs_${email}`, JSON.stringify(appliedIDs));

      setAppliedJobs(appliedIDs);

      console.log("Saved my applied job IDs:", appliedIDs);
    } catch (error) {
      console.error("Fetch user data error:", error);
    } finally {
      setLoadingUserData(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserData();
  }, []);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const submitApplication = async () => {
    try {
      const token = localStorage.getItem("user_token");

      if (!token) {
        toast("Login required", {
          description: "Please login to continue with your application.",
        });

        return;
      }

      if (!selectedJob) {
        toast("Error", {
          description: "No job selected. Please try again.",
        });
        return;
      }

      // Validate answers if questions exist
      if (selectedJob.questions && selectedJob.questions.length > 0) {
        const unanswered = selectedJob.questions.some(
          (_, index) => !answers[index]?.trim(),
        );
        if (unanswered) {
          toast("Incomplete Application", {
            description:
              "Please answer all required questions before submitting.",
          });

          return;
        }
      }

      const applicationData = {
        job_id: selectedJob.id,
        answers:
          selectedJob.questions?.map((question, index) => ({
            question: question,
            answer: answers[index] || "",
          })) || [],
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
        },
      );
      // console.log("Here is the data",response)
      const result = await response.json();
      console.log("Serialised data for error :", result);

      if (response.ok) {
        toast.success("Application Submitted", {
          description: `Your application for ${selectedJob.title} has been sent successfully.`,
        });

        setIsApplyModalOpen(false);
        setSelectedJob(null);
        fetchUserData();
        setAnswers({});

        // SAVE APPLIED JOB PER USER
        const email = localStorage.getItem("user_email");
        const key = email ? `applied_jobs_${email}` : "applied_jobs";

        setAppliedJobs((prev) => {
          const jobIdNum = Number(selectedJob.id);
          const updated = prev.includes(jobIdNum) ? prev : [...prev, jobIdNum];
          localStorage.setItem(key, JSON.stringify(updated));
          return updated;
        });
      } else {
        toast.error("Application Failed", {
          description:
            result?.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast("Network error", {
        description: "Please check your internet connection and try again",
      });
    }
  };

  const getWorkModeColor = (workMode: string) => {
    switch (workMode) {
      case "Remote":
        return "bg-green-100 text-green-800";
      case "Hybrid":
        return "bg-blue-100 text-blue-800";
      case "Office":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeSincePosted = (dateString: string) => {
    const postedDate = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - postedDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  if (loading) {
    return (
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-3 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {/* <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Latest Job Opportunities
          </h2>
          <p className="text-gray-600 text-lg">
            Discover your next career move from {jobs.length}+ active job
            postings
          </p>
        </div> */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
            {showFilters && (
              <div className="fixed inset-0 z-50 bg-black/40">
                <div className="absolute right-0 top-0 h-full w-[350px] bg-white overflow-y-auto">
                  <Card className="sticky top-4">
                    <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Filters
                      </h3>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          Clear All
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowFilters(false)}
                          className="h-8 w-8"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>

                      <div className="space-y-6">
                        {/* Location */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Location
                          </Label>

                          <Select
                            value={filters.location || undefined}
                            onValueChange={(location) =>
                              setFilters((prev) => ({
                                ...prev,
                                location,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>

                            <SelectContent className="max-h-60">
                              {/* Search input */}
                              <div className="sticky top-0 z-20 bg-white p-2 border-b">
                                <input
                                  type="text"
                                  placeholder="Search location..."
                                  value={searchLocation}
                                  onChange={(e) => setSearchLocation(e.target.value)}
                                  onKeyDown={(e) => e.stopPropagation()}
                                  className="w-full h-10 text-sm border rounded px-2 placeholder-gray-400 appearance-none focus:outline-none"
                                />
                              </div>

                              {/* Loading */}
                              {loading && (
                                <p className="text-sm text-gray-500 p-2">
                                  Loading locations...
                                </p>
                              )}

                              {/* Location list */}
                              {allLocations
                                .filter(
                                  (location) =>
                                    typeof location.name === "string" &&
                                    location.name
                                      .toLowerCase()
                                      .startsWith(searchLocation.toLowerCase()),
                                )
                                .map((location) => {
                                  const isSelected =
                                    filters.location === location.name;

                                  return (
                                    <SelectItem
                                      key={location.id}
                                      value={location.name}
                                      className={`text-sm cursor-pointer
                                      ${
                                        isSelected
                                          ? "bg-blue-100 text-blue-700 font-medium"
                                          : "text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      {location.name}
                                    </SelectItem>
                                  );
                                })}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Experience */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Experience
                          </Label>

                          <div className="flex items-center gap-2">
                            {/* Min Experience */}
                            <select
                              value={filters.min_experience || ""}
                              onChange={(e) => {
                                setFilters((prev) => ({
                                  ...prev,
                                  min_experience: e.target.value,
                                  max_experience: "", // reset max when min changes
                                }));
                              }}
                              className="w-full border rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="">Min Exp</option>

                              {[...Array(21)].map((_, i) => (
                                <option key={i} value={i}>
                                  {i === 0 ? "Fresher" : `${i} Year${i !== 1 ? "s" : ""}`}
                                </option>
                              ))}

                              <option value="20+">20+ Years</option>
                            </select>

                            <span>-</span>

                            {/* Max Experience */}
                            <select
                              value={filters.max_experience || ""}
                              onChange={(e) => {
                                setFilters((prev) => ({
                                  ...prev,
                                  max_experience: e.target.value,
                                }));
                              }}
                              className="w-full border rounded-lg px-3 py-2 text-sm"
                              disabled={!filters.min_experience}
                            >
                              <option value="">Max Exp</option>

                              {[
                                ...Array(21)
                                  .fill(0)
                                  .map((_, i) => i.toString()),
                                "20+",
                              ]
                                .filter((exp) => {
                                  if (!filters.min_experience) return true;

                                  if (filters.min_experience === "20+") {
                                    return exp === "20+";
                                  }

                                  if (exp === "20+") return true;

                                  return Number(exp) >= Number(filters.min_experience);
                                })
                                .map((exp) => (
                                  <option key={exp} value={exp}>
                                    {exp === "0"
                                      ? "Fresher"
                                      : exp === "20+"
                                      ? "20+ Years"
                                      : `${exp} Year${Number(exp) !== 1 ? "s" : ""}`}
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* Validation */}
                          {filters.min_experience &&
                            filters.max_experience &&
                            filters.min_experience !== "20+" &&
                            filters.max_experience !== "20+" &&
                            Number(filters.min_experience) >
                              Number(filters.max_experience) && (
                              <p className="text-red-500 text-xs mt-1">
                                Min experience cannot be greater than max experience
                              </p>
                            )}
                        </div>

                        {/* Job Type */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Job Type
                          </Label>

                          {jobTypes
                            .sort((a, b) => {
                              const aSelected = filters.jobType.includes(a);
                              const bSelected = filters.jobType.includes(b);
                              return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
                            })
                            .slice(0, showMoreJobType ? jobTypes.length : 4)
                            .map((type) => (
                              <div
                                key={type}
                                className="flex items-center space-x-2 mb-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.jobType.includes(type)}
                                  onChange={(e) =>
                                    handleJobTypeFilter(type, e.target.checked)
                                  }
                                />
                                <label className="text-sm text-gray-600">
                                  {type}
                                </label>
                              </div>
                            ))}

                          {jobTypes.length > 4 && (
                            <button
                              onClick={() => setShowMoreJobType(!showMoreJobType)}
                              className="text-blue-600 text-sm mt-1"
                            >
                              {showMoreJobType ? "Less" : "More"}
                            </button>
                          )}
                        </div>

                        {/* Work Mode */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Work Mode
                          </Label>

                          {workModes
                            .sort((a, b) => {
                              const aSelected = filters.workMode.includes(a);
                              const bSelected = filters.workMode.includes(b);
                              return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
                            })
                            .slice(0, showMoreWorkMode ? workModes.length : 4)
                            .map((mode) => (
                              <div
                                key={mode}
                                className="flex items-center space-x-2 mb-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.workMode.includes(mode)}
                                  onChange={(e) =>
                                    handleWorkModeFilter(mode, e.target.checked)
                                  }
                                />
                                <label className="text-sm text-gray-600">
                                  {mode}
                                </label>
                              </div>
                            ))}

                          {workModes.length > 4 && (
                            <button
                              onClick={() => setShowMoreWorkMode(!showMoreWorkMode)}
                              className="text-blue-600 text-sm mt-1"
                            >
                              {showMoreWorkMode ? "Less" : "More"}
                            </button>
                          )}
                        </div>

                        {/* Salary Range */}
                        <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Salary Range
                        </Label>

                        {salaryRanges
                          .sort((a, b) => {
                            const aSelected = filters.salaryRange.includes(a);
                            const bSelected = filters.salaryRange.includes(b);
                            return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
                          })
                          .slice(0, showMoreSalary ? salaryRanges.length : 4)
                          .map((range) => (
                            <div
                              key={range}
                              className="flex items-center space-x-2 mb-2"
                            >
                              <input
                                type="checkbox"
                                checked={filters.salaryRange.includes(range)}
                                onChange={(e) =>
                                  handleSalaryFilter(range, e.target.checked)
                                }
                              />
                              <label className="text-sm text-gray-600">
                                {range}
                              </label>
                            </div>
                          ))}

                        {salaryRanges.length > 4 && (
                          <button
                            onClick={() => setShowMoreSalary(!showMoreSalary)}
                            className="text-blue-600 text-sm mt-1"
                          >
                            {showMoreSalary ? "Less" : "More"}
                          </button>
                        )}
                      </div>

                        {/* Posted Within */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Posted Within
                          </Label>

                          {postedOptions
                            .sort((a, b) => {
                              const aSelected = filters.postedWithin.includes(
                                a.value,
                              );
                              const bSelected = filters.postedWithin.includes(
                                b.value,
                              );
                              return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
                            })
                            .slice(0, showMorePosted ? postedOptions.length : 4)
                            .map((option) => (
                              <div
                                key={option.value}
                                className="flex items-center space-x-2 mb-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.postedWithin.includes(
                                    option.value,
                                  )}
                                  onChange={(e) =>
                                    handlePostedFilter(option.value, e.target.checked)
                                  }
                                />
                                <label className="text-sm text-gray-600">
                                  {option.label}
                                </label>
                              </div>
                            ))}

                          {postedOptions.length > 4 && (
                            <button
                              onClick={() => setShowMorePosted(!showMorePosted)}
                              className="text-blue-600 text-sm mt-1"
                            >
                              {showMorePosted ? "Less" : "More"}
                            </button>
                          )}
                        </div>

                        {/* Companies */}
                        <div className="mb-4">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Companies
                          </Label>

                          {/* Search */}
                          <input
                            type="text"
                            placeholder="Search company..."
                            value={searchCompany}
                            onChange={(e) => setSearchCompany(e.target.value)}
                            className="w-full h-9 text-sm border rounded px-2 mb-2"
                          />

                          {companies
                            .filter((company) =>
                              company
                                .toLowerCase()
                                .includes(searchCompany.toLowerCase()),
                            )
                            .sort((a, b) => {
                              const aSelected = filters.companies.includes(a);
                              const bSelected = filters.companies.includes(b);
                              return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
                            })
                            .slice(0, showMoreCompanies ? companies.length : 4)
                            .map((company) => (
                              <div
                                key={company}
                                className="flex items-center space-x-2 mb-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.companies.includes(company)}
                                  onChange={(e) =>
                                    handleCompanyFilter(company, e.target.checked)
                                  }
                                />
                                <label className="text-sm text-gray-600">
                                  {company}
                                </label>
                              </div>
                            ))}

                          {companies.length > 4 && (
                            <button
                              onClick={() => setShowMoreCompanies(!showMoreCompanies)}
                              className="text-blue-600 text-sm mt-1"
                            >
                              {showMoreCompanies ? "Less" : "More"}
                            </button>
                          )}
                        </div>

                        {/* Skills */}
                        {/* <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Skills
                          </Label>

                          <Select
                            open={open} 
                            onOpenChange={setOpen}
                            value="" 
                            onValueChange={() => {}}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  filters.skills.length > 0
                                    ? `${filters.skills.length} skills selected`
                                    : "Select skills"
                                }
                              />
                            </SelectTrigger>

                            <SelectContent className="max-h-60">
                              <div className="sticky top-0 bg-white z-10 p-2 border-b">
                                <input
                                  type="text"
                                  placeholder="Search skills..."
                                  value={searchSkill}
                                  onChange={(e) => setSearchSkill(e.target.value)}
                                  onKeyDown={(e) => e.stopPropagation()}
                                  className="w-full h-8 text-sm border rounded px-2"
                                />
                              </div>

                              {skillsList
                                .filter((skill) =>
                                  skill.toLowerCase().startsWith(searchSkill.toLowerCase())
                                )
                                .map((skill) => {
                                  const isSelected = filters.skills.includes(skill);

                                  return (
                                    <div
                                      key={skill}
                                      className={`px-3 py-2 text-sm cursor-pointer flex justify-between items-center
                                        ${
                                          isSelected
                                            ? "bg-blue-100 text-blue-700 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                      onClick={() => {
                                        setFilters((prev) => ({
                                          ...prev,
                                          skills: isSelected
                                            ? prev.skills.filter((s) => s !== skill)
                                            : [...prev.skills, skill],
                                        }));
                                        setOpen(false);
                                      }}
                                    >
                                      <span>{skill}</span>
                                      {isSelected && <span>✓</span>}
                                    </div>
                                  );
                                })}
                            </SelectContent>
                          </Select>
                        </div> */}
                      </div>
                    <div className="mt-6 flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setAppliedFilters(filters);
                        setShowFilters(false);
                      }}
                    >
                      Apply Filters
                    </Button>
                  </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          {/* Job Listings */}
          <div className="lg:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {jobs.length} jobs
              </p>
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Left Side - Job List */}
                <div className="xl:col-span-5 xl:max-h-[85vh] xl:overflow-y-auto pr-0 xl:pr-2">
                    {sortedJobs.length === 0 ? (
                      <div className="text-center py-12">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No jobs found
                        </h3>
                        <p className="text-gray-600">
                          Try adjusting your search criteria or check back later for
                          new opportunities.
                        </p>
                      </div>
                    ) : (
                      sortedJobs.map((job) => (
                        <Card
                            key={job.id}
                            onClick={() => setSelectedJob(job)}
                            className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4
                              ${
                                selectedJob?.id === job.id
                                  ? "border-l-purple-500 bg-purple-50"
                                  : "border-l-transparent hover:border-l-purple-500"
                              }`}
                          >
                            <CardContent className="p-4 md:p-6">
                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                {/* Job Info */}
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start space-x-3">
                                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                          {job.company_user?.company_logo ? (
                                            <Image
                                              src={job.company_user.company_logo}
                                              alt="company logo"
                                              width={32}
                                              height={25}
                                              className="w-12 h-12 rounded-full object-cover border"
                                            />
                                          ) : (
                                            <User className="w-6 h-6 text-gray-700 hover:text-purple-600" />
                                          )}
                                        </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                                            <a
                                              // href={`/job-details?id=${job.id}`}
                                              onClick={() => {
                                                handleViewDetails(job, false);
                                              }}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="hover:underline"
                                            >
                                              {job.title}
                                            </a>
                                          </h3>
                                            {appliedJobs.includes(Number(job.id)) && (
                                            <Badge
                                              onClick={() => window.location.assign("/applied-jobs")}
                                              className="bg-green-100 text-green-700 text-xs cursor-pointer hover:bg-green-200"
                                            >
                                              Applied
                                            </Badge>
                                            )}
                                          {job.urgentHiring && (
                                            <Badge className="bg-red-100 text-red-800 text-xs">
                                              Urgent
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-purple-600 font-medium text-base md:text-lg mb-2">
                                          {job.company}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-600 mb-3">
                                          <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                            <span>{job.location ?? "N/A"}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <Briefcase className="w-4 h-4 mr-1 flex-shrink-0" />
                                            <span>
                                              {job.min_experience === "0" && job.max_experience === "0"
                                                ? "Fresher"
                                                : `${job.min_experience} - ${job.max_experience} ${
                                                    job.min_experience === job.max_experience &&
                                                    job.min_experience === "1"
                                                      ? "Year"
                                                      : "Years"
                                                  }`}
                                            </span>
                                          </div>
                                        <div className="flex items-center gap-1">
                                            <span>{job.currency?.symbol_native}</span>

                                            <span>
                                              {job.salary
                                                ? new Intl.NumberFormat(
                                                    job.currency?.code === "INR" ? "en-IN" : "en-US"
                                                  ).format(Number(job.salary))
                                                : ""}
                                              {" - "}
                                              {job.salary_max
                                                ? new Intl.NumberFormat(
                                                    job.currency?.code === "INR" ? "en-IN" : "en-US"
                                                  ).format(Number(job.salary_max))
                                                : ""} / yr
                                            </span>
                                          </div>
                                          <Badge
                                            className={getWorkModeColor(job.work_mode ?? "")}
                                          >
                                            {job.work_mode
                                              ? job.work_mode.charAt(0).toUpperCase() +
                                                job.work_mode.slice(1).toLowerCase()
                                              : ""}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Skills */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {job.skills.slice(0, 5).map((skill, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs bg-gray-100 text-gray-700"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                    {job.skills.length > 5 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-gray-100 text-gray-700"
                                      >
                                        +{job.skills.length - 5} more
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Footer Info */}
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm text-gray-500">
                                    <div className="flex items-center space-x-4">
                                      <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>
                                          {getTimeSincePosted(job.created_at ?? "")}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        <span>{job.vacancies} Vacancies</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                        </Card>
                      ))
                    )}
                    {/* Pagination */}
                  <div className="sticky flex items-center justify-center items-center gap-2 mt-5 mb-5">

                    {/* Previous */}
                    <button
                      disabled={currentPage === 1}
                      onClick={() => fetchJobs(currentPage - 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ‹
                    </button>

                    {/* Page Info */}
                    <div className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>

                    {/* Next */}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => fetchJobs(currentPage + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ›
                    </button>

                  </div>
                </div>
                {/* Right Side - Job Details */}
                <div className="xl:col-span-7">
                  {selectedJob ? (
                    <div className="xl:sticky xl:top-20">
                      <Card className="shadow-lg border-0 xl:h-[85vh] flex flex-col">
                        <CardContent className="flex-1 xl:overflow-y-auto p-0">
                          <div className="sticky top-0 z-50 bg-white border-b p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-2xl font-bold">
                                {selectedJob.title}
                              </h3>
                              <h3 className="text-lg font-semibold text-purple-600">
                                {selectedJob.company}
                              </h3>

                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Users className="w-4 h-4 mr-1" />
                                <span>Openings : {selectedJob.vacancies}</span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                              {(() => {
                            const token = localStorage.getItem("user_token");
                            const jobIdNum = Number(selectedJob.id);
                            const appliedList = appliedJobs.map(Number);

                            const buttonClass =
                              "w-[140px] h-9 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-md";

                            if (selectedJob.website_apply) {
                              return (
                                <a
                                  href={selectedJob.website_apply}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block"
                                  onClick={() => {
                                    handleViewDetails(selectedJob, false);
                                  }}
                                >
                                  <Button className={buttonClass}>
                                    Apply Now
                                  </Button>
                                </a>
                              );
                            }

                            if (token && appliedList.includes(jobIdNum)) {
                              return (
                                <Button
                                  disabled
                                  className="w-[140px] h-9 bg-green-600 text-white"
                                >
                                  Applied
                                </Button>
                              );
                            }

                            return (
                              <Button
                                onClick={() => {
                                  handleViewDetails(selectedJob, false);
                                  handleApply(selectedJob);
                                }}
                                className={buttonClass}
                              >
                                Apply Now
                              </Button>
                            );
                          })()}

                          <Button
                            variant="outline"
                            onClick={() =>
                              savedJobIds.includes(Number(selectedJob.id))
                                ? unsaveJob(Number(selectedJob.id))
                                : saveJob(Number(selectedJob.id))
                            }
                            className={`w-[140px] h-9 ${
                              savedJobIds.includes(Number(selectedJob.id))
                                ? "border-purple-600 text-purple-600"
                                : ""
                            }`}
                          >
                            <Bookmark
                              className={`w-4 h-4 mr-2 ${
                                savedJobIds.includes(Number(selectedJob.id))
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                            {savedJobIds.includes(Number(selectedJob.id))
                              ? "Saved"
                              : "Save Job"}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                        {/* Job Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{selectedJob.location ?? "N/A"}</span>
                            </div>
                              <div className="flex items-center text-gray-600">
                              <Briefcase className="w-4 h-4 mr-1" />
                              <span>
                                {selectedJob.min_experience === "0" && selectedJob.max_experience === "0"
                                  ? "Fresher"
                                  : `${selectedJob.min_experience} - ${selectedJob.max_experience} ${
                                      selectedJob.min_experience === selectedJob.max_experience &&
                                      selectedJob.min_experience === "1"
                                        ? "Year"
                                        : "Years"
                                    }`}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="w-4 h-6 ">{selectedJob.currency?.symbol_native}</span>
                              <span>
                                {selectedJob.salary
                                  ? new Intl.NumberFormat(
                                      selectedJob.currency?.code === "INR" ? "en-IN" : "en-US"
                                    ).format(Number(selectedJob.salary))
                                  : ""}
                                {" - "}
                                {selectedJob.salary_max
                                  ? new Intl.NumberFormat(
                                      selectedJob.currency?.code === "INR" ? "en-IN" : "en-US"
                                    ).format(Number(selectedJob.salary_max))
                                  : ""} / yr
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600 ">
                              <Clock className="w-4 h-4 mr-2" />

                              <span className="capitalize">
                                {Array.isArray(selectedJob.job_type)
                                  ? selectedJob.job_type
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
                                  : selectedJob.job_type
                                      ?.split("-")
                                      .map(
                                        (word: string) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1).toLowerCase()
                                      )
                                      .join(" ")}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Building2 className="w-4 h-4 mr-2" />
                              <Badge
                                className={getWorkModeColor(selectedJob.work_mode ?? "")}
                              >
                                {selectedJob.work_mode
                                  ? selectedJob.work_mode.charAt(0).toUpperCase() +
                                    selectedJob.work_mode.slice(1).toLowerCase()
                                  : ""}
                              </Badge>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                Posted{" "}
                                {getTimeSincePosted(selectedJob.created_at ?? "")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Job Description */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mt-3 mb-1">
                            Job Description
                          </h4>
                          <div
                            className="text-gray-700 leading-relaxed prose max-w-none
                            [&_ul]:list-disc [&_ul]:pl-6
                            [&_ol]:list-decimal [&_ol]:pl-6
                            [&_li]:mb-1"
                            dangerouslySetInnerHTML={{ __html: selectedJob.description ?? "",}}
                          />
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mt-3 mb-1">
                            Requirements
                          </h4>
                          <div
                            className="prose text-gray-700 max-w-none
                            [&_ul]:list-disc [&_ul]:pl-6
                            [&_ol]:list-decimal [&_ol]:pl-6
                            [&_li]:mb-1"
                            dangerouslySetInnerHTML={{
                              __html: Array.isArray(selectedJob.requirements)
                                ? selectedJob.requirements.join("<br/>")
                                : selectedJob.requirements || "",
                            }}
                          />
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mt-3 mb-1">
                            Benefits
                          </h4>
                          <div
                            className="prose text-gray-700 max-w-none
                            [&_ul]:list-disc [&_ul]:pl-6
                            [&_ol]:list-decimal [&_ol]:pl-6
                            [&_li]:mb-1"
                            dangerouslySetInnerHTML={{
                              __html: Array.isArray(selectedJob.benefits)
                                ? selectedJob.benefits.join("<br/>")
                                : selectedJob.benefits || "",
                            }}
                          />
                        </div>

                        {/* Skills */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mt-3 mb-1">
                            Required Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(selectedJob?.skills) &&
                            selectedJob.skills.length > 0 ? (
                              selectedJob.skills.map((req, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{req}</span>
                                </li>
                              ))
                            ) : (
                              <p className="text-gray-500 italic">
                                {selectedJob.skills}
                              </p>
                            )}
                          </div>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </div>
                  ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center min-h-[500px] p-10">

                    <div className="relative mb-8">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <Briefcase className="w-14 h-14 text-purple-600" />
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Ready to Explore Jobs?
                    </h2>

                    <p className="text-gray-500 text-center max-w-lg">
                      Select a job from the left panel to view complete details,
                      salary information, skills, requirements, and apply instantly.
                    </p>

                  </CardContent>
                </Card>
                  )}
                </div>
              </div>
          </div>
        </div>

        {/* Job Details Modal */}
        {/* <Dialog open={isJobDetailOpen} onOpenChange={setIsJobDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {selectedJob.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                     <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                       {selectedJob.company_user?.company_logo ? (
                        <Image
                           src={selectedJob.company_user.company_logo}
                          alt="company logo"
                           width={32}
                          height={25}
                           className="w-12 h-12 rounded-full object-cover border"
                         />
                       ) : (
                         <User className="w-6 h-6 text-gray-700 hover:text-purple-600" />
                       )}
                     </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-purple-600 mb-1">
                        {selectedJob.company}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>openings : {selectedJob.vacancies}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{selectedJob.location ?? "N/A"}</span>
                      </div>
                         <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-1" />
                        <span>
                          {selectedJob.min_experience === "0" && selectedJob.max_experience === "0"
                            ? "Fresher"
                            : `${selectedJob.min_experience} - ${selectedJob.max_experience} ${
                                selectedJob.min_experience === selectedJob.max_experience &&
                                selectedJob.min_experience === "1"
                                  ? "Year"
                                  : "Years"
                              }`}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="w-4 h-6 ">{selectedJob.currency?.symbol_native}</span>
                        <span>
                          {selectedJob.salary
                            ? new Intl.NumberFormat(
                                selectedJob.currency?.code === "INR" ? "en-IN" : "en-US"
                              ).format(Number(selectedJob.salary))
                            : ""}
                          {" - "}
                          {/* {selectedJob.currency?.symbol_native} */}
                          {selectedJob.salary_max
                            ? new Intl.NumberFormat(
                                selectedJob.currency?.code === "INR" ? "en-IN" : "en-US"
                              ).format(Number(selectedJob.salary_max))
                            : ""} / yr
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />

                        <span>
                          {Array.isArray(selectedJob.job_type)
                            ? selectedJob.job_type
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
                            : selectedJob.job_type
                                ?.split("-")
                                .map(
                                  (word: string) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building2 className="w-4 h-4 mr-2" />
                        <Badge
                          className={getWorkModeColor(selectedJob.work_mode ?? "")}
                        >
                          {selectedJob.work_mode
                            ? selectedJob.work_mode.charAt(0).toUpperCase() +
                              selectedJob.work_mode.slice(1).toLowerCase()
                            : ""}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Posted{" "}
                          {getTimeSincePosted(selectedJob.created_at ?? "")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Job Description
                    </h4>
                     <div
                      className="text-gray-700 leading-relaxed prose max-w-none
                      [&_ul]:list-disc [&_ul]:pl-6
                      [&_ol]:list-decimal [&_ol]:pl-6
                      [&_li]:mb-1"
                      dangerouslySetInnerHTML={{ __html: selectedJob.description ?? "",}}
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Requirements
                    </h4>
                    <div
                      className="prose text-gray-700 max-w-none
                      [&_ul]:list-disc [&_ul]:pl-6
                      [&_ol]:list-decimal [&_ol]:pl-6
                      [&_li]:mb-1"
                      dangerouslySetInnerHTML={{
                        __html: Array.isArray(selectedJob.requirements)
                          ? selectedJob.requirements.join("<br/>")
                          : selectedJob.requirements || "",
                      }}
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Benefits
                    </h4>
                    <div
                      className="prose text-gray-700 max-w-none
                      [&_ul]:list-disc [&_ul]:pl-6
                      [&_ol]:list-decimal [&_ol]:pl-6
                      [&_li]:mb-1"
                      dangerouslySetInnerHTML={{
                        __html: Array.isArray(selectedJob.benefits)
                          ? selectedJob.benefits.join("<br/>")
                          : selectedJob.benefits || "",
                      }}
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedJob?.skills) &&
                      selectedJob.skills.length > 0 ? (
                        selectedJob.skills.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">
                          {selectedJob.skills}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() =>
                        savedJobIds.includes(Number(selectedJob.id))
                          ? unsaveJob(Number(selectedJob.id))
                          : saveJob(Number(selectedJob.id))
                      }
                      className={`flex-1 ${
                        savedJobIds.includes(Number(selectedJob.id))
                          ? "border-purple-600 text-purple-600"
                          : ""
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 mr-2 ${
                          savedJobIds.includes(Number(selectedJob.id))
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      {savedJobIds.includes(Number(selectedJob.id))
                        ? "Saved"
                        : "Save Job"}
                    </Button>

                     <Button
                      variant="outline"
                      onClick={() => handleShare(selectedJob)}
                      className="flex-1"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog> */}

        {/* Apply Modal */}
        <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
          <DialogContent className="max-w-2xl w-full h-[90vh] overflow-y-auto p-6">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Apply for {selectedJob.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Your profile and resume will be sent to the employer.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Profile information</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {loadingUserData ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    ) : (
                      userData && (
                       <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <h4 className="font-semibold text-gray-900">
                          Your Application Details
                        </h4>

                        <div className="text-sm text-gray-600 space-y-2">

                          {/* Name */}
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="sm:w-28 text-gray-500">Name:</span>
                            <span className="font-medium text-gray-900 break-all">
                              {userData.name || userData.full_name || "-"}
                            </span>
                          </div>

                          {/* Email */}
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="sm:w-28 text-gray-500">Email:</span>
                            <span className="font-medium text-gray-900 break-all">
                              {userData.email || "-"}
                            </span>
                          </div>

                          {/* Phone */}
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="sm:w-28 text-gray-500">Phone:</span>
                            <span className="font-medium text-gray-900">
                              +{userData.phone_code || ""} {userData.phone || "Not provided"}
                            </span>
                          </div>

                        </div>
                      </div>
                      )
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Resume/CV</span>
                  </div>
                  {userData?.resume ? (
                    <a
                      href={userData.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 underline flex items-center gap-1"
                    >
                      View Resume
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">
                      No resume uploaded
                    </span>
                  )}
                </div>
                <div>
                   {/* Job Description */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 ">
                      Job Description
                    </h4>
                     <div
                      className="text-gray-700 leading-relaxed prose max-w-none
                      [&_ul]:list-disc [&_ul]:pl-6
                      [&_ol]:list-decimal [&_ol]:pl-6
                      [&_li]:mb-1"
                      dangerouslySetInnerHTML={{ __html: selectedJob.description ?? "",}}
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mt-3">
                      Requirements
                    </h4>
                    <div
                      className="prose text-gray-700 max-w-none
                      [&_ul]:list-disc [&_ul]:pl-6
                      [&_ol]:list-decimal [&_ol]:pl-6
                      [&_li]:mb-1"
                      dangerouslySetInnerHTML={{
                        __html: Array.isArray(selectedJob.requirements)
                          ? selectedJob.requirements.join("<br/>")
                          : selectedJob.requirements || "",
                      }}
                    />
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mt-3">
                      Benefits
                    </h4>
                    <div
                      className="prose text-gray-700 max-w-none
                      [&_ul]:list-disc [&_ul]:pl-6
                      [&_ol]:list-decimal [&_ol]:pl-6
                      [&_li]:mb-1"
                      dangerouslySetInnerHTML={{
                        __html: Array.isArray(selectedJob.benefits)
                          ? selectedJob.benefits.join("<br/>")
                          : selectedJob.benefits || "",
                      }}
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mt-3">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedJob?.skills) &&
                      selectedJob.skills.length > 0 ? (
                        selectedJob.skills.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">
                          {selectedJob.skills}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedJob?.questions) &&
                      selectedJob.questions.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            Additional Questions
                          </h4>
                          {selectedJob.questions.map((question, index) => (
                            <div key={index} className="space-y-2">
                              <Label
                                htmlFor={`question-${index}`}
                                className="font-medium text-gray-800"
                              >
                                {index + 1}. {question}
                              </Label>
                              <Input
                                id={`question-${index}`}
                                placeholder="Type your answer here..."
                                value={answers[index] || ""}
                                onChange={(e) =>
                                  handleAnswerChange(index, e.target.value)
                                }
                                className="w-full"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={submitApplication}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Login Required Popup */}
        <Dialog open={showLoginPopup} onOpenChange={setShowLoginPopup}>
          <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <h2 className="text-xl font-semibold">Login Required</h2>
              <p className="text-sm opacity-90 mt-1">
                You need to login before applying for jobs
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 bg-purple-50 border border-purple-100 rounded-lg p-4">
                <div className="flex-shrink-0">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Login to apply for jobs, track your applications, and get
                  personalized job recommendations.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md"
                  onClick={() => {
                    setShowLoginPopup(false);
                    window.location.href = "/login";
                  }}
                >
                  Login Now
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLoginPopup(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}