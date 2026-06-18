"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/jobListings?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Find Your Dream Job
          </h1>
          <p className="text-gray-500 mt-2">
            Search thousands of opportunities from top companies
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg border p-3 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <Input
              placeholder="Job title, keyword, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="pl-12 h-12 border-0 shadow-none focus-visible:ring-0 text-base"
            />
          </div>

          <button
            onClick={handleSearch}
            className="h-12 px-6 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all"
          >
            Search Jobs
          </button>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {[
            "React Developer",
            "Python",
            "UI/UX Designer",
            "Data Analyst",
            "Marketing",
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                router.push(`/jobListings?search=${encodeURIComponent(item)}`)
              }
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
