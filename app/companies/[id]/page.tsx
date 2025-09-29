
import Image from "next/image";
import Header from "@/components/Header";

export const allCompanies = [
  {
    id: 1,
    name: "Simplilearn",
    rating: 3.1,
    reviews: 727,
    category: "e-Learning / EdTech",
    founded: 2010,
    logo: "/companies_logos/simplilearn.png",
    type: "Foreign MNC",
    industry: "Education / Training",
    locations: ["Bengaluru", "Delhi / NCR"],
    jobs: [
      {
        title: "Software Engineer Intern",
        duration: "No fixed duration",
        salary: "Unpaid",
        location: "Bengaluru, Delhi / NCR",
        type: "Internship",
        start: "Starts in 1-3 months",
        posted: "2 Days Ago",
      },
      {
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },{
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },
    ],
  },
  {
    id: 2,
    name: "Ganesh Grains",
    rating: 3.0,
    reviews: 182,
    category: "FMCG",
    founded: 1936,
    logo: "/companies_logos/ganesh_grains.png",
    type: "Corporate",
    industry: "Food Processing",
    locations: ["Kolkata"],
    jobs: [
     {
        title: "Software Engineer Intern",
        duration: "No fixed duration",
        salary: "Unpaid",
        location: "Bengaluru, Delhi / NCR",
        type: "Internship",
        start: "Starts in 1-3 months",
        posted: "2 Days Ago",
      },
      {
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },
    ],
  },
  {
    id: 3,
    name: "Cyber Managers Software Services",
    rating: 3.0,
    reviews: 35,
    category: "IT Services & Consulting",
    founded: 2000,
    logo: "/companies_logos/cyber_managers.png",
    type: "Corporate",
    industry: "IT Services & Consulting",
    locations: ["Hyderabad", "Pune"],
    jobs: [
      {
        title: "Software Engineer Intern",
        duration: "No fixed duration",
        salary: "Unpaid",
        location: "Bengaluru, Delhi / NCR",
        type: "Internship",
        start: "Starts in 1-3 months",
        posted: "2 Days Ago",
      },
      {
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },
    ],
  },
  {
    id: 4,
    name: "Infinity Data Technologies",
    rating: 3.7,
    reviews: 158,
    category: "IT Services & Consulting",
    founded: 2012,
    logo: "/companies_logos/infinity_data.png",
    type: "Corporate",
    industry: "IT Services & Consulting",
    locations: ["Mumbai", "Delhi / NCR"],
    jobs: [
      {
        title: "Software Engineer Intern",
        duration: "No fixed duration",
        salary: "Unpaid",
        location: "Bengaluru, Delhi / NCR",
        type: "Internship",
        start: "Starts in 1-3 months",
        posted: "2 Days Ago",
      },
      {
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },{
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },
    ],
  },
  {
    id: 5,
    name: "Topsource Infotech Solutions",
    rating: 3.2,
    reviews: 38,
    category: "IT Services & Consulting",
    founded: 2004,
    employees: "51-200 emp.",
    logo: "/companies_logos/topsource.png",
    type: "Foreign MNC",
    industry: "IT Services & Consulting",
    locations: ["Pune", "Chennai"],
    jobs: [
      {
        title: "Software Engineer Intern",
        duration: "No fixed duration",
        salary: "Unpaid",
        location: "Bengaluru, Delhi / NCR",
        type: "Internship",
        start: "Starts in 1-3 months",
        posted: "2 Days Ago",
      },
      {
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },
    ],
  },
  {
    id: 6,
    name: "Torrent Pharmaceuticals",
    rating: 3.9,
    reviews: 2800,
    category: "Pharmaceutical & Life Sciences",
    founded: 1959,
    logo: "/companies_logos/torrent.png",
    type: "Indian MNC",
    industry: "Pharmaceuticals",
    locations: ["Ahmedabad", "Mumbai"],
    jobs: [
      {
        title: "Software Engineer Intern",
        duration: "No fixed duration",
        salary: "Unpaid",
        location: "Bengaluru, Delhi / NCR",
        type: "Internship",
        start: "Starts in 1-3 months",
        posted: "2 Days Ago",
      },
      {
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },{
        title: "Software Engineer Intern",
        duration: "No fixed duration",
        salary: "Unpaid",
        location: "Bengaluru, Delhi / NCR",
        type: "Internship",
        start: "Starts in 1-3 months",
        posted: "2 Days Ago",
      },
      {
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },
    ],
  },
  {
    id: 7,
    name: "Anytime Fitness (AF)",
    rating: 3.5,
    reviews: 167,
    category: "Fitness & Wellness",
    founded: 2001,
    logo: "/companies_logos/anytime_fitness.png",
    type: "Corporate",
    industry: "Fitness & Wellness",
    locations: ["Delhi / NCR", "Bengaluru"],
    jobs: [
      {
        title: "Software Engineer Intern",
        duration: "No fixed duration",
        salary: "Unpaid",
        location: "Bengaluru, Delhi / NCR",
        type: "Internship",
        start: "Starts in 1-3 months",
        posted: "2 Days Ago",
      },
      {
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },{
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },
    ],
  },
  {
    id: 8,
    name: "Zenoti",
    rating: 2.9,
    reviews: 167,
    category: "IT Services & Consulting",
    founded: 2010,
    logo: "/companies_logos/zenoti.png",
    type: "Foreign MNC",
    industry: "IT Services & Consulting",
    locations: ["Hyderabad", "Bengaluru"],
    jobs: [
      {
        title: "Software Engineer Intern",
        duration: "No fixed duration",
        salary: "Unpaid",
        location: "Bengaluru, Delhi / NCR",
        type: "Internship",
        start: "Starts in 1-3 months",
        posted: "2 Days Ago",
      },
      {
        title: "QA Engineer",
        experience: "1-3 Yrs",
        salary: "Not disclosed",
        location: "Bengaluru",
        description: "Responsible for automation and manual testing of products...",
        skills: ["Selenium", "Java", "API Testing", "Postman"],
        posted: "6 Days Ago",
      },
    ],
  },
];

