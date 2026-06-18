"use client";
interface ProfilePDFTemplateProps {
  profileData: any;
}

export default function ProfilePDFTemplate({
  profileData,
}: ProfilePDFTemplateProps) {
  const summaryText = profileData.personalInfo.professional_summary || "";

  const limitedSummary = summaryText.split(" ").slice(0, 150).join(" ");
  return (
    <div
      className="bg-white text-gray-800 mx-auto"
      style={{
        width: "190mm",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div className="bg-slate-700 text-white h-[110px] flex items-center justify-center">
        <h1
          className="font-bold uppercase text-center"
          style={{
            fontSize: "28px",
            letterSpacing: "1px",
            width: "100%",
          }}
        >
          {profileData.personalInfo.fullName}
        </h1>
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
        <div className="w-[68%] p-8 overflow-hidden">
          {/* Professional Summary */}
          {profileData.personalInfo.professional_summary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold uppercase border-b-2 border-slate-600 pb-2 mb-4">
                Professional Summary
              </h2>

              <div
                className="..."
                dangerouslySetInnerHTML={{
                  __html: limitedSummary,
                }}
              />
            </section>
          )}

          {/* Experience */}
          {profileData.experience?.length > 0 && (
            <section
              className="mb-8"
              style={{
                pageBreakInside: "auto",
              }}
            >
              <h2 className="text-2xl font-bold uppercase border-b-2 border-slate-600 pb-2 mb-4">
                Experience
              </h2>

              <div
                className="space-y-6"
                style={{
                  breakInside: "auto",
                }}
              >
                {profileData.experience.map((exp: any) => (
                  <div
                    key={exp.id}
                    style={{
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                    }}
                  >
                    <h3 className="font-bold text-lg text-slate-800">
                      {exp.company}
                    </h3>

                    <p className="text-sm text-gray-500">{exp.position}</p>

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

                  <p className="text-sm text-gray-600">
                    {edu.institution} ({edu.start_year}-{edu.end_year})
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
