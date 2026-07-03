'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfilePDFTemplate from "@/components/ProfilePDFTemplate";
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Edit,
  Download,
  Eye,
  Star,
  Building2,
  Clock,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import DownloadProfilePDF from '@/components/DownloadProfilePDF';
export default function ProfileReview() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [isPDF, setIsPDF] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  interface JobCategory {
  id: number | string;
  name: string;
}
interface JobTitle {
  id: number | string;
  title: string;
}
interface ProfileExperience {
  id: string | number;
  company: string;
  position: string;
  category: string;
  duration: string;
  location: string;
  description: string;
}

interface Education {
  id: string | number;
  education: string;
  course: string;
  course_name?: string;
  education_name?: string;
  // optional fields used during data mapping
  course_id?: string | number;
  institution: string;
  start_year: string | number;
  end_year: string | number;
  percentage: string;
  score_type?: string;
  course_type?: string;
  courseType?: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string | number;
}

interface ProfileData {
  id?: string | number;
  personalInfo: {
    profile_image?: string | null;
    fullName: string;
    email: string;
    phone: string;
    phoneCode?: string;
    location: string;
    experience: string;
    currentSalary: string;
    currentCurrency: string;
    currentCurrencySymbol?: string;
    expectedCurrency: string;
    expectedCurrencySymbol?: string;
    expectedSalary: string;
    noticePeriod: string;
    professional_summary: string;
  };
  experience: ProfileExperience[];
  education: Education[];
  certifications: Certification[];
  skills: string[];
  resume: string;
}
interface Certification {
  id: string | number; 
  name: string;
  issuer: string;
  year: string | number;
}

