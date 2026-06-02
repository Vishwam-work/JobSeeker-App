"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
export default function AppliedJobsPage() {
  const router = useRouter();
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [appliedjobCount, setAppliedJobCount] = useState(1);


  const steps = ["Under Review", "Shortlisted", "Interview Scheduled"];
  const formatStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "under_review":
        return "Under Review";
      case "shortlisted":
        return "Shortlisted";
      case "interview scheduled":
        return "Interview Scheduled";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };
  const formatDate = (date?: any) => {
  if (!date) return "";

  const parsed = dayjs(date);

  // ❗ future date check
  if (!parsed.isValid() || parsed.year() > dayjs().year()) {
    return "Invalid Date";
  }

  return parsed.format("DD/MM/YYYY");
};
  const getCurrentStep = (status: string) => {
    const index = steps.findIndex(
      (s) => s.toLowerCase() === status?.toLowerCase(),
    );
    return index === -1 ? 1 : index + 1; // default = first step
  };
  const getProgressWidth = (status: string) => {
    const currentStep = getCurrentStep(status);
    return `${(currentStep / steps.length) * 100}%`;
  };

  const fetchAppliedJobs = async (page = 1) => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/my-applied-jobs/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      console.log(data);
      setAppliedJobs(data.results || []);
      setAppliedJobCount(data.count || 0);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / 5));
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto px-4 pt-6 flex items-center justify-between">
        {/* LEFT TITLE */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Job application status
        </h1>

        {/* RIGHT COUNTERS */}
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-3xl font-semibold text-gray-900">
              {appliedjobCount.toString().padStart(2, "0")}
            </p>
            <p className="text-xs text-gray-500">Total applies</p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-10 px-4 grid lg:grid-cols-3 gap-6">
        {/* LEFT SIDE - JOB LIST */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold text-lg mb-4">Applied Jobs</h2>

          {appliedJobs.map((job, index) => (
            <div
              key={job.id}
              // onClick={() => setSelectedJob(job)}
               onClick={() => {
                setSelectedJob(job);
                setShowMobileDetails(true);
              }}
              className="p-3 border rounded-lg mb-3 cursor-pointer hover:bg-gray-50"
            >
              <h3 className="font-medium text-gray-900">{job.job_title}</h3>

              <p className="text-sm text-gray-500">{job.job.company}</p>

              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  job.application_status?.toLowerCase() === "rejected"
                    ? "bg-red-100 text-red-600"
                    : job.application_status?.toLowerCase() === "shortlisted"
                      ? "bg-blue-100 text-blue-600"
                      : job.application_status?.toLowerCase() ==="interview scheduled"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-green-100 text-green-600"
                }`}
              >
                {formatStatus(job.application_status)}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Applied on:{" "}
                {formatDate(selectedJob?.applied_at || "")}
              </p>
            </div>
          ))}
           {/* Pagination */}
        <div className="flex items-center justify-center gap-2">

          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => fetchAppliedJobs(currentPage - 1)}
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
            onClick={() => fetchAppliedJobs(currentPage + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ›
          </button>

        </div>
        </div>

        {/* RIGHT SIDE - JOB DETAILS */}
        <div className="hidden lg:block lg:col-span-2 bg-white border rounded-xl p-6">
          {selectedJob ? (
            <>
              {/* Title */}
             <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedJob.job_title}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    window.open(
                      `/job-details?id=${selectedJob.job.id}`,
                      "_blank"
                    )
                  }
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  View Job Details
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {selectedJob.job.company}
              </p>
              <p className="text-sm text-gray-500">
                {selectedJob.job.location?.name} •{" "}
                
                {Array.isArray(selectedJob.job.job_type)
                  ? selectedJob.job.job_type
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
              </p>
              <div className="mt-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">
                  {selectedJob.job.work_mode
                    ? selectedJob.job.work_mode.charAt(0).toUpperCase() +
                      selectedJob.job.work_mode.slice(1).toLowerCase()
                    : ""}
                </span>
                <p className="text-xs text-gray-400 mt-3">
                  Applied on:{" "}
                  {formatDate(selectedJob?.applied_at || "")}
                </p>
              </div>

              {/* STATUS BAR */}
              {selectedJob?.application_status?.toLowerCase() !==
                "rejected" && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-4">Application Status</p>

                  {/* Progress line */}
                  <div className="relative">
                    <div className="w-full h-2 bg-gray-200 rounded-full"></div>

                    <div
                      className="absolute top-0 left-0 h-2 bg-green-500 rounded-full transition-all duration-500"
                      style={{
                        width: getProgressWidth(
                          selectedJob?.application_status,
                        ),
                      }}
                    ></div>

                    {/* Dots */}
                    <div className="absolute -top-1.5 left-0 w-full flex justify-between">
                      {steps.map((step, index) => {
                        const currentStep = getCurrentStep(
                          selectedJob?.application_status,
                        );

                        return (
                          <div
                            key={index}
                            className={`w-4 h-4 rounded-full border-2 ${
                              index + 1 <= currentStep
                                ? "bg-green-500 border-green-500"
                                : "bg-white border-gray-300"
                            }`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="flex justify-between text-xs mt-4">
                    {steps.map((step, index) => {
                      const currentStep = getCurrentStep(
                        selectedJob?.application_status,
                      );

                      return (
                        <span
                          key={index}
                          className={`${
                            index + 1 <= currentStep
                              ? "text-green-600 font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {step}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {selectedJob?.application_status?.toLowerCase() ===
                "rejected" && (
                <div className="mt-6 p-4 border rounded-lg bg-red-50">
                  <p className="text-sm font-medium text-red-600">
                    Application Rejected
                  </p>
                </div>
              )}

              {/* STATS */}
              <div className="mt-6 border rounded-lg p-4 flex justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    {selectedJob.job.applicants}
                  </p>
                  <p className="text-xs text-gray-500">Total applications</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.job.skills.map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              Select a job to view details
            </p>
          )}
        </div>

        {/* Mobile Job Details Modal */}
          {showMobileDetails && selectedJob && (
            <div className="fixed inset-0 z-50 bg-white lg:hidden overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Job Details</h2>

                <button
                  onClick={() => setShowMobileDetails(false)}
                  className="text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedJob.job_title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedJob.job.company}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedJob.job.location?.name} • {selectedJob.job.job_type}
                </p>

                {/* Badge */}
                <div className="mt-3">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {selectedJob.job.work_mode}
                  </span>
                </div>

                {/* Applied Date */}
                <p className="text-xs text-gray-400 mt-4">
                  Applied on:{" "}
                  {/* {new Date(selectedJob.applied_at).toLocaleDateString()} */}
                   {formatDate(selectedJob?.applied_at || "")}
                </p>

                {/* STATUS BAR */}
                        {selectedJob?.application_status?.toLowerCase() !==
                          "rejected" && (
                          <div className="mt-6">
                            <p className="text-sm font-medium mb-4">Application Status</p>

                            {/* Progress line */}
                            <div className="relative">
                              <div className="w-full h-2 bg-gray-200 rounded-full"></div>

                              <div
                                className="absolute top-0 left-0 h-2 bg-green-500 rounded-full transition-all duration-500"
                                style={{
                                  width: getProgressWidth(
                                    selectedJob?.application_status,
                                  ),
                                }}
                              ></div>

                              {/* Dots */}
                              <div className="absolute -top-1.5 left-0 w-full flex justify-between">
                                {steps.map((step, index) => {
                                  const currentStep = getCurrentStep(
                                    selectedJob?.application_status,
                                  );

                                  return (
                                    <div
                                      key={index}
                                      className={`w-4 h-4 rounded-full border-2 ${
                                        index + 1 <= currentStep
                                          ? "bg-green-500 border-green-500"
                                          : "bg-white border-gray-300"
                                      }`}
                                    ></div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Labels */}
                            <div className="flex justify-between text-xs mt-4">
                              {steps.map((step, index) => {
                                const currentStep = getCurrentStep(
                                  selectedJob?.application_status,
                                );

                                return (
                                  <span
                                    key={index}
                                    className={`${
                                      index + 1 <= currentStep
                                        ? "text-green-600 font-medium"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {selectedJob?.application_status?.toLowerCase() ===
                          "rejected" && (
                          <div className="mt-6 p-4 border rounded-lg bg-red-50">
                            <p className="text-sm font-medium text-red-600">
                              Application Rejected
                            </p>
                          </div>
                        )}


                {/* Stats */}
                <div className="mt-6 border rounded-lg p-4">
                  <p className="text-lg font-semibold">
                    {selectedJob.job.applicants}
                  </p>
                  <p className="text-xs text-gray-500">
                    Total Applications
                  </p>
                </div>

                {/* Skills */}
                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">Skills</p>

                  <div className="flex flex-wrap gap-2">
                    {selectedJob.job.skills.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      <Footer />
    </div>
  );
}
