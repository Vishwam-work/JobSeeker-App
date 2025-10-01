"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ServicesPage() {
  const services = [
    {
      title: "ROAD FREIGHT",
      description:
        "We provide reliable road freight solutions ensuring timely and safe delivery across major cities.",
      image: "/service_image/image.jpg",
    },
    {
      title: "AIR FREIGHT",
      description:
        "Fast and efficient air freight services connecting you to global destinations with ease.",
      image: "/service_image/image.jpg",
    },
    {
      title: "SEA FREIGHT",
      description:
        "Affordable sea freight solutions for bulk shipments with complete safety assurance.",
      image: "/service_image/image.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 text-gray-900 min-h-[70vh] flex items-center overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="w-full md:w-2/3 text-left">
            <h1 className="text-5xl font-extrabold uppercase tracking-wide drop-shadow-sm">
              SERVICES
            </h1>
            <p className="mt-4 text-gray-700 text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {services.map((service, idx) => (
          <div key={idx} className="space-y-8">
            <div
              className={`flex flex-col md:flex-row items-center gap-8 ${
                idx % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
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

      {/* More Services Section (Accordion) */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start">
            <h2 className="text-3xl font-extrabold uppercase tracking-wide">
              MORE <br /> SERVICES
            </h2>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column Accordion */}
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>Worldwide Transport</AccordionTrigger>
                <AccordionContent>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus
                  leo.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Cargo</AccordionTrigger>
                <AccordionContent>
                  Details about Cargo services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Packaging & Storage</AccordionTrigger>
                <AccordionContent>
                  Details about Packaging & Storage services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Warehousing</AccordionTrigger>
                <AccordionContent>
                  Details about Warehousing services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Door to Door Delivery</AccordionTrigger>
                <AccordionContent>
                  Details about Door to Door Delivery services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Ground Transport</AccordionTrigger>
                <AccordionContent>
                  Details about Ground Transport services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>International Mail Shipping</AccordionTrigger>
                <AccordionContent>
                  Details about International Mail Shipping services.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Right Column Accordion */}
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-8">
                <AccordionTrigger>International</AccordionTrigger>
                <AccordionContent>
                  Details about International services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger>Domestic</AccordionTrigger>
                <AccordionContent>
                  Details about Domestic services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger>Optional Services</AccordionTrigger>
                <AccordionContent>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus
                  leo.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11">
                <AccordionTrigger>Customs Services</AccordionTrigger>
                <AccordionContent>
                  Details about Customs services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12">
                <AccordionTrigger>Advanced Shipping Solutions</AccordionTrigger>
                <AccordionContent>
                  Details about Advanced Shipping Solutions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
