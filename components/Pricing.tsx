"use client";

import { useState } from "react";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const pricing = {
    free: { monthly: 0, yearly: 0 },
    chatbots: { monthly: 39, yearly: 39 * 10 }, // 2 months free
    communicator: { monthly: 15, yearly: 15 * 10 },
  };

  return (
    <section className="bg-gray-50 py-20">
      {/* Billing Toggle */}
      <div className="flex flex-col items-center mb-14">
        <div className="flex rounded-full bg-white p-1 shadow-sm">
          {["monthly", "yearly"].map((type) => (
            <button
              key={type}
              onClick={() => setBilling(type as any)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition ${
                billing === type
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {type === "monthly" ? "Monthly" : "Annually"}
            </button>
          ))}
        </div>

        {billing === "yearly" && (
          <p className="mt-3 text-sm text-gray-600">
            Annually you get <span className="font-semibold">2 months free</span> 
          </p>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <PricingCard
          title="Free"
          price={pricing.free[billing]}
          buttonText="Use for free"
          features={[
            "100 unique reachable visitors",
            "Unlimited chats",
            "Desktop & mobile apps",
            "Visitors info",
            "3rd party integrations",
            "JavaScript API",
          ]}
        />

        <PricingCard
          title="Chatbots"
          price={pricing.chatbots[billing]}
          highlight
          buttonText="Start my free trial"
          features={[
            "All Free features",
            "Unlimited reachable visitors",
            "Unlimited active chatbots",
            "Chatbot templates",
            "Visual chatbot editor",
            "Zapier integration",
          ]}
        />

        <PricingCard
          title="Communicator"
          price={pricing.communicator[billing]}
          buttonText="Start my free trial"
          subText="Billed per operator"
          features={[
            "All Free features",
            "Live typing",
            "Viewed pages",
            "Live visitors list",
            "Permissions",
            "Notes",
            "1–40 operator seats available",
          ]}
        />
      </div>
    </section>
  );
}

function PricingCard({
  title,
  price,
  features,
  buttonText,
  subText,
  highlight = false,
}: {
  title: string;
  price: number;
  features: string[];
  buttonText: string;
  subText?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-8 shadow-md flex flex-col ${
        highlight ? "ring-2 ring-blue-600" : ""
      }`}
    >
      <h3 className="text-xl font-semibold text-center">{title}</h3>

      <div className="mt-6 text-center">
        <span className="text-5xl font-bold">${price}</span>
        <span className="text-gray-500 text-sm"> /mo</span>
      </div>

      {subText && (
        <p className="mt-2 text-center text-xs text-gray-500">{subText}</p>
      )}

      <button
        className={`mt-6 mb-8 rounded-lg py-3 text-sm font-medium transition ${
          highlight
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {buttonText}
      </button>

      <ul className="space-y-3 text-sm text-gray-600">
        {features.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-blue-600">✔</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
