"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Snackbar, Alert } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import { Chrome, CheckCircle, Eye, EyeOff, ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useSession, signIn, signOut } from "next-auth/react";
import CookieConsent from "@/components/Cookie";

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [isEmployerDropdownOpen, setIsEmployerDropdownOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const REQUIRED_PROFILE_FIELDS = [
    "full_name",
    "phone",
    "resume",
    "skills",
    "country",
    "state",
    "city",
    "experiences",
  ];
  const isProfileComplete = (profile: any) => {
    return REQUIRED_PROFILE_FIELDS.every(
      (field) =>
        profile[field] &&
        (Array.isArray(profile[field])
          ? profile[field].length > 0
          : true)
    );
  };


  // Email/Password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("auth_token", data.access);
        localStorage.setItem("full_name", data.full_name);

        localStorage.setItem("user_email", email);
        if (data.id) localStorage.setItem("user_id", data.id);
        window.dispatchEvent(new Event("user-email-updated"));
        // 🔹 profile API call
        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_APP}/profile/`,
          {
            headers: {
              Authorization: `Bearer ${data.access}`,
            },
          }
        );

        const profileData = await profileRes.json();

        // 🔹 conditional redirect
        setTimeout(() => {
          if (isProfileComplete(profileData)) {
            router.push("/");        // profile complete → home
          } else {
            router.push("/profile"); // profile incomplete → profile page
          }
        }, 2000);

        setAlertType("success");
        setAlertMessage("Login Successful!");
        setAlertOpen(true);
      } else {
        setAlertType("error");
        setEmailError("");
        setPasswordError("");


          if (data.error === "User not found") {
    setEmailError("Email not registered.");
    setAlertMessage("Email not registered. Please register first.");
  } 
  else if (data.error === "Invalid email") {
    setEmailError("Please enter a valid email.");
    setAlertMessage("Please enter a valid email address.");
  } 
  else if (data.error === "Invalid credentials") {
    setPasswordError("Incorrect password.");
    setAlertMessage("Incorrect password.");
  } 
  else {
    setPasswordError(data.error || "Login Failed");
    setAlertMessage(data.error || "Login Failed");
  }
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Please enter a valid email address.");
      setAlertOpen(true);
    }
  };



  return (
    <>
      {/* Alerts */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertType} onClose={() => setAlertOpen(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
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
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors"
                onClick={() =>
                  setIsEmployerDropdownOpen(!isEmployerDropdownOpen)
                }
                onBlur={() =>
                  setTimeout(() => setIsEmployerDropdownOpen(false), 200)
                }
              >
                <span className="text-sm font-medium">For employers</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isEmployerDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/employer/home"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    Employer Login
                  </Link>
                  <Link
                    href="/employer/home"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    Register as Employer
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left Side - Benefits */}
            <Card className="bg-white shadow-lg order-2 lg:order-1">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">
                  New to JobSeeker?
                </h2>
                <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm md:text-base">
                      One click apply using jobseeker profile.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm md:text-base">
                      Get relevant job recommendations.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm md:text-base">
                      Showcase profile to top companies and consultants.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm md:text-base">
                      Know application status on applied jobs.
                    </p>
                  </div>
                </div>

                <Link href="/register">
                  <Button
                    variant="outline"
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 h-12"
                  >
                    Register for Free
                  </Button>
                </Link>

                <div className="mt-6 md:mt-8 text-center">
                  <div className="w-32 h-24 md:w-48 md:h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mx-auto flex items-center justify-center">
                    <div className="text-3xl md:text-4xl">👨‍💻</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Side - Login Form */}
            <Card className="bg-white shadow-lg order-1 lg:order-2">
              <CardContent className="p-6 md:p-8">
                <div className="text-center mb-6 md:mb-8">
                  <Link
                    href="/"
                    className="flex items-center justify-center space-x-2 mb-6"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      jobseeker
                    </span>
                  </Link>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    Login
                  </h1>
                </div>

                <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                  {/* Email */}
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email ID / Username
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="mt-1 bg-gray-50 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      value={email}
                      onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      }}
                    />
                    {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                     )}
                  </div>

                  {/* Password */}
                  <div>
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <div className="mt-1 relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pr-10 bg-gray-50 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        value={password}
                        onChange={(e) => {
  setPassword(e.target.value);
  setPasswordError("");
}}
                      />
                      {passwordError && (
  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
)}
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

                  {/* Buttons */}
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-200">
                    Login
                  </Button>

                  {/* <Button
                    variant="outline"
                    className="w-full h-12 border-gray-200 hover:bg-gray-50"
                    type="button"
                  >
                    Use OTP to Login
                  </Button> */}

                  {/* Or divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    {/* <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div> */}
                  </div>

                  {/* Google Login */}
                  {/* <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 transition-all duration-200"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google Logo"
                      className="w-5 h-5 mr-3"
                    />
                    <span className="text-gray-700 font-medium">
                      Sign in with Google
                    </span>
                  </Button> */}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CookieConsent />
    </>
  );
}
