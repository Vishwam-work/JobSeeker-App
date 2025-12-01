"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useSavedJobs } from "@/context/SavedJobsContext";
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
  DollarSign,
  Building2,
  Users,
  Calendar,
  Star,
  Bookmark,
  Share2,
  ExternalLink,
  Filter,
  Search,
  X,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Award,
  Eye,
  Send,
} from "lucide-react";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const { savedJobs, addJob, removeJob } = useSavedJobs();
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);


  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    experience: "",
    jobType: "",
    workMode: "",
    salaryRange: [0, 50],
    companies: [],
    skills: [],
    postedWithin: "",
  });

  // Sample job data - in real app, this would come from API
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [skillsList, setSkillsList] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [searchCompany, setSearchCompany] = useState("");
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [searchSkill, setSearchSkill] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/employeer/api/all-jobs/"
        );
        const data = await res.json();

        const companyNames = [
          ...new Set(data.map((item: any) => item.company).filter(Boolean)),
        ];

        setCompanies(companyNames);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;
    
        const res = await fetch("https://jobseeker-backend-jy1y.onrender.com/api/saved-jobs/", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
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

  // Lazy load locations
  const loadLocations = async () => {
    if (isLoaded) return;
    setLoading(true);
    try {
      const res = await fetch(
        "https://jobseeker-backend-jy1y.onrender.com/master/api/states/"
      );
      const data = await res.json();
      const locationNames = data.map((item: any) => item.name);
      setLocations(locationNames);
      setIsLoaded(true);
    } catch (err) {
      console.error("Error fetching locations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/master/api/jobs_category/"
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
    // Simulate API call
    setTimeout(async () => {
      const response = await fetch(
        "https://jobseeker-backend-jy1y.onrender.com/employeer/api/all-jobs/"
      );
      const data = await response.json();
      console.log("Jobs data:", data);
      setJobs(data);
      setFilteredJobs(data);
      setLoading(false);
      fetchUserData();
    }, 1000);
  }, []);

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
    let filtered = jobs;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(filters.search.toLowerCase())
          )
      );
    }

    // Location filter
    if (filters.location && filters.location !== "All") {
      filtered = filtered.filter(
        (job) =>
          job.location &&
          job.location.name &&
          job.location.name
            .toLowerCase()
            .includes(filters.location.toLowerCase())
      );
    }

    // Experience filter
    if (filters.experience && filters.experience !== "All") {
      filtered = filtered.filter((job) => {
        const [minJobExp, maxJobExp] = job.experience.split("-").map(Number);
        let [minFilterExp, maxFilterExp] = [0, 100]; // default

        switch (filters.experience) {
          case "0-1":
            [minFilterExp, maxFilterExp] = [0, 1];
            break;
          case "2-4":
            [minFilterExp, maxFilterExp] = [2, 4];
            break;
          case "3-5":
            [minFilterExp, maxFilterExp] = [3, 5];
            break;
          case "5-8":
            [minFilterExp, maxFilterExp] = [5, 8];
            break;
          case "8+":
            [minFilterExp, maxFilterExp] = [8, 100];
            break;
        }

        return maxJobExp >= minFilterExp && minJobExp <= maxFilterExp;
      });
    }

    // Work Mode filter
    if (filters.workMode && filters.workMode !== "All") {
      filtered = filtered.filter(
        (job) =>
          job.work_mode &&
          job.work_mode.toLowerCase().includes(filters.workMode.toLowerCase())
      );
    }

    // Job Type filter
    if (filters.jobType && filters.jobType !== "All") {
      filtered = filtered.filter(
        (job) =>
          job.job_type &&
          job.job_type.toLowerCase().includes(filters.jobType.toLowerCase())
      );
    }

    // Skills filter
    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(
        (job) =>
          Array.isArray(job.skills) &&
          filters.skills.every((skill) =>
            job.skills.some((jobSkill) =>
              jobSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
      );
    }

    // Company filter
    if (filters.companies && filters.companies.length > 0) {
      filtered = filtered.filter((job) => {
        const companyName = job.company?.toLowerCase().trim();
        return filters.companies.some(
          (selected) => selected.toLowerCase().trim() === companyName
        );
      });
    }

    // Salary range filter
    const [minSalary, maxSalary] = filters.salaryRange;
    filtered = filtered.filter((job) => {
      const salaryMatch = job.salary.match(/(\d+)-(\d+)/);
      if (salaryMatch) {
        const jobMinSalary = parseInt(salaryMatch[1]);
        const jobMaxSalary = parseInt(salaryMatch[2]);
        return jobMaxSalary >= minSalary && jobMinSalary <= maxSalary;
      }
      return true;
    });

    // Posted within filter
    if (filters.postedWithin && filters.postedWithin !== "All") {
      const now = new Date();
      filtered = filtered.filter((job) => {
        const postedDate = new Date(job.created_at);
        const diffTime = Math.abs(now - postedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.postedWithin) {
          case "1":
            return diffDays <= 1;
          case "3":
            return diffDays <= 3;
          case "7":
            return diffDays <= 7;
          case "30":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCompanyFilter = (company, checked) => {
    setFilters((prev) => ({
      ...prev,
      companies: checked
        ? [...prev.companies, company]
        : prev.companies.filter((c) => c !== company),
    }));
  };

  const handleSkillFilter = (skill, checked) => {
    setFilters((prev) => ({
      ...prev,
      skills: checked
        ? [...prev.skills, skill]
        : prev.skills.filter((s) => s !== skill),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      location: "",
      experience: "",
      jobType: "",
      workMode: "",
      salaryRange: [0, 50],
      companies: [],
      skills: [],
      postedWithin: "",
    });
  };

  const handleSaveJob = (job) => {
  const isSaved = savedJobs.some((j) => j.id === job.id);
  if (isSaved) {
    removeJob(job.id);
  } else {
    addJob(job);
  }
};

const saveJob = async (jobId: number) => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    alert("Please log in first.");
    return;
  }

  try {
    const res = await fetch("https://jobseeker-backend-jy1y.onrender.com/api/saved-jobs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ job: jobId }),
    });

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
  const token = localStorage.getItem("auth_token");
  if (!token) return;

  try {
    // We need to find the savedJobId (record ID) for this job
    const res = await fetch("https://jobseeker-backend-jy1y.onrender.com/api/saved-jobs/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const savedData = await res.json();
    const record = savedData.find((item: any) => item.job === jobId);

    if (!record) return;

    const delRes = await fetch(`https://jobseeker-backend-jy1y.onrender.com/api/saved-jobs/${record.id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

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

  const handleApply = (job) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Please login to apply for jobs");
      window.location.href = "/login";
      return;
    }
    setSelectedJob(job);
    setAnswers({});
    fetchUserData();
    setIsApplyModalOpen(true);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsJobDetailOpen(true);
  };

  const handleShare = (job) => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  };

  const fetchUserData = async () => {
    setLoadingUserData(true);
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        "https://jobseeker-backend-jy1y.onrender.com/api/profile/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch profile");
        return;
      }

      const data = await response.json();
      console.log("User Profile Data:", data);
      setUserData(data);

      const email = localStorage.getItem("user_email");
      const key = email ? `applied_jobs_${email}` : "applied_jobs";

      const applied = JSON.parse(localStorage.getItem(key)) || [];
      setAppliedJobs(applied);
      console.log("Applied Jobs Loaded:", applied);
    } catch (error) {
      console.error("Fetch user data error:", error);
    } finally {
      setLoadingUserData(false);
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const submitApplication = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        alert("Please login to apply");
        return;
      }

      // Validate answers if questions exist
      if (selectedJob.questions && selectedJob.questions.length > 0) {
        const unanswered = selectedJob.questions.some(
          (_, index) => !answers[index]?.trim()
        );
        if (unanswered) {
          alert("Please answer all questions before submitting");
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
        "https://jobseeker-backend-jy1y.onrender.com/employeer/api/applications/submit/",
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
        alert(`Application submitted successfully for ${selectedJob.title}!`);
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

        // setAppliedJobs((prev) => {
        //   const updated = [...prev, selectedJob.id]; // ✅ use selectedJob.id
        //   localStorage.setItem("applied_jobs", JSON.stringify(updated));
        //   return updated;
        // });
      } else {
        alert(result.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Network error. Please try again.");
    }
  };

  const getWorkModeColor = (workMode) => {
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

  const getTimeSincePosted = (postedDate) => {
    const now = new Date();
    const posted = new Date(postedDate);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
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
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Latest Job Opportunities
          </h2>
          <p className="text-gray-600 text-lg">
            Discover your next career move from {jobs.length}+ active job
            postings
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Search Jobs
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Job title, skills, company..."
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="border rounded-lg p-3 bg-white shadow-sm">
                    <button
                      onClick={() => {
                        if (!isLoaded) loadLocations();
                        setShowLocationDropdown((prev) => !prev);
                      }}
                      className="w-full text-left font-semibold text-gray-700 flex justify-between items-center"
                    >
                      <span> Location</span>
                      <span className="text-gray-400">
                        {showLocationDropdown ? "▲" : "▼"}
                      </span>
                    </button>

                    {showLocationDropdown && (
                      <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                        <div className="sticky top-0 bg-white z-10 p-1 border-b">
                          <input
                            type="text"
                            placeholder="Search location..."
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className="w-full h-8 text-sm border rounded px-2"
                          />
                        </div>

                        {loading ? (
                          <p className="text-sm text-gray-500">
                            Loading locations...
                          </p>
                        ) : (
                          locations
                            .filter((location) =>
                              location
                                .toLowerCase()
                                .startsWith(searchLocation.toLowerCase())
                            )
                            .map((location) => {
                              const isSelected = filters.location === location;

                              return (
                                <div
                                  key={location}
                                  onClick={() =>
                                    setFilters((prev) => ({
                                      ...prev,
                                      location: isSelected ? "All" : location,
                                    }))
                                  }
                                  className={`p-2 rounded cursor-pointer text-sm
                  ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                                >
                                  {location}
                                </div>
                              );
                            })
                        )}
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Experience
                    </Label>
                    <Select
                      value={filters.experience}
                      onValueChange={(value) =>
                        handleFilterChange("experience", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Experience</SelectItem>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-4">2-4 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-8">5-8 years</SelectItem>
                        <SelectItem value="8+">8+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Job Type */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Job Type
                    </Label>
                    <Select
                      value={filters.job_Type}
                      onValueChange={(value) =>
                        handleFilterChange("jobType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Work Mode */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Work Mode
                    </Label>
                    <Select
                      value={filters.workMode}
                      onValueChange={(value) =>
                        handleFilterChange("workMode", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select work mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Modes</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Salary Range (PA)
                    </Label>
                    <div className="px-2">
                      <Slider
                        value={filters.salaryRange}
                        onValueChange={(value) =>
                          handleFilterChange("salaryRange", value)
                        }
                        max={50}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{filters.salaryRange[0]} PA</span>
                        <span>{filters.salaryRange[1]} PA</span>
                      </div>
                    </div>
                  </div>

                  {/* Posted Within */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Posted Within
                    </Label>
                    <Select
                      value={filters.postedWithin}
                      onValueChange={(value) =>
                        handleFilterChange("postedWithin", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Any time</SelectItem>
                        <SelectItem value="1">Last 24 hours</SelectItem>
                        <SelectItem value="3">Last 3 days</SelectItem>
                        <SelectItem value="7">Last week</SelectItem>
                        <SelectItem value="30">Last month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Companies */}
                  <div className="border rounded-lg p-3 bg-white shadow-sm">
                    <button
                      onClick={() => setShowCompanyDropdown((prev) => !prev)}
                      className="w-full text-left font-semibold text-gray-700 flex justify-between items-center"
                    >
                      <span>Companies</span>
                      <span className="text-gray-400">
                        {showCompanyDropdown ? "▲" : "▼"}
                      </span>
                    </button>

                    {showCompanyDropdown && (
                      <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                        <div className="sticky top-0 bg-white z-10 p-1 border-b">
                          <input
                            type="text"
                            placeholder="Search company..."
                            value={searchCompany}
                            onChange={(e) => setSearchCompany(e.target.value)}
                            className="w-full h-8 text-sm border rounded px-2"
                          />
                        </div>

                        {/* List */}
                        {companies
                          .filter((company) =>
                            company
                              .toLowerCase()
                              .startsWith(searchCompany.toLowerCase())
                          )
                          .map((company) => (
                            <div
                              key={company}
                              className="p-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 rounded"
                              onClick={() =>
                                setFilters((prev) => ({
                                  ...prev,
                                  companies: [company],
                                }))
                              }
                            >
                              {company}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="border rounded-lg p-3 bg-white shadow-sm">
                    <button
                      onClick={() => setShowSkillsDropdown((prev) => !prev)}
                      className="w-full text-left font-semibold text-gray-700 flex justify-between items-center"
                    >
                      <span>Skills</span>
                      <span className="text-gray-400">
                        {showSkillsDropdown ? "▲" : "▼"}
                      </span>
                    </button>

                    {showSkillsDropdown && (
                      <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                        <div className="sticky top-0 bg-white z-10 p-1 border-b">
                          <input
                            type="text"
                            placeholder="Search skills..."
                            value={searchSkill}
                            onChange={(e) => setSearchSkill(e.target.value)}
                            className="w-full h-8 text-sm border rounded px-2"
                          />
                        </div>

                        {/* List */}
                        {skillsList
                          .filter((skill) =>
                            skill
                              .toLowerCase()
                              .startsWith(searchSkill.toLowerCase())
                          )
                          .map((skill) => {
                            const isSelected = filters.skills.includes(skill);

                            return (
                              <div
                                key={skill}
                                className={`p-2 text-sm cursor-pointer rounded ${
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
                                }}
                              >
                                {skill}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Sort by: Relevance
                </span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {filteredJobs.length === 0 ? (
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
                filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-purple-500"
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Job Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-6 h-6 text-purple-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 hover:text-purple-600 cursor-pointer transition-colors">
                                    {job.title}
                                  </h3>
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
                                    <span>{job.location?.name ?? "N/A"}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Briefcase className="w-4 h-4 mr-1 flex-shrink-0" />
                                    <span>{job.experience}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
                                    <span>{job.salary}</span>
                                  </div>
                                  <Badge
                                    className={getWorkModeColor(job.workMode)}
                                  >
                                    {job.workMode}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBookmark(job.id)}
                                className={
                                  job.isBookmarked
                                    ? "text-purple-600"
                                    : "text-gray-400"
                                }
                              >
                                <Bookmark className={`w-4 h-4 ${job.isBookmarked ? 'fill-current' : ''}`} />
                              </Button> */}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                savedJobIds.includes(job.id)
                                  ? unsaveJob(job.id)
                                  : saveJob(job.id)
                              }
                              className={`${
                                savedJobIds.includes(job.id)
                                  ? "text-green-600"
                                  : "text-gray-400 hover:text-green-500"
                              }`}
                            >
                              <Bookmark
                                className={`w-4 h-4 transition-all duration-300 ${
                                  savedJobIds.includes(job.id)
                                    ? "fill-green-500 drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                                    : ""
                                }`}
                              />
                            </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare(job)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Job Description */}
                          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
                            {job.description}
                          </p>

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
                                  {getTimeSincePosted(job.created_at)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{job.vacancies} Vacancies</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32">
                          {(() => {
                            const token = localStorage.getItem("auth_token");
                            const jobIdNum = Number(job.id);
                            const appliedList = appliedJobs.map(Number);

                            if (token && appliedList.includes(jobIdNum)) {
                              return null;
                            }

                            return (
                              <Button
                                onClick={() => handleApply(job)}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                Apply Now
                              </Button>
                            );
                          })()}

                          <Button
                            variant="outline"
                            className="border-purple-200 text-purple-600 hover:bg-purple-50"
                            onClick={() => handleViewDetails(job)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Load More Button */}
            {filteredJobs.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" className="px-8 py-3">
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Job Details Modal */}
        <Dialog open={isJobDetailOpen} onOpenChange={setIsJobDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {selectedJob.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Company Info */}
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-purple-600" />
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

                  {/* Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{selectedJob.location?.name ?? "N/A"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <span>{selectedJob.experience}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>{selectedJob.salary}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{selectedJob.job_type}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building2 className="w-4 h-4 mr-2" />
                        <Badge
                          className={getWorkModeColor(selectedJob.workMode)}
                        >
                          {selectedJob.work_mode}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Posted {getTimeSincePosted(selectedJob.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Job Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {Array.isArray(selectedJob?.requirements) &&
                      selectedJob.requirements.length > 0 ? (
                        selectedJob.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">
                          {selectedJob.requirements}
                        </p>
                      )}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Benefits
                    </h4>
                    <ul className="space-y-2">
                      {Array.isArray(selectedJob?.benefits) &&
                      selectedJob.benefits.length > 0 ? (
                        selectedJob.benefits.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">
                          {selectedJob.benefits}
                        </p>
                      )}
                    </ul>
                  </div>

                  {/* Skills */}
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

                  {/* <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                       {Array.isArray(selectedJob?.questions) && selectedJob.questions.length > 0 ? (
                            selectedJob.questions.map((req, index) => (
                              <div> <p className="font-medium text-gray-800">{req}:-</p>
                                  <Input
                                    placeholder="Type your answer here..."
                                    // value={answers[q.id] || ''}
                                    // onChange={e => handleChange(q.id, e.target.value)}
                                  />
                              </div>
                              
                            ))
                        ) : (
                            <p className="text-gray-500 italic">{selectedJob.questions}</p>
                        )}
                    </div>
                  </div> */}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button
                      onClick={() => {
                        setIsJobDetailOpen(false);
                        handleApply(selectedJob);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                    {/* <Button
                      variant="outline"
                      onClick={() => handleBookmark(selectedJob.id)}
                      className={`flex-1 ${
                        selectedJob.isBookmarked
                          ? "border-purple-600 text-purple-600"
                          : ""
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 mr-2 ${selectedJob.isBookmarked ? 'fill-current' : ''}`} />
                      {selectedJob.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </Button> */}

                    <Button
                      variant="outline"
                      onClick={() => handleSaveJob(selectedJob)}
                      className={`flex-1 ${
                        savedJobs.some((j) => j.id === selectedJob.id)
                          ? "border-purple-600 text-purple-600"
                          : ""
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 mr-2 ${
                          savedJobs.some((j) => j.id === selectedJob.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      {savedJobs.some((j) => j.id === selectedJob.id)
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
        </Dialog>

        {/* Apply Modal */}
        <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
          <DialogContent className="max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Apply for {selectedJob.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
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
                          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                            <h4 className="font-semibold text-gray-900">
                              Your Application Details
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                <span className="font-medium">Name:</span>{" "}
                                {userData.name || userData.full_name}
                              </p>
                              <p>
                                <span className="font-medium">Email:</span>{" "}
                                {userData.email}
                              </p>
                              <p>
                                <span className="font-medium">Phone:</span>{" "}
                                {userData.phone || "Not provided"}
                              </p>
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
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Required Skills
                    </h4>
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
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
