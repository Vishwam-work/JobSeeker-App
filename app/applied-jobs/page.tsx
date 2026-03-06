"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function AppliedJobsPage() {
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppliedJobs = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      setLoading(true);

      const res = await fetch(
        "https://jobseeker-backend-jy1y.onrender.com/api/my-applied-jobs/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setAppliedJobs(data || []);
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
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="w-5 h-5" />
            Applied Jobs
          </CardTitle>
        </CardHeader>

        <CardContent>

          {loading && (
            <p className="text-gray-500 text-sm">Loading applied jobs...</p>
          )}

          {!loading && appliedJobs.length === 0 && (
            <p className="text-gray-500 text-sm">No applied jobs found.</p>
          )}

          {appliedJobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-4 mb-3 hover:shadow-sm"
            >
              {/* Job Title */}
              <h3 className="font-semibold text-lg text-gray-900">
                {job.job_title}
              </h3>

              {/* Application Status */}
              <p className="text-sm mt-1 text-blue-600">
                Status: {job.application_status}
              </p>
            </div>
          ))}

        </CardContent>
      </Card>
    </div>
        <Footer />
        </div>
  );
}