"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SavedJobsContext = createContext(null);

export const SavedJobsProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("saved_jobs");
    if (stored) setSavedJobs(JSON.parse(stored));
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem("saved_jobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  const addJob = (job) => {
    setSavedJobs((prev) => {
      if (prev.find((j) => j.id === job.id)) return prev;
      return [...prev, job];
    });
  };

  const removeJob = (id) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, addJob, removeJob }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => useContext(SavedJobsContext);
