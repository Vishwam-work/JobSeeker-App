"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkX } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
interface SavedJob {
  id: number;
  job_title: string;
  job: {
    id: number;
    title: string;
    company: string;
    location?: {
      name: string;
    };
  };
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/api/saved-jobs-all/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("Fetched saved jobs:", data);
          setSavedJobs(data);
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      }
    };

    fetchSavedJobs();
  }, []);

  const removeSavedJob = async (id: number) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch(
        `https://jobseeker-backend-jy1y.onrender.com/api/saved-jobs/${id}/`,
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
    <div>
         <Header />
    <div className="max-w-5xl mx-auto py-10 px-4">
     

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bookmark className="w-5 h-5" />
            Saved Jobs
          </CardTitle>
        </CardHeader>

        <CardContent>
          {savedJobs.length > 0 ? (
            savedJobs.map((savedJob) => (
              <div
                key={savedJob.id}
                className="border rounded-lg p-4 mb-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="font-semibold text-lg">
                      {savedJob.job?.title || savedJob.job_title}
                    </h3>

                    <p className="text-purple-600 font-medium text-sm">
                      {savedJob.job?.company || "Unknown Company"}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {savedJob.job?.location?.name ||
                        "Location not available"}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSavedJob(savedJob.id)}
                    className="text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <BookmarkX className="w-4 h-4 mr-2" />
                    Remove
                  </Button>

                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No saved jobs yet.
            </p>
          )}
        </CardContent>
      </Card>
       
    </div>
     <Footer />
    </div>
  );
}