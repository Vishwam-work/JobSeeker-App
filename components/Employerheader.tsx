"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function EmployerHeader() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [openAccountMenu, setOpenAccountMenu] = useState(false);
  const router = useRouter();
  const companyLogo = "/companies_logos/zenoti.png";

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    console.log("LOG TOKEN:", token);
    setIsAuthenticated(!!token);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    router.push("/employer/login");
  };

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
            <Link
              href="/employer/dashboard"
              className="text-gray-700 hover:text-purple-600 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-purple-600 font-medium"
            >
              Pricing
            </Link>

            {/* Notification */}
            <div className="relative">
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
            </div>
            <div className="relative">
              <Image
                src={companyLogo}
                alt="Company Logo"
                width={40}
                height={40}
                onClick={() => setOpenAccountMenu((prev) => !prev)}
                className="rounded-full border-2 border-purple-600 cursor-pointer"
              />

              {openAccountMenu && (
                <div className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-lg border z-50">
                  <button
                    onClick={() => router.push("/employer/account")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    View Account
                  </button>

                  <button
                    onClick={() => router.push("/employer/account")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit Account
                  </button>

                  <button
                    onClick={() => router.push("/employer/settings")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
