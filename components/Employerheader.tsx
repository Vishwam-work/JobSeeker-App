"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {  Search,Settings,HelpCircle,LogOut, User,Activity,CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
 

export default function EmployerHeader() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [ContactpersonName, setContactpersonName] = useState("");
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  interface DecodedToken {
    user_id: number | string;
    exp?: number;
    iat?: number;
  }
  const router = useRouter();
  const companyLogo = "/companies_logos/zenoti.png";

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    // console.log("LOG TOKEN:", token);
    setIsAuthenticated(!!token);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    router.push("/employer/home");
  };
  useEffect(() => {
      const run = async () => {
        try {
          const token = localStorage.getItem("auth_token");
          if (!token) return;
  
          const decoded = jwtDecode<DecodedToken>(token);
          // console.log("DECODED:", decoded);
          // console.log("Employer ID:", decoded.user_id);
  
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/companies/${decoded.user_id}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
  
          if (!res.ok) {
            console.error("FETCH FAILED:", res.status);
            return;
          }

          const data = await res.json();
          // console.log("Applications:", data);
          setContactpersonName(data.contact_person_name);
          // console.log(data.contact_person_name)
        } catch (err) {
          console.error("Error:", err);
        }
      };

      run();
    }, []);

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              jobseeker
            </span>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              Employer
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
           

            {/* Notification */}
            {/* <div className="relative">
              <div
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="cursor-pointer relative select-none"
              >
                <Bell className="w-5 h-5 text-gray-700 hover:text-purple-600" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
              </div>

              {isNotificationOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white border shadow-lg rounded-lg z-50">
                    <div className="p-3 border-b font-semibold text-gray-700">
                      Notifications
                    </div>
                    <div className="p-3 text-sm text-gray-600">
                      No new notifications
                    </div>
                  </div>
                </>
              )}
            </div> */}
            {/* <div className="relative">
              <Image
                src={companyLogo}
                alt="Company Logo"
                width={40}
                height={40}
                onClick={() => setOpenAccountMenu((prev) => !prev)}
                className="rounded-full border-2 border-purple-600 cursor-pointer"
              />
            </div> */}
             {isAuthenticated && (
                <div className="relative">
                  <div
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="cursor-pointer"
                  >
                    <User className="w-6 h-6 text-gray-700 hover:text-purple-600" />
                  </div>

                {isUserMenuOpen && (
                <>
                  {/* Overlay */}
                  <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />

                  {/* Side Panel */}
                  <div className="fixed right-0 top-0 h-screen w-[30%] min-w-[320px] bg-white shadow-2xl z-50 flex flex-col">

                    {/* Header */}
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-semibold">{ContactpersonName || "User"}</h2>
                        <Link
                          href="/employer/account"
                          className="text-blue-600 text-sm font-medium"
                        >
                          View & Update Account
                        </Link>
                      </div>

                      <button
                        onClick={() => setIsUserMenuOpen(false)}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                      >
                        ✕
                      </button>
                    </div>
                    {/* Menu */}
                    <div className="flex-1">

                <Link href="/employer/dashboard">
                  <div className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                    <Activity size={18} />
                    Dashboard
                  </div>
                </Link>

                <Link href="/pricing">
                  <div className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                    <CreditCard size={18} />
                    Pricing
                  </div>
                </Link>

                <Link href="">
                  <div className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                    <Settings size={18} />
                    Settings
                  </div>
                </Link>

                <Link href="">
                  <div className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                    <HelpCircle size={18} />
                    FAQs
                  </div>
                </Link>

                <div
                  onClick={handleLogout}
                  className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                >
                  <LogOut size={18} />
                  Logout
                </div>

              </div>



                  </div>
                </>
              )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
