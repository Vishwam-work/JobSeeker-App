"use client";

import { useState } from "react";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);


  const pricing = {
    free: { monthly: 0, yearly: 0 },
    chatbots: { monthly: 39, yearly: 39 * 10 },
    communicator: { monthly: 15, yearly: 15 * 10 },
  };



  return (
    <section className="bg-gray-50 py-12">
      
<div className="w-full mb-6">
  <div className="relative">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by skill, keyword, company, designation..."
      className="w-full rounded-lg border border-gray-300 px-5 py-4 pl-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
      🔍
    </span>
  </div>
</div>
{/* Mobile Filters */}
<div className="lg:hidden mb-4">
  <button
    onClick={() => setShowFilters(true)}
    className="w-full border rounded-lg py-3 text-sm font-medium flex items-center justify-center gap-2"
  >
    ☰ Filters
  </button>
</div>
 {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="absolute left-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>

            
             <label className="flex items-center gap-2 font-medium mb-4">
    <input type="checkbox" />
    Hide Profiles
  </label>

  <hr className="mb-4" />

  {/* Filters Title */}
  <div className="flex items-center gap-2 font-semibold mb-4">
    <span className="material-icons text-gray-500">tune</span>
    Filters
    <span className="text-xs bg-orange-500 text-white px-2 rounded">New</span>
  </div>

  <hr className="mb-4" />

  {/* Premium */}
  <label className="flex items-center gap-2 mb-4">
    <input type="checkbox" />
    Premium Institute Candidates
  </label>

  <hr className="mb-4" />

  {/* Keywords */}
  <details className="mb-4">
    <summary className="cursor-pointer font-medium flex justify-between">
      Keywords <span>⌄</span>
    </summary>
  </details>

  <hr className="mb-4" />

  {/* Current Company */}
  <details className="mb-4">
    <summary className="cursor-pointer font-medium flex justify-between">
      Current company <span>⌄</span>
    </summary>
  </details>

  <hr className="mb-4" />

  {/* Location */}
  <details open className="mb-4">
    <summary className="cursor-pointer font-medium flex justify-between mb-2">
      Location <span>⌃</span>
    </summary>

    <input
      placeholder="Search location"
      className="w-full border rounded px-2 py-1 mb-3 text-sm"
    />

    {[
      ["Hyderabad", "1,153"],
      ["Bengaluru", "1,111"],
      ["Pune", "516"],
      ["Chennai", "234"],
    ].map(([city, count]) => (
      <label key={city} className="flex justify-between items-center mb-2">
        <span className="flex gap-2">
          <input type="checkbox" />
          {city}
        </span>
        <span className="text-gray-400">{count}</span>
      </label>
    ))}

    <button className="text-blue-600 text-xs mt-2">
      +16 more locations
    </button>
  </details>

  <hr className="mb-4" />

  {/* Experience */}
  <details open>
    <summary className="cursor-pointer font-medium flex justify-between mb-2">
      Experience (Years) <span>⌃</span>
    </summary>

    {/* Fake histogram bar */}
    <div className="h-8 bg-gray-100 rounded mb-3"></div>

    <div className="flex items-center gap-2">
      <select className="w-full border rounded px-2 py-1 text-sm">
        <option>Select</option>
        <option>0</option>
        <option>1</option>
        <option>2</option>
      </select>

      <span>to</span>

      <select className="w-full border rounded px-2 py-1 text-sm">
        <option>Select</option>
        <option>5</option>
        <option>10</option>
        <option>14+</option>
      </select>
    </div>
  </details>
  {/* Salary  */}
<details open className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-2">
    Salary (INR-Lacs) <span>⌃</span>
  </summary>

  {/* Histogram placeholder */}
  <div className="h-8 bg-gray-100 rounded mb-3"></div>

  <div className="flex items-center gap-2">
    <select className="w-full border rounded px-2 py-2 text-sm">
      <option>Select</option>
      <option>0</option>
      <option>5</option>
      <option>10</option>
      <option>15</option>
      <option>20</option>
      <option>30+</option>
    </select>

    <span>to</span>

    <select className="w-full border rounded px-2 py-2 text-sm">
      <option>Select</option>
      <option>10</option>
      <option>15</option>
      <option>20</option>
      <option>25</option>
      <option>30+</option>
    </select>
  </div>
</details>

<hr className="mb-4" />

{/* Current Designation*/}
<details className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-2">
    Current designation <span>⌄</span>
  </summary>

  <div className="relative">
    <input
      placeholder="Add designation"
      className="w-full border rounded px-3 py-2 text-sm"
    />
    <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
  </div>
</details>

<hr className="mb-4" />

{/* Department & Role */}
<details open className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-2">
    Department and Role <span>⌃</span>
  </summary>

  <div className="relative mb-3">
    <input
      placeholder="Search department/role"
      className="w-full border rounded px-3 py-2 text-sm"
    />
    <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
  </div>

  {[
    ["Engineering - Software & QA", "1,682"],
    ["Consulting", "1,133"],
    ["IT & Information Security", "300"],
    ["Project & Program Management", "75"],
  ].map(([name, count]) => (
    <label key={name} className="flex justify-between items-center mb-2">
      <span className="flex gap-2">
        <input type="checkbox" />
        {name}
      </span>
      <span className="text-gray-400">{count}</span>
    </label>
  ))}

  <button className="text-blue-600 text-xs mt-2">
    +1 more department
  </button>
</details>

<hr className="mb-4" />

{/*  Industry  */}
<details open>
  <summary className="cursor-pointer font-medium flex justify-between mb-2">
    Industry <span>⌃</span>
  </summary>

  <div className="relative mb-3">
    <input
      placeholder="Search industry"
      className="w-full border rounded px-3 py-2 text-sm"
    />
    <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
  </div>

  {[
    ["IT Services & Consulting", "2,839"],
    ["Software Product", "568"],
    ["Management Consulting", "373"],
    ["Emerging Technologies", "108"],
  ].map(([name, count]) => (
    <label key={name} className="flex justify-between items-center mb-2">
      <span className="flex gap-2">
        <input type="checkbox" />
        {name}
      </span>
      <span className="text-gray-400">{count}</span>
    </label>
  ))}
</details>
<hr className="my-4" />

{/* Notice Period*/}
<details open className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-2">
    Notice period <span>⌃</span>
  </summary>

  {[
    ["0 - 15 days", "921"],
    ["1 month", "951"],
    ["2 months", "699"],
    ["3 months", "1,106"],
    ["More than 3 months", "56"],
    ["Currently serving notice period", "160"],
  ].map(([label, count]) => (
    <label key={label} className="flex justify-between items-center mb-2">
      <span className="flex gap-2">
        <input type="checkbox" />
        {label}
      </span>
      <span className="text-gray-400">{count}</span>
    </label>
  ))}
</details>

<hr className="mb-4" />

{/* Gender*/}
<details open className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-3">
    Gender <span>⌃</span>
  </summary>

  <div className="flex gap-3">
    <button className="border rounded-full px-4 py-1 text-sm hover:bg-gray-50">
      Male candidates
    </button>
    <button className="border rounded-full px-4 py-1 text-sm hover:bg-gray-50">
      Female candidates
    </button>
  </div>
</details>

<hr className="mb-4" />

{/* Age  */}
<details open className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-3">
    Age <span>⌃</span>
  </summary>

  <div className="flex items-center gap-2">
    <input
      placeholder="Min age"
      className="w-full border rounded px-3 py-2 text-sm"
    />
    <span>to</span>
    <input
      placeholder="Max age"
      className="w-full border rounded px-3 py-2 text-sm"
    />
  </div>
</details>

<hr className="mb-4" />

{/*  Degree / Course */}
<details className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-3">
    Degree/Course <span>⌄</span>
  </summary>

  <div className="space-y-2 text-sm text-blue-600">
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> UG course
    </button>
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> PG course
    </button>
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> PPG course
    </button>
  </div>
</details>

<hr className="mb-4" />

{/* College Name  */}
<details className="mb-2">
  <summary className="cursor-pointer font-medium flex justify-between mb-3">
    College name <span>⌄</span>
  </summary>

  <div className="space-y-2 text-sm text-blue-600">
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> UG college
    </button>
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> PG college
    </button>
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> PPG college
    </button>
  </div>
</details>

          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl flex gap-6 px-4">

       
<aside className="hidden lg:block w-80 bg-white rounded-xl shadow-sm p-4 h-fit sticky top-6 text-sm">

  {/* Hide Profiles */}
  <label className="flex items-center gap-2 font-medium mb-4">
    <input type="checkbox" />
    Hide Profiles
  </label>

  <hr className="mb-4" />

  {/* Filters Title */}
  <div className="flex items-center gap-2 font-semibold mb-4">
    <span className="material-icons text-gray-500">tune</span>
    Filters
    <span className="text-xs bg-orange-500 text-white px-2 rounded">New</span>
  </div>

  <hr className="mb-4" />

  {/* Premium */}
  <label className="flex items-center gap-2 mb-4">
    <input type="checkbox" />
    Premium Institute Candidates
  </label>

  <hr className="mb-4" />

  {/* Keywords */}
  <details className="mb-4">
    <summary className="cursor-pointer font-medium flex justify-between">
      Keywords <span>⌄</span>
    </summary>
  </details>

  <hr className="mb-4" />

  {/* Current Company */}
  <details className="mb-4">
    <summary className="cursor-pointer font-medium flex justify-between">
      Current company <span>⌄</span>
    </summary>
  </details>

  <hr className="mb-4" />

  {/* Location */}
  <details open className="mb-4">
    <summary className="cursor-pointer font-medium flex justify-between mb-2">
      Location <span>⌃</span>
    </summary>

    <input
      placeholder="Search location"
      className="w-full border rounded px-2 py-1 mb-3 text-sm"
    />

    {[
      ["Hyderabad", "1,153"],
      ["Bengaluru", "1,111"],
      ["Pune", "516"],
      ["Chennai", "234"],
    ].map(([city, count]) => (
      <label key={city} className="flex justify-between items-center mb-2">
        <span className="flex gap-2">
          <input type="checkbox" />
          {city}
        </span>
        <span className="text-gray-400">{count}</span>
      </label>
    ))}

    <button className="text-blue-600 text-xs mt-2">
      +16 more locations
    </button>
  </details>

  <hr className="mb-4" />

  {/* Experience */}
  <details open>
    <summary className="cursor-pointer font-medium flex justify-between mb-2">
      Experience (Years) <span>⌃</span>
    </summary>

    {/* Fake histogram bar */}
    <div className="h-8 bg-gray-100 rounded mb-3"></div>

    <div className="flex items-center gap-2">
      <select className="w-full border rounded px-2 py-1 text-sm">
        <option>Select</option>
        <option>0</option>
        <option>1</option>
        <option>2</option>
      </select>

      <span>to</span>

      <select className="w-full border rounded px-2 py-1 text-sm">
        <option>Select</option>
        <option>5</option>
        <option>10</option>
        <option>14+</option>
      </select>
    </div>
  </details>

   <hr className="mb-4" />

  {/* Salary  */}
<details open className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-2">
    Salary (INR-Lacs) <span>⌃</span>
  </summary>

  {/* Histogram placeholder */}
  <div className="h-8 bg-gray-100 rounded mb-3"></div>

  <div className="flex items-center gap-2">
    <select className="w-full border rounded px-2 py-2 text-sm">
      <option>Select</option>
      <option>0</option>
      <option>5</option>
      <option>10</option>
      <option>15</option>
      <option>20</option>
      <option>30+</option>
    </select>

    <span>to</span>

    <select className="w-full border rounded px-2 py-2 text-sm">
      <option>Select</option>
      <option>10</option>
      <option>15</option>
      <option>20</option>
      <option>25</option>
      <option>30+</option>
    </select>
  </div>
</details>

<hr className="mb-4" />

{/* Current Designation*/}
<details className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-2">
    Current designation <span>⌄</span>
  </summary>

  <div className="relative">
    <input
      placeholder="Add designation"
      className="w-full border rounded px-3 py-2 text-sm"
    />
    <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
  </div>
</details>

<hr className="mb-4" />

{/* Department & Role */}
<details open className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-2">
    Department and Role <span>⌃</span>
  </summary>

  <div className="relative mb-3">
    <input
      placeholder="Search department/role"
      className="w-full border rounded px-3 py-2 text-sm"
    />
    <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
  </div>

  {[
    ["Engineering - Software & QA", "1,682"],
    ["Consulting", "1,133"],
    ["IT & Information Security", "300"],
    ["Project & Program Management", "75"],
  ].map(([name, count]) => (
    <label key={name} className="flex justify-between items-center mb-2">
      <span className="flex gap-2">
        <input type="checkbox" />
        {name}
      </span>
      <span className="text-gray-400">{count}</span>
    </label>
  ))}

  <button className="text-blue-600 text-xs mt-2">
    +1 more department
  </button>
</details>

<hr className="mb-4" />

{/*  Industry  */}
<details open>
  <summary className="cursor-pointer font-medium flex justify-between mb-2">
    Industry <span>⌃</span>
  </summary>

  <div className="relative mb-3">
    <input
      placeholder="Search industry"
      className="w-full border rounded px-3 py-2 text-sm"
    />
    <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
  </div>

  {[
    ["IT Services & Consulting", "2,839"],
    ["Software Product", "568"],
    ["Management Consulting", "373"],
    ["Emerging Technologies", "108"],
  ].map(([name, count]) => (
    <label key={name} className="flex justify-between items-center mb-2">
      <span className="flex gap-2">
        <input type="checkbox" />
        {name}
      </span>
      <span className="text-gray-400">{count}</span>
    </label>
  ))}
</details>
<hr className="my-4" />

{/* Notice Period*/}
<details open className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-2">
    Notice period <span>⌃</span>
  </summary>

  {[
    ["0 - 15 days", "921"],
    ["1 month", "951"],
    ["2 months", "699"],
    ["3 months", "1,106"],
    ["More than 3 months", "56"],
    ["Currently serving notice period", "160"],
  ].map(([label, count]) => (
    <label key={label} className="flex justify-between items-center mb-2">
      <span className="flex gap-2">
        <input type="checkbox" />
        {label}
      </span>
      <span className="text-gray-400">{count}</span>
    </label>
  ))}
</details>

<hr className="mb-4" />

{/* Gender*/}
<details open className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-3">
    Gender <span>⌃</span>
  </summary>

  <div className="flex gap-3">
    <button className="border rounded-full px-4 py-1 text-sm hover:bg-gray-50">
      Male candidates
    </button>
    <button className="border rounded-full px-4 py-1 text-sm hover:bg-gray-50">
      Female candidates
    </button>
  </div>
</details>

<hr className="mb-4" />

{/* Age  */}
<details open className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-3">
    Age <span>⌃</span>
  </summary>

  <div className="flex items-center gap-2">
    <input
      placeholder="Min age"
      className="w-full border rounded px-3 py-2 text-sm"
    />
    <span>to</span>
    <input
      placeholder="Max age"
      className="w-full border rounded px-3 py-2 text-sm"
    />
  </div>
</details>

<hr className="mb-4" />

{/*  Degree / Course */}
<details className="mb-4">
  <summary className="cursor-pointer font-medium flex justify-between mb-3">
    Degree/Course <span>⌄</span>
  </summary>

  <div className="space-y-2 text-sm text-blue-600">
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> UG course
    </button>
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> PG course
    </button>
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> PPG course
    </button>
  </div>
</details>

<hr className="mb-4" />

{/* College Name  */}
<details className="mb-2">
  <summary className="cursor-pointer font-medium flex justify-between mb-3">
    College name <span>⌄</span>
  </summary>

  <div className="space-y-2 text-sm text-blue-600">
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> UG college
    </button>
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> PG college
    </button>
    <button className="flex items-center gap-2">
      <span className="text-lg">+</span> PPG college
    </button>
  </div>
</details>

</aside>


        {/*  RIGHT CONTENT  */}
        <div className="flex-1">

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Free"
              price={pricing.free[billing]}
              buttonText="Use for free"
              features={["Unlimited chats", "Mobile & desktop"]}
            />

            <PricingCard
              title="Chatbots"
              price={pricing.chatbots[billing]}
              highlight
              buttonText="Start free trial"
              features={["Unlimited bots", "Templates", "Editor"]}
            />

            <PricingCard
              title="Communicator"
              price={pricing.communicator[billing]}
              buttonText="Start free trial"
              subText="Billed per operator"
              features={["Live visitors", "Notes", "Permissions"]}
            />
          </div>
        </div>
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
}: any) {
  return (
    <div
      className={`rounded-2xl bg-white p-8 shadow-md ${
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
        className={`mt-6 mb-8 w-full rounded-lg py-3 text-sm font-medium ${
          highlight
            ? "bg-blue-600 text-white"
            : "border border-gray-300"
        }`}
      >
        {buttonText}
      </button>

      <ul className="space-y-2 text-sm text-gray-600">
        {features.map((item: string, i: number) => (
          <li key={i}>✔ {item}</li>
        ))}
      </ul>
    </div>
  );
}
