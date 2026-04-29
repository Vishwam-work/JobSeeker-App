"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark,Briefcase, IndianRupee, MapPin  } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    } | null;
     currencyCode: string | null;
    location:string | null;

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
  }, []);

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

  return (
    <div className="bg-gray-100">
         <Header />
    <div className=" max-w-4xl  py-10 px-4">
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
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job?.title}
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
                        <span>
                          {job.salary
                           ? new Intl.NumberFormat(
                               job.currencyCode === "INR" ? "en-IN" : "en-US"
                            ).format(Number(job.salary))
                           : ""}
                        -
                         {job.salary_max
                           ? new Intl.NumberFormat(
                               job.currencyCode === "INR" ? "en-IN" : "en-US"
                            ).format(Number(job.salary_max))
                           : ""}
                         </span>
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
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                    <span>
                      Posted{" "}
                      {new Date(job?.created_at).toLocaleDateString()}
                    </span>

                    <span className="text-black font-medium">Saved</span>
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
      <div className="flex items-center justify-center mt-6">
  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl shadow-md px-4 py-3">

    <button
      disabled={currentPage === 1}
      onClick={() => fetchSavedJobs(currentPage - 1)}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <span className="text-base">←</span>
    </button>

    <div className="flex items-center gap-2 px-3">
      <span className="text-sm text-gray-500">Page</span>

      <div className="min-w-[40px] h-10 flex items-center justify-center rounded-xl  font-semibold text-sm shadow">
        {currentPage}
      </div>

      <span className="text-sm text-gray-500">
        of {totalPages}
      </span>
    </div>

    <button
      disabled={currentPage === totalPages}
      onClick={() => fetchSavedJobs(currentPage + 1)}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <span className="text-base">→</span>
    </button>

  </div>
</div>

    </div>
     <Footer />
    </div>
  );
}