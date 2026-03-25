"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import AsyncSelect from "react-select/async";

export default function PostJobPage() {
  const [jobForm, setJobForm] = useState<JobForm>({
    title: "",
    category: "",
    jobTitle: "",
    company: "",
    location: "",
    experience: "",
    salary: "",
    currency: "",
    job_type: "",
    workMode: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: [],
    applicationDeadline: "",
    vacancies: "",
    isUrgent: false,
    isRemote: false,
    questions: [],
  });
  const [CompanyName, setCompanyName] = useState("");
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [askQuestionEnabled, setAskQuestionEnabled] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchJobTitle, setSearchJobTitle] = useState("");
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [currency, setCurrency] = useState<Currency[]>([]);

  interface JobForm {
    title: string;
    category: string;
    jobTitle: string;
    company: string;
    location: string;
    experience: string;
    salary: string;
    currency: string;
    job_type: string;
    workMode: string;
    description: string;
    requirements: string;
    benefits: string;
    skills: string[];
    applicationDeadline: string;
    vacancies: string;
    isUrgent: boolean;
    isRemote: boolean;
    questions: string[];
  }

  interface PostedJob {
    id: number;
    title: string;
    job_title: number;
    company: string;
    location_id: number;
    experience: string;
    salary: string;
    job_type: string;
    work_mode: string;
    vacancies: number;
    application_deadline: string;
    description: string;
    requirements: string;
    benefits: string;
    skills: string[];
    is_urgent: boolean;
    is_remote: boolean;
    status: string;
    location?: {
      id?: number;
      name: string;
    };
    created_at?: string;
    applicants?: number;
    apply_clicks?: number;
    questions?: string[];
  }
  interface JobCategory {
    id: number;
    title: string;
  }
  interface JobTitle {
    id: number;
    title: string;
  }
  interface City {
    id: number;
    name: string;
  }
  interface Currency {
    id: number;
    symbol: string;
  }
  interface DecodedToken {
    user_id: number | string;
    exp?: number;
    iat?: number;
  }
  const fetchPostedJobs = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/job-list-view/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        console.error("Failed to fetch jobs");
        return;
      }
      const data = await response.json();
      // console.log("Here is the Job-list-view-data:",data)
      // console.log(data.category)
      setPostedJobs(data); // Set jobs into stateq
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  const handleSubmitJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("You must be logged in to post a job.", {
          description: "Please log in to continue.",
        });
        return;
      }
      const payload = {
        title: jobForm.title,
        category_id: parseInt(jobForm.category),
        job_title: parseInt(jobForm.jobTitle),
        company: CompanyName,
        location_id: parseInt(jobForm.location),
        currency_id: parseInt(jobForm.currency),
        experience: jobForm.experience,
        salary: jobForm.salary,
        job_type: jobForm.job_type,
        work_mode: jobForm.workMode,
        vacancies: parseInt(jobForm.vacancies) || 1, // Ensure integer
        application_deadline: jobForm.applicationDeadline,
        description: jobForm.description,
        requirements: jobForm.requirements,
        benefits: jobForm.benefits,
        skills: jobForm.skills,
        is_urgent: jobForm.isUrgent,
        is_remote: jobForm.isRemote,
        status: "active",
        questions: Array.isArray(jobForm.questions) ? jobForm.questions : [],
      };
      // console.log("Payload:", payload);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/job-postings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error posting job:", errorData);
        toast.error("Failed to post job", {
          description: errorData.detail || "Unknown error. Please try again.",
        });

        return;
      }

      const data = await response.json();
      // console.log("Job posted successfully:", data);
      setPostedJobs((prev) => [...prev, data]);
      toast.success("Job posted successfully!");
      await fetchPostedJobs();

      // Reset form
      setJobForm({
        title: "",
        category: "",
        jobTitle: "",
        company: "",
        location: "",
        experience: "",
        salary: "",
        currency: "",
        job_type: "",
        workMode: "",
        description: "",
        requirements: "",
        benefits: "",
        skills: [],
        applicationDeadline: "",
        vacancies: "",
        isUrgent: false,
        isRemote: false,
        questions: [],
      });
      setSelectedCategory("");
      setQuestions([]);
      setAskQuestionEnabled(false); // uncheck the checkbox
      setNewSkill("");
      setNewQuestion("");
    } catch (error) {
      console.error("Error submitting job:", error);
      toast.error("An error occurred while posting the job.", {
        description: "Please try again or check your internet connection.",
      });
    }
  };
  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const decoded = jwtDecode<DecodedToken>(token);
        console.log("DECODED:", decoded);
        console.log("Employer ID:", decoded.user_id);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/companies/${decoded.user_id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) {
          console.error("FETCH FAILED:", res.status);
          return;
        }

        const data = await res.json();
        // console.log("Applications:", data);
        setCompanyName(data.company_name);
        // console.log(data.company_name)
      } catch (err) {
        console.error("Error:", err);
      }
    };

    run();
  }, []);
  //   const getSelectedLocation = () => {
  //   if (!experienceForm.location) return null;

  //   return {
  //     label: experienceForm.location,
  //     value: experienceForm.location,
  //   };
  // }
  const getJobCategoryOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_category?q=${inputValue || ""}`,
      );

      const data = await res.json();

      return data.map((category: any) => ({
        label: category.name,
        value: category.name,
      }));
    } catch (error) {
      console.error("Error fetching job categories:", error);
      return [];
    }
  };
  const getSelectedJobCategory = () => {
    if (!jobForm.category) return null;

    return {
      label: jobForm.category,
      value: jobForm.category,
    };
  };

  const getJobTitlesOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_title/?q=${inputValue || ""}`,
      );

      const data = await res.json();

      return data.map((title: any) => ({
        label: title.title,
        value: title.title,
      }));
    } catch (error) {
      console.error("Error fetching job titles:", error);
      return [];
    }
  };
  const getSelectedJobTitle = () => {
    if (!jobForm.jobTitle) return null;

    return {
      label: jobForm.jobTitle,
      value: jobForm.jobTitle,
    };
  };
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
  );
  const formatNumber = (value: string | number): string => {
    if (!value) return "";
    return new Intl.NumberFormat("en-IN").format(Number(value));
  };

  const parseNumber = (value: string): string => {
    return value.replace(/,/g, "");
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !jobForm.skills.includes(newSkill.trim())) {
      setJobForm((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setJobForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() && !jobForm.questions.includes(newQuestion.trim())) {
      const updated = [...jobForm.questions, newQuestion.trim()];
      setJobForm((prev) => ({ ...prev, questions: updated }));
      setQuestions(updated); // ✅ keep them in sync
      setNewQuestion("");
    }
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    const updated = jobForm.questions.filter(
      (_, index) => index !== indexToRemove,
    );
    setJobForm((prev) => ({ ...prev, questions: updated }));
    setQuestions(updated);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Post a New Job</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitJob} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Job Title *
              </Label>
              <Input
                id="title"
                value={jobForm.title}
                onChange={(e) =>
                  setJobForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="e.g., Senior Software Developer"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Job Category *</Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                placeholder="e.g., Accounting"
                className="mt-1"
                loadOptions={getJobCategoryOptions}
                value={getSelectedJobCategory()}
                onChange={(selectedOption: any) => {
                  setSelectedCategory(String(selectedOption?.value || ""));
                  setJobForm((prev) => ({
                    ...prev,
                    category: String(selectedOption?.value || ""),
                    jobTitle: "",
                  }));
                }}
                isClearable
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Specific Job Title *
              </Label>

              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={getJobTitlesOptions}
                value={getSelectedJobTitle()}
                placeholder="Search job title..."
                className="mt-1"
                onChange={(selected: any) => {
                  setJobForm((prev) => ({
                    ...prev,
                    jobTitle: selected?.value?.toString() || "",
                  }));
                }}
                isClearable
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-sm font-medium">
                Company Name *
              </Label>
              <Input
                id="company"
                value={CompanyName}
                readOnly
                onChange={(e) =>
                  setJobForm((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                placeholder="Enter company name"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Job Location *</Label>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between mt-1 h-10 lg:h-11"
                  >
                    {selectedCity || "Select location"}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search location..."
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandList>
                      {filteredCities.length === 0 ? (
                        <CommandEmpty>No location found.</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {filteredCities
                            .filter((city) =>
                              city.name
                                .toLowerCase()
                                .startsWith(search.toLowerCase()),
                            )
                            .map((city) => (
                              <CommandItem
                                key={city.id}
                                onSelect={() => {
                                  setSelectedCity(city.name);

                                  setJobForm((prev: any) => ({
                                    ...prev,
                                    location: city.id.toString(),
                                  }));

                                  setSearch("");
                                  setOpen(false);
                                }}
                              >
                                {city.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Experience Required *
              </Label>
              <Select
                value={jobForm.experience}
                onValueChange={(value) =>
                  setJobForm((prev) => ({ ...prev, experience: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresher">Fresher</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary" className="text-sm font-medium">
                Salary Range (Annual)
              </Label>
              <div className="flex gap-2 mt-1">
                <Select
                  value={jobForm.currency || ""}
                  onValueChange={(value) =>
                    setJobForm((prev) => ({ ...prev, currency: value }))
                  }
                  required={true}
                >
                  <SelectTrigger className="w-20 h-10 lg:h-11">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currency.map((curr) => (
                      <SelectItem key={curr.id} value={curr.id.toString()}>
                        {curr.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  id="salary"
                  value={formatNumber(jobForm.salary)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const rawValue = parseNumber(e.target.value);

                    if (!isNaN(Number(rawValue))) {
                      setJobForm((prev) => ({
                        ...prev,
                        salary: rawValue,
                      }));
                    }
                  }}
                  placeholder="Enter Annual Salary"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Job Type *</Label>
              <Select
                value={jobForm.job_type}
                onValueChange={(value) =>
                  setJobForm((prev) => ({ ...prev, job_type: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Work Mode</Label>
              <Select
                value={jobForm.workMode}
                onValueChange={(value) =>
                  setJobForm((prev) => ({ ...prev, workMode: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Work from Office</SelectItem>
                  <SelectItem value="remote">Work from Home</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vacancies" className="text-sm font-medium">
                Number of Vacancies
              </Label>
              <Input
                id="vacancies"
                type="number"
                value={jobForm.vacancies}
                onChange={(e) =>
                  setJobForm((prev) => ({
                    ...prev,
                    vacancies: e.target.value,
                  }))
                }
                placeholder="e.g., 5"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="deadline" className="text-sm font-medium">
                Application Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={jobForm.applicationDeadline}
                onChange={(e) =>
                  setJobForm((prev) => ({
                    ...prev,
                    applicationDeadline: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Job Description *
            </Label>
            <Textarea
              id="description"
              value={jobForm.description}
              onChange={(e) =>
                setJobForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={6}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              className="mt-1"
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="requirements" className="text-sm font-medium">
              Requirements & Qualifications
            </Label>
            <Textarea
              id="requirements"
              value={jobForm.requirements}
              onChange={(e) =>
                setJobForm((prev) => ({
                  ...prev,
                  requirements: e.target.value,
                }))
              }
              rows={4}
              placeholder="List the required skills, qualifications, and experience..."
              className="mt-1"
            />
          </div>

          {/* Skills */}
          <div>
            <Label className="text-sm font-medium">Required Skills</Label>
            <div className="mt-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobForm.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <Label htmlFor="benefits" className="text-sm font-medium">
              Benefits & Perks
            </Label>
            <Textarea
              id="benefits"
              value={jobForm.benefits}
              onChange={(e) =>
                setJobForm((prev) => ({
                  ...prev,
                  benefits: e.target.value,
                }))
              }
              rows={3}
              placeholder="List the benefits, perks, and company culture highlights..."
              className="mt-1"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={jobForm.isUrgent}
                onCheckedChange={(checked) =>
                  setJobForm((prev) => ({
                    ...prev,
                    isUrgent: checked === true,
                  }))
                }
              />
              <Label htmlFor="urgent" className="text-sm">
                Mark as urgent hiring
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remote"
                checked={jobForm.isRemote}
                onCheckedChange={(checked) =>
                  setJobForm((prev) => ({
                    ...prev,
                    isRemote: checked === true,
                  }))
                }
              />
              <Label htmlFor="remote" className="text-sm">
                Remote work available
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ask-question"
                checked={askQuestionEnabled}
                onCheckedChange={(checked) => setAskQuestionEnabled(!!checked)}
              />
              <Label htmlFor="ask-question" className="text-sm">
                Ask Question
              </Label>
            </div>
          </div>
          {askQuestionEnabled && (
            <div className="mt-4 space-y-2 w-full sm:w-3/5 lg:w-2/5">
              <div className="flex gap-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter a question..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddQuestion}
                  variant="outline"
                >
                  Add Question
                </Button>
              </div>

              {/* Show added questions */}
              <div className="flex flex-wrap gap-2">
                {questions.map((q, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {q}
                    <button
                      type="button"
                      className="ml-2 text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveQuestion(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
