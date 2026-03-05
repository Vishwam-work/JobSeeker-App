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
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react"; 
import Loader from "./Loader";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmployerDropdownOpen, setIsEmployerDropdownOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");


  const router = useRouter();
  const pathname = usePathname();

  // const { data: session } = useSession(); 
const handleSearch = () => {
  router.push(`/jobs?keyword=${keyword}&location=${location}`);
};
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    handleSearch();
  }
};

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
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");

    setIsAuthenticated(false);
    router.push("/login");
  };

  useEffect(() => {
  setPageLoading(false);
}, [pathname]);

 const handleProfileNavigate = () => {
  if (pathname === "/profile") {
    return;
  }
  setPageLoading(true);
  router.push("/profile");
};

const lockBodyScroll = () => {
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${scrollBarWidth}px`;
};

const unlockBodyScroll = () => {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};

useEffect(() => {
  if (isNotificationOpen) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }

  return () => unlockBodyScroll();
}, [isNotificationOpen]);



  return (
    <>
  <Loader show={pageLoading} text="Loding..." />

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
           <div
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchOpen(true);
              }}
              className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 cursor-pointer"
            >

              <input
                type="text"
                placeholder="Search jobs here"
                className="bg-transparent outline-none text-sm w-full cursor-pointer"
                readOnly
              />

              <Search className="w-4 h-4 text-white bg-blue-600 rounded-full p-1 ml-2" />
            </div>
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

                   <Button
                  onClick={handleProfileNavigate}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  Make Profile
                </Button>
                
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

           {/* Notification Bell  */}
           <div className="relative">
           <div
             onClick={() => setIsNotificationOpen(!isNotificationOpen)}
             className="cursor-pointer relative"
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
          
               <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded-lg z-50">
                 <div className="p-3 border-b font-semibold text-gray-700">
                   Notifications
                 </div>
          
                 <div className="max-h-64 overflow-y-auto">
                   <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                     <p className="text-sm font-medium text-gray-800">
                       New job matched your profile
                     </p>
                     <p className="text-xs text-gray-500">2 minutes ago</p>
                   </div>
          
                   <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                     <p className="text-sm font-medium text-gray-800">
                       Employer viewed your profile
                     </p>
                     <p className="text-xs text-gray-500">1 hour ago</p>
                   </div>
                 </div>
               </div>
              </>
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
                <div className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors px-2 py-1">
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

             {/*  Notification Section */}
              <div className="border-t pt-4">
               <button
                 onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                 className="flex items-center gap-2 w-full px-2 py-2 text-gray-700 hover:text-purple-600"
               >
                 <Bell className="w-5 h-5" />
                 <span>Notifications</span>
               </button>

               {isNotificationOpen && (
                 <div className="mt-2 bg-gray-50 rounded-lg border">
                   <div className="px-3 py-2 text-sm font-medium border-b">
                     Notifications
                   </div>

                   <div className="max-h-48 overflow-y-auto">
                     <div className="px-3 py-2 text-sm hover:bg-gray-100">
                       New job matched your profile
                     </div>
                     <div className="px-3 py-2 text-sm hover:bg-gray-100">
                       Employer viewed your profile
                     </div>
                   </div>
                 </div>
               )}
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
                      <Button
                        onClick={handleProfileNavigate}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                      >
                        Make Profile
                      </Button>
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
    {isSearchOpen && (
  <div
  onClick={(e) => e.stopPropagation()}
  className="bg-gray-100 py-6 border-b"
>

    <div className="max-w-5xl mx-auto">

      <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">

        <input
          type="text"
          placeholder="Enter keyword / designation / companies"
          className="flex-1 px-6 py-4 outline-none"
        />

        <div className="border-l px-6 py-4">
          <select className="outline-none text-gray-500">
            <option>Select experience</option>
            <option>Fresher</option>
            <option>1 Year</option>
            <option>2 Years</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Enter keyword / designation / companies"
          className="flex-1 px-6 py-4 outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
           onKeyDown={handleKeyPress}
        />

        <input
          type="text"
          placeholder="Enter location"
          className="border-l px-6 py-4 outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
           onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-8 py-4"
         >
          Search
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}
