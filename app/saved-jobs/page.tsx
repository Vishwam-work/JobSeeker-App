"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Bookmark,
  Briefcase,
  IndianRupee,
  MapPin,
  CheckCircle,
  ExternalLink,
  Send,
  Clock
 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
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

interface SavedJob {
  id: number;
  job_title: string;
  saved_at: string;

  job: {
    id: number;
    title: string;
    company: string;
    description: string;
    experience: string;
    salary: string | null;
    salary_max: string | null;
    currency: {
      symbol_native: string;
      code: string;
    } | null;
     currencyCode: string | null;
    location:string | null;
    questions?: string[];
    website_apply?: string;
    skills: string[];
    job_type: string;
    work_mode: string;
    created_at: string;
  };
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);

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
  const fetchSavedJobs = async (page = 1) => {
      const token = localStorage.getItem("user_token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_APP}/saved-jobs-all/?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("Fetched saved jobs:", data);
          setSavedJobs(data.results || []);
          setCurrentPage(page);
          setTotalPages(Math.ceil(data.count / 3));
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      }
    };
  useEffect(() => {
    fetchSavedJobs();
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

      if (
        selectedJob.questions &&
        selectedJob.questions.length > 0
      ) {
        const unanswered = selectedJob.questions.some(
          (_: any, index: number) => !answers[index]?.trim()
        );

        if (unanswered) {
          toast.error("Please answer all questions");
          return;
        }
      }

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

        setAnswers({});
      } else {
        toast.error(
          result?.error || "Something went wrong"
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeSavedJob = async (id: number) => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/saved-jobs/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setSavedJobs((prev) => prev.filter((job) => job.id !== id));
      }
    } catch (err) {
      console.error("Error removing saved job:", err);
    }
  };
const handleViewDetails = (job: any) => {
  setSelectedJob(job);
  setIsJobDetailOpen(true);
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
  return (
    <div>
         <Header />
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className=" rounded-xl  mb-6">
        <p className="text-3xl font-bold text-black-500">Jobs saved by you</p>
      </div>
     <div className=" bg-white rounded-xl p-6 mb-6">
        <h2 className=" text-3xl font-bold">
          {savedJobs.length.toString().padStart(2, "0")}
        </h2>
        <p className="text-gray-500">Saved Job(s)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Jobs</CardTitle>
        </CardHeader>
        <CardContent>
         {savedJobs.length > 0 ? (
            savedJobs.map((savedJob) => {
              const job = savedJob.job;

              return (
                <div
                  key={savedJob.id}
                  className="border rounded-xl p-5 mb-5 bg-white hover:shadow-md transition"
                >
                  {/* Top Section */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        <Link
                          href={`/job-details?id=${job.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {job?.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 text-sm mt-1">
                        {job?.company}
                      </p>
                    </div>

                    <button
                      onClick={() => removeSavedJob(savedJob.id)}
                      className="text-gray-500 "
                    >
                      <Bookmark className="w-5 h-5 fill-green-500" />
                    </button>
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">

                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                     <span>
                      {job.experience?.toString().trim().toLowerCase() === "fresher" ||
                      Number(job.experience) === 0
                         ? "Fresher"
                         : `${job.experience} ${Number(job.experience) === 1 ? "Year" : "Years"}`}
                     </span>
                    </span>

                    <span className="flex items-center gap-1">
                      <span className="w-3 h-5">{job.currency?.symbol_native}</span>
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
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job?.location || ""}
                    </span>

                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    <div
                            className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 line-clamp-2 overflow-hidden
                             [&_ul]:list-disc [&_ul]:pl-6
                             [&_ol]:list-decimal [&_ol]:pl-6
                             [&_li]:mb-1"
                            dangerouslySetInnerHTML={{
                              __html: job.description || "",
                            }}
                          />
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job?.skills?.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Row */}
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-400">
                          Posted {new Date(job?.created_at).toLocaleDateString()}
                        </span>

                        <button
                          onClick={() => {
                            if (appliedJobs.includes(Number(job?.id))) {
                              toast.info("You have already applied for this job");
                              return;
                            }

                            if (job?.website_apply) {
                              window.open(job.website_apply, "_blank");
                              return;
                            }

                            handleApply(job);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition
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
              );
            })
          ) : (
            <p className="text-gray-500 text-center">
              No saved jobs yet.
            </p>
          )}
        </CardContent>
      </Card>
      {/* Pagination */}
        <div className="flex items-center justify-center gap-2">

          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => fetchSavedJobs(currentPage - 1)}
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
            onClick={() => fetchSavedJobs(currentPage + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ›
          </button>

        </div>
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

             {
                selectedJob.description && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Job Description</h4>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedJob.description,
                      }}
                    />
                  </div>
                )
              }

             {
                selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Required Skills</h4>

                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map(
                        (skill: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )
             }

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
      <Dialog
        open={isJobDetailOpen}
        onOpenChange={setIsJobDetailOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {selectedJob.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">

                {/* Company */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-600 mb-1">
                    {selectedJob.company}
                  </h3>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Left */}
                  <div className="space-y-3">

                    {/* Experience */}
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />

                      <span>
                        {selectedJob.experience
                          ?.toString()
                          .trim()
                          .toLowerCase() === "fresher" ||
                        Number(selectedJob.experience) === 0
                          ? "Fresher"
                          : `${selectedJob.experience} ${
                              Number(selectedJob.experience) === 1
                                ? "Year"
                                : "Years"
                            }`}
                      </span>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center text-gray-600">
                      <IndianRupee className="w-4 h-4 mr-2" />

                      <span>
                        {selectedJob.salary
                          ? new Intl.NumberFormat(
                              selectedJob.currencyCode === "INR"
                                ? "en-IN"
                                : "en-US"
                            ).format(Number(selectedJob.salary))
                          : ""}

                        {" - "}

                        {selectedJob.salary_max
                          ? new Intl.NumberFormat(
                              selectedJob.currencyCode === "INR"
                                ? "en-IN"
                                : "en-US"
                            ).format(Number(selectedJob.salary_max))
                          : ""}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />

                      <span>
                        {selectedJob.location || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="space-y-3">

                    {/* Job Type */}
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />

                      <span>
                        {Array.isArray(selectedJob.job_type)
                          ? selectedJob.job_type.join(", ")
                          : selectedJob.job_type}
                      </span>
                    </div>

                    {/* Work Mode */}
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />

                      <span>
                        {selectedJob.work_mode || "N/A"}
                      </span>
                    </div>

                    {/* Posted */}
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />

                      <span>
                        Posted{" "}
                        {new Date(
                          selectedJob.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Job Description
                  </h4>

                  <div
                    className="text-gray-700 leading-relaxed prose max-w-none
                    [&_ul]:list-disc [&_ul]:pl-6
                    [&_ol]:list-decimal [&_ol]:pl-6
                    [&_li]:mb-1"
                    dangerouslySetInnerHTML={{
                      __html: selectedJob.description || "",
                    }}
                  />
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Required Skills
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedJob?.skills) &&
                    selectedJob.skills.length > 0 ? (
                      selectedJob.skills.map(
                        (skill: string, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-gray-500 italic">
                        No skills available
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
     <Footer />
    </div>
  );
}