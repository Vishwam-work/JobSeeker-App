"use client";

import Image from "next/image";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import allCompanies from "@/data/companies.json";
import Footer from "@/components/Footer";
export default function CompanyDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const company = allCompanies.find((c) => c.id === Number(id));

  if (!company) {
    return <div className="p-6">Company not found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="px-4 sm:px-6 md:px-10 py-6 w-full max-w-7xl mx-auto">
        {/* Company Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-6 w-full">
          <Image
            src={company.logo}
            alt={company.name}
            width={100}
            height={100}
            className="rounded-md bg-gray-100 p-2 object-contain w-20 h-20 sm:w-24 sm:h-24"
          />
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {company.industry}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b mt-4 overflow-x-auto">
          {/* <button className="py-3 px-2 text-gray-600 hover:text-black border-b-2 border-transparent hover:border-gray-300 flex-shrink-0">
            Overview
          </button> */}
          <button className="py-3 px-2 text-black font-semibold border-b-2 border-black flex-shrink-0">
            Jobs
          </button>
        </div>

        {/* Jobs + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* LEFT: Job Listings */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              {company.jobs.length} Job openings at {company.name}
            </h2>

            {company.jobs.map((job, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-base">{job.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                  {job.duration && <span>📅 {job.duration}</span>}
                  {job.experience && <span>👨‍💻 {job.experience}</span>}
                  <span>💰 {job.salary}</span>
                  <span>📍 {job.location}</span>
                </div>

                {job.type && (
                  <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-600 font-medium">
                    {job.type}
                  </span>
                )}
                {job.start && (
                  <p className="text-xs text-gray-500 mt-1">{job.start}</p>
                )}

                {job.description && (
                  <p className="text-sm text-gray-700 mt-3">
                    {job.description}
                  </p>
                )}

                {job.skills && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-gray-100 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-2">{job.posted}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
