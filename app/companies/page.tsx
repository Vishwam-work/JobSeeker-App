"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
// import Image from "next/image";
import Footer from "@/components/Footer";

export default function CompaniesPage() {
  const [allCompanies, setAllCompanies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        const res = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/employeer/api/companies/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const data = await res.json();
        console.log("API Response:", data);

        const mapped = (data.data || data).map((item) => ({
          id: item.id,
          name: item.company_name,
          type: item.company_type || "N/A",
          industry: item.industry || "Not specified",
          employees: item.company_size || "N/A",
          locations: [item.city, item.state].filter(Boolean),
          rating: Math.floor(Math.random() * 2) + 3,
          reviews: Math.floor(Math.random() * 200) + 10,
          // logo: "/placeholder-company.png",
          founded: item.founded_year || null,
        }));

        setAllCompanies(mapped);
      } catch (error) {
        console.error("Error fetching companies:", error);
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

  if (loading) return <p className="p-6">Loading companies...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SearchSection />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="flex items-center justify-between mb-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.slice(0, visibleCount).map((company, i) => (
                <a
                  key={i}
                  href={`/companies/detail?id=${company.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="p-4 cursor-pointer hover:shadow-md transition">
                    <CardContent className="flex items-center gap-4 p-0">
                      {/* <Image
                        src={company.logo}
                        alt={company.name || "Company logo"}
                        width={76}
                        height={76}
                        className="w-14 h-14 rounded object-contain bg-white p-1"
                      /> */}

                      <div className="flex-1">
                        <h2 className="font-semibold text-base">
                          {company.name}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          ⭐ {company.rating} ({company.reviews} reviews)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {company.industry}
                        </p>
                        <p className="text-xs text-gray-500">
                          {company.locations.join(", ")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>

            {visibleCount < filteredCompanies.length && (
              <div className="flex justify-center mt-6">
                <Button onClick={() => setVisibleCount((prev) => prev + 9)}>
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
