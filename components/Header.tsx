"use client";

import { Button } from "@/components/ui/button";
import {
  Search,
  Building2,
  Users,
  Phone,
  Briefcase,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react"; 

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmployerDropdownOpen, setIsEmployerDropdownOpen] = useState(false);
  const router = useRouter();

  // const { data: session } = useSession(); 

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Local logout
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_name");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              jobseeker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors">
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
              </div>
            </Link>
            <Link href="/companies">
              <div className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors">
                <Building2 className="w-4 h-4" />
                <span>Companies</span>
              </div>
            </Link>
            <Link href="/service">
              <div className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors">
                <Users className="w-4 h-4" />
                <span>Services</span>
              </div>
            </Link>
            <Link href="/contact">
              <div className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors">
                <Phone className="w-4 h-4" />
                <span>Contact</span>
              </div>
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">
                    {localStorage.getItem("full_name") || "User"}
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                  onClick={handleLogout}  >
                  Logout
                </Button>

                <Link href="/profile">
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                    Make Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}

            {/* For Employers Dropdown */}
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
                    href="/employer/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    Employer Login
                  </Link>
                  <Link
                    href="/employer/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    Register as Employer
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/">
                <div className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors px-2 py-1">
                  <Briefcase className="w-4 h-4" />
                  <span>Jobs</span>
                </div>
              </Link>
              <Link href="/companies">
                <div className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors px-2 py-1">
                  <Building2 className="w-4 h-4" />
                  <span>Companies</span>
                </div>
              </Link>
              <Link href="/service">
                <div className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors px-2 py-1">
                  <Users className="w-4 h-4" />
                  <span>Services</span>
                </div>
              </Link>
              <Link href="/contact">
                <div className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Contact</span>
                </div>
              </Link>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 px-2 mb-2">
                  For Employers
                </p>
                <Link
                  href="/employer/login"
                  className="block px-2 py-1 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Employer Login
                </Link>
              </div>

              <div className="flex flex-col space-y-2 pt-4 border-t px-2">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-red-600 text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                    <Link href="/profile">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                        Make Profile
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
