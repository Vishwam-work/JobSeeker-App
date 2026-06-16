"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/Header";
import HeroCarousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import Image from "next/image";
import { User } from "lucide-react";
import AsyncSelect from "react-select/async";
export default function CompaniesPage() {
  const [allCompanies, setAllCompanies] = useState<CompanyListItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCompanyType, setSelectedCompanyType] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCompanySize, setSelectedCompanySize] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalcount, setTotalcount] = useState("");
  const companyTypes = [
    "Government",
    "LLP",
    "NGO",
    "Partnership",
    "Private Limited Company",
    "Public Limited Company",
    "Startup",
    "Sole Proprietorship",
  ];

  const industries = [
    "Automotive",
    "Banking & Financial Services",
    "Consulting",
    "Education",
    "Healthcare",
    "Information Technology",
    "Manufacturing",
    "Media & Entertainment",
    "Other",
    "Real Estate",
    "Retail",
    "Telecommunications",
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ];
  type CompanyListItem = {
    id: string | number;
    name: string;
    type: string;
    industry: string;
    employees: string;
    locations: string[];
    rating: number;
    reviews: number;
    founded: number | null;
    company_logo: string;
  };
  // Fetch states and categories for filters
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("user_token")
            : null;

        const headers = {
          "Content-Type": "application/json",
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        };

        const [stateRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/states/`, {
            headers,
          }),
        ]);

        const stateData = await stateRes.json();

        console.log("States:", stateData);

        setStates(
          Array.isArray(stateData)
            ? stateData
            : stateData.data || stateData.results || [],
        );
      } catch (err) {
        console.error(err);
      }
    };

    loadFilters();
  }, []);
  const companyTypeOptions = companyTypes.map((item) => ({
    value: item,
    label: item,
  }));

  const industryOptions = industries.map((item) => ({
    value: item,
    label: item,
  }));

  const companySizeOptions = companySizes.map((item) => ({
    value: item,
    label: item,
  }));
  const loadCompanyTypes = async () => companyTypeOptions;
  const loadIndustries = async () => industryOptions;
  const loadCompanySizes = async () => companySizeOptions;
  const fetchCompanies = async (
    searchValue = "",
    stateValue = "",
    companyTypeValue = "",
    industryValue = "",
    companySizeValue = "",
     pageNumber = 1
  ) => {
    try {
      setLoading(true);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("user_token")
          : null;

      const headers = {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      };

      const params = new URLSearchParams();

      if (searchValue) params.append("search", searchValue);

      if (stateValue) params.append("state", stateValue);

      if (companyTypeValue) {
        params.append("company_type", companyTypeValue);
      }

      if (industryValue) {
        params.append("industry", industryValue);
      }

      if (companySizeValue) {
        params.append("company_size", companySizeValue);
      }

      params.append("page", pageNumber.toString());

      const companyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/companies/?${params.toString()}`,
        { headers },
      );

      const companyData = await companyRes.json();
      const companies = Array.isArray(companyData)
        ? companyData
        : companyData.results || [];
        setTotalcount(companyData.count || 0);
      setCurrentPage(pageNumber);

      setTotalPages(
        Math.ceil(
          (Array.isArray(companyData)
            ? companyData.length
            : companyData.count || 0) / 1
        )
      );

      const countryRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/countries/`,
      );

      const countryData = await countryRes.json();

      const countries = countryData.data || countryData;

      const stateRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/states/`,
      );

      const stateData = await stateRes.json();

      const states = stateData.data || stateData;

      const mapped: CompanyListItem[] = await Promise.all(
        companies.map(async (item: any): Promise<CompanyListItem> => {
          const matchedCountry = countries.find(
            (c: any) => Number(c.id) === Number(item.company?.country),
          );

          const matchedState = states.find(
            (s: any) => Number(s.id) === Number(item.company?.state),
          );

          const cityRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_MASTER}/cities/?state=${item.company?.state}`,
          );

          const cityData = await cityRes.json();

          const cities = cityData.data || cityData.results || cityData;

          const matchedCity = cities.find(
            (c: any) => String(c.id) === String(item.company?.city),
          );

          return {
            id: item.id,
            name: item.company?.company_name || "N/A",

            type: item.company?.company_type || "N/A",

            industry: item.company?.industry || "Not specified",

            employees: item.company?.company_size || "N/A",

            locations: [
              matchedCity?.name,
              matchedState?.name,
              matchedCountry?.name,
            ].filter(Boolean),

            rating: item.company?.rating || 3,

            reviews: item.company?.reviews || 10,

            founded: item.company?.founded_year || null,

            company_logo: item.company?.company_logo
              ? process.env.NEXT_PUBLIC_URL + item.company?.company_logo
              : "",
          };
        }),
      );

      setAllCompanies(mapped);
    } catch (error) {
      console.error("Fetch Error:", error);
      setAllCompanies([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroCarousel />

      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Companies ({totalcount})
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar filters */}
          <div className="lg:col-span-3 bg-white border rounded-lg p-4 h-fit">
          <div className="flex gap-2">
            <h3 className="font-semibold mb-4">All Filters</h3>
            <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSelectedState("");
                  setSelectedCompanyType("");
                  setSelectedIndustry("");
                  setSelectedCompanySize("");

                  fetchCompanies();
                }}
              >
                Reset
              </Button>
              </div>

            {/* Search */}

            <div className="mb-5">
              <label className="text-sm font-medium">Search</label>

              <Input
                placeholder="Company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Company Type */}
            <div className="mb-5">
              <label className="text-sm font-medium">Company Type</label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadCompanyTypes}
                value={
                  selectedCompanyType
                    ? {
                        value: selectedCompanyType,
                        label: selectedCompanyType,
                      }
                    : null
                }
                onChange={(selected: any) =>
                  setSelectedCompanyType(selected?.value || "")
                }
                placeholder="Company Type"
              />
            </div>

            {/* Industry */}
            <div className="mb-5">
              <label className="text-sm font-medium">Industry</label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadIndustries}
                value={
                  selectedIndustry
                    ? {
                        value: selectedIndustry,
                        label: selectedIndustry,
                      }
                    : null
                }
                onChange={(selected: any) =>
                  setSelectedIndustry(selected?.value || "")
                }
                placeholder="Industry"
              />
            </div>

            {/* Company Size */}
            <div className="mb-5">
              <label className="text-sm font-medium">Company Size</label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadCompanySizes}
                value={
                  selectedCompanySize
                    ? {
                        value: selectedCompanySize,
                        label: selectedCompanySize,
                      }
                    : null
                }
                onChange={(selected: any) =>
                  setSelectedCompanySize(selected?.value || "")
                }
                placeholder="Company Size"
              />
            </div>

            {/* State */}

            <div className="mb-5">
              <label className="text-sm font-medium">State</label>

              <AsyncSelect
                cacheOptions
                defaultOptions={states.map((state: any) => ({
                  value: state.name,
                  label: state.name,
                }))}
                loadOptions={async (inputValue) => {
                  return states
                    .filter((state: any) =>
                      state.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()),
                    )
                    .map((state: any) => ({
                      value: state.name,
                      label: state.name,
                    }));
                }}
                value={
                  selectedState
                    ? {
                        value: selectedState,
                        label: selectedState,
                      }
                    : null
                }
                onChange={(selected: any) =>
                  setSelectedState(selected?.value || "")
                }
                placeholder="Search State..."
              />
            </div>

            {/* Buttons */}

              <Button
                className="flex-1"
                onClick={() => {
                  setPage(1);

                  fetchCompanies(
                    search,
                    selectedState,
                    selectedCompanyType,
                    selectedIndustry,
                    selectedCompanySize,
                    1
                  );
                }}
              >
                Apply Filters
              </Button>

              {/* <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSelectedState("");
                  setSelectedCompanyType("");
                  setSelectedIndustry("");
                  setSelectedCompanySize("");

                  fetchCompanies();
                }}
              >
                Reset
              </Button>
            </div> */}
          </div>

          {allCompanies.length === 0 ? (
            <div className="flex items-center justify-center py-16 lg:col-span-9">
              <div className="bg-white border rounded-xl shadow-sm p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  No Companies Found
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  We couldn't find any companies matching your search or
                  selected filters.
                </p>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => {
                    setSearch("");
                    setSelectedState("");
                    setSelectedCompanyType("");
                    setSelectedIndustry("");
                    setSelectedCompanySize("");
                    setPage(1);
                    fetchCompanies();
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Companies */}
              <div className="lg:col-span-9">
                <p className="text-sm text-gray-500 mb-4">
                  Showing {allCompanies.length} companies
                  {/* Showing {totalCount} companies */}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {allCompanies.map((company) => (
                    <Link
                      key={company.id || Math.random()}
                      href={company.id ? `/companies/${company.id}` : "#"}
                      target="_blank"
                    >
                      <Card className="p-4 hover:shadow-md transition cursor-pointer">
                        <CardContent className="flex items-center gap-4 p-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            {company.company_logo ? (
                              <Image
                                src={company.company_logo}
                                alt="company logo"
                                width={32}
                                height={25}
                                className="w-12 h-12 rounded-full object-cover border"
                              />
                            ) : (
                              <User className="w-6 h-6 text-gray-700 hover:text-purple-600" />
                            )}
                          </div>

                          <div>
                            <h3 className="font-semibold">{company.name}</h3>

                            <p className="text-xs text-gray-500">
                              {company.type}
                            </p>

                            <p className="text-xs text-gray-500">
                              {company.industry}
                            </p>

                            <p className="text-xs text-gray-400">
                              {company.locations.join(", ")}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 border-t pt-6">

            {/* Pagination */}
            <div className="flex items-center gap-2">

              {/* Previous */}
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  fetchCompanies(
                    search,
                    selectedState,
                    selectedCompanyType,
                    selectedIndustry,
                    selectedCompanySize,
                    currentPage - 1
                  )
                }
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ‹
              </button>

              {/* Page Info */}
              <div className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                Page {currentPage} of {totalPages}
              </div>

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  fetchCompanies(
                    search,
                    selectedState,
                    selectedCompanyType,
                    selectedIndustry,
                    selectedCompanySize,
                    currentPage + 1
                  )
                }
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ›
              </button>

            </div>

          </div>
      </main>

      <Footer />
    </div>
  );
}
