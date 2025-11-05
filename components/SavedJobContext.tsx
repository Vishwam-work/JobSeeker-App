// context/SavedJobsContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SavedJobsContext = createContext(null);

export const SavedJobsProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch saved jobs once when user is logged in
  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8010/api/saved-jobs/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();

          // If the backend only returns job IDs, fetch job details:
          const jobs = await Promise.all(
            data.map(async (item) => {
              const jobRes = await fetch(
                `http://127.0.0.1:8010/employeer/api/all-jobs/${item.job}/`
              );
              const jobData = await jobRes.json();
              return { ...jobData, backend_id: item.id };
            })
          );

          setSavedJobs(jobs);
        } else {
          console.error("Failed to fetch saved jobs");
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  // ✅ Save a job
  const addJob = async (job) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Please login to save jobs");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8010/api/saved-jobs/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job: job.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setSavedJobs((prev) => [...prev, { ...job, backend_id: data.id }]);
      } else {
        console.error("Failed to save job:", await res.text());
      }
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  // ❌ Remove a job
  const removeJob = async (jobId) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Please login to unsave jobs");
      return;
    }

    const jobToDelete = savedJobs.find((j) => j.id === jobId);
    if (!jobToDelete) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8010/api/saved-jobs/${jobToDelete.backend_id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
      } else {
        console.error("Failed to unsave job");
      }
    } catch (err) {
      console.error("Error unsaving job:", err);
    }
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, addJob, removeJob, loading }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => useContext(SavedJobsContext);
