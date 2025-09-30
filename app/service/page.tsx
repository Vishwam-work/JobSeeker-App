"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  const services = [
    {
      title: "ROAD FREIGHT",
      description:
        "We provide reliable road freight solutions ensuring timely and safe delivery across major cities.",
      image: "/images/road.jpg",
    },
    {
      title: "AIR FREIGHT",
      description:
        "Fast and efficient air freight services connecting you to global destinations with ease.",
      image: "/images/air.jpg",
    },
    {
      title: "SEA FREIGHT",
      description:
        "Affordable sea freight solutions for bulk shipments with complete safety assurance.",
      image: "/images/sea.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 🔹 Hero Section with same gradient as Footer */}
      <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 text-gray-900 py-20 overflow-hidden">
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold uppercase tracking-wide drop-shadow-sm">
            SERVICES
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
        </div>
      </section>

      {/* 🔹 Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {services.map((service, idx) => (
          <div key={idx} className="space-y-8">
            {/* Image + Side Details */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg object-cover w-full h-72"
                />
              </div>

              <div className="w-full md:w-1/2 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