const formatNumber = (
  value: any,
  currency?: string,
  symbol?: string
) => {
  if (!value) return "-";

  const curr = currency?.toUpperCase();

  const locale = curr === "INR" ? "en-IN" : "en-US";

  const formatted = new Intl.NumberFormat(locale).format(Number(value));

  return symbol ? `${symbol} ${formatted}` : formatted;
};

    useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_title/`)
        .then((res) => res.json())
        .then((data) => {
          setJobTitles(data);
        })
        .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_category/`)
        .then((res) => res.json())
        .then((data) => {
          setJobCategories(data);
        })
        .catch((err) => console.error(err));
    }, []);


  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_APP}/profile/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      });




      if (res.ok) {
        const data = await res.json();
        console.log("Profile Data: before", data);



        setProfileData({
          id: data.id,
          personalInfo: {
            profile_image: data.profile_image || null,
            fullName: data.full_name,
            email: data.email,
            phone: data.phone,
            phoneCode: data.phone_code || data.phoneCode || "",
            location: `${data.city?.name || ""}, ${data.state?.name || ""}`,
            experience: data.experience,
            currentSalary: data.current_salary,
            currentCurrency: data?.current_currency?.code ?? "",
            currentCurrencySymbol: data?.current_currency?.symbol_native ?? "",
            expectedCurrency: data?.expected_currency?.code ?? "",
            expectedCurrencySymbol: data?.expected_currency?.symbol_native ?? "",
            expectedSalary: data.expected_salary,
            noticePeriod: data.notice_period,
            professional_summary: data.professional_summary,
          },
          experience: data.experiences.map((exp: any) => ({
            id: exp.id,
            company: exp.company,
            position: exp.job_title|| "N/A",
            category: exp.category|| "N/A",
            duration: `${exp.start_date} - ${exp.end_date || "Present"}`,
            location: exp.location || "N/A",
            description: exp.description,
          })),
          education: data.educations.map((e: any) => ({
            id: e.id,
            education: e.education,
            course: e.course || "",
            institution: e.institution,
            start_year: e.start_year,
            end_year: e.end_year,
            percentage: e.percentage,
            score_type: e.score_type?.toLowerCase() || "cgpa",
            course_type: e.course_type,
            education_name: e.education_detail?.name || "N/A",
            course_name: e.course_detail?.name || "N/A",
          })),
          certifications: data.certifications.map((cert: any) => ({
            name : cert.name,
            issuer : cert.issuer,
            year : cert.year
          })),
          skills: data.skills.map((s: any) => s.name),
          resume: data.resume || "",
        });
        console.log("Profile Data: after mapping", profileData);
      } else {
        console.error("Failed to fetch profile");
      }
    };

    loadProfile();
  }, []);

  const downloadResume = async () => {
    const profileId = profileData?.id;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_APP}/download-resume/${profileId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: JSON.stringify({
          id: profileId,
        }),
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }
  // console.log("Profile Data: after", profileData);
  // Sample profile data - in a real app, this would come from an API or state management


  // Calculate profile completion percentage
  // const calculateCompletionPercentage = () => {
  //   let completed = 0;
  //   let total = 8;

  //   if (profileData.personalInfo.fullName) completed++;
  //   if (profileData.personalInfo.email) completed++;
  //   if (profileData.personalInfo.phone) completed++;
  //   if (profileData.personalInfo.location) completed++;
  //   // if (profileData.summary) completed++;
  //   if (profileData.experience.length > 0) completed++;
  //   if (profileData.education.length > 0) completed++;
  //   if (profileData.skills.length > 0) completed++;

  //   return Math.round((completed / total) * 100);
  // };

  // const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Edit
                </Button>
              </Link>
            </div>
           <div className="flex justify-end">
           {/* <Button
            onClick={downloadResume}
            className="w-full sm:w-auto min-w-[180px] bg-white text-black border border-gray-300 hover:bg-gray-100 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </Button> */}
          {/* forntend pdf */}
          </div>
          </div>
        </div>

        <div>
          <div  className="space-y-6 bg-white px-6 pb-6 pt-10" >
            <div className="relative">
              {isDownloading && (
                <div className="absolute inset-0 z-50 bg-white/90 p-6 rounded-lg">
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white shadow-lg rounded-xl px-6 py-4">
                      <p className="font-medium text-gray-700">
                        Preparing PDF...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            <div
              id="profile-review-ui"
              className={isPDF ? 'pdf-mode pt-8' : ''}
            >
                {isPDF ? (
    <ProfilePDFTemplate
      profileData={profileData}
    />
  ) : (
    <>
      <div id="pdf-page-1">
        {/* COMPLETE REVIEW UI */}
          {/* Personal Information */}
          <Card className="pdf-section">
            <CardHeader
              className={isPDF ? "pb-6 mb-4" : "pb-4"}
            >
                        <CardTitle className="flex items-center gap-2 mb-4">
              {isPDF ? (
                <span>👤</span>
              ) : (
                <User className="w-5 h-5 text-purple-600 space-x-2" />
              )}
              <span>Personal Information</span>
            </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="profile-image-box w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center overflow-hidden">

                   {profileData.personalInfo.profile_image ? (
                    <img
                        src={`/api/image-proxy?url=${encodeURIComponent(
                        profileData.personalInfo.profile_image
                      )}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />

                   ) : (
                   <User className="w-12 h-12 lg:w-16 lg:h-16 text-purple-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {profileData.personalInfo.fullName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm lg:text-base">
                    <div className="flex items-center space-x-2 text-gray-600">
                         {isPDF ? '✉️' : <Mail className="w-4 h-4" />}
                      <span>{profileData.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      {isPDF ? ' ' : <Phone className="w-4 h-4" />}
                      <span>
                        {[
                           profileData.personalInfo.phoneCode
                            ? `+${profileData.personalInfo.phoneCode}`
                            : null,
                          profileData.personalInfo.phone,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                       </span>

                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      {isPDF ? '📍' : <MapPin className="w-4 h-4" />}
                      <span>{profileData.personalInfo.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 capitalize">
                      {isPDF ? '💼' : <Briefcase className="w-4 h-4" />}
                      <span>Experience: {profileData.personalInfo.experience}</span>
                    </div>
                    <div className="flex flex-col text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span>Current:</span>
                        {isPDF ? (
                          <span>{profileData.personalInfo.currentCurrencySymbol}</span>
                        ) : (
                          <span className="text-sm font-medium">
                            {profileData.personalInfo.currentCurrencySymbol}
                          </span>
                        )}

                        <span>
                          {formatNumber(
                            profileData.personalInfo.currentSalary,
                            profileData.personalInfo.currentCurrency,
                          )} / yr
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col text-gray-600 ">

                      <div className="flex items-center space-x-2">
                        <span>Expected:</span>
                        {isPDF ? (
                          <span>{profileData.personalInfo.expectedCurrencySymbol}</span>
                        ) : (
                          <span className="text-sm font-medium">
                            {profileData.personalInfo.expectedCurrencySymbol}
                          </span>
                        )}

                        <span>
                          {formatNumber(
                            profileData.personalInfo.expectedSalary,
                            profileData.personalInfo.expectedCurrency,
                          )} / yr
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 whitespace-nowrap">
                      {isPDF ? (
                        <span className="inline-flex items-center justify-center w-4 h-4 text-[12px]">
                          🕒
                        </span>
                      ) : (
                        <Clock className="w-4 h-4 flex-shrink-0" />
                      )}

                      <span className="whitespace-nowrap">
                        Notice Period: {profileData.personalInfo.noticePeriod}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="pdf-section">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5 text-purple-600" />
                <span>Professional Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                {profileData.summary}
              </p>
            </CardContent>
          </Card> */}

          {/* Work Experience */}
          <Card className="pdf-section">
            <CardHeader className={isPDF ? "pb-6 mb-4" : "pb-4"}>
              <CardTitle className="flex items-center gap-2 mb-4">
                {isPDF ? '💼' : <Briefcase className="w-4 h-4 text-purple-600" />}
                <span>Work Experience</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div  className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={exp.id} className="relative  pdf-section">
                    {index !== profileData.experience.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900">{exp.position}</h3>
                        <p className="text-purple-600 font-medium">{exp.company}</p>
                        <h2 className='text-gray-400 font-semibold'>{exp.category}</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                          <div className="flex items-center">
                            {isPDF ? '🕒' : <Clock className="w-4 h-4" />}
                            <span>&nbsp;{exp.duration}</span>
                          </div>
                          <div className="flex items-center">
                            {isPDF ? '📍' : <MapPin className="w-4 h-4" />}
                            <span>&nbsp;{exp.location}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2 leading-relaxed text-sm lg:text-base">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="pdf-section">
            <CardHeader className={isPDF ? "pb-6 mb-4" : "pb-4"}>
              <CardTitle className="flex items-center gap-2 mb-4">
                {isPDF ? '🎓' : <GraduationCap className="w-5 h-5 text-purple-600" />}
                <span>Education</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profileData.education.map((edu, index) => (
                  <div key={edu.id} className="relative">
                    {index !== profileData.education.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900">{edu.education_name}</h3>
                        <p className="text-green-600 font-medium">{edu.course_name}</p>
                        <p className="text-gray-600">University:{edu.institution}</p>
                        <p className="text-gray-600">Course Type:{edu.course_type}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                          <div className="flex items-center gap-2">
                            {isPDF ? '📅' : <Calendar className="w-4 h-4 mr-1" />}
                            <span>Year: {edu.start_year}-{edu.end_year}</span>
                          </div>
                          <div className="flex items-center">
                            {isPDF ? '🎖  ' : <Award className="w-5 h-5 text-purple-600" />}
                            <span>Score: {edu.percentage}
                              {edu.score_type === "percentage"
                                    ? "(Percentage)"
                                    : edu.score_type === "cgpa"
                                    ? "(CGPA)"
                                    : edu.score_type === "grade"
                                    ? "(Grade)"
                                    : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="pdf-section">
            <CardHeader className={isPDF ? "pb-6 mb-4" : "pb-4"}>
              <CardTitle className="flex items-center gap-2 mb-4">
                {isPDF ? '🎖  ' : <Award className="w-5 h-5 text-purple-600" />}
                <span>Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>


          {/* Certifications */}
          <Card className="pdf-section">
            <CardHeader className={isPDF ? "pb-6 mb-4" : "pb-4"}>
              <CardTitle className="flex items-center gap-2 mb-4">
                {isPDF ? '🎖  ' : <Award className="w-5 h-5 text-purple-600" />}
                <span>Certifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900">{cert.name}</h3>
                      <p className="text-yellow-600 font-medium">{cert.issuer}</p>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        {isPDF ? '📅' : <Calendar className="w-4 h-4 mr-1" />}
                        <span>Issued: {cert.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          </div>
           </>
  )}
          </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link href="/profile" className="flex-1">
              <Button variant="outline" className="w-full h-12">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            {profileData?.resume && (
              <Link href={profileData.resume} target="_blank">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12">
                  Preview Resume
                </Button>
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}