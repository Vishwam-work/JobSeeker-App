"use client";

import { useState } from "react";
import Topics from "@/app/faq-support/topics/page";
import Form from "@/app/faq-support/form/page";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SecurityAdvice() {
  const faqData = [
  {
    question: "How do I keep my account secure?",
    answer: "Use a strong password and never share login credentials.",
  },
  {
    question: "How do I avoid fake job postings?",
    answer: "Verify recruiter details and avoid sharing sensitive information.",
  },
  {
    question: "What should I do if I see suspicious activity?",
    answer: "Report suspicious messages or recruiters immediately.",
  },
  {
    question: "Should I share OTP or passwords?",
    answer: "Never share OTPs, passwords, or payment details with anyone.",
  },
];
  const [selectedFAQ, setSelectedFAQ] = useState(faqData[0]);

  return (
    <div>
      <Header />
      <Topics />

      <div className="bg-[#f5f5f5] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[350px_1fr] gap-8 bg-white p-6 rounded-md shadow-sm">
            <div className="border-r border-gray-200 pr-4">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Security Advice FAQ
              </h2>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {faqData.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFAQ(faq)}
                    className={`w-full text-left p-4 rounded-md border transition-all duration-200 ${
                      selectedFAQ.question === faq.question
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>

            <div className="pl-2">
              <h1 className="text-4xl font-semibold text-blue-700 mb-6">
                {selectedFAQ.question}
              </h1>

              <div className="text-gray-700 leading-8 text-lg bg-gray-50 rounded-md p-6 border border-gray-200">
                <p>{selectedFAQ.answer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Form />
      <Footer />
    </div>
  );
}