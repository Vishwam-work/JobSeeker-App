"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Chrome,
  CheckCircle,
  Mail,
  Lock,
  Phone,
  User,
  Search,
  ArrowRight,
  ChevronDown,
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

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function Register() {
  const router = useRouter();

  // Form states
  const [workStatus, setWorkStatus] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [receivePromotions, setReceivePromotions] = useState(false);

  // Country / Phone
  const [countries, setCountries] = useState<any[]>([]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  const [profileData, setProfileData] = useState({
    personalInfo: {
      countryId: "",
      phone: "",
    },
  });

  // OTP Modal
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // ----------------------------
  // SEND OTP
  // ----------------------------
  const handlesendotp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://127.0.0.1:8010/api/send_otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send OTP");
        return;
      }

      setIsOtpOpen(true);
      toast.success("OTP Sent Successfully");
    } catch (error) {
      console.error(error);
      toast.warning("Something went wrong");  
    }
  };

  // ----------------------------
  // VERIFY OTP
  // ----------------------------
  const handleVerifyOTP = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8010/api/verify-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid OTP");
        return;
      }

      setIsOtpVerified(true);
      setIsOtpOpen(false);
      toast.success("OTP Verified Successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------
  // REGISTER
  // ----------------------------
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

    try {
      const res = await fetch(
        "http://127.0.0.1:8010/api/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Registration failed");

      const result = await res.json();
      console.log("Registration Successful:", result);

      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // ----------------------------
  // FETCH COUNTRIES
  // ----------------------------
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8010/master/api/countries/"
        );
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCountries();
  }, []);

  // ----------------------------
  // RETURN JSX
  // ----------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              jobseeker
            </span>
          </Link>

          <div className="text-sm text-gray-600">
            Already Registered?{" "}
            <Link href="/login" className="text-purple-600 font-medium">
              Login here
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">
        {/* LEFT BENEFITS */}
        <div className="bg-white p-8 rounded-xl shadow">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold">On registering, you can</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
              <p>Build your profile and let recruiters find you</p>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
              <p>Get job postings delivered to your email</p>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
              <p>Find a job and grow your career</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white p-8 rounded-xl shadow">
          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Full name */}
            <div>
              <Label>Full Name *</Label>
              <Input
                className="mt-1 h-12"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email *</Label>
              <Input
                className="mt-1 h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
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

            {/* Password */}
            <div>
              <Label>Password *</Label>
              <Input
                className="mt-1 h-12"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Country */}
            <div>
              <Label>Country *</Label>

              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full mt-1 h-10 lg:h-11 border rounded px-3 flex items-center justify-between">
                    <span>
                    {profileData.personalInfo.countryId
                      ? countries.find(
                          (c) =>
                            c.id == profileData.personalInfo.countryId
                        )?.name
                      : "Select Country"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
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
                          .filter((c) =>
                            c.name
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

            {/* Mobile Number */}
            <div>
              <Label>Mobile *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  className="w-24 h-12 bg-gray-100"
                  value={`+${phoneCode}`}
                  // readOnly
                />
                <Input
                  className="h-12"
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
            </div>

            {/* Work Status */}
            <div>
              <Label>Work Status *</Label>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <Card
                  className={`cursor-pointer ${
                    workStatus === "experienced"
                      ? "ring-2 ring-purple-500 bg-purple-50"
                      : ""
                  }`}
                  onClick={() => setWorkStatus("experienced")}
                >
                  <CardContent className="p-4">
                    <div className="text-2xl">💼</div>
                    <p className="font-medium">I'm experienced</p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer ${
                    workStatus === "fresher"
                      ? "ring-2 ring-purple-500 bg-purple-50"
                      : ""
                  }`}
                  onClick={() => setWorkStatus("fresher")}
                >
                  <CardContent className="p-4">
                    <div className="text-2xl">🎓</div>
                    <p className="font-medium">I'm a fresher</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Promotions */}
            <div className="flex items-start gap-2 mt-2">
              <Checkbox
                checked={receivePromotions}
                onCheckedChange={(val) =>
                  setReceivePromotions(val === true)
                }
              />
              <p className="text-sm text-gray-600">
                Send me important updates via Email, SMS, and WhatsApp.
              </p>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={!isOtpVerified}
              className="w-full h-12 text-lg bg-purple-600 text-white"
            >
              Register Now
            </Button>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
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
