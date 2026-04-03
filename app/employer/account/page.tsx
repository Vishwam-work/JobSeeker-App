"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import AsyncSelect from "react-select/async";

export default function EmployerAccountEdit() {
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    company_type: "",
    industry: "",
    company_size: "",
    website: "",
    description: "",
    contact_person_name: "",
    designation: "",
    phone: "",
    address: "",
    country: "",
    countryLabel: "",
    state: "",
    city: "",
    company_logo: "",
  });
const [selectedCountry, setSelectedCountry] = useState<any>(null);
const [countries, setCountries] = useState<Country[]>([]);
const [states, setStates] = useState<StateItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
const [selectedState, setSelectedState] = useState<any>(null);
const [selectedCity, setSelectedCity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
type FormData = {
  company_name: string;
  company_type: string;
  industry: string;
  company_size: string;
  website: string;
  description: string;
  contact_person_name: string;
  designation: string;
  phone: string;
  address: string;
  country: string;
  countryLabel: string; // ✅ ADD THIS
  state: string;
  city: string;
  company_logo: string;
};
type Country = {
  id: string | number;
  name: string;
};
type StateItem = {
  id: string | number;
  name: string;
};
 
type CityItem = {
  id: string | number;
  name: string;
  stateId: number;
};
  // ✅ Fetch Company


  useEffect(() => {
      const fetchCompanyDetails = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const decoded: any = jwtDecode(token);
      const userId = decoded?.user_id;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/company/${userId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      setFormData({
        company_name: data.company_name || "",
        company_type: data.company_type || "",
        industry: data.industry || "",
        company_size: data.company_size || "",
        website: data.website || "",
        description: data.description || "",
        contact_person_name: data.contact_person_name || "",
        designation: data.designation || "",
        phone: data.phone || "",
        address: data.address || "",
        country: data.country || "",
        countryLabel: data.country_name || "", // ✅ SET COUNTRY LABEL
        state: data.state || "",
        city: data.city || "",
        company_logo: data.company_logo || "",
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
    fetchCompanyDetails();
  }, []);

  console.log("Profile Data ---->After Fetch", formData);
    useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/countries/`)
        .then((res) => res.json())
        .then((data) => {
          // console.log("Country data:", data);
          setCountries(data);
        })
        .catch((err) => console.error(err));
    }, []);
useEffect(() => {
    if (formData.country) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/states/?country_id=${formData.country}`
      )
        .then((res) => res.json())
        .then((data) => {
          setStates(data);
        })
        .catch((err) => console.error(err));
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/cities/?state=${formData.state}`
      )
        .then((res) => res.json())
        .then(setCities)
        .catch((err) => console.error(err));
    }
  }, [formData.state]);
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFormData({
        ...formData,
        company_logo: URL.createObjectURL(file),
      });
    }
  };

  // ✅ Update API
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("auth_token");
      const decoded: any = jwtDecode(token!);
      const userId = decoded?.user_id;

      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "company_logo") {
          form.append(key, value as string);
        }
      });

      if (selectedFile) {
        form.append("company_logo", selectedFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/company/${userId}/update/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await response.json();
      console.log(data);
      alert("Updated Successfully");
    } catch (err) {
      console.error(err);
    }
  };
  const getselectcountry = () => {
  const country = countries.find(
    (c) => c.id.toString() === formData.country.toString()
  );

  return country
    ? {
        label: country.name,
        value: country.id.toString(),
          // phonecode: country.phonecode,
      }
    : null;
};
const loadCountryOptionss = async (inputValue: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_MASTER}/countries/`
    );

    const data = await res.json();

    return data
      .filter((c: any) =>
        c.name?.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((c: any) => ({
        label: c.name,
        value: c.id.toString(),
        phonecode: c.phonecode,
      }));
  } catch (error) {
    console.error(error);
    return [];
  }
};
const loadStateOptions = async (inputValue: string) => {
  const search = inputValue.toLowerCase();

  return states
    .filter((s) => {
      if (!s.name) return false;

      return s.name.toLowerCase().includes(search);
    })
    .map((s) => ({
      label: s.name,
      value: s.id.toString(),
    }));
};
const getSelectedState = () => {
  const state = states.find(
    (s) => s.id.toString() === formData.state.toString()
  );

  return state
    ? {
        label: state.name,
        value: state.id.toString(),
      }
    : null;
};
const loadCityOptions = async (inputValue: string) => {
  const search = inputValue?.toLowerCase()?.trim() || "";

  return cities
    .filter((c) => {
      if (!c.name) return false;
      if (!search) return true;

      return c.name.toLowerCase().includes(search);
    })
    .map((c) => ({
      label: c.name,
      value: c.id.toString(),
    }));
};
const getSelectedCity = () => {
  const city = cities.find(
    (c) => c.id.toString() === formData.city.toString()
  );

  return city
    ? {
        label: city.name,
        value: city.id.toString(),
      }
    : null;
};
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <EmployerHeader />

      <div className="p-6 max-w-5xl mx-auto">
        <Card className="shadow-2xl">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Edit Employer Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo */}
              <div className="flex justify-center">
                <Image
                  src={formData.company_logo || "/placeholder.png"}
                  alt="logo"
                  width={120}
                  height={120}
                  onClick={handleImageClick}
                  className="rounded-full cursor-pointer border"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Inputs */}
              <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl ">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    Company Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Company Name */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Company Name
                      </label>
                      <input
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        className="input-style  border p-2 rounded"
                      />
                    </div>

                    {/* Company Type */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Company Type
                      </label>
                      <input
                        name="company_type"
                        value={formData.company_type}
                        onChange={handleChange}
                        placeholder="Private / Public"
                        className="input-style  border p-2 rounded"
                      />
                    </div>

                    {/* Industry */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Industry
                      </label>
                      <input
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        placeholder="e.g IT, Finance"
                        className="input-style  border p-2 rounded"
                      />
                    </div>

                    {/* Company Size */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Company Size
                      </label>
                      <input
                        name="company_size"
                        value={formData.company_size}
                        onChange={handleChange}
                        placeholder="e.g 10-50 employees"
                        className="input-style  border p-2 rounded"
                      />
                    </div>

                    {/* Website */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Website
                      </label>
                      <input
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="input-style  border p-2 rounded"
                      />
                    </div>

                    {/* Contact Person */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Contact Person
                      </label>
                      <input
                        name="contact_person_name"
                        value={formData.contact_person_name}
                        onChange={handleChange}
                        placeholder="Full name"
                        className="input-style  border p-2 rounded"
                      />
                    </div>

                    {/* Designation */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Designation
                      </label>
                      <input
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="HR / Manager"
                        className="input-style  border p-2 rounded"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 9876543210"
                        className="input-style  border p-2 rounded"
                      />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Country
                  </label>

                <AsyncSelect
                  cacheOptions
                  defaultOptions={countries.map((c) => ({
                                          label: c.name ?? "",
                                          value: c.id.toString(),
                                        }))}
                  loadOptions={loadCountryOptionss}
                  value={getselectcountry()}
                  onChange={(selected: any) => {
                    setSelectedCountry(selected);
                    setFormData((prev) => ({
                      ...prev,
                      country: selected?.value || "",
                      countryLabel: selected?.label || "",
                      state: "",
                      city: "",
                    }));
                  }}
                  placeholder="Search Country..."
                />
                </div>

                    <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    State
                  </label>

                  <AsyncSelect
                    cacheOptions
                    defaultOptions={states.map((s) => ({
                                            label: s.name ?? "",
                                            value: s.id.toString(),
                                          }))}
                    loadOptions={loadStateOptions}
                    value={getSelectedState()}
                    onChange={(selected: any) => {
                      setSelectedState(selected);

                      setFormData((prev) => ({
                        ...prev,
                        state: selected?.value || "",
                        city: "",
                      }));

                    }}
                    placeholder="Search State..."
                    isDisabled={!formData.country}
                  />
                </div>

                    {/* City */}
                    <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    City
                  </label>

                  <AsyncSelect
                    cacheOptions
                    defaultOptions={cities.map((c) => ({
                                            label: c.name ?? "",
                                            value: c.id.toString(),
                                          }))}
                    loadOptions={loadCityOptions}
                    value={getSelectedCity()}
                    onChange={(selected: any) => {
                      setSelectedCity(selected);

                      setFormData((prev) => ({
                        ...prev,
                        city: selected?.value || "",
                      }));
                    }}
                    placeholder="Search City..."
                    isDisabled={!formData.state} // ✅ disable until state selected
                  />
                </div>
                  </div>
                </div>

              <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" />
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

              <div className="text-center">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <EmployerFooter />
    </div>
  );
}
