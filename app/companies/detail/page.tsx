"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ExternalLink, Send } from "lucide-react";

export default function CompanyDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token");
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
        console.log("Company Data:", companyData);
        const mappedCompany = {
          id: companyData.id,
          // name: companyData.company_name,
            name:
           companyData.company_name ||
           companyData.name ||
           "Company name not available",
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

        const jobList =
          Array.isArray(jobsData) ||
          Array.isArray(jobsData.data) ||
          Array.isArray(jobsData.results)
            ? (jobsData.data || jobsData.results || jobsData).map((job) => ({
                id: job.id,
                title: job.title || job.job_title || "Untitled Job",
                description: job.description || "No description provided.",
                location: job.location?.name || job.city?.name || "N/A",
                salary: job.salary || "Not specified",
                type: job.job_type || job.type || "Not specified",
                questions: job.questions || [],
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

  const handleApply = async (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
    setLoadingUserData(true);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch(
        "https://jobseeker-backend-jy1y.onrender.com/jobseeker/api/profile/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingUserData(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const submitApplication = async () => {
    alert(`Application submitted for: ${selectedJob.title}`);
    setIsApplyModalOpen(false);
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
            {/* <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1> */}
            <h1 className="text-2xl sm:text-3xl font-bold">
             {company?.name || "Company name not available"}
            </h1>

            <p className="text-gray-600 text-sm sm:text-base">
              {company.industry} • {company.type}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {company.city}, {company.state}, {company.country}
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

        {company.description && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">About Company</h2>
            <p className="text-gray-700">{company.description}</p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            {jobs.length} Job openings at {company.name}
          </h2>

          {Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job, idx) => (
              <div
                key={idx}
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
                    onClick={() => handleApply(job)}
                    className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No jobs available for this company.</p>
          )}
        </div>
      </div>

      {/* ✅ Apply Modal */}
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
                    ) : userData ? (
                      <div className="space-y-2">
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
                    ) : (
                      <p className="text-gray-400 italic">
                        Unable to load profile.
                      </p>
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
                      View Resume <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">
                      No resume uploaded
                    </span>
                  )}
                </div>

                {/* Additional Questions */}
                {Array.isArray(selectedJob?.questions) &&
                  selectedJob.questions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Additional Questions
                      </h4>
                      {selectedJob.questions.map((q, index) => (
                        <div key={index} className="space-y-2">
                          <Label
                            htmlFor={`question-${index}`}
                            className="font-medium text-gray-800"
                          >
                            {index + 1}. {q}
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

      <Footer />
    </div>
  );
}
