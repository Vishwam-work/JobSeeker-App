"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import Image from "next/image";
import allCompanies from "@/data/companies.json";
import Link from "next/link";

import Footer from "@/components/Footer";

export default function CompaniesPage() {
  const [filters, setFilters] = useState({
    types: [],
    locations: [],
    industries: [],
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [visibleCount, setVisibleCount] = useState(6);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const router = useRouter();

  const toggleFilter = (filterType, value) => {
    setFilters((prev) => {
      const current = prev[filterType];
      return {
        ...prev,
        [filterType]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const filteredCompanies = allCompanies
    .filter((company) => {
      const matchType =
        filters.types.length === 0 || filters.types.includes(company.type);
      const matchLocation =
        filters.locations.length === 0 ||
        company.locations.some((loc) => filters.locations.includes(loc));
      const matchIndustry =
        filters.industries.length === 0 ||
        filters.industries.includes(company.industry);
      const matchSearch =
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.category.toLowerCase().includes(search.toLowerCase()) ||
        company.industry.toLowerCase().includes(search.toLowerCase());
      return matchType && matchLocation && matchIndustry && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const allLocations = [
    "Bengaluru",
    "Delhi / NCR",
    "Mumbai",
    "Hyderabad",
    "Pune",
    "Chennai",
    "Ahmedabad",
    "Kolkata",
  ];

  const allIndustries = [
    "IT Services & Consulting",
    "Software Product",
    "Education / Training",
    "Industrial Equipment / Machinery",
    "Food Processing",
    "Pharmaceuticals",
    "Fitness & Wellness",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SearchSection />
      {/* Topbar for mobile: search + filters toggle */}
      <div className="bg-white border-b p-3 md:hidden flex items-center justify-between">
        <Input
          placeholder="Search companies, industries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 mr-3"
        />
        <Button onClick={() => setMobileFiltersOpen(true)}>Filters</Button>
      </div>

      <div className="flex">
        {/* Sidebar - hidden on small screens */}
        <aside className="hidden md:block w-72 bg-white border-r p-4 h-screen sticky top-0 overflow-y-auto">
          <h2 className="font-semibold mb-4">All Filters</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Company type</h3>
            <div className="space-y-2">
              {["Corporate", "Foreign MNC", "Startup", "Indian MNC"].map(
                (type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.types.includes(type)}
                      onCheckedChange={() => toggleFilter("types", type)}
                    />
                    <label htmlFor={type}>{type}</label>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Industry</h3>
            <Input placeholder="Search Industry" className="mb-3" />
            <ScrollArea className="h-40">
              <div className="space-y-2">
                {allIndustries.map((ind) => (
                  <div key={ind} className="flex items-center space-x-2">
                    <Checkbox
                      id={ind}
                      checked={filters.industries.includes(ind)}
                      onCheckedChange={() => toggleFilter("industries", ind)}
                    />
                    <label htmlFor={ind}>{ind}</label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Location</h3>
            <Input placeholder="Search Location" className="mb-3" />
            <ScrollArea className="h-40">
              <div className="space-y-2">
                {allLocations.map((loc) => (
                  <div key={loc} className="flex items-center space-x-2">
                    <Checkbox
                      id={loc}
                      checked={filters.locations.includes(loc)}
                      onCheckedChange={() => toggleFilter("locations", loc)}
                    />
                    <label htmlFor={loc}>{loc}</label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black opacity-40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Close
                </Button>
              </div>

              {/* Reuse same filter sections */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Company type</h3>
                <div className="space-y-2">
                  {["Corporate", "Foreign MNC", "Startup", "Indian MNC"].map(
                    (type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`m-${type}`}
                          checked={filters.types.includes(type)}
                          onCheckedChange={() => toggleFilter("types", type)}
                        />
                        <label htmlFor={`m-${type}`}>{type}</label>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Industry</h3>
                <Input placeholder="Search Industry" className="mb-3" />
                <div className="space-y-2">
                  {allIndustries.map((ind) => (
                    <div key={ind} className="flex items-center space-x-2">
                      <Checkbox
                        id={`m-${ind}`}
                        checked={filters.industries.includes(ind)}
                        onCheckedChange={() => toggleFilter("industries", ind)}
                      />
                      <label htmlFor={`m-${ind}`}>{ind}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Location</h3>
                <Input placeholder="Search Location" className="mb-3" />
                <div className="space-y-2">
                  {allLocations.map((loc) => (
                    <div key={loc} className="flex items-center space-x-2">
                      <Checkbox
                        id={`m-${loc}`}
                        checked={filters.locations.includes(loc)}
                        onCheckedChange={() => toggleFilter("locations", loc)}
                      />
                      <label htmlFor={`m-${loc}`}>{loc}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button onClick={() => setMobileFiltersOpen(false)}>
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setFilters({ types: [], locations: [], industries: [] })
                  }
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6">
          {/* Top bar (desktop) */}
          <div className="hidden md:flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4 w-full">
              <Input
                placeholder="Search companies, industries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <select
                className="border rounded p-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Reviews</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          <h1 className="text-lg font-semibold mb-4">
            Showing {filteredCompanies.length} companies
          </h1>

          {/* Responsive grid: 1 column on small, 2 on md, 3 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.slice(0, visibleCount).map((company, i) => (
              <Link
                key={i}
                href={`/companies/detail?id=${company.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="p-4 cursor-pointer hover:shadow-md transition">
                  <CardContent className="flex items-center gap-4 p-0">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={76}
                      height={76}
                      className="w-14 h-14 rounded object-contain bg-white p-1"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h2 className="font-semibold text-base">
                          {company.name}
                        </h2>
                        <div className="text-sm text-gray-600">›</div>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        ⭐ {company.rating} ({company.reviews} reviews)
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {company.type}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {company.industry}
                        </span>
                        {company.employees && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {company.employees}
                          </span>
                        )}
                        {company.founded && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Founded: {company.founded}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        {company.locations.join(", ")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More */}
          {visibleCount < filteredCompanies.length && (
            <div className="flex justify-center mt-6">
              <Button onClick={() => setVisibleCount((prev) => prev + 9)}>
                Load More
              </Button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
