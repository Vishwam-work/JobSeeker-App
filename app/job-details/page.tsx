"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
export default function JobDetailsPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");
  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    if (!jobId) return;

    fetch("https://jobseeker-backend-jy1y.onrender.com/employeer/api/all-jobs/")
      .then((res) => res.json())
      .then((data) => {
        const job = data.find((j: any) => j.id === Number(jobId));
        setSelectedJob(job);
      })
      .catch(console.error);
  }, [jobId]);

  if (!selectedJob) {
    return <p className="p-6">Loading job details...</p>;
  }
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
      alert("Job link copied to clipboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border border-gray-200 rounded-lg shadow-sm">
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
                <Calendar className="w-4 h-4 mr-2" />
                <span>Posted {getTimeSincePosted(selectedJob.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Job Description</h4>
            <p className="text-gray-700">{selectedJob.description}</p>
          </div>

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
                  {selectedJob?.requirements || "No requirements provided"}
                </p>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Benefits
            </h4>
            <ul className="space-y-2">
              {Array.isArray(selectedJob?.benefits) &&
              selectedJob.benefits.length > 0 ? (
                selectedJob.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  {selectedJob?.benefits || "No benefits mentioned"}
                </p>
              )}
            </ul>
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
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
    </div>
  );
}