// ✅ Static params for export
export async function generateStaticParams() {
  return allCompanies.map((company) => ({
    id: company.id.toString(),
  }));
}

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const companyId = Number(params.id);
  const company = allCompanies.find((c) => c.id === companyId);

  if (!company) {
    return <div className="p-6">Company not found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="px-4 sm:px-6 md:px-10 py-6 w-full max-w-7xl mx-auto">
        {/* Company Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-6 w-full">
          <Image
            src={company.logo}
            alt={company.name}
            width={100}
            height={100}
            className="rounded-md bg-gray-100 p-2 object-contain w-20 h-20 sm:w-24 sm:h-24"
          />
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
            <p className="text-gray-600 text-sm sm:text-base">{company.industry}</p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <button className="text-sm text-blue-600 hover:underline whitespace-nowrap">
              Your company? Claim now
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 whitespace-nowrap">
              + Follow
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b mt-4 overflow-x-auto">
          <button className="py-3 px-2 text-gray-600 hover:text-black border-b-2 border-transparent hover:border-gray-300 flex-shrink-0">
            Overview
          </button>
          <button className="py-3 px-2 text-black font-semibold border-b-2 border-black flex-shrink-0">
            Jobs
          </button>
        </div>

        {/* Jobs + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* LEFT: Job Listings */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              {company.jobs.length} Job openings at {company.name}
            </h2>

            {company.jobs.map((job, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-base">{job.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                  {job.duration && <span>📅 {job.duration}</span>}
                  {job.experience && <span>👨‍💻 {job.experience}</span>}
                  <span>💰 {job.salary}</span>
                  <span>📍 {job.location}</span>
                </div>

                {job.type && (
                  <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-600 font-medium">
                    {job.type}
                  </span>
                )}
                {job.start && (
                  <p className="text-xs text-gray-500 mt-1">{job.start}</p>
                )}

                {job.description && (
                  <p className="text-sm text-gray-700 mt-3">{job.description}</p>
                )}

                {job.skills && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-gray-100 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-2">{job.posted}</div>
              </div>
            ))}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Register Box */}
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800">
                Love jobs by {company.name}?
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Register with us and let company recruiters find you
              </p>
              <button className="mt-3 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
                Register Now
              </button>
            </div>

            {/* Reviews Box */}
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">
                Reviews by Job Profile
              </h3>
              <p className="text-sm text-gray-700">
                ⭐ 4.1 <span className="ml-2">Software Engineer (8)</span>
              </p>
              <button className="mt-3 text-blue-600 text-sm hover:underline">
                Write a review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

