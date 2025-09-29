"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Header from "@/components/Header";

export default function CompanyDetailPage() {
  // Example company (static for now)
  const company = {
    name: "Torrent Pharmaceuticals",
    rating: 3.9,
    reviews: 2800,
    category: "Pharmaceutical & Life Sciences",
    founded: 1959,
    employees: "5000+ emp.",
    logo: "https://via.placeholder.com/100",
    type: "Indian MNC",
    industry: "Pharmaceuticals",
    locations: ["Ahmedabad", "Mumbai"],
  };

  return (
    <div>
        <Header />
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center">
 
      <Card className="w-full max-w-3xl p-4 sm:p-6">
        <CardContent className="p-0 flex flex-col md:flex-row gap-6">
          {/* Company Logo */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <img
              src={company.logo}
              alt={company.name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded"
            />
          </div>

          {/* Company Info */}
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">{company.name}</h1>
            <p className="text-sm text-gray-600 mt-1">
              ⭐ {company.rating} ({company.reviews.toLocaleString()} reviews)
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                {company.type}
              </span>
              <span className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                {company.industry}
              </span>
              <span className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                Founded: {company.founded}
              </span>
              {company.employees && (
                <span className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                  {company.employees}
                </span>
              )}
            </div>

            {/* Locations */}
            <p className="text-xs sm:text-sm text-gray-500 mt-3">
              Locations: {company.locations.join(", ")}
            </p>

            {/* CTA Button */}
            <Button className="mt-6 w-full sm:w-auto">Apply Now</Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
