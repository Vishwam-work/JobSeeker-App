"use client";

import { useEffect, useState } from "react";
import { Phone, FileText, Mail, CheckSquare, Briefcase, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Highlighter from "react-highlight-words";
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


export default function CandidatesPage({ isSubscribed = false }: { isSubscribed?: boolean }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewedCandidateIds, setViewedCandidateIds] = useState<number[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  const [filters, setFilters] = useState({
    hideProfiles: false,
    premiumOnly: false,
    keywords: "",
    currentCompany: "",
    locationSearch: "",
    locations: [] as string[],
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    designation: "",
    department: [] as string[],
    industry: [] as string[],
    noticePeriod: [] as string[],
    gender: "",
    minAge: "",
    maxAge: "",
    degree: [] as string[],
    college: [] as string[],
  });

  const clearFilters = () => {
    setFilters({
      hideProfiles: false,
      premiumOnly: false,
      keywords: "",
      currentCompany: "",
      locationSearch: "",
      locations: [],
      minExperience: "",
      maxExperience: "",
      minSalary: "",
      maxSalary: "",
      designation: "",
      department: [],
      industry: [],
      noticePeriod: [],
      gender: "",
      minAge: "",
      maxAge: "",
      degree: [],
      college: [],
    });
    setSearch("");
  };
  const cleanSearch = search.trim().replace(/\s+/g, " ");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    fetch(
      "http://127.0.0.1:8010/employeer/api/profile-all/",
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
    // 1. Global Search (Search Bar)
    const q = search.trim().toLowerCase();
    let matchesSearch = true;
    if (q) {
      const matches = (value: any) =>
        value !== null &&
        value !== undefined &&
        String(value).toLowerCase().includes(q);

      matchesSearch =
        matches(c.full_name) ||
        matches(c.email) ||
        matches(c.current_role) ||
        matches(c.current_company) ||
        matches(c.experience) ||
        matches(c.current_salary) ||
        matches(c.expected_salary) ||
        matches(c.notice_period) ||
        matches(c.city?.name) ||
        matches(c.state?.name) ||
        matches(c.country?.name) ||
        c.skills?.some((s) => matches(s.name)) ||
        c.certifications?.some(
          (cert) =>
            matches(cert.name) || matches(cert.issuer) || matches(cert.year)
        ) ||
        c.educations?.some(
          (e) =>
            matches(e.degree) ||
            matches(e.field) ||
            matches(e.institution) ||
            matches(e.year)
        ) ||
        c.experiences?.some(
          (ex) => matches(ex.designation) || matches(ex.company)
        );
    }

    // 2. Specific Filters

    // Hide Profiles
    if (filters.hideProfiles && viewedCandidateIds.includes(c.id)) return false;

    // Premium Institute
    if (filters.premiumOnly) {
      const premiumKeywords = ["iit", "iim", "nit", "bits", "xlri", "isb", "iiit"];
      const isPremium = c.educations?.some((e) => // Use c.educations if available from API (check interface, used in detail view, so assumed exists in list OR detail)
        premiumKeywords.some((pk) => e.institution?.toLowerCase().includes(pk))
      );
      // If educations is not in list view item, this might fail or be false. 
      // Assuming 'profile-all' returns full nested objects as seen in CandidatesPage detail view logic.
      if (!isPremium) return false;
    }

    // Keywords
    if (filters.keywords) {
      const k = filters.keywords.toLowerCase();
      const hasKeyword =
        c.skills?.some((s) => s.name.toLowerCase().includes(k)) ||
        c.full_name.toLowerCase().includes(k) ||
        c.current_role?.toLowerCase().includes(k);
      if (!hasKeyword) return false;
    }

    // Current Company
    if (filters.currentCompany) {
      const company = filters.currentCompany.toLowerCase();
      const hasCompany =
        c.current_company?.toLowerCase().includes(company) ||
        c.experiences?.some(ex => ex.company?.toLowerCase().includes(company) && (!ex.end_date || ex.end_date.toLowerCase() === 'present'));
      if (!hasCompany) return false;
    }

    // Location
    if (filters.locations.length > 0) {
      const locMatch = filters.locations.some(loc =>
        c.city?.name.toLowerCase().includes(loc.toLowerCase()) ||
        c.state?.name.toLowerCase().includes(loc.toLowerCase())
      );
      if (!locMatch) return false;
    }
    if (filters.locationSearch) {
      const locS = filters.locationSearch.toLowerCase();
      const locSearchMatch =
        c.city?.name.toLowerCase().includes(locS) ||
        c.state?.name.toLowerCase().includes(locS);
      if (!locSearchMatch) return false;
    }

    // Experience
    const expVal = parseFloat(c.experience) || 0;
    if (filters.minExperience && expVal < parseFloat(filters.minExperience)) return false;
    if (filters.maxExperience && expVal > parseFloat(filters.maxExperience)) return false;

    // Salary
    const salVal = parseFloat(c.current_salary) || 0;
    if (filters.minSalary && salVal < parseFloat(filters.minSalary)) return false;
    if (filters.maxSalary && salVal > parseFloat(filters.maxSalary)) return false;

    // Designation
    if (filters.designation) {
      const des = filters.designation.toLowerCase();
      const matchesDes = c.current_role?.toLowerCase().includes(des) ||
        c.experiences?.some(ex => ex.designation.toLowerCase().includes(des));
      if (!matchesDes) return false;
    }

    // Department (Search in rule)
    if (filters.department.length > 0) {
      const matchesDept = filters.department.some(dept =>
        c.current_role?.toLowerCase().includes(dept.toLowerCase())
      );
      if (!matchesDept) return false;
    }

    // Industry - Placeholder logic
    if (filters.industry.length > 0) {
      // checks against current company or role for now
      const matchesInd = filters.industry.some(ind =>
        c.current_role?.toLowerCase().includes(ind.toLowerCase()) ||
        c.current_company?.toLowerCase().includes(ind.toLowerCase())
      );
      if (!matchesInd) return false;
    }

    // Notice Period
    if (filters.noticePeriod.length > 0) {
      const matchesNP = filters.noticePeriod.some(np =>
        c.notice_period?.toLowerCase() === np.toLowerCase() ||
        c.notice_period?.toLowerCase().includes(np.toLowerCase())
      );
      if (!matchesNP) return false;
    }

    // Gender
    if (filters.gender) {
      if ((c as any).gender?.toLowerCase() !== filters.gender.toLowerCase()) return false;
    }

    // Age
    if (filters.minAge || filters.maxAge) {
      const age = (c as any).age ? parseInt((c as any).age) : 0;
      if (age > 0) {
        if (filters.minAge && age < parseInt(filters.minAge)) return false;
        if (filters.maxAge && age > parseInt(filters.maxAge)) return false;
      }
    }

    return matchesSearch;
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

  const renderCandidateCard = (c: Candidate) => (
    <div
      key={c.id}
      className={`bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 transition-all duration-300 ${selectedCandidate?.id === c.id
        ? "border-l-4 border-l-blue-500 bg-blue-50"
        : "border-l-4 border-l-transparent"
        }`}
    >
      <input type="checkbox" className="mt-2 md:mt-0" />

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
          <span className="font-semibold text-gray-900">
            <Highlight text={c.full_name} />
          </span>
        </h3>

        <div className="text-xs md:text-sm text-gray-600 flex flex-wrap gap-2 md:gap-3">
          <span>
            <Highlight text={c.experience} />
          </span>
          <span>
            <Highlight text={c.current_salary} />
          </span>
          {c.expected_salary && (
            <span>
              Expected: <Highlight text={c.expected_salary} />
            </span>
          )}
          <span>
            <Highlight text={c.city?.name} />, <Highlight text={c.state?.name} />
          </span>
        </div>

        {c.notice_period && (
          <p className="text-xs text-gray-500">
            Notice period: <Highlight text={c.notice_period} />
          </p>
        )}

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

        <p className="text-xs text-blue-600 mt-1 cursor-pointer">
          View similar profiles
        </p>
      </div>

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
  );

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
        
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 p-4">
        {/* LEFT FILTERS */}
        <aside className="hidden md:block col-span-3 bg-white rounded-xl p-4 shadow-sm h-fit max-h-screen overflow-y-auto sticky top-4">
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
          <label className="flex items-center gap-2 font-medium mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hideProfiles}
              onChange={(e) =>
                setFilters({ ...filters, hideProfiles: e.target.checked })
              }
            />
            Hide Viewed Profiles
          </label>

          <hr className="mb-4" />

          {/* Premium */}
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.premiumOnly}
              onChange={(e) => setFilters({ ...filters, premiumOnly: e.target.checked })}
            />
            Premium Institute Candidates
          </label>

          <hr className="mb-4" />

          {/* Keywords */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between">
              Keywords <span>⌄</span>
            </summary>
            <div className="mt-2">
              <input
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="e.g. React, Java"
                value={filters.keywords}
                onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
              />
            </div>
          </details>

          <hr className="mb-4" />

          {/* Current Company */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between">
              Current company <span>⌄</span>
            </summary>
            <div className="mt-2">
              <input
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="Search company"
                value={filters.currentCompany}
                onChange={(e) => setFilters({ ...filters, currentCompany: e.target.value })}
              />
            </div>
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
              ["Delhi", "500"],
              ["Mumbai", "600"],
            ].map(([city, count]) => (
              <label
                key={city}
                className="flex justify-between items-center mb-2 cursor-pointer"
              >
                <span className="flex gap-2 text-sm">
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
                <span className="text-gray-400 text-xs">{count}</span>
              </label>
            ))}
          </details>

          <hr className="mb-4" />

          {/* Experience */}
          <details open>
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Experience (Years) <span>⌃</span>
            </summary>

            <div className="flex items-center gap-2">
              <select
                value={filters.minExperience}
                onChange={(e) =>
                  setFilters({ ...filters, minExperience: e.target.value })
                }
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="">Min</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="8">8</option>
                <option value="10">10</option>
              </select>

              <span>to</span>

              <select
                value={filters.maxExperience}
                onChange={(e) =>
                  setFilters({ ...filters, maxExperience: e.target.value })
                }
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="">Max</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="15">15+</option>
              </select>
            </div>
          </details>

          <hr className="mb-4" />

          {/* Salary  */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Salary (INR-Lacs) <span>⌃</span>
            </summary>

            <div className="flex items-center gap-2">
              <select
                className="w-full border rounded px-2 py-2 text-sm"
                value={filters.minSalary}
                onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
              >
                <option value="">Min</option>
                <option value="0">0</option>
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>

              <span>to</span>

              <select
                className="w-full border rounded px-2 py-2 text-sm"
                value={filters.maxSalary}
                onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
              >
                <option value="">Max</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50+</option>
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
                value={filters.designation}
                onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
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

            <div className="max-h-40 overflow-y-auto">
              {[
                "Engineering - Software & QA",
                "Consulting",
                "IT & Information Security",
                "Project & Program Management",
                "Sales",
                "Marketing",
                "HR"
              ].map((name) => (
                <label
                  key={name}
                  className="flex justify-between items-center mb-2 cursor-pointer"
                >
                  <span className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.department.includes(name)}
                      onChange={() => setFilters(prev => ({
                        ...prev,
                        department: prev.department.includes(name)
                          ? prev.department.filter(d => d !== name)
                          : [...prev.department, name]
                      }))}
                    />
                    {name}
                  </span>
                </label>
              ))}
            </div>
          </details>

          <hr className="mb-4" />

          {/*  Industry  */}
          <details open>
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Industry <span>⌃</span>
            </summary>

            <div className="max-h-40 overflow-y-auto">
              {[
                "IT Services & Consulting",
                "Software Product",
                "Management Consulting",
                "Emerging Technologies",
                "Banking",
                "Healthcare"
              ].map((name) => (
                <label
                  key={name}
                  className="flex justify-between items-center mb-2 cursor-pointer"
                >
                  <span className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.industry.includes(name)}
                      onChange={() => setFilters(prev => ({
                        ...prev,
                        industry: prev.industry.includes(name)
                          ? prev.industry.filter(i => i !== name)
                          : [...prev.industry, name]
                      }))}
                    />
                    {name}
                  </span>
                </label>
              ))}
            </div>
          </details>
          <hr className="my-4" />

          {/* Notice Period*/}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Notice period <span>⌃</span>
            </summary>

            {[
              "0 - 15 days",
              "1 month",
              "2 months",
              "3 months",
              "More than 3 months",
              "Serving Notice Period",
            ].map((label) => (
              <label
                key={label}
                className="flex justify-between items-center mb-2 cursor-pointer"
              >
                <span className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.noticePeriod.includes(label)}
                    onChange={() => setFilters(prev => ({
                      ...prev,
                      noticePeriod: prev.noticePeriod.includes(label)
                        ? prev.noticePeriod.filter(n => n !== label)
                        : [...prev.noticePeriod, label]
                    }))}
                  />
                  {label}
                </span>
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
                onClick={() => setFilters({ ...filters, gender: filters.gender === 'Male' ? '' : 'Male' })}
                className={`border rounded-full px-4 py-1 text-sm ${filters.gender === 'Male' ? 'bg-blue-100 border-blue-200' : 'hover:bg-gray-50'}`}>
                Male
              </button>
              <button
                onClick={() => setFilters({ ...filters, gender: filters.gender === 'Female' ? '' : 'Female' })}
                className={`border rounded-full px-4 py-1 text-sm ${filters.gender === 'Female' ? 'bg-blue-100 border-blue-200' : 'hover:bg-gray-50'}`}>
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
                placeholder="Min"
                className="w-full border rounded px-3 py-2 text-sm"
                value={filters.minAge}
                onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
              />
              <span>to</span>
              <input
                placeholder="Max"
                className="w-full border rounded px-3 py-2 text-sm"
                value={filters.maxAge}
                onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
              />
            </div>
          </details>

          <hr className="mb-4" />

          {/*  Degree / Course */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-3">
              Degree/Course <span>⌄</span>
            </summary>
            {/* Expanded details could go here, for now keeping simple UI */}
            <div className="text-sm text-gray-500 italic">Select degrees (Coming soon)</div>
          </details>

          <hr className="mb-4" />

          {/* College Name  */}
          <details className="mb-2">
            <summary className="cursor-pointer font-medium flex justify-between mb-3">
              College name <span>⌄</span>
            </summary>
            {/* Expanded details for colleges */}
            <div className="text-sm text-gray-500 italic">Select colleges (Coming soon)</div>
          </details>
        </aside>

        <div
          className={`fixed inset-0 bg-black/40 z-50 md:hidden transition-transform ${showFilters ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="absolute right-0 w-3/4 max-w-xs h-full bg-white p-4 overflow-y-auto">
            <button
              onClick={() => setShowFilters(false)}
              className="mb-4 text-gray-500"
            >
              Close ✕
            </button>

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Hide Profiles */}
            <label className="flex items-center gap-2 font-medium mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hideProfiles}
                onChange={(e) => setFilters({ ...filters, hideProfiles: e.target.checked })}
              />
              Hide Viewed Profiles
            </label>

            <hr className="mb-4" />

            {/* Premium */}
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.premiumOnly}
                onChange={(e) => setFilters({ ...filters, premiumOnly: e.target.checked })}
              />
              Premium Institute Candidates
            </label>

            <hr className="mb-4" />

            {/* Keywords */}
            <details className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between">
                Keywords <span>⌄</span>
              </summary>
              <div className="mt-2">
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="e.g. React, Java"
                  value={filters.keywords}
                  onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
                />
              </div>
            </details>

            <hr className="mb-4" />

            {/* Current Company */}
            <details className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between">
                Current company <span>⌄</span>
              </summary>
              <div className="mt-2">
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Search company"
                  value={filters.currentCompany}
                  onChange={(e) => setFilters({ ...filters, currentCompany: e.target.value })}
                />
              </div>
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
                value={filters.locationSearch}
                onChange={(e) => setFilters({ ...filters, locationSearch: e.target.value })}
              />

              {[
                ["Hyderabad", "1,153"],
                ["Bengaluru", "1,111"],
                ["Pune", "516"],
                ["Chennai", "234"],
              ].map(([city, count]) => (
                <label
                  key={city}
                  className="flex justify-between items-center mb-2 cursor-pointer"
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
            </details>

            <hr className="mb-4" />

            {/* Experience */}
            <details open>
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Experience (Years) <span>⌃</span>
              </summary>

              <div className="flex items-center gap-2">
                <select
                  value={filters.minExperience}
                  onChange={(e) =>
                    setFilters({ ...filters, minExperience: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="">Min</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                </select>

                <span>to</span>

                <select
                  value={filters.maxExperience}
                  onChange={(e) =>
                    setFilters({ ...filters, maxExperience: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="">Max</option>
                  <option value="2">2</option>
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                  <option value="15">15+</option>
                </select>
              </div>
            </details>

            <hr className="mb-4" />

            {/* Salary  */}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Salary (INR-Lacs) <span>⌃</span>
              </summary>

              <div className="flex items-center gap-2">
                <select
                  className="w-full border rounded px-2 py-2 text-sm"
                  value={filters.minSalary}
                  onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                >
                  <option value="">Min</option>
                  <option value="0">0</option>
                  <option value="3">3</option>
                  <option value="6">6</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>

                <span>to</span>

                <select
                  className="w-full border rounded px-2 py-2 text-sm"
                  value={filters.maxSalary}
                  onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                >
                  <option value="">Max</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50+</option>
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
                  value={filters.designation}
                  onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
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
              <div className="max-h-40 overflow-y-auto">
                {[
                  "Engineering - Software & QA",
                  "Consulting",
                  "IT & Information Security",
                  "Project & Program Management",
                  "Sales",
                  "Marketing",
                  "HR"
                ].map((name) => (
                  <label
                    key={name}
                    className="flex justify-between items-center mb-2 cursor-pointer"
                  >
                    <span className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={filters.department.includes(name)}
                        onChange={() => setFilters(prev => ({
                          ...prev,
                          department: prev.department.includes(name)
                            ? prev.department.filter(d => d !== name)
                            : [...prev.department, name]
                        }))}
                      />
                      {name}
                    </span>
                  </label>
                ))}
              </div>
            </details>
            <hr className="mb-4" />

            {/*  Industry  */}
            <details open>
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Industry <span>⌃</span>
              </summary>

              <div className="max-h-40 overflow-y-auto">
                {[
                  "IT Services & Consulting",
                  "Software Product",
                  "Management Consulting",
                  "Emerging Technologies",
                  "Banking",
                  "Healthcare"
                ].map((name) => (
                  <label
                    key={name}
                    className="flex justify-between items-center mb-2 cursor-pointer"
                  >
                    <span className="flex gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.industry.includes(name)}
                        onChange={() => setFilters(prev => ({
                          ...prev,
                          industry: prev.industry.includes(name)
                            ? prev.industry.filter(i => i !== name)
                            : [...prev.industry, name]
                        }))}
                      />
                      {name}
                    </span>
                  </label>
                ))}
              </div>
            </details>
            <hr className="my-4" />

            {/* Notice Period*/}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Notice period <span>⌃</span>
              </summary>

              {[
                "0 - 15 days",
                "1 month",
                "2 months",
                "3 months",
                "More than 3 months",
                "Serving Notice Period",
              ].map((label) => (
                <label
                  key={label}
                  className="flex justify-between items-center mb-2 cursor-pointer"
                >
                  <span className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.noticePeriod.includes(label)}
                      onChange={() => setFilters(prev => ({
                        ...prev,
                        noticePeriod: prev.noticePeriod.includes(label)
                          ? prev.noticePeriod.filter(n => n !== label)
                          : [...prev.noticePeriod, label]
                      }))}
                    />
                    {label}
                  </span>
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
                  onClick={() => setFilters({ ...filters, gender: filters.gender === 'Male' ? '' : 'Male' })}
                  className={`border rounded-full px-4 py-1 text-sm ${filters.gender === 'Male' ? 'bg-blue-100 border-blue-200' : 'hover:bg-gray-50'}`}>
                  Male
                </button>
                <button
                  onClick={() => setFilters({ ...filters, gender: filters.gender === 'Female' ? '' : 'Female' })}
                  className={`border rounded-full px-4 py-1 text-sm ${filters.gender === 'Female' ? 'bg-blue-100 border-blue-200' : 'hover:bg-gray-50'}`}>
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
                placeholder="Min"
                className="w-full border rounded px-3 py-2 text-sm"
                value={filters.minAge}
                onChange={(e) => setFilters({...filters, minAge: e.target.value})}
              />
              <span>to</span>
              <input
                placeholder="Max"
                className="w-full border rounded px-3 py-2 text-sm"
                value={filters.maxAge}
                onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
              />
            </div>
          </details>
          </div>
        </div>

        {!selectedCandidate ? (
          <main className="col-span-12 md:col-span-9 space-y-4">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Full Access</h3>
                  <p className="text-gray-500 mb-6 text-center max-w-sm">
                    Subscribe to our premium plan to view unlimited candidate profiles and access contact details.
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2 rounded-full shadow-md transition-transform hover:scale-105">
                    View Subscription Plans
                  </Button>
                </div>

                {/* Blurred Content (Render next 3 as background) */}
                <div className="space-y-4 blur-sm opacity-40 select-none pointer-events-none grayscale">
                  {filteredCandidates.slice(3, 6).map((c) => renderCandidateCard(c))}
                </div>

                {/* RIGHT ACTION PANEL */}
                <div className="flex md:flex-col items-center md:items-center justify-between md:justify-center gap-2 md:gap-3 md:w-52 w-full border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4">
                  <img
                    src={
                      c.profile_image
                        ? `http://127.0.0.1:8010${c.profile_image}`
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
                      href={`http://127.0.0.1:8010${c.resume}`}
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
          <main className="col-span-12 md:col-span-9">
            <CandidateDetail
              candidate={selectedCandidate!}
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
    <div className="grid grid-cols-12 gap-4 px-2 sm:px-4 lg:px-0">
      {/* LEFT PROFILE */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <button onClick={onBack} className="text-blue-600 text-sm mb-4">
          ← Back to profiles
        </button>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <img
            src={
              candidate.profile_image
                ? `http://127.0.0.1:8010${candidate.profile_image}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  candidate.full_name
                )}`
            }
            alt={candidate.full_name}
           className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
                    <HighlightText text={ex.start_date ? String(ex.start_date) : undefined} />{" "}
                    – <HighlightText text={ex.end_date !== undefined && ex.end_date !== null ? String(ex.end_date) : "Present"} />

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
        <p className="flex items-center gap-2 text-sm break-all">
          <Mail size={14} />
          <HighlightText text={candidate.email} />
        </p>
        <p className="flex items-center gap-2 text-sm">
          <Phone size={14} /> <HighlightText text={candidate.phone} />
        </p>

        {candidate.resume && (
          <a
            href={`http://127.0.0.1:8010${candidate.resume}`}
            target="_blank"
            className="inline-flex items-center gap-1 mt-3 text-blue-600 underline text-sm"
          >
            <FileText size={14} /> View CV
          </a>
        )}
      </div>

      {/* RIGHT SIMILAR */}
      <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-4 sm:p-5 shadow-sm">
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
