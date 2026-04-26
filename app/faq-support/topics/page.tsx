"use client";
 import Link from "next/link";
 import {
  UserRound,
  Search,
  MousePointerClick,
  RefreshCw,
  Settings,
  ShieldCheck,
} from "lucide-react";
export default function Topics() {
  const topics = [
  {
    title: "Create Profile",
    icon: <UserRound className="w-12 h-12 text-blue-600" />,
    slug: "create-profile",
  },
  {
    title: "Search Jobs",
    icon: <Search className="w-12 h-12 text-blue-600" />,
    slug: "search-jobs",
  },
  {
    title: "Apply Jobs",
    icon: <MousePointerClick className="w-12 h-12 text-blue-600" />,
    slug: "apply-jobs",
  },
  {
    title: "Getting Started",
    icon: <RefreshCw className="w-12 h-12 text-blue-600" />,
    slug: "getting-started",
  },
  {
    title: "Settings",
    icon: <Settings className="w-12 h-12 text-blue-600" />,
    slug: "settings",
  },
  {
    title: "Security Advice",
    icon: <ShieldCheck className="w-12 h-12 text-blue-600" />,
    slug: "security-advice",
  },
];

  return (
    <div className="bg-[#f3f3f3] ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Browse Topics */}
         <div className="text-center ">
          <h2 className="text-4xl font-semibold text-blue-700 uppercase tracking-wide mb-10">
            Browse By Topic
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {topics.map((topic, index) => (
              <Link href={`/faq-support/${topic.slug}`}>
                <div
                key={index}
                className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center justify-center min-h-[180px] hover:-translate-y-1 cursor-pointer"
              >
                <div className="text-5xl mb-5">{topic.icon}</div>
                <h3 className="text-gray-700 text-base font-medium text-center">
                  {topic.title}
                </h3>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}