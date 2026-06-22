"use client";
interface ProfilePDFTemplateProps {
  profileData: any;
}

export default function ProfilePDFTemplate({
  profileData,
}: ProfilePDFTemplateProps) {
  return (
    <div
      className="bg-white text-gray-800 mx-auto"
      style={{
        width: "190mm",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div className="bg-slate-700 text-white h-[100px] flex items-center justify-center">
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
        <div
          className="bg-gray-200 p-2"
          style={{
            width: "32%",
            flexShrink: 0,
          }}
        >
          {/* Profile Image */}
          <div className="flex justify-center mb-10">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
              {profileData.personalInfo.profile_image ? (
                <img
                  src={`/api/image-proxy?url=${encodeURIComponent(
                    profileData.personalInfo.profile_image,
                  )}`}
                  crossOrigin="anonymous"
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
                <span className="break-all">
                  {profileData.personalInfo.email}
                </span>
              </div>

              <div className="flex gap-3">
                <span className="w-5 font-semibold">🏠︎</span>
                <span className="break-words">
                  {profileData.personalInfo.location}
                </span>
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

            <ul className="space-y-2 text-sm">
              {profileData.skills?.map((skill: string, index: number) => (
                <li key={index} className="break-words">
                  • {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          {profileData.certifications?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold uppercase border-b-2 border-gray-500 pb-2 mb-4">
                Certifications
              </h2>

              <div className="space-y-3">
                {profileData.certifications.map((cert: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-md break-words"
                    style={{
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                    }}
                  >
                    <p className="font-semibold text-sm">{cert.name}</p>

                    <p className="text-xs text-gray-600">{cert.issuer}</p>

                    <p className="text-xs text-gray-500">{cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          className="p-2"
          style={{
            width: "68%",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {/* Professional Summary */}
          {profileData.personalInfo.professional_summary && (
            <section
              // className="mb-4"
              style={{
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <h2 className="text-2xl font-bold uppercase border-b-2 border-slate-600 pb-2 mb-4">
                Professional Summary
              </h2>

              <div
                className="text-gray-700 leading-relaxed prose max-w-none
                      [&_ul]:list-disc [&_ul]:pl-6
                      [&_ol]:list-decimal [&_ol]:pl-6
                      [&_li]:mb-1"
                dangerouslySetInnerHTML={{
                  __html: profileData.personalInfo.professional_summary,
                }}
              />
            </section>
          )}

          {/* Experience */}
          {profileData.experience?.length > 0 && (
            <section
              style={{
                pageBreakBefore: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <h2 className="text-2xl font-bold uppercase border-b-2 border-slate-600 pb-2 mb-4">
                Experience
              </h2>

              <div className="">
                {profileData.experience.map((exp: any) => (
                  <div
                    key={exp.id}
                    style={{
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                    }}
                  >
                    <h3 className="font-bold text-lg text-slate-800 break-words">
                      {exp.company}
                    </h3>

                    <p className="text-sm text-gray-500">{exp.position}</p>

                    <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>

                    <p
                      className="text-sm leading-6 text-gray-700"
                      style={{
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          <section className="">
            <h2 className="text-2xl font-bold uppercase border-b-2 border-slate-600 pb-2 mb-4">
              Education
            </h2>

            <div className="">
              {profileData.education?.map((edu: any) => (
                <div
                  key={edu.id}
                  // className="mb-4"
                  style={{
                    pageBreakInside: "avoid",
                    breakInside: "avoid",
                  }}
                >
                  <h3 className="font-semibold text-lg break-words">
                    {edu.course_name}
                  </h3>

                  <p className="text-sm text-gray-600 break-words">
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
