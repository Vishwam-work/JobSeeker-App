"use client";

import { useEffect, useState } from "react";
import { Phone, FileText, Mail, CheckSquare } from "lucide-react";
import Highlighter from "react-highlight-words";
// interface Candidate {
//   id: number;
//   full_name: string;
//   experience: string;
//   current_salary: string;
//   expected_salary?: string;
//   notice_period?: string;
//   email: string;
//   city?: { name: string };
//   state?: { name: string };
//   profile_image?: string | null;
//   skills?: { name: string }[];
//   phone: string;
//   resume?: string;
// }
interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone: string;

  current_role?: string;
  current_company?: string;

  experience: string;
  current_salary: string;
  expected_salary?: string;
  notice_period?: string;

  city?: { name: string };
  state?: { name: string };
  country?: { name: string };

  profile_image?: string | null;
  resume?: string;

  skills?: { name: string }[];

  certifications?: {
    name: string;
    issuer?: string;
    year?: string | number;
  }[];

  educations?: {
  degree?: string;
  field?: string;
  institution?: string;
  year?: string | number;
  score_type?: string;
  percentage?: string | number;
}[];

  experiences?: {
    designation?: string;
    company?: string;
    start_date?: string | number;
    end_date?: string | number;
  }[];
}


export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewedCandidateIds, setViewedCandidateIds] = useState<number[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [filters, setFilters] = useState({
    hideProfiles: false,
    premiumOnly: false,
    locations: [] as string[],
    locationSearch: "",
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    designation: "",
    department: "",
    industry: "",
    noticePeriod: [] as string[],
    gender: "",
    minAge: "",
    maxAge: "",
  });

  const clearFilters = () => {
    setFilters({
      hideProfiles: false,
      premiumOnly: false,
      locations: [],
      locationSearch: "",
      minExperience: "",
      maxExperience: "",
      minSalary: "",
      maxSalary: "",
      designation: "",
      department: "",
      industry: "",
      noticePeriod: [],
      gender: "",
      minAge: "",
      maxAge: "",
    });
  };
  const cleanSearch = search.trim().replace(/\s+/g, " ");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    fetch(
      "https://jobseeker-backend-jy1y.onrender.com/employeer/api/profile-all/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log("Candidate data:", data);
        setCandidates(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const matches = (value: any) =>
      value !== null &&
      value !== undefined &&
      String(value).toLowerCase().includes(q);

    return (
      // basic info
      matches(c.full_name) ||
      matches(c.email) ||
      matches(c.current_role) ||
      matches(c.current_company) ||
      matches(c.experience) ||
      matches(c.current_salary) ||
      matches(c.expected_salary) ||
      matches(c.notice_period) ||
      // location
      matches(c.city?.name) ||
      matches(c.state?.name) ||
      matches(c.country?.name) ||
      // skills
      c.skills?.some((s) => matches(s.name)) ||
      // certifications
      c.certifications?.some(
        (cert) =>
          matches(cert.name) || matches(cert.issuer) || matches(cert.year)
      ) ||
      // education
      c.educations?.some(
        (e) =>
          matches(e.degree) ||
          matches(e.field) ||
          matches(e.institution) ||
          matches(e.year)
      ) ||
      // experience details
      c.experiences?.some(
        (ex) => matches(ex.designation) || matches(ex.company)
      )
    );
  });

  type HighlightProps = {
    text?: string;
  };

  const Highlight = ({ text = "" }: HighlightProps) => {
    if (!cleanSearch) return <>{text}</>;

    return (
      <Highlighter
        highlightClassName="bg-yellow-200 px-1 rounded font-semibold"
        searchWords={cleanSearch.split(" ")}
        autoEscape={true}
        textToHighlight={String(text)}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading candidates...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full mb-6">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by skill, keyword, company, designation..."
            className="w-full rounded-lg border border-gray-300 px-5 py-4 pl-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
        </div>
      </div>
      <div className="p-4 md:hidden flex justify-between items-center">
        <button
          onClick={() => setShowFilters(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filters
        </button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by skill, keyword, company..."
          className="border rounded px-3 py-2 w-full ml-2"
        />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 p-4">
        {/* LEFT FILTERS */}
        <aside className="hidden md:block col-span-3 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear all
            </button>
          </div>

          <hr className="mb-4" />
          {/* Hide Profiles */}
          <label className="flex items-center gap-2 font-medium mb-4">
            <input
              type="checkbox"
              checked={filters.premiumOnly}
              onChange={(e) =>
                setFilters({ ...filters, hideProfiles: e.target.checked })
              }
            />
            Hide Profiles
          </label>

          <hr className="mb-4" />

          {/* Premium */}
          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" />
            Premium Institute Candidates
          </label>

          <hr className="mb-4" />

          {/* Keywords */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between">
              Keywords <span>⌄</span>
            </summary>
          </details>

          <hr className="mb-4" />

          {/* Current Company */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between">
              Current company <span>⌄</span>
            </summary>
          </details>

          <hr className="mb-4" />

          {/* Location */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Location <span>⌃</span>
            </summary>

            <input
              placeholder="Search location"
              value={filters.locationSearch}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  locationSearch: e.target.value,
                });
              }}
              className="w-full border rounded px-2 py-1 mb-3 text-sm"
            />

            {[
              ["Hyderabad", "1,153"],
              ["Bengaluru", "1,111"],
              ["Pune", "516"],
              ["Chennai", "234"],
            ].map(([city, count]) => (
              <label
                key={city}
                className="flex justify-between items-center mb-2"
              >
                <span className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={filters.locations.includes(city)}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        locations: prev.locations.includes(city)
                          ? prev.locations.filter((c) => c !== city)
                          : [...prev.locations, city],
                      }))
                    }
                  />
                  {city}
                </span>
                <span className="text-gray-400">{count}</span>
              </label>
            ))}

            <button className="text-blue-600 text-xs mt-2">
              +16 more locations
            </button>
          </details>

          <hr className="mb-4" />

          {/* Experience */}
          <details open>
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Experience (Years) <span>⌃</span>
            </summary>

            {/* Fake histogram bar */}
            <div className="h-8 bg-gray-100 rounded mb-3"></div>

            <div className="flex items-center gap-2">
              <select
                value={filters.minExperience}
                onChange={(e) =>
                  setFilters({ ...filters, minExperience: e.target.value })
                }
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option>Select</option>
                <option>0</option>
                <option>1</option>
                <option>2</option>
              </select>

              <span>to</span>

              <select
                value={filters.maxExperience}
                onChange={(e) =>
                  setFilters({ ...filters, maxExperience: e.target.value })
                }
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option>Select</option>
                <option>5</option>
                <option>10</option>
                <option>14+</option>
              </select>
            </div>
          </details>

          <hr className="mb-4" />

          {/* Salary  */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Salary (INR-Lacs) <span>⌃</span>
            </summary>

            {/* Histogram placeholder */}
            <div className="h-8 bg-gray-100 rounded mb-3"></div>

            <div className="flex items-center gap-2">
              <select className="w-full border rounded px-2 py-2 text-sm">
                <option>Select</option>
                <option>0</option>
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
                <option>30+</option>
              </select>

              <span>to</span>

              <select className="w-full border rounded px-2 py-2 text-sm">
                <option>Select</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
                <option>25</option>
                <option>30+</option>
              </select>
            </div>
          </details>

          <hr className="mb-4" />

          {/* Current Designation*/}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Current designation <span>⌄</span>
            </summary>

            <div className="relative">
              <input
                placeholder="Add designation"
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </details>

          <hr className="mb-4" />

          {/* Department & Role */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Department and Role <span>⌃</span>
            </summary>

            <div className="relative mb-3">
              <input
                placeholder="Search department/role"
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {[
              ["Engineering - Software & QA", "1,682"],
              ["Consulting", "1,133"],
              ["IT & Information Security", "300"],
              ["Project & Program Management", "75"],
            ].map(([name, count]) => (
              <label
                key={name}
                className="flex justify-between items-center mb-2"
              >
                <span className="flex gap-2">
                  <input type="checkbox" />
                  {name}
                </span>
                <span className="text-gray-400">{count}</span>
              </label>
            ))}

            <button className="text-blue-600 text-xs mt-2">
              +1 more department
            </button>
          </details>

          <hr className="mb-4" />

          {/*  Industry  */}
          <details open>
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Industry <span>⌃</span>
            </summary>

            <div className="relative mb-3">
              <input
                placeholder="Search industry"
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {[
              ["IT Services & Consulting", "2,839"],
              ["Software Product", "568"],
              ["Management Consulting", "373"],
              ["Emerging Technologies", "108"],
            ].map(([name, count]) => (
              <label
                key={name}
                className="flex justify-between items-center mb-2"
              >
                <span className="flex gap-2">
                  <input type="checkbox" />
                  {name}
                </span>
                <span className="text-gray-400">{count}</span>
              </label>
            ))}
          </details>
          <hr className="my-4" />

          {/* Notice Period*/}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Notice period <span>⌃</span>
            </summary>

            {[
              ["0 - 15 days", "921"],
              ["1 month", "951"],
              ["2 months", "699"],
              ["3 months", "1,106"],
              ["More than 3 months", "56"],
              ["Currently serving notice period", "160"],
            ].map(([label, count]) => (
              <label
                key={label}
                className="flex justify-between items-center mb-2"
              >
                <span className="flex gap-2">
                  <input type="checkbox" />
                  {label}
                </span>
                <span className="text-gray-400">{count}</span>
              </label>
            ))}
          </details>

          <hr className="mb-4" />

          {/* Gender*/}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-3">
              Gender <span>⌃</span>
            </summary>

            <div className="flex gap-3">
              <button
                onClick={() => setFilters({ ...filters, gender: "Male" })}
                className={`border rounded-full px-4 py-1 text-sm ${
                  filters.gender === "Male" ? "bg-blue-100" : ""
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setFilters({ ...filters, gender: "Female" })}
                className={`border rounded-full px-4 py-1 text-sm ${
                  filters.gender === "Female" ? "bg-blue-100" : ""
                }`}
              >
                Female
              </button>
            </div>
          </details>

          <hr className="mb-4" />

          {/* Age  */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-3">
              Age <span>⌃</span>
            </summary>

            <div className="flex items-center gap-2">
              <input
                placeholder="Min age"
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <span>to</span>
              <input
                placeholder="Max age"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </details>

          <hr className="mb-4" />

          {/*  Degree / Course */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-3">
              Degree/Course <span>⌄</span>
            </summary>

            <div className="space-y-2 text-sm text-blue-600">
              <button className="flex items-center gap-2">
                <span className="text-lg">+</span> UG course
              </button>
              <button className="flex items-center gap-2">
                <span className="text-lg">+</span> PG course
              </button>
              <button className="flex items-center gap-2">
                <span className="text-lg">+</span> PPG course
              </button>
            </div>
          </details>

          <hr className="mb-4" />

          {/* College Name  */}
          <details className="mb-2">
            <summary className="cursor-pointer font-medium flex justify-between mb-3">
              College name <span>⌄</span>
            </summary>

            <div className="space-y-2 text-sm text-blue-600">
              <button className="flex items-center gap-2">
                <span className="text-lg">+</span> UG college
              </button>
              <button className="flex items-center gap-2">
                <span className="text-lg">+</span> PG college
              </button>
              <button className="flex items-center gap-2">
                <span className="text-lg">+</span> PPG college
              </button>
            </div>
          </details>
        </aside>

        <div
          className={`fixed inset-0 bg-black/40 z-50 md:hidden transition-transform ${
            showFilters ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="absolute right-0 w-3/4 max-w-xs h-full bg-white p-4 overflow-y-auto">
            <button
              onClick={() => setShowFilters(false)}
              className="mb-4 text-gray-500"
            >
              Close ✕
            </button>

            {/* Hide Profiles */}
            <label className="flex items-center gap-2 font-medium mb-4">
              <input type="checkbox" />
              Hide Profiles
            </label>

            <hr className="mb-4" />

            {/* Filters Title */}
            <div className="flex items-center gap-2 font-semibold mb-4">
              <span className="material-icons text-gray-500">tune</span>
              Filters
              <span className="text-xs bg-orange-500 text-white px-2 rounded">
                New
              </span>
            </div>

            <hr className="mb-4" />

            {/* Premium */}
            <label className="flex items-center gap-2 mb-4">
              <input type="checkbox" />
              Premium Institute Candidates
            </label>

            <hr className="mb-4" />

            {/* Keywords */}
            <details className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between">
                Keywords <span>⌄</span>
              </summary>
            </details>

            <hr className="mb-4" />

            {/* Current Company */}
            <details className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between">
                Current company <span>⌄</span>
              </summary>
            </details>

            <hr className="mb-4" />

            {/* Location */}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Location <span>⌃</span>
              </summary>

              <input
                placeholder="Search location"
                className="w-full border rounded px-2 py-1 mb-3 text-sm"
              />

              {[
                ["Hyderabad", "1,153"],
                ["Bengaluru", "1,111"],
                ["Pune", "516"],
                ["Chennai", "234"],
              ].map(([city, count]) => (
                <label
                  key={city}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="flex gap-2">
                    <input type="checkbox" />
                    {city}
                  </span>
                  <span className="text-gray-400">{count}</span>
                </label>
              ))}

              <button className="text-blue-600 text-xs mt-2">
                +16 more locations
              </button>
            </details>

            <hr className="mb-4" />

            {/* Experience */}
            <details open>
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Experience (Years) <span>⌃</span>
              </summary>

              {/* Fake histogram bar */}
              <div className="h-8 bg-gray-100 rounded mb-3"></div>

              <div className="flex items-center gap-2">
                <select className="w-full border rounded px-2 py-1 text-sm">
                  <option>Select</option>
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                </select>

                <span>to</span>

                <select className="w-full border rounded px-2 py-1 text-sm">
                  <option>Select</option>
                  <option>5</option>
                  <option>10</option>
                  <option>14+</option>
                </select>
              </div>
            </details>

            <hr className="mb-4" />

            {/* Salary  */}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Salary (INR-Lacs) <span>⌃</span>
              </summary>

              {/* Histogram placeholder */}
              <div className="h-8 bg-gray-100 rounded mb-3"></div>

              <div className="flex items-center gap-2">
                <select className="w-full border rounded px-2 py-2 text-sm">
                  <option>Select</option>
                  <option>0</option>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                  <option>30+</option>
                </select>

                <span>to</span>

                <select className="w-full border rounded px-2 py-2 text-sm">
                  <option>Select</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                  <option>25</option>
                  <option>30+</option>
                </select>
              </div>
            </details>

            <hr className="mb-4" />

            {/* Current Designation*/}
            <details className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Current designation <span>⌄</span>
              </summary>

              <div className="relative">
                <input
                  placeholder="Add designation"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  🔍
                </span>
              </div>
            </details>

            <hr className="mb-4" />

            {/* Department & Role */}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Department and Role <span>⌃</span>
              </summary>

              <div className="relative mb-3">
                <input
                  placeholder="Search department/role"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  🔍
                </span>
              </div>

              {[
                ["Engineering - Software & QA", "1,682"],
                ["Consulting", "1,133"],
                ["IT & Information Security", "300"],
                ["Project & Program Management", "75"],
              ].map(([name, count]) => (
                <label
                  key={name}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="flex gap-2">
                    <input type="checkbox" />
                    {name}
                  </span>
                  <span className="text-gray-400">{count}</span>
                </label>
              ))}

              <button className="text-blue-600 text-xs mt-2">
                +1 more department
              </button>
            </details>

            <hr className="mb-4" />

            {/*  Industry  */}
            <details open>
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Industry <span>⌃</span>
              </summary>

              <div className="relative mb-3">
                <input
                  placeholder="Search industry"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  🔍
                </span>
              </div>

              {[
                ["IT Services & Consulting", "2,839"],
                ["Software Product", "568"],
                ["Management Consulting", "373"],
                ["Emerging Technologies", "108"],
              ].map(([name, count]) => (
                <label
                  key={name}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="flex gap-2">
                    <input type="checkbox" />
                    {name}
                  </span>
                  <span className="text-gray-400">{count}</span>
                </label>
              ))}
            </details>
            <hr className="my-4" />

            {/* Notice Period*/}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Notice period <span>⌃</span>
              </summary>

              {[
                ["0 - 15 days", "921"],
                ["1 month", "951"],
                ["2 months", "699"],
                ["3 months", "1,106"],
                ["More than 3 months", "56"],
                ["Currently serving notice period", "160"],
              ].map(([label, count]) => (
                <label
                  key={label}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="flex gap-2">
                    <input type="checkbox" />
                    {label}
                  </span>
                  <span className="text-gray-400">{count}</span>
                </label>
              ))}
            </details>

            <hr className="mb-4" />

            {/* Gender*/}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-3">
                Gender <span>⌃</span>
              </summary>

              <div className="flex gap-3">
                <button className="border rounded-full px-4 py-1 text-sm hover:bg-gray-50">
                  Male candidates
                </button>
                <button className="border rounded-full px-4 py-1 text-sm hover:bg-gray-50">
                  Female candidates
                </button>
              </div>
            </details>

            <hr className="mb-4" />

            {/* Age  */}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-3">
                Age <span>⌃</span>
              </summary>

              <div className="flex items-center gap-2">
                <input
                  placeholder="Min age"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <span>to</span>
                <input
                  placeholder="Max age"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </details>

            <hr className="mb-4" />

            {/*  Degree / Course */}
            <details className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-3">
                Degree/Course <span>⌄</span>
              </summary>

              <div className="space-y-2 text-sm text-blue-600">
                <button className="flex items-center gap-2">
                  <span className="text-lg">+</span> UG course
                </button>
                <button className="flex items-center gap-2">
                  <span className="text-lg">+</span> PG course
                </button>
                <button className="flex items-center gap-2">
                  <span className="text-lg">+</span> PPG course
                </button>
              </div>
            </details>

            <hr className="mb-4" />

            {/* College Name  */}
            <details className="mb-2">
              <summary className="cursor-pointer font-medium flex justify-between mb-3">
                College name <span>⌄</span>
              </summary>

              <div className="space-y-2 text-sm text-blue-600">
                <button className="flex items-center gap-2">
                  <span className="text-lg">+</span> UG college
                </button>
                <button className="flex items-center gap-2">
                  <span className="text-lg">+</span> PG college
                </button>
                <button className="flex items-center gap-2">
                  <span className="text-lg">+</span> PPG college
                </button>
              </div>
            </details>
          </div>
        </div>

        {!selectedCandidate ? (
          <main className="col-span-9 space-y-4">
            {filteredCandidates.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4"
              >
                {/* Checkbox */}
                <input type="checkbox" className="mt-2 md:mt-0" />

                {/* MAIN INFO */}
                <div className="flex-1 flex flex-col gap-2">
                  <h3
                    onClick={() => {
                      setSelectedCandidate(c);

                      setViewedCandidateIds((prev) =>
                        prev.includes(c.id) ? prev : [...prev, c.id]
                      );
                    }}
                    className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 flex items-center gap-2"
                  >
                    {viewedCandidateIds.includes(c.id) && (
                      <CheckSquare size={16} className="text-blue-600" />
                    )}
                    <h3 className="font-semibold text-gray-900">
                      <Highlight text={c.full_name} />
                    </h3>
                  </h3>

                  {/* Experience, salary, location */}
                  <div className="text-xs md:text-sm text-gray-600 flex flex-wrap gap-2 md:gap-3">
                    <span>
                      <Highlight text={c.experience} />
                    </span>
                    <span>
                      <Highlight text={c.current_salary} />
                    </span>
                    {c.expected_salary && (
                      <span>
                        Expected:
                        <Highlight text={c.expected_salary} />
                      </span>
                    )}
                    <span>
                      <Highlight text={c.city?.name} />,{" "}
                      <Highlight text={c.state?.name} />
                    </span>
                  </div>

                  {/* Notice period */}
                  {c.notice_period && (
                    <p className="text-xs text-gray-500">
                      Notice period: <Highlight text={c.notice_period} />
                    </p>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {c.skills?.slice(0, 6).map((s, i) => (
                      <span
                        key={i}
                        className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                      >
                        <Highlight text={s.name} />
                      </span>
                    ))}
                  </div>

                  {/* Similar profiles */}
                  <p className="text-xs text-blue-600 mt-1 cursor-pointer">
                    View similar profiles
                  </p>
                </div>

                {/* RIGHT ACTION PANEL */}
                <div className="flex md:flex-col items-center md:items-center justify-between md:justify-center gap-2 md:gap-3 md:w-52 w-full border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4">
                  <img
                    src={
                      c.profile_image
                        ? `https://jobseeker-backend-jy1y.onrender.com${c.profile_image}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            c.full_name
                          )}`
                    }
                    alt={c.full_name}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border"
                  />

                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail size={14} /> <Highlight text={c.email} />
                  </p>

                  {c.resume && (
                    <a
                      href={`https://jobseeker-backend-jy1y.onrender.com${c.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-600 flex items-center gap-1 hover:underline"
                    >
                      <FileText size={14} /> View CV
                    </a>
                  )}
                </div>
              </div>
            ))}
          </main>
        ) : (
          /*DETAIL VIEW  */
          <main className="col-span-9">
            <CandidateDetail
              candidate={selectedCandidate}
              candidates={candidates}
              search={search}
              onBack={() => setSelectedCandidate(null)}
              onSelect={setSelectedCandidate}
            />
          </main>
        )}
      </div>
    </div>
  );
}

// Candidate Detail page

function CandidateDetail({
  candidate,
  candidates,
  search,
  onBack,
  onSelect,
}: {
  candidate: Candidate;
  candidates: Candidate[];
  search: string;
  onBack: () => void;
  onSelect: (c: Candidate) => void;
}) {
  const cleanSearch = search.trim().replace(/\s+/g, " ");

  const HighlightText = ({ text = "" }: { text?: string }) => {
    if (!cleanSearch) return <>{text}</>;

    return (
      <Highlighter
        searchWords={cleanSearch.split(" ")}
        autoEscape={true}
        textToHighlight={String(text)}
        highlightClassName="bg-yellow-200 px-1 rounded font-semibold"
      />
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* LEFT PROFILE */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-6 shadow-sm">
        <button onClick={onBack} className="text-blue-600 text-sm mb-4">
          ← Back to profiles
        </button>

        <div className="flex gap-4">
          <img
            src={
              candidate.profile_image
                ? `https://jobseeker-backend-jy1y.onrender.com${candidate.profile_image}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    candidate.full_name
                  )}`
            }
            alt={candidate.full_name}
            className="w-20 h-20 rounded-full object-cover border"
          />

          <div>
            <h2 className="text-xl font-semibold">
              {" "}
              <HighlightText text={candidate.full_name} />
            </h2>
            <p className="text-sm text-gray-600">
              <HighlightText text={candidate.experience} /> •{" "}
              <HighlightText text={candidate.current_salary} />
            </p>
            <p className="text-sm text-gray-500">
              <HighlightText text={candidate.city?.name} />,{" "}
              <HighlightText text={candidate.state?.name} />
            </p>
          </div>
        </div>
        <hr className="my-4" />

        <h3 className="font-medium mb-2">Compensation</h3>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <p>
            <b>Current:</b> <HighlightText text={candidate.current_salary} />
          </p>
          <p>
            <b>Expected:</b> <HighlightText text={candidate.expected_salary} />
          </p>
          <p>
            <b>Notice Period:</b>{" "}
            <HighlightText text={candidate.notice_period} />
          </p>
        </div>
        {candidate.educations && candidate.educations.length > 0 && (
          <>
            <hr className="my-4" />
            <h3 className="font-medium mb-2">Education</h3>

            {candidate.educations.map((e, i) => (
              <div key={i} className="text-sm mb-3">
                <p className="font-medium">
                  <HighlightText text={e.degree} /> {e.field && `(${e.field})`}
                </p>

                <p className="text-gray-600">
                  <HighlightText text={e.institution} />
                </p>

                <p className="text-gray-500 text-xs">
                  <HighlightText text={e.score_type?.toUpperCase()} />:{" "}
                  <HighlightText text={String(e.percentage)} /> • Year:{" "}
                  <HighlightText text={String(e.year)} />
                </p>
              </div>
            ))}
          </>
        )}

        <hr className="my-4" />

        <h3 className="font-medium mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {candidate.skills?.map((s, i) => (
            <span
              key={i}
              className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
            >
              <HighlightText text={s.name} />
            </span>
          ))}
        </div>

          {candidate.experiences && candidate.experiences.length > 0 && (
          <>
            <hr className="my-4" />
            <h3 className="font-medium mb-2">Experience</h3>

            {candidate.experiences.map((ex, i) => (
              <div key={i} className="text-sm mb-3">
                <p className="font-medium">
                  {" "}
                  <HighlightText text={ex.designation} />
                </p>
                <p className="text-gray-600">
                  {" "}
                  <HighlightText text={ex.company} />
                </p>
                <p className="text-gray-500 text-xs">
                  <p className="text-gray-500 text-xs">
                    <HighlightText text={ex.start_date ? String(ex.start_date) : undefined}/>{" "}
                  – <HighlightText text={ex.end_date !== undefined && ex.end_date !== null ? String(ex.end_date): "Present"}/>

                  </p>
                </p>
              </div>
            ))}
          </>
        )}
        {candidate.certifications && candidate.certifications.length > 0 && (
          <>
            <hr className="my-4" />
            <h3 className="font-medium mb-2">Certifications</h3>

            {candidate.certifications.map((c, i) => (
              <div key={i} className="text-sm mb-2">
                <p className="font-medium">
                  <HighlightText text={c.name} />
                </p>
                <p className="text-gray-600">
                  <HighlightText text={c.issuer} />
                </p>
                <p className="text-gray-500 text-xs">
                  Year:
                  <HighlightText text={String(c.year)} />
                </p>
              </div>
            ))}
          </>
        )}

        <hr className="my-4" />

        <h3 className="font-medium mb-2">Contact</h3>
        <p className="flex items-center gap-2 text-sm">
          <Mail size={14} />
          <HighlightText text={candidate.email} />
        </p>
        <p className="flex items-center gap-2 text-sm">
          <Phone size={14} /> <HighlightText text={candidate.phone} />
        </p>

        {candidate.resume && (
          <a
            href={`https://jobseeker-backend-jy1y.onrender.com${candidate.resume}`}
            target="_blank"
            className="inline-flex items-center gap-1 mt-3 text-blue-600 underline text-sm"
          >
            <FileText size={14} /> View CV
          </a>
        )}
      </div>

      {/* RIGHT SIMILAR */}
      <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Similar Profiles</h3>

        {candidates
          .filter((c) => c.id !== candidate.id)
          .slice(0, 10)
          .map((c) => (
            <div
              key={c.id}
              onClick={() => onSelect(c)}
              className="border-b py-2 text-sm cursor-pointer hover:text-blue-600"
            >
              <HighlightText text={c.full_name} />
            </div>
          ))}
      </div>
    </div>
  );
}
