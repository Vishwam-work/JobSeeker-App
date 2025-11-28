"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Chrome,
  CheckCircle,
  Mail,
  Lock,
  Phone,
  User,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";

export default function Register() {
  const [workStatus, setWorkStatus] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [receivePromotions, setReceivePromotions] = useState(false);
  const router = useRouter();
  const [countries, setCountries] = useState<any[]>([]);
  const [phoneCode, setPhoneCode] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [profileData, setProfileData] = useState({
    personalInfo: {
      countryId: "",
      stateId: "",
      cityId: "",
      phone: "",
    },
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      full_name: fullName,
      email: email,
      password: password,
      mobile_number: profileData.personalInfo.phone,
      work_status: workStatus,
      receive_promotions: receivePromotions,
      country_id: profileData.personalInfo.countryId,
    };
    console.log("DATA", data);

    try {
      const response = await fetch(
        "https://jobseeker-backend-jy1y.onrender.com/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const result = await response.json();
      console.log("Registration successful:", result);
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/master/api/countries/"
        );
        const data = await res.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                jobseeker
              </span>
            </Link>
            <div className="text-sm text-gray-600 text-center sm:text-right">
              Already Registered?{" "}
              <Link
                href="/login"
                className="text-purple-600 hover:underline font-medium"
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Side - Benefits */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 order-2 lg:order-1">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 md:w-12 md:h-12 text-purple-600" />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">
                    Build your profile and let recruiters find you
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">
                    Get job postings delivered right to your email
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">
                    Find a job and grow your career
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 order-1 lg:order-2">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Create your JobSeeker profile
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Search & apply to jobs from India's No.1 Job Site
              </p>
            </div>

            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div>
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700"
                >
                  Full name*
                </Label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    placeholder="What is your name?"
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email ID*
                </Label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Tell us your Email ID"
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send relevant jobs and updates to this email
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Country *
                </Label>

                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between mt-1 h-12"
                    >
                      {profileData.personalInfo.countryId
                        ? countries.find(
                            (c) => c.id == profileData.personalInfo.countryId
                          )?.name
                        : "Select country"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent align="start" className="w-full p-0">
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
                            .filter((country) =>
                              country.name
                                .toLowerCase()
                                .startsWith(countrySearch.toLowerCase())
                            )
                            .map((country) => (
                              <CommandItem
                                key={country.id}
                                value={country.name}
                                onSelect={() => {
                                  setProfileData((prev) => ({
                                    ...prev,
                                    personalInfo: {
                                      ...prev.personalInfo,
                                      countryId: country.id,
                                      stateId: "",
                                      cityId: "",
                                    },
                                  }));

                                  setPhoneCode(country.phonecode);

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

              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password*
                </Label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="(Minimum 6 characters)"
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This helps your account stay protected
                </p>
              </div>

              <div className="mt-1">
                <Label
                  htmlFor="mobile"
                  className="text-sm font-medium text-gray-700"
                >
                  Mobile number*
                </Label>

                <div className="relative flex items-center gap-2 mt-2">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    className="w-24 h-12 pl-10 border rounded-lg bg-gray-100 text-gray-700"
                    value={`+${phoneCode}`}
                    readOnly
                  />

                  <input
                    className="flex-1 h-12 border rounded-lg px-3 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter mobile number"
                    value={profileData.personalInfo.phone}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          phone: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recruiters will contact you on this number
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Work status*
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card
                    className={`cursor-pointer transition-all ${
                      workStatus === "experienced"
                        ? "ring-2 ring-purple-500 bg-purple-50"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => setWorkStatus("experienced")}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">💼</div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">
                        I'm experienced
                      </h3>
                      <p className="text-xs text-gray-600">
                        I have work experience (excluding internships)
                      </p>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${
                      workStatus === "fresher"
                        ? "ring-2 ring-purple-500 bg-purple-50"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => setWorkStatus("fresher")}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🎓</div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">
                        I'm a fresher
                      </h3>
                      <p className="text-xs text-gray-600">
                        I am a student/ Haven't worked after graduation
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="updates"
                  className="mt-1"
                  checked={receivePromotions}
                  onCheckedChange={(value) =>
                    setReceivePromotions(value === true)
                  }
                />
                <label
                  htmlFor="updates"
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  Send me important updates & promotions via SMS, Email, and{" "}
                  <span className="text-green-600 font-medium">WhatsApp</span>
                </label>
              </div>

                  {/* Register Button */}
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl hover:bg-violet-700 active:scale-[0.99] transition-all shadow-lg shadow-violet-200 flex items-center justify-center gap-2 group"
                    >
                      Register Now
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                      By clicking Register, you agree to the <a href="#" className="text-violet-600 hover:underline">Terms and Conditions</a> & <a href="#" className="text-violet-600 hover:underline">Privacy Policy</a>
                    </p>
                  </div>

              <Button
                variant="outline"
                className="w-full h-12 border-gray-200 hover:bg-gray-50"
                type="button"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>

              <p className="text-xs text-gray-500 text-center leading-relaxed">
                By clicking Register, you agree to the{" "}
                <Link href="#" className="text-purple-600 hover:underline">
                  Terms and Conditions
                </Link>{" "}
                &{" "}
                <Link href="#" className="text-purple-600 hover:underline">
                  Privacy Policy
                </Link>{" "}
                of JobSeeker.com
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer / Trust Badges (Optional) */}
      <footer className="w-full py-6 text-center text-slate-400 text-sm hidden lg:block">
        <div className="flex items-center justify-center gap-6 opacity-70">
           <span className="flex items-center gap-1"><ShieldCheck size={14}/> 100% Data Privacy</span>
           <span>&bull;</span>
           <span>ISO 27001 Certified</span>
        </div>
      </footer>
    </div>
  );
}

// Sub-component for Benefits List on Left Panel
function BenefitItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-500 flex-shrink-0 mt-1">
        <CheckCircle2 size={20} />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 text-sm lg:text-base flex items-center gap-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
