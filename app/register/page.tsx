"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import AsyncSelect from "react-select/async";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import {
  CheckCircle,
  User,
  Search,
  ChevronDown,
  Eye,
  EyeOff,
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
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Register() {
  const router = useRouter();

  // Form states
  const [workStatus, setWorkStatus] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  // Resume Upload
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP Modal
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [otpError, setOtpError] = useState("");

  const emailDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "rediffmail.com",
];

const emailParts = email.split("@");

const showSuggestions =
  email.includes("@") &&
  emailParts[1] !== undefined &&
  !emailDomains.includes(emailParts[1]);

const filteredDomains =
  emailParts[1] === ""
    ? emailDomains
    : emailDomains.filter((domain) =>
        domain.startsWith(emailParts[1])
      );
  const validateFullName = (value: string) => {
  if (!value) return "Full name is required";
  if (value.trim().length < 3) return "Enter at least 3 characters";
  if (!/^[a-zA-Z\s]+$/.test(value)) return "Only letters allowed";
  return "";
};
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!regex.test(value)) return "Enter valid email";
    return "";
  };

  const validateOtp = (value: string) => {
  if (!value) return "OTP is required";
  if (value.length !== 6) return "Enter 6 digit OTP";
  if (!/^\d+$/.test(value)) return "OTP must be numbers only";
  return "";
};

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Minimum 8 characters required";
    return "";
  };

  const validatePhone = (value: string) => {
    if (!value) return "Mobile number is required";
    if (!/^[6-9]\d{9}$/.test(value))
      return "Enter valid 10 digit mobile number";
    return "";
  };

  const validateResume = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/rtf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Only DOC, DOCX, PDF, RTF allowed";
    }

    if (file.size > 2 * 1024 * 1024) {
      return "File size must be less than 2MB";
    }

    return "";
  };
  const formatFileSize = (size: number) => {
    return size < 1024
      ? `${size} B`
      : size < 1024 * 1024
        ? `${(size / 1024).toFixed(0)} KB`
        : `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

useEffect(() => {
  let interval: NodeJS.Timeout;

  if (isOtpOpen && timer > 0) {
    interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  }

  if (timer === 0) {
    setCanResend(true);
  }

  return () => clearInterval(interval);
}, [isOtpOpen, timer]);

  // ----------------------------
  // SEND OTP
  // ----------------------------
  const handlesendotp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/send_otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
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

  //resend otp
const handleResendOTP = async () => {
   console.log("Resend OTP clicked");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_APP}/send_otp/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    console.log("API Status:", res.status);

    const data = await res.json();
    console.log("API Response:", data);

    if (!res.ok) {
      toast.error(data.error || "Failed to resend OTP");
      return;
    }

    toast.success("OTP Resent Successfully");
    setOtp("");
    setOtpError("");
    setTimer(59);
    setCanResend(false);

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

  // ----------------------------
  // VERIFY OTP
  // ----------------------------
  const handleVerifyOTP = async () => {
     const error = validateOtp(otp);
  if (error) {
    setOtpError(error);
    return;
  }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/verify-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid OTP");
        return;
      }
      setOtpError("");
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

    const phone = profileData.personalInfo.phone;

    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    const formData = new FormData();

    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("mobile_number", profileData.personalInfo.phone);
    formData.append("work_status", workStatus);
    formData.append("receive_promotions", String(receivePromotions));
    formData.append("country_id", String(profileData.personalInfo.countryId));

    if (resume) {
      formData.append("resume", resume);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/register/`,
        {
          method: "POST",
          body: formData,
        },
      );
      const result = await res.json() as Record<string, any>;
       if (!res.ok) {
        throw new Error(
          result?.error ||
          result?.message ||
          (Object.values(result)[0] as any)?.[0] ||
          "Registration failed"
        );
      }
      console.log("Registration Successful");
      toast.success("Registration Successful ");
      router.push("/login");

    } catch (error) {
      toast.error((error as Error).message);
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
          `${process.env.NEXT_PUBLIC_API_URL_MASTER}/countries/`,
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
            <div className="container mt-5">
             <GoogleOAuthProvider clientId="839330984972-s0g17d8e9ou8eghct8h9f4cnv0p6lm2p.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const token = credentialResponse.credential;

                        const response = await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL_APP}/google-login/`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ token }),
                          }
                        );

                        const data = await response.json();

                        if (response.ok) {
                          localStorage.setItem("user_token", data.access);
                          localStorage.setItem("full_name", data.full_name);
                          localStorage.setItem("user_email", data.email);
                          if (data.user_id)
                            localStorage.setItem("user_id", data.user_id);
                          window.dispatchEvent(new Event("user-email-updated"));
                          setTimeout(() => {
                              router.push("/profile");
                          }, 2000);
                          toast.success("Registration Successful ");
                        } else {
                          toast.error("Registration failed: " + data.error);
                        }

                      } catch (error) {
                        console.log("Error:", error);
                      }
                    }}
                    onError={() => toast.error("Registration failed: Google login error")}
                  />
                </GoogleOAuthProvider>
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
               onChange={(e) => {
                const value = e.target.value;
                setFullName(value);

                setErrors((prev) => ({
                  ...prev,
                  fullName: validateFullName(value),
                }));
              }}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label>Email *</Label>

              <div className="relative mt-1">
                <Input
                  className={`h-12 pr-10 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : isOtpVerified
                        ? "border-green-500 focus:ring-green-500"
                        : ""
                  }`}
                   disabled={isOtpVerified}
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    setIsOtpVerified(false);
                    setIsOtpOpen(false);
                    setErrors((prev) => ({
                      ...prev,
                      email: validateEmail(value),
                    }));
                  }}
                  placeholder="Enter your email"
                  type="email"
                />
               {showSuggestions && filteredDomains.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-md z-10">
                    {filteredDomains.map((domain) => (
                      <div
                        key={domain}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          const newEmail = `${emailParts[0]}@${domain}`;
                          setEmail(newEmail);

                          setErrors((prev) => ({
                            ...prev,
                            email: validateEmail(newEmail),
                          }));
                        }}
                      >
                        {domain}
                      </div>
                    ))}
                  </div>
                )}
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
                  {!errors.email && !email && (
                    <p className="text-xs text-gray-500 mt-1">
                      Verify your email before clicking Register.
                    </p>
                  )}
                   {!errors.email && email &&(
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send relevant jobs and updates to this email
                    </p>
                  )}
                {isOtpVerified && (
                  <CheckCircle className="absolute right-3 top-6 -translate-y-1/2 text-green-600 w-5 h-5" />
                )}
              </div>

              {!isOtpVerified && !isOtpOpen && (
              <Button
                type="button"
                className="mt-2"
                disabled={!!errors.email}
                onClick={handlesendotp}
              >
                Verify Email OTP
              </Button>
            )}
                      {isOtpOpen && !isOtpVerified && (
              <div className="mt-3">

                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setOtpError("");
                  }}
                >
                  <InputOTPGroup className="gap-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-10 h-10 text-lg border"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                {otpError && (
                  <p className="text-sm text-red-500 mt-1">{otpError}</p>
                )}

                {/* Timer */}
                <div className="flex items-center gap-2 mt-2 text-sm">
              {!canResend ? (
                <span className="text-gray-500">
                  Expired OTP in <span className="font-medium">{timer}s</span>
                </span>
              ) : (
                <>
                  <span className="text-gray-500">Didn't receive OTP?</span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Resend
                  </button>
                </>
              )}
            </div>

                {/* Verify Button */}
                <Button
                  type="button"
                  className="mt-3 bg-blue-600 text-white w-full"
                  onClick={handleVerifyOTP}
                >
                  Verify OTP
                </Button>

              </div>
            )}
            </div>

            {/* Password */}
            <div>
              <Label>Password *</Label>

              <div className="relative mt-1">
                <Input
                  className={`h-12 pr-10 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);

                    setErrors((prev) => ({
                      ...prev,
                      password: validatePassword(value),
                    }));
                  }}
                />
                {errors.password ? (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                ) : password.length >= 8 ? (
                  <p className="text-xs text-green-600 mt-1">
                    This helps your account stay protected
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    This helps your account stay protected
                  </p>
                )}
                <button
                  type="button"
                  className="absolute right-3 top-6 -translate-y-1/2 text-gray-500"
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
              <Label>Country *</Label>

              <AsyncSelect
                cacheOptions
                defaultOptions={countries.map((c) => ({
                  label: c.name ?? "",
                  value: c.id,
                  phonecode: c.phonecode,
                }))}
                loadOptions={async (inputValue) => {
                  const search = inputValue.toLowerCase().trim();

                  return countries
                    .filter((c) =>
                      c.name?.toLowerCase().includes(search)
                    )
                    .map((c) => ({
                      label: c.name ?? "",
                      value: c.id,
                      phonecode: c.phonecode,
                    }));
                }}
                value={
                  countries
                    .filter(
                      (c) => c.id == profileData.personalInfo.countryId
                    )
                    .map((c) => ({
                      label: c.name,
                      value: c.id,
                      phonecode: c.phonecode,
                    }))[0] || null
                }
                onChange={(selected: any) => {
                  // ✅ SAME LOGIC (unchanged)
                  setProfileData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      countryId: selected?.value,
                    },
                  }));

                  setPhoneCode(selected?.phonecode);
                }}
                placeholder="Search Country..."
              />
            </div>

            {/* Mobile Number */}
            <div>
              <Label>Mobile *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  className="w-24 h-12 bg-gray-100"
                  value={`+${phoneCode}`}
                  readOnly
                />
                 <div className="relative w-full">
                <Input
                  className={`h-12 pr-10${
                    errors.phone ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Enter mobile number"
                  value={profileData.personalInfo.phone}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*$/.test(value)) return;
                    if (value.length > 10) return;

                    setProfileData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        phone: value,
                      },
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      phone: validatePhone(value),
                    }));
                  }}
                />
                   {!errors.phone && profileData.personalInfo.phone.length === 10 && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5" />
                  )}
                  </div>
              </div>
             {errors.phone ? (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              ) : profileData.personalInfo.phone.length === 10 ? (
                <p className="text-xs text-green-600 mt-1">
                  Employers will reach you on this mobile number.
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                 Recruiters will contact you on this number
                </p>
              )}
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
                    <p>I have work experience (excluding internships)</p>
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
                    <p>I am a student / Haven't worked after graduation</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <Label>Resume</Label>

              {!resume ? (
                <div className="mt-2 flex items-center gap-4">
                  <label className="cursor-pointer bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition">
                    {" "}
                    Upload Resume
                    <input
                      type="file"
                      className="hidden"
                      accept=".doc,.docx,.pdf,.rtf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const error = validateResume(file);
                        if (error) {
                          setResumeError(error);
                          setResume(null);
                        } else {
                          setResume(file);
                          setResumeError("");
                        }
                      }}
                    />
                  </label>

                  <span className="text-sm text-gray-500">
                    DOC, DOCx, PDF, RTF | Max: 2 MB
                  </span>
                </div>
              ) : (
                // Uploaded UI
                <div className="mt-3">
                  <div className="flex items-center justify-between border rounded-full px-4 py-3 bg-gray-50">
                    {/* File Name */}
                    <div className="flex items-center gap-2 truncate">
                      📎
                      <span className="text-sm truncate max-w-xs">
                        {resume.name}
                      </span>
                    </div>

                    {/* Replace + Delete */}
                    <div className="flex items-center gap-4">
                      {/* Replace */}
                      <label className="text-blue-600 text-sm font-medium cursor-pointer">
                        Replace
                        <input
                          type="file"
                          className="hidden"
                          accept=".doc,.docx,.pdf,.rtf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const error = validateResume(file);
                            if (error) {
                              setResumeError(error);
                            } else {
                              setResume(file);
                              setResumeError("");
                            }
                          }}
                        />
                      </label>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setResume(null)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  {/* File Info */}
                  <p className="text-xs text-gray-500 mt-2">
                    Size: {formatFileSize(resume.size)} | Last Updated:{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              )}

               {resumeError ? (
               <p className="text-sm text-red-500 mt-2">{resumeError}</p>
             ) : (
               <p className="text-xs text-gray-500 mt-2">
                 Upload your resume in PDF or DOC format.
               </p>
             )}
            </div>

            <div className="flex items-start gap-2 mt-4">
              <Checkbox
                checked={agreeTerms}
                onCheckedChange={(val) => setAgreeTerms(val === true)}
              />
             <p className="text-sm text-gray-600">
               By clicking Register, you agree to the{" "}
               <Link
                 href="/terms-and-conditions"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-blue-600 font-medium"
               >
                 Terms and Conditions
               </Link>{" "}
               &{" "}
               <Link
                 href="/privacy-policy"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-blue-600 font-medium"
               >
                 Privacy Policy
               </Link>
             </p>
            </div>

            {/* Promotions */}
            <div className="flex items-start gap-2 mt-2">
              <Checkbox
                checked={receivePromotions}
                onCheckedChange={(val) => setReceivePromotions(val === true)}
              />
              <p className="text-sm text-gray-600">
                Send me important updates via Email, SMS, and WhatsApp.
              </p>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={
                !isOtpVerified ||
                !agreeTerms ||
                !!errors.email ||
                !!errors.password ||
                !!errors.phone ||
                !email ||
                !password ||
                !profileData.personalInfo.phone
              }
              className="w-full h-12 text-lg bg-purple-600 text-white"
            >
              Register Now
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
