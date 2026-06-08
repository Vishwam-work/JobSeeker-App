"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface ProfilePDFTemplateProps {
  profileData: any;
}

export default function ProfilePDFTemplate({
  profileData,
}: ProfilePDFTemplateProps) {
  return (
    <div
      className="w-full bg-white text-gray-800"
      style={{
        width: "210mm",
        // minHeight: "297mm",
        // overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="bg-slate-700 text-white px-10 py-8">
        {" "}
        <h1 className="text-4xl font-bold uppercase tracking-wide text-center">
          {" "}
          {profileData.personalInfo.fullName}{" "}
        </h1>{" "}
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-[32%] bg-gray-200 p-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
              {profileData.personalInfo.profile_image ? (
                <img
                  src={`/api/image-proxy?url=${encodeURIComponent(
                    profileData.personalInfo.profile_image,
                  )}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-5xl text-gray-500">👤</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h2 className="text-xl font-bold uppercase border-b-2 border-gray-500 pb-2 mb-4">
              Contact
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <span className="w-5 font-semibold">☎</span>
                <span>
                  +{profileData.personalInfo.phoneCode}{" "}
                  {profileData.personalInfo.phone}
                </span>
              </div>

              <div className="flex gap-3">
                <span className="w-5 font-semibold">✉</span>
                <span>{profileData.personalInfo.email}</span>
              </div>

              <div className="flex gap-3">
                <span className="w-5 font-semibold text-black">🏠︎</span>
                <span>{profileData.personalInfo.location}</span>
              </div>

              <div className="flex gap-3">
                <span className="w-5 font-semibold">◷</span>
                <span>{profileData.personalInfo.noticePeriod}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="text-xl font-bold uppercase border-b-2 border-gray-500 pb-2 mb-4">
              Skills
            </h2>

            <div>
              <ul className="space-y-2 text-sm">
                {profileData.skills?.map((skill: string, index: number) => (
                  <li key={index}>• {skill}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Certifications */}
          {profileData.certifications?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold uppercase border-b-2 border-gray-500 pb-2 mb-4">
                Certifications
              </h2>

              <div className="space-y-3">
                {profileData.certifications.map((cert: any, index: number) => (
                  <div key={index} className="bg-white p-3 rounded-md">
                    <p className="font-semibold text-sm break-words">
                      {cert.name}
                    </p>

                    <p className="text-xs text-gray-600">{cert.issuer}</p>

                    <p className="text-xs text-gray-500">{cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-[68%] p-8">
          {/* Professional Summary */}
          {profileData.personalInfo.professional_summary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold uppercase border-b-2 border-slate-600 pb-2 mb-4">
                Professional Summary
              </h2>

              <p
                 className="text-sm leading-7 text-gray-700 text-justify
                 [&_ul]:list-disc [&_ul]:pl-6
                 [&_ol]:list-decimal [&_ol]:pl-6
                 [&_li]:mb-1"
                 dangerouslySetInnerHTML={{
                  __html: profileData.personalInfo.professional_summary || "",
                 }}
              />

            </section>
          )}

          {/* Experience */}
          {profileData.experience?.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold uppercase border-b-2 border-slate-600 pb-2 mb-4">
                Experience
              </h2>

              <div className="space-y-6">
                {profileData.experience.map((exp: any) => (
                  <div key={exp.id}>
                    <h3 className="font-bold text-lg text-slate-800">
                      {exp.position}
                    </h3>

                    <p className="text-sm text-gray-500">{exp.company}</p>

                    <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>

                    <p className="text-sm leading-6 text-gray-700">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold uppercase border-b-2 border-slate-600 pb-2 mb-4">
              Education
            </h2>

            <div className="space-y-5">
              {profileData.education?.map((edu: any) => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-lg">{edu.course_name}</h3>

                  <p className="text-sm text-gray-600">{edu.institution}</p>

                  <p className="text-sm text-gray-600">
                    {edu.start_year} - {edu.end_year}
                  </p>

                  <p className="text-sm">
                    Score : {edu.percentage}{" "}
                    {edu.score_type === "cgpa"
                      ? "(CGPA)"
                      : edu.score_type === "percentage"
                        ? "(Percentage)"
                        : "(Grade)"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
