"use client";

import { useEffect, useState } from "react";
import { useSearchParams,useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  Users,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  CheckCircle,
  Bookmark,
  Share2,
  Eye,
  ExternalLink,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function JobDetailsPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const router = useRouter();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  
  interface Job {
    id: number;
    title: string;
    company: string;
    questions?: string[];
    vacancies: number;
    location?: string;
    experience: string;
    salary: string;
    salary_max?: string;
    currencyCode?: string;
     currency?: {
      symbol_native: string;
    };
    job_type: string;
    created_at: string;
    description: string;
    requirements?: string[];
    benefits?: string[];
    skills?: string[];
    // Add other fields as needed
  }
interface Application {
    id: number | string;
    user_email: string;
    job: number | string;
  }
  useEffect(() => {
    if (!jobId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/all-jobs/`)
      .then((res) => res.json())
      .then((data) => {

        const job = data.results.find((j: any) => String(j.id) === String(jobId));
        setSelectedJob(job);
      })
      .catch(console.error);
  }, [jobId]);

 
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

  const handleShare = (job: any) => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job at ${job.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
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
      const token = localStorage.getItem("auth_token");

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
      const token = localStorage.getItem("auth_token");
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
const submitApplication = async () => {
    try {
      const token = localStorage.getItem("auth_token");

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
        // setSelectedJob(null);
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
   const handleApply = (job: Job) => {
    const token = localStorage.getItem("auth_token");
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
    if (!selectedJob) {
  return (
    <div>
      <Header />

      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-2/3 mb-6"></div>

        <div className="flex gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-6 border border-gray-200 rounded-lg shadow-sm mt-10">
        <>
          {/* Job Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedJob.title}
          </h1>

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
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>openings : {selectedJob.vacancies}</span>
                </div>

              </div>
                   <div className="mt-4 sm:mt-0 sm:ml-4  ">
                   <button
                    onClick={() => {
                      if (appliedJobs.includes(Number(selectedJob?.id))) {
                        toast.info("You have already applied for this job");
                        return;
                      }
                      handleApply(selectedJob);
                    }}
                    className={`text-sm font-medium px-4 py-2 rounded-md transition w-full sm:w-auto
                      ${
                        appliedJobs.includes(Number(selectedJob?.id))
                          ? "bg-green-500 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                  >
                    {appliedJobs.includes(Number(selectedJob?.id)) ? "Applied" : "Apply Now"}
                  </button>
                  </div>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{selectedJob.location ?? ""}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                   <span>
                     {selectedJob.experience?.toString().trim().toLowerCase() === "fresher" ||
                     Number(selectedJob.experience) === 0
                      ? "Fresher"
                      : `${selectedJob.experience} ${Number(selectedJob.experience) === 1 ? "Year" : "Years"}`}
                    </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-4 h-6 ">{selectedJob.currency?.symbol_native}</span>
                    <span>
                      {selectedJob.salary
                        ? new Intl.NumberFormat(
                            selectedJob.currencyCode === "INR" ? "en-IN" : "en-US"
                          ).format(Number(selectedJob.salary))
                        : ""}
                      -
                      {selectedJob.salary_max
                        ? new Intl.NumberFormat(
                            selectedJob.currencyCode === "INR" ? "en-IN" : "en-US"
                          ).format(Number(selectedJob.salary_max))
                        : ""}
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
                            (type) =>
                              type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
                          )
                          .join(", ")
                      : selectedJob.job_type
                          ?.charAt(0).toUpperCase() +
                        selectedJob.job_type?.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Posted {getTimeSincePosted(selectedJob.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Job Description</h4>
               <div
                  className="text-gray-700 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedJob.description ??"" }}
                />
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Requirements
              </h4>
              <div
                  className="prose text-gray-700 max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedJob.requirements ??"" }}
                />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Benefits
              </h4>
              <div
                  className="prose text-gray-700 max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedJob.benefits ??"" }}
                />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(selectedJob?.skills) &&
                  selectedJob.skills.length > 0 ? (
                  selectedJob.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    {selectedJob?.skills || "No skills specified"}
                  </p>
                )}
              </div>
            </div>

            {/* <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleShare(selectedJob)}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div> */}
          </div>
        </>

      </div>
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
              </>
            )}
          </DialogContent>
        </Dialog>
      {/* // Login Prompt Dialog */}
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
                      window.open("/login", "_blank");
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
      <Footer />
    </div>
  );
}
