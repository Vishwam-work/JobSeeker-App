"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/Header";
import HeroCarousel from "@/components/Carousel";
import Footer from "@/components/Footer";

export default function CompaniesPage() {
  const [allCompanies, setAllCompanies] = useState<CompanyListItem[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
         const token =
           typeof window !== "undefined"
             ? localStorage.getItem("auth_token")
             : null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/companies/`,
          {
            headers: {
               "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
           }
        );
   
        if (!res.ok) {
          throw new Error("Failed to fetch companies");
        }

        const data = await res.json();

        const mapped: CompanyListItem[] = (data.data || data).map(
        (item: any): CompanyListItem => ({
          id: item.id,
          name: item.company_name,
          type: item.company_type || "N/A",
          industry: item.industry || "Not specified",
          employees: item.company_size || "N/A",
          locations: [item.city, item.state].filter(Boolean),
          rating: Math.floor(Math.random() * 2) + 3,
          reviews: Math.floor(Math.random() * 200) + 10,
          founded: item.founded_year || null,
        })
      );
   
        setAllCompanies(mapped);
      } catch (error) {

        setAllCompanies([]);
      } finally {
        setLoading(false);
      }
     };

     fetchCompanies();
   }, []);


  //  Search filter
  const filteredCompanies = allCompanies.filter((company) => {
    const query = search.toLowerCase();
    return (
      company.name.toLowerCase().includes(query) ||
      company.industry.toLowerCase().includes(query)
    );
  });

const startIndex = (page - 1) * itemsPerPage;

const paginatedCompanies = filteredCompanies.slice(
  startIndex,
  startIndex + itemsPerPage
);

const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

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
        {/* Search bar */}
        <div className="flex items-center justify-center mb-6">
          <Input
            placeholder="Search companies or industries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        <h1 className="text-2xl font-bold mb-6">
          Companies ({filteredCompanies.length})
        </h1>

        {filteredCompanies.length === 0 ? (
          <p className="text-gray-500">No companies found.</p>
        ) : (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

  {/* Sidebar filters */}
  <div className="lg:col-span-3 bg-white border rounded-lg p-4 h-fit">
    <h3 className="font-semibold mb-4">All Filters</h3>

    <div className="mb-6">
      <p className="text-sm font-medium mb-2">Company type</p>

      <div className="space-y-2 text-sm">
        <label className="flex gap-2">
          <input type="checkbox" /> Indian MNC
        </label>

        <label className="flex gap-2">
          <input type="checkbox" /> Startup
        </label>

        <label className="flex gap-2">
          <input type="checkbox" /> MNC
        </label>
      </div>
    </div>

    <div>
      <p className="text-sm font-medium mb-2">Location</p>

      <Input placeholder="Search Location" className="mb-2" />

      <div className="space-y-2 text-sm">
        <label className="flex gap-2">
          <input type="checkbox" /> Bengaluru
        </label>

        <label className="flex gap-2">
          <input type="checkbox" /> Delhi
        </label>

        <label className="flex gap-2">
          <input type="checkbox" /> Mumbai
        </label>
      </div>
    </div>
  </div>

  {/* Companies */}
  <div className="lg:col-span-9">

    <p className="text-sm text-gray-500 mb-4">
      Showing {filteredCompanies.length} companies
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {paginatedCompanies.map((company) => (

        <Link
          key={company.id}
          href={`/companies/${company.id}`}
          target="_blank"
        >

          <Card className="p-4 hover:shadow-md transition cursor-pointer">
            <CardContent className="flex items-center gap-4 p-0">

              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center font-bold">
                {company.name.charAt(0)}
              </div>

              <div>
                <h3 className="font-semibold">{company.name}</h3>

                <p className="text-sm text-gray-500">
                  ⭐ {company.rating} ({company.reviews} reviews)
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
</div>
<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 border-t pt-6">

  <div className="text-sm text-gray-500">
    Showing{" "}
    <span className="font-medium">
      {Math.min((page - 1) * itemsPerPage + 1, filteredCompanies.length)}
    </span>{" "}
    to{" "}
    <span className="font-medium">
      {Math.min(page * itemsPerPage, filteredCompanies.length)}
    </span>{" "}
    of{" "}
    <span className="font-medium">{filteredCompanies.length}</span>
  </div>

  <div className="flex items-center gap-2">

    <Button
      variant="outline"
      size="icon"
      disabled={page === 1}
      onClick={() => {
        setPage(page - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      ‹
    </Button>

    <span className="text-sm font-medium">
      Page {page} of {totalPages}
    </span>

    <Button
      variant="outline"
      size="icon"
      disabled={page === totalPages}
      onClick={() => {
        setPage(page + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      ›
    </Button>

  </div>

</div>
            
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
