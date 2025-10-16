import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  companyName: string;
  jobTitle: string;
}

export function EmailTemplate({ firstName, companyName, jobTitle }: EmailTemplateProps) {
  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md font-sans">
      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome, {firstName}!
        </h1>
        <p className="text-gray-600 mb-4">
          Thank you for applying for the <strong>{jobTitle}</strong> position at <strong>{companyName}</strong>! We are excited to review your application and explore how your skills and experience align with our company’s mission.
        </p>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Next Steps</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Your application has been received and is under review by our hiring team.</li>
            <li>We will reach out within the next 5-7 business days to discuss potential next steps.</li>
            <li>Feel free to contact us at <a href="mailto:careers@company.com" className="text-blue-600 hover:underline">careers@company.com</a> with any questions.</li>
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">About {companyName}</h2>
          <p className="text-gray-600">
            At {companyName}, we are committed to innovation, collaboration, and excellence. We look forward to potentially welcoming you to our team to help shape the future of our industry.
          </p>
        </div>
        <div className="text-center">
          <a
            href="https://www.company.com"
            className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Learn More About {companyName}
          </a>
        </div>
        <div className="mt-6 text-gray-500 text-sm text-center">
          <p>Best regards,</p>
          <p>The {companyName} Hiring Team</p>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs mt-4">
        <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
      </div>
    </div>
  );
}



// import * as React from 'react';

// interface EmailTemplateProps {
//   firstName: string;
// }

// export function EmailTemplate({ firstName }: EmailTemplateProps) {
//   return (
//     <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md font-sans">
//       <div className="bg-white p-8 rounded-lg border border-gray-200">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {firstName}!</h1>
//         <p className="text-gray-600 mb-4">
//           Thank you for applying to join our team! We are excited to review your application and explore how your skills and experience align with our company’s mission.
//         </p>
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-700 mb-2">Next Steps</h2>
//           <ul className="list-disc list-inside text-gray-600 space-y-2">
//             <li>Your application has been received and is under review by our hiring team.</li>
//             <li>We will reach out within the next 5-7 business days to discuss potential next steps.</li>
//             <li>Feel free to contact us at <a href="mailto:careers@company.com" className="text-blue-600 hover:underline">careers@company.com</a> with any questions.</li>
//           </ul>
//         </div>
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-700 mb-2">About Us</h2>
//           <p className="text-gray-600">
//             At [Company Name], we are committed to innovation, collaboration, and excellence. We look forward to potentially welcoming you to our team to help shape the future of our industry.
//           </p>
//         </div>
//         <div className="text-center">
//           <a
//             href="https://www.company.com"
//             className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
//           >
//             Learn More About Us
//           </a>
//         </div>
//         <div className="mt-6 text-gray-500 text-sm text-center">
//           <p>Best regards,</p>
//           <p>The [Company Name] Hiring Team</p>
//         </div>
//       </div>
//       <div className="text-center text-gray-400 text-xs mt-4">
//         <p>&copy; {new Date().getFullYear()} [Company Name]. All rights reserved.</p>
//       </div>
//     </div>
//   );
// }



