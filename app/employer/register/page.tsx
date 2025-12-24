"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Search,
  CheckCircle,
  Star,
  TrendingUp,
  Briefcase,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmployerRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [industrySearch, setIndustrySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [isOtpOpen,setIsOtpOpen] =useState(false);
  const [otp,setOtp] = useState("");
  const [IsOtpVerified,setIsOtpVerified] =useState(false);
  const [IsRegDisabled,setIsRegDisabled] = useState(false);
  const router = useRouter();
  const [email,setemail] = useState("");
  const [showText,setShowText] =useState(false)
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    companyType: "",
    industry: "",
    companySize: "",
    website: "",
    description: "",

    // Contact Information
    contactPersonName: "",
    designation: "",
    email: email,
    phone: "",
    phoneCode: "",

    // Address Information
    address: "",
    countryId: "",
    stateId: "",
    cityId: "",
    pincode: "",

    // Account Information
    password: "",
    confirmPassword: "",

    // Agreements
    agreeTerms: false,
    agreeMarketing: false,
  });
  const companyTypes = [
    "Private Limited Company",
    "Public Limited Company",
    "Partnership",
    "Sole Proprietorship",
    "LLP",
    "Government",
    "NGO",
    "Startup",
  ];

  const industries = [
    "Information Technology",
    "Banking & Financial Services",
    "Healthcare",
    "Manufacturing",
    "Retail",
    "Education",
    "Real Estate",
    "Automotive",
    "Telecommunications",
    "Media & Entertainment",
    "Consulting",
    "Other",
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ];

  const benefits = [
    {
      icon: Users,
      title: "Access to 10 Crore+ candidates",
      description: "Reach the largest talent pool in India",
    },
    {
      icon: TrendingUp,
      title: "AI-powered matching",
      description: "Get relevant candidate matches instantly",
    },
    {
      icon: Briefcase,
      title: "End-to-end recruitment",
      description: "From job posting to candidate onboarding",
    },
    {
      icon: Star,
      title: "Trusted platform",
      description: "Join 1 Lakh+ companies hiring successfully",
    },
  ];

  const filteredIndustries = industries.filter((item) =>
    item.toLowerCase().includes(industrySearch.toLowerCase())
  );

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Fetch the Data from the MASTER DB
  useEffect(() => {
    fetch("https://jobseeker-backend-jy1y.onrender.com/master/api/countries/")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (formData.countryId) {
      fetch(
        `https://jobseeker-backend-jy1y.onrender.com/master/api/states/?country_id=${formData.countryId}`
      )
        .then((res) => res.json())
        .then(setStates)
        .catch(console.error);
    }
  }, [formData.countryId]);

  useEffect(() => {
    if (formData.stateId) {
      fetch(
        `https://jobseeker-backend-jy1y.onrender.com/master/api/cities/?state=${formData.stateId}`
      )
        .then((res) => res.json())
        .then(setCities)
        .catch(console.error);
    }
  }, [formData.stateId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // console.log("Form Data:", formData);
  };

  const handleEmailChange = (value:string) => {
    setemail(value);
    // console.log("Form Data:", formData);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
    if(currentStep == 1 && !IsOtpVerified){
      setIsRegDisabled(true)  
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    if(currentStep!=1){
      setIsRegDisabled(false)
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    const payload = {
      company_name: formData.companyName,
      company_type: formData.companyType,
      industry: formData.industry,
      company_size: formData.companySize,
      website: formData.website,
      description: formData.description,
      contact_person_name: formData.contactPersonName,
      designation: formData.designation,
      phone: `${formData.phoneCode}${formData.phone}`,
      address: formData.address,
      country: formData.countryId,
      state: formData.stateId,
      city: formData.cityId,
      pincode: formData.pincode,
      agree_terms: formData.agreeTerms,
      agree_marketing: formData.agreeMarketing,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      email: formData.email,
    };
    console.log("Payload:", payload);
    try {
      const response = await fetch(
        "https://jobseeker-backend-jy1y.onrender.com/employeer/api/employeer_register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const result = await response.json();
      console.log("Registration successful:", result);
      router.push("/employer/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                currentStep > step ? "bg-purple-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const handlesendotp = async () => {
    try {
      const res = await fetch(
        "https://jobseeker-backend-jy1y.onrender.com/api/send_otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to send OTP");
        return;
      }

      setIsOtpOpen(true);
      alert("OTP Sent Successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await fetch(
      //   // "https://jobseeker-backend-jy1y.onrender.com/api/verify-otp/",
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ email, otp }),
      //   }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Invalid OTP");
        return;
      }

      setIsOtpVerified(true);
      setIsOtpOpen(false);
      alert("OTP Verified Successfully!");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                jobseeker
              </span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                For Employers
              </span>
            </Link>
            <div className="text-sm text-gray-600 text-center sm:text-right">
              Already have an account?{" "}
              <Link
                href="/employer/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Benefits */}
          <div className="order-2 lg:order-1">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Start hiring the best talent today
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Join 1 Lakh+ companies finding their perfect candidates on
                JobSeeker
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">10Cr+</div>
                <div className="text-sm text-gray-600">Candidates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1L+</div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">50L+</div>
                <div className="text-sm text-gray-600">Jobs Posted</div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="order-1 lg:order-2">
            <Card className="bg-white shadow-2xl border-0">
              <CardContent className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Register Your Company
                  </h2>
                  <p className="text-gray-600">
                    Create your employer account to start hiring
                  </p>
                </div>

                {renderStepIndicator()}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Company Information */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Company Information
                      </h3>

                      <div>
                        <Label
                          htmlFor="companyName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Company Name *
                        </Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) =>
                            handleInputChange("companyName", e.target.value)
                          }
                          placeholder="Enter your company name"
                          className="mt-1 h-12"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Company Type *
                          </Label>
                          <Select
                            value={formData.companyType}
                            onValueChange={(value) =>
                              handleInputChange("companyType", value)
                            }
                          >
                            <SelectTrigger className="mt-1 h-12">
                              <SelectValue placeholder="Select company type" />
                            </SelectTrigger>
                            <SelectContent>
                              {companyTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Industry *
                          </Label>
                          <Select
                            value={formData.industry}
                            onValueChange={(value) =>
                              handleInputChange("industry", value)
                            }
                          >
                            <SelectTrigger className="mt-1 h-12">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Company Size *
                          </Label>
                          <Select
                            value={formData.companySize}
                            onValueChange={(value) =>
                              handleInputChange("companySize", value)
                            }
                          >
                            <SelectTrigger className="mt-1 h-12">
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                              {companySizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor="website"
                            className="text-sm font-medium text-gray-700"
                          >
                            Website
                          </Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) =>
                              handleInputChange("website", e.target.value)
                            }
                            placeholder="https://www.company.com"
                            className="mt-1 h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium text-gray-700"
                        >
                          Company Description
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          rows={4}
                          placeholder="Tell us about your company..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Contact & Address Information */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="contactPersonName"
                            className="text-sm font-medium text-gray-700"
                          >
                            Contact Person Name *
                          </Label>
                          <Input
                            id="contactPersonName"
                            value={formData.contactPersonName}
                            onChange={(e) =>
                              handleInputChange(
                                "contactPersonName",
                                e.target.value
                              )
                            }
                            placeholder="Enter contact person name"
                            className="mt-1 h-12"
                            required
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="designation"
                            className="text-sm font-medium text-gray-700"
                          >
                            Designation *
                          </Label>
                          <Input
                            id="designation"
                            value={formData.designation}
                            onChange={(e) =>
                              handleInputChange("designation", e.target.value)
                            }
                            placeholder="e.g., HR Manager"
                            className="mt-1 h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Country Dropdown */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Country *
                          </Label>

                          <Popover
                            open={countryOpen}
                            onOpenChange={setCountryOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between mt-1 h-12"
                              >
                                {formData.countryId
                                  ? countries.find(
                                      (c) => c.id == formData.countryId
                                    )?.name
                                  : "Select country"}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent
                              align="start"
                              className="w-full p-0"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search country..."
                                  value={countrySearch}
                                  onValueChange={setCountrySearch}
                                />

                                <CommandList className="max-h-60 overflow-y-auto">
                                  <CommandEmpty>No country found.</CommandEmpty>

                                  <CommandGroup>
                                    {countries
                                      .filter(
                                        (c) =>
                                          c.name
                                            .toLowerCase()
                                            .startsWith(
                                              countrySearch.toLowerCase()
                                            ) 
                                      )
                                      .map((country) => (
                                        <CommandItem
                                          key={country.id}
                                          value={country.name}
                                          onSelect={() => {
                                            handleInputChange(
                                              "countryId",
                                              country.id
                                            );
                                            handleInputChange(
                                              "phoneCode",
                                              country.phonecode
                                            ); 
                                            setCountryOpen(false);
                                          }}
                                        >
                                          {country.name}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* State Dropdown */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            State *
                          </Label>

                          <Popover open={stateOpen} onOpenChange={setStateOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between mt-1 h-12"
                              >
                                {formData.stateId
                                  ? states.find((s) => s.id == formData.stateId)
                                      ?.name
                                  : "Select state"}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent
                              align="start"
                              className="w-full p-0"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search state..."
                                  value={stateSearch}
                                  onValueChange={setStateSearch}
                                />

                                <CommandList className="max-h-60 overflow-y-auto">
                                  <CommandEmpty>No state found.</CommandEmpty>

                                  <CommandGroup>
                                    {states
                                      .filter((state) =>
                                        state.name
                                          .toLowerCase()
                                          .startsWith(stateSearch.toLowerCase())
                                      )
                                      .map((state) => (
                                        <CommandItem
                                          key={state.id}
                                          value={state.name}
                                          onSelect={() => {
                                            handleInputChange(
                                              "stateId",
                                              state.id.toString()
                                            );
                                            setStateOpen(false);
                                          }}
                                        >
                                          {state.name}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* City Dropdown */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            City *
                          </Label>

                          <Popover open={cityOpen} onOpenChange={setCityOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between mt-1 h-12"
                              >
                                {formData.cityId
                                  ? cities.find((c) => c.id == formData.cityId)
                                      ?.name
                                  : "Select city"}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent
                              align="start"
                              className="w-full p-0"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search city..."
                                  value={citySearch}
                                  onValueChange={setCitySearch}
                                />

                                <CommandList className="max-h-60 overflow-y-auto">
                                  <CommandEmpty>No city found.</CommandEmpty>

                                  <CommandGroup>
                                    {cities
                                      .filter((city) =>
                                        city.name
                                          .toLowerCase()
                                          .startsWith(citySearch.toLowerCase())
                                      )
                                      .map((city) => (
                                        <CommandItem
                                          key={city.id}
                                          value={city.name}
                                          onSelect={() => {
                                            handleInputChange(
                                              "cityId",
                                              city.id.toString()
                                            );
                                            setCityOpen(false);
                                          }}
                                        >
                                          {city.name}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                              handleEmailChange(e.target.value)
                            }
                            placeholder="Enter email address"
                            className="mt-1 h-12"
                            required
                          />

                          <Button
                            type="button"
                            className="mt-2"
                            disabled={!email.includes("@")}
                            onClick={handlesendotp}
                          >
                            Verify Email OTP
                          </Button>
                        </div>
                        <div>
                          <div>
                            <Label
                              htmlFor="phone"
                              className="text-sm font-medium text-gray-700"
                            >
                              Phone Number *
                            </Label>

                            <div className="flex gap-2 mt-1">
                             
                              <input
                                className="w-20 h-10 lg:h-11 border rounded px-3 bg-gray-100 text-gray-700"
                                value={
                                  formData.phoneCode
                                    ? `+${formData.phoneCode}`
                                    : ""
                                }
                                readOnly
                               
                              />

                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) =>
                                  handleInputChange("phone", e.target.value)
                                }
                                className="flex-1 h-10 lg:h-11"
                                placeholder="Enter phone number"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="address"
                          className="text-sm font-medium text-gray-700"
                        >
                          Company Address *
                        </Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          rows={3}
                          placeholder="Enter complete address"
                          className="mt-1"
                          required
                        />
                        <div>
                          <Label
                            htmlFor="pincode"
                            className="text-sm font-medium text-gray-700"
                          >
                            Pincode *
                          </Label>
                          <Input
                            id="pincode"
                            value={formData.pincode}
                            onChange={(e) =>
                              handleInputChange("pincode", e.target.value)
                            }
                            placeholder="Enter pincode"
                            className="mt-1 h-12"
                            required
                          />
                        </div>
                      </div>
                      {/*
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="city"
                            className="text-sm font-medium text-gray-700"
                          >
                            City *
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                            placeholder="Enter city"
                            className="mt-1 h-12"
                            required
                          />
                        </div>
                      </div> */}
                    </div>
                  )}

                  {/* Step 3: Account Setup */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Account Setup
                      </h3>

                      <div>
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-gray-700"
                        >
                          Password *
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            placeholder="Create a strong password"
                            className="pr-10 h-12"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-gray-700"
                        >
                          Confirm Password *
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            placeholder="Confirm your password"
                            className="pr-10 h-12"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="agreeTerms"
                            checked={formData.agreeTerms}
                            onCheckedChange={(checked) =>
                              handleInputChange("agreeTerms", checked)
                            }
                            className="mt-1"
                          />
                          <label
                            htmlFor="agreeTerms"
                            className="text-sm text-gray-600 leading-relaxed"
                          >
                            I agree to the{" "}
                            <Link
                              href="#"
                              className="text-blue-600 hover:underline"
                            >
                              Terms and Conditions
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="#"
                              className="text-blue-600 hover:underline"
                            >
                              Privacy Policy
                            </Link>
                          </label>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="agreeMarketing"
                            checked={formData.agreeMarketing}
                            onCheckedChange={(checked) =>
                              handleInputChange("agreeMarketing", checked)
                            }
                            className="mt-1"
                          />
                          <label
                            htmlFor="agreeMarketing"
                            className="text-sm text-gray-600 leading-relaxed"
                          >
                            Send me updates about new features, hiring tips, and
                            promotional offers
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        className="h-12 px-6"
                      >
                        Previous
                      </Button>
                    )}

                    {currentStep < 3 ? (
                      
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled= {IsRegDisabled}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-6 ml-auto"
                      >
                        Next
                      
                      </Button>
                    
                    ) : (
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-6 ml-auto"
                      >
                        Create Account
                      </Button>
                    )}
                  </div>
                </form>
                  
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure registration process</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent>
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4">Enter OTP</h1>

            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              className="w-full mt-4 bg-indigo-600 text-white"
              onClick={handleVerifyOTP}
            >
              Verify
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
