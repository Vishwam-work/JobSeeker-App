"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
import Image from "next/image";

export default function EmployerAccountEdit() {
  const [formData, setFormData] = useState({
    company_name: "ABC Technologies Pvt Ltd",
    company_type: "Private Limited Company",
    industry: "Information Technology",
    company_size: "51-200 employees",
    website: "https://abctech.com",
    description:
      "We are a fast-growing IT company providing software development and AI solutions across India.",
    contact_person_name: "Rahul Sharma",
    designation: "HR Manager",
    email: "hr@abctech.com",
    phone: "+91 9876543210",
    address: "SG Highway",
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad",
    pincode: "380015",
    company_logo: "/companies_logos/zenoti.png",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormData({ ...formData, company_logo: imageUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <EmployerHeader />

      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl border-0">
            <CardContent className="p-8 space-y-8">
              <h2 className="text-2xl font-semibold text-center">
                Edit Employer Account
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Company Logo Upload */}
                <div className="flex flex-col items-center">
                  <Image
                    src={formData.company_logo}
                    alt="Company Logo"
                    width={120}
                    height={120}
                    onClick={handleImageClick}
                    className="rounded-full border-4 border-blue-500 shadow-lg cursor-pointer hover:opacity-80 transition"
                  />

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Company Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    label="Company Name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Company Type"
                    name="company_type"
                    value={formData.company_type}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Company Size"
                    name="company_size"
                    value={formData.company_size}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Contact Person"
                    name="contact_person_name"
                    value={formData.contact_person_name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                  <InputField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  <InputField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button type="submit" className="px-10 py-3 text-lg">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <EmployerFooter />
    </div>
  );
}

/* 🔹 Reusable Input Field */
function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-2"
      />
    </div>
  );
}
