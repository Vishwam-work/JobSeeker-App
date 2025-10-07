'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function ProfileReview() {
  const [profileData, setProfileData] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);

    const getCategoryName = (id) =>
    jobCategories.find((c) => c.id === id)?.name || "";

    const getJobTitleName = (id) =>
    jobTitles.find((t) => t.id === id)?.title || "";
  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("http://127.0.0.1:8010/api/profile/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Profile Data:", data);
        setProfileData({
          personalInfo: {
            fullName: data.full_name,
            email: data.email,
            phone: data.phone,
            location: `${data.city?.name || ""}, ${data.state?.name || ""}`,
            experience: data.experience,
            currentSalary: data.current_salary,
            expectedSalary: data.expected_salary,
            noticePeriod: data.notice_period,
          },
          experience: data.experiences.map((exp) => ({
            id: exp.id,
            company: exp.company,
            position: exp.job_title?.title || "N/A",
            duration: `${exp.start_date} - ${exp.end_date || "Present"}`,
            location: exp.location?.name || "N/A",
            category: exp.category?.name || "N/A",
            description: exp.description,
          })),
          education: data.educations.map((edu) => ({
            id: edu.id,
            degree: edu.degree,
            field: edu.field_of_study,
            institution: edu.institution,
            year: edu.year,
            percentage: edu.percentage,
          })),
          certifications: data.certifications.map((cert) => ({
            name : cert.name,
            issuer : cert.issuer,
            year : cert.year
          })),
          skills: data.skills.map((s) => s.name),
        });
      } else {
        console.error("Failed to fetch profile");
      }
    };

    loadProfile();
  }, []);

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }
  console.log("Profile Data:", profileData);
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
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 lg:w-16 lg:h-16 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {profileData.personalInfo.fullName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm lg:text-base">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{profileData.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{profileData.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.personalInfo.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{profileData.personalInfo.experience} Experience</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Current: {profileData.personalInfo.currentSalary}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Expected: {profileData.personalInfo.expectedSalary}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Notice Period: {profileData.personalInfo.noticePeriod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
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
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span>Work Experience</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={exp.id} className="relative">
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
                        <h2 className='text-gray-400 font-semibold'>{exp.category.name}</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{exp.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{exp.location}</span>
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
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
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
                        <h3 className="font-semibold text-lg text-gray-900">{edu.degree}</h3>
                        <p className="text-green-600 font-medium">{edu.field}</p>
                        <p className="text-gray-600">{edu.institution}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Graduated: {edu.year}</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="w-4 h-4 mr-1" />
                            <span>Score: {edu.percentage}</span>
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
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
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
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>Certifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900">{cert.name}</h3>
                      <p className="text-yellow-600 font-medium">{cert.issuer}</p>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Issued: {cert.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link href="/profile" className="flex-1">
              <Button variant="outline" className="w-full h-12">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12">
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}