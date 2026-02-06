"use client";

import { useState, useEffect,useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
// import Pricing from "@/components/Pricing";
import CandidatesPage from "@/app/employer/dashboard/candidate_listing/page";
import QuotaUsagePage from "@/app/employer/dashboard/quota-usage/page";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  Plus,
  Search,
  Calendar,
  Target,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  Filter,
  MoreVertical,
  Download,
  Mail,
  Phone,
  GraduationCap,
  Award,
  ExternalLink,
  Star,
  CheckCircle,
  XCircle,
  ChevronsUpDown,
  ChevronDown,
  Bell,
  UserCircle,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("post-job");
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCandidate, setSelectedCandidate] =useState<Candidate | null>(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [jobFilter, setJobFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [askQuestionEnabled, setAskQuestionEnabled] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  // The Dialog box
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<PostedJob | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [CompanyName, setCompanyName] = useState("");
  const [filter, setFilter] = useState("All");

  const [dateFilter, setDateFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [salaryFilter, setSalaryFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [jobTitleFilter, setJobTitleFilter] = useState("All");
  const [searchJobTitle, setSearchJobTitle] = useState("");
  const [openSchedule, setOpenSchedule] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewMode, setInterviewMode] = useState("Online");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmPm] = useState("AM");
  const interviewTime = `${hour}:${minute} ${ampm}`;
  const [timeZone, setTimeZone] = useState("IST");
  const [time, setTime] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);

  interface DecodedToken {
  user_id: number | string;
  exp?: number;
  iat?: number;
}
interface City {
  id: number;
  name: string;
}

interface ApplicationUpdateResponse {
  id: number;
  application_status: string;
  detail?: string;
}

interface JobCategory {
  id: number;
  name: string;
}

interface JobTitle {
  id: number;
  title: string;
}

interface Currency{
  id: number;
  symbol: string;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  currentRole: string;
  currentCompany: string;
  skills: string[];
  education: string;
  appliedFor: string;
  job_title?: string;
  appliedDate: string;
  status: string;
  expectedSalary?: string;
  resumeUrl?: string;
  profileImage?: string | null;
  summary?: string;
  workExperience: {
    company: string;
    role: string;
    duration: string;
    description?: string;
  }[];

  educationDetails: {
    degree: string;
    field: string;
    institution: string;
    year: string;
    grade?: string;
  }[];

  certifications: {
    name: string;
    issuer?: string;
    year?: string;
  }[];
  phoneCode?: string;
  qa?: CandidateQA[];
}

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
interface ApiCandidate {
  id: number;
  full_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  experience?: string;
  job_title?: string;
  application_status?: string;
  applied_at?: string;

  profile?: {
    full_name?: string;
    phone?: string;
    experience?: string;
    resume?: string;
    skills?: { name: string }[];
    educations?: any[];
    experiences?: any[];
    certifications?: any[];
  };

  answers?: {
    question_index: number;
    question_text: string;
    answer: string;
  }[];
}

interface CandidateQA {
  question_index?: number;
  question_text?: string;
  answer_text?: string;
}

const mapApiCandidateToUI = (item: ApiCandidate): Candidate => {
  const experiences = item.profile?.experiences ?? [];
  const educations = item.profile?.educations ?? [];

  return {
    id: item.id,
    name: item.profile?.full_name || item.full_name || "",
    email: item.email || "",
    phone: item.profile?.phone || "",
    location: item.city || "",
    experience: item.profile?.experience || item.experience || "",

    currentRole:
      experiences[0]?.designation ||
      item.job_title ||
      "",

    currentCompany:
      experiences[0]?.company || "",

    skills:
      item.profile?.skills?.map((s) => s.name) || [],

    education:
      educations[0]?.degree || "",

    appliedFor:
      item.job_title || "",

    job_title: item.job_title,

    appliedDate:
      item.applied_at || "",

    status:
      item.application_status || "Under Review",

    resumeUrl:
      item.profile?.resume,

    profileImage: null,
    summary: "",

    workExperience:
      experiences.map((ex: any) => ({
        company: ex.company || "",
        role: ex.designation || "",
        duration: `${String(ex.start_date ?? "")} - ${String(
          ex.end_date ?? "Present"
        )}`,
        description: ex.description,
      })),

    educationDetails:
      educations.map((e: any) => ({
        degree: e.degree || "",
        field: e.field || "",
        institution: e.institution || "",
        year: String(e.year ?? ""),
        grade: e.grade,
      })),

    certifications:
      item.profile?.certifications?.map((c: any) => ({
        name: c.name || "",
        issuer: c.issuer,
        year: c.year ? String(c.year) : undefined,
      })) || [],
  };
};

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



  // Sample data for posted jobs
  // const [postedJobs] = useState([
  //   {
  //     id: 1,
  //     title: "Senior Software Developer",
  //     company: "Tech Solutions Pvt Ltd",
  //     location: "Mumbai",
  //     experience: "3-5 years",
  //     salary: "8-12 PA",
  //     jobType: "Full Time",
  //     postedDate: "2024-01-15",
  //     applications: 45,
  //     status: "Active",
  //     views: 234,
  //   },
  //   {
  //     id: 2,
  //     title: "Frontend Developer",
  //     company: "Digital Innovations Inc",
  //     location: "Bangalore",
  //     experience: "2-4 years",
  //     salary: "6-10 PA",
  //     jobType: "Full Time",
  //     postedDate: "2024-01-10",
  //     applications: 32,
  //     status: "Active",
  //     views: 189,
  //   },
  //   {
  //     id: 3,
  //     title: "Product Manager",
  //     company: "StartupXYZ",
  //     location: "Delhi",
  //     experience: "5-8 years",
  //     salary: "15-20 PA",
  //     jobType: "Full Time",
  //     postedDate: "2024-01-08",
  //     applications: 28,
  //     status: "Closed",
  //     views: 156,
  //   },
  // ]);
const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);


  // Sample data for candidates
  const [candidates, setCandidates] =useState<Candidate[]>([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 9876543210",
      location: "Mumbai, Maharashtra",
      experience: "4 years",
      currentRole: "Senior Software Developer",
      currentCompany: "TCS",
      skills: ["React", "Node.js", "JavaScript", "Python", "AWS"],
      education: "B.Tech Computer Science",
      appliedFor: "Senior Software Developer",
      appliedDate: "2024-01-16",
      status: "Under Review",
      resumeUrl: "#",
      profileImage: null,
      summary:
        "Experienced software developer with 4+ years of expertise in full-stack development. Proven track record in React, Node.js, and cloud technologies.",
      workExperience: [
        {
          company: "TCS",
          role: "Senior Software Developer",
          duration: "Jan 2022 - Present",
          description:
            "Led development of multiple web applications using React and Node.js.",
        },
        {
          company: "Infosys",
          role: "Software Developer",
          duration: "Jun 2020 - Dec 2021",
          description: "Developed and maintained e-commerce platforms.",
        },
      ],
      educationDetails: [
        {
          degree: "B.Tech",
          field: "Computer Science",
          institution: "Mumbai University",
          year: "2020",
          grade: "8.5 CGPA",
        },
      ],
      certifications: [
        {
          name: "AWS Certified Developer",
          issuer: "Amazon Web Services",
          year: "2023",
        },
      ],
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "+91 9876543211",
      location: "Bangalore, Karnataka",
      experience: "3 years",
      currentRole: "Frontend Developer",
      currentCompany: "Wipro",
      skills: ["React", "Vue.js", "JavaScript", "CSS", "HTML"],
      education: "B.Tech Information Technology",
      appliedFor: "Frontend Developer",
      appliedDate: "2024-01-15",
      status: "Shortlisted",
      resumeUrl: "#",
      profileImage: null,
      summary:
        "Creative frontend developer with strong expertise in modern JavaScript frameworks and responsive design.",
      workExperience: [
        {
          company: "Wipro",
          role: "Frontend Developer",
          duration: "Mar 2021 - Present",
          description:
            "Developed responsive web applications using React and Vue.js.",
        },
      ],
      educationDetails: [
        {
          degree: "B.Tech",
          field: "Information Technology",
          institution: "VTU",
          year: "2021",
          grade: "8.2 CGPA",
        },
      ],
      certifications: [],
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit.kumar@email.com",
      phone: "+91 9876543212",
      location: "Delhi, India",
      experience: "6 years",
      currentRole: "Product Manager",
      currentCompany: "Amazon",
      skills: ["Product Management", "Analytics", "Strategy", "Leadership"],
      education: "MBA Marketing",
      appliedFor: "Product Manager",
      appliedDate: "2024-01-14",
      status: "Rejected",
      resumeUrl: "#",
      profileImage: null,
      summary:
        "Experienced product manager with 6+ years in leading cross-functional teams and driving product strategy.",
      workExperience: [
        {
          company: "Amazon",
          role: "Senior Product Manager",
          duration: "Jan 2020 - Present",
          description:
            "Led product development for e-commerce platform features.",
        },
      ],
      educationDetails: [
        {
          degree: "MBA",
          field: "Marketing",
          institution: "IIM Bangalore",
          year: "2018",
          grade: "8.8 CGPA",
        },
      ],
      certifications: [],
    },
  ]);

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

  const [newSkill, setNewSkill] = useState("");
  const [currency, setCurrency] = useState<Currency[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    console.log("LOG TOKEN:", token);
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const decoded = jwtDecode<DecodedToken>(token);
        console.log("DECODED:", decoded);
        console.log("Employer ID:", decoded.user_id);

        const res = await fetch(
          `https://jobseeker-backend-jy1y.onrender.com/employeer/api/companies/${decoded.user_id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error("FETCH FAILED:", res.status);
          return;
        }

        const data = await res.json();
        // console.log("Applications:", data);
        setCompanyName(data.company_name)
        // console.log(data.company_name)
      } catch (err) {
        console.error("Error:", err);
      }
    };

    run();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;
        const res = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/employeer/api/employer/applications/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          console.error("Failed to fetch employer applications");
          return;
        }
        const data = await res.json();
        console.log("Employer applications:", data);
        // Map API to UI candidate shape
        const mapped = (Array.isArray(data) ? data : []).map((app) => ({
          id: app.id,
          name: app.profile?.full_name || app.user_email || "Unknown",
          email: app.profile?.email || app.user_email,
          phone: app.profile?.phone || "Not provided",
          phoneCode: app.profile?.phone_code || "",

          location: [
            app.profile?.city,
            app.profile?.state,
            app.profile?.country,
          ]
            .filter(Boolean)
            .join(", "),
          experience: app.profile?.experience || "N/A",
          currentRole: "",
          currentCompany: "",
          skills: app.profile?.skills || [],
          education: "",
          appliedFor: app.job_title,
          appliedDate: app.applied_at,
          // status: app.application_status || "Under Review",
          status:
             app.application_status &&
             app.application_status !== "application_status"
             ? app.application_status
             : "Under Review",

          resumeUrl: app.profile?.resume
            ? `https://jobseeker-backend-jy1y.onrender.com${app.profile.resume}`
            : "#",
          profileImage: null,
          summary: "",
          workExperience: app.profile?.experiences || [],
          educationDetails: app.profile?.educations || [],
          certifications: app.profile?.certifications || [],
          qa: app.answers || [],
        }));
        setCandidates(mapped);
      } catch (e) {
        console.error("Failed to fetch employer applications", e);
      }
    };
    fetchApplications();
  }, []);

  const exportToExcel = async () => {
    const XLSX = await import("xlsx");

    const data = filteredCategories.map((c) => ({
      name: c.name || "",
      email: c.email || "",
      // phone: `+${c.phoneCode}${c.phone}` || "",
      phone: `+${c.phone || ""}`,
      appliedFor: c.appliedFor || c.job_title || "",
      status: c.status || "",
      experience: c.experience || "",
      location: c.location || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Candidates");

    XLSX.writeFile(wb, "filtered_candidates.xlsx");
  };
  const fetchPostedJobs = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;
        const response = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/employeer/api/job-list-view/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      // const response = await fetch(
      //   "https://jobseeker-backend-jy1y.onrender.com/employeer/api/job-list-view/",
      //   {
      //     method: "GET",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

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

  // Fetch data from APIs
  useEffect(() => {
    fetchPostedJobs();
  }, []);
  console.log("Posted Jobs:", postedJobs);

  useEffect(() => {
    fetch("https://jobseeker-backend-jy1y.onrender.com/master/api/currencies/")
      .then((res) => res.json())
      .then((data) => {
        // console.log("Currency data:", data);
        setCurrency(data);
      });
  }, []);

  useEffect(() => {
    // Fetch job categories
    fetch(
      "https://jobseeker-backend-jy1y.onrender.com/master/api/jobs_category/"
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setJobCategories(data))
      .catch((err) => {
        console.error("Failed to fetch job categories:", err);
        setJobCategories([]);
      });

    // Fetch country
    fetch("https://jobseeker-backend-jy1y.onrender.com/master/api/countries/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setCities(data))
      .catch((err) => {
        console.error("Failed to fetch cities:", err);
        setCities([]);
      });
  }, []);

  // Fetch job titles when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetch(
        `https://jobseeker-backend-jy1y.onrender.com/master/api/jobs_title/?category=${selectedCategory}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setJobTitles(data))
        .catch((err) => {
          console.error("Failed to fetch job titles:", err);
          setJobTitles([]);
        });
    } else {
      setJobTitles([]);
    }
  }, [selectedCategory]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !jobForm.skills.includes(newSkill.trim())) {
      setJobForm((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleApplicationsClick = async (jobId: number) => {
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `https://jobseeker-backend-jy1y.onrender.com/employeer/api/employer/applications/job/${jobId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      // console.log("API RAW DATA:", data);

      if (!Array.isArray(data)) {
        console.error("API did not return list:", data);
        toast.error("Failed to load candidates! (Unauthorized?)", {
        description: "You might not have permission. Please log in or check your access."
        });
        return;
      }

    //   const mappedCandidates = data.map((item) => ({
    //     id: item.id,
    //     name: item.profile?.full_name || item.full_name,
    //     email: item.email || item.user_email, 
    //     phone: item.profile?.phone || item.phone,
    //     phoneCode: item.profile?.phone_code || item.phone_code,
    //     location: item.profile?.city || item.city,
    //     experience: item.profile?.experience || item.experience,
    //     job_title: item.job_title,
    //     resumeUrl: item.profile?.resume || item.resume,
    //     skills: item.profile?.skills || item.skills,
    //     certifications: item.profile?.certifications || item.certifications,
    //     educationDetails: item.profile?.educations || item.educations,
    //     workExperience: item.profile?.experiences || item.experiences,
    //     status: item.application_status || "Under Review",
    //     appliedDate: item.applied_at,
    //     qa: item.answers?.map((ans: any) => ({
    //       question_index: ans.question_index,
    //       question_text: ans.question_text,
    //       answer_text: ans.answer,
    //     })),
    //   }));

    //   console.log("MAPPED CANDIDATES:", mappedCandidates);

    //   setCandidates(mappedCandidates);
    //   setActiveTab("candidates");
    // } catch (error) {
    //   console.error(error);
    // }
    const mappedCandidates: Candidate[] =
      data.map(mapApiCandidateToUI);

      setCandidates(mappedCandidates);
      setActiveTab("candidates");
    } catch (error) {
      console.error(error);
    }
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
      (_, index) => index !== indexToRemove
    );
    setJobForm((prev) => ({ ...prev, questions: updated }));
    setQuestions(updated);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setJobForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmitJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("You must be logged in to post a job.", {
        description: "Please log in to continue."
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
        "https://jobseeker-backend-jy1y.onrender.com/employeer/api/job-postings/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
          body: JSON.stringify(payload),
        }
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
        description: "Please try again or check your internet connection."
        });
       }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case "active":
          return "bg-green-100 text-green-800";
        case "closed":
          return "bg-red-100 text-red-800";
        case "Under Review":
          return "bg-yellow-100 text-yellow-800";
        case "Shortlisted":
          return "bg-blue-100 text-blue-800";
        case "Rejected":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

  // Filter jobs based on status and search term
  const filteredJobs = postedJobs.filter((job) => {
    const matchesFilter =
      jobFilter === "all" ||
      job.status.toLowerCase() === jobFilter.toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesDate = true;
    if (dateFilter !== "all" && job.created_at) {
      const jobDate = new Date(job.created_at);
      const now = new Date();

      if (dateFilter === "today") {
        matchesDate = jobDate.toDateString() === now.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesDate = jobDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        matchesDate = jobDate >= monthAgo;
      }
    }
    return matchesFilter && matchesSearch && matchesDate;
  });
  const filteredCategories = candidates.filter((c) => {
    const nameMatch =
      c.name?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      c.currentRole?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      c.appliedFor?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      c.skills?.some((skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const statusMatch =
      statusFilter === "All" ||
      c.status?.toLowerCase() === statusFilter.toLowerCase();

    const locationMatch =
      locationFilter === "All" ||
      c.location?.toLowerCase() === locationFilter.toLowerCase();

    const jobTitleMatch =
      jobTitleFilter === "All" ||
      c.appliedFor?.toLowerCase() === jobTitleFilter.toLowerCase();

    const salary = parseInt(c.expectedSalary ?? "0", 10);
    const salaryMatch =
      salaryFilter === "All" ||
      (salaryFilter === "Below 20000" && salary < 20000) ||
      (salaryFilter === "20000-50000" && salary >= 20000 && salary <= 50000) ||
      (salaryFilter === "Above 50000" && salary > 50000);

    const expMatch =
      experienceFilter === "All" ||
      (experienceFilter === "Fresher" &&
        (c.experience?.toLowerCase().includes("fresher") ||
          c.experience?.includes("0"))) ||
      (experienceFilter === "1-3 Years" &&
        (c.experience?.includes("1") ||
          c.experience?.includes("2") ||
          c.experience?.includes("3"))) ||
      (experienceFilter === "3-5 Years" &&
        (c.experience?.includes("3") ||
          c.experience?.includes("4") ||
          c.experience?.includes("5"))) ||
      (experienceFilter === "5+ Years" &&
        (c.experience?.includes("5") ||
          c.experience?.includes("6") ||
          c.experience?.includes("7")));

    return (
      nameMatch &&
      statusMatch &&
      locationMatch &&
      salaryMatch &&
      expMatch &&
      jobTitleMatch
    );
  });
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

    const handleViewJob = async (job: any) => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(
          `https://jobseeker-backend-jy1y.onrender.com/employeer/api/job-list-view/${job.id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Job details:", data);
        setSelectedJob(data);
        setIsEditMode(false);
        setIsModalOpen(true);
      } catch (err) {
        console.error("Error fetching job details", err);
      }
    };
  //https://jobseeker-backend-jy1y.onrender.com
    const handleEditJob = async (job: any) => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(
          `https://jobseeker-backend-jy1y.onrender.com/employeer/api/job-list-view/${job.id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      
        const data = await response.json();
        // console.log("Data is prefill", data);
        // Prefill the form
    setJobForm({
        title: data.title || "",
        category: data.category?.name?.toString() || data.category || "",
        jobTitle: data.job_title?.id?.toString() || data.job_title || "",
        company: data.company || "",
        location: data.location?.name?.toString() || data.location || "",
        experience: data.experience || "",
        salary: data.salary || "",
        currency: data.currency?.id?.toString() || data.currency || "",
        job_type: data.job_type || "",
        workMode: data.work_mode || "",
        description: data.description || "",
        requirements: data.requirements || "",
        benefits: data.benefits || "",
        skills: data.skills || [],
        applicationDeadline: data.application_deadline || "",
        vacancies: data.vacancies || "",
        isUrgent: data.is_urgent || false,
        isRemote: data.is_remote || false,
        questions: data.questions || [],
      });
      setQuestions(data.questions || []);
      setAskQuestionEnabled(data.questions && data.questions.length > 0);

      setSelectedJob(data);
      setIsEditMode(true);
    } catch (err) {
      console.error("Error fetching job details for edit", err);
    }
  };

  const handleDeleteJob = async (job: any) => {
    const token = localStorage.getItem("auth_token");
    try {
      if (
        window.confirm(`Are you sure you want to delete the job: ${job.title}?`)
      ) {
        // console.log("Deleting job:", job);

        toast.success("Job deleted", {
        description: `The job "${job.title}" has been successfully removed.`
        });

      }
      const response = await fetch(
        `https://jobseeker-backend-jy1y.onrender.com/employeer/job-postings/${job.id}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setPostedJobs((prev) => prev.filter((j) => j.id !== job.id));
        toast.success("Job deleted", {
        description: `The job "${job.title}" has been successfully removed.`
        });

      } else {
        console.error("Failed to delete job");
        toast.error("Failed to delete job", {
        description: "Please try again or check your internet connection."
        });
      }
    } catch (err) {
      console.error("Error fetching job details for edit", err);
    }
  };

  // const handleToggleJobStatus = (job) => {
  //   const newStatus = job.status === "Active" ? "Closed" : "Active";
  //   console.log(`Changing job status from ${job.status} to ${newStatus}`);
  //   // Implement status toggle functionality
  //   alert(`Job status changed to: ${newStatus}`);
  // };

  const handleToggleJobStatus = async (job: any) => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      toast.error("You are not logged in. Please log in again.", {
      description: "Your session may have expired."
      });
      return;
    }

    const newStatus =
      job.status.toLowerCase() === "active" ? "closed" : "active";

    try {
      const response = await fetch(
        `https://jobseeker-backend-jy1y.onrender.com/employeer/job-postings/${job.id}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setPostedJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
        );
        toast.success(`Job status changed to: ${newStatus}`);
      } else {
        console.error("Failed to update job status:", result);

        toast.error(result.detail || "Failed to update job status", {
       description: "Please check and try again.",
       });
      }
    } catch (err) {
      console.error("Error updating job status:", err);
      toast.error("Network error. Please try again.");
    }
  };

  // OLD handleUpdateJOB
  // const handleUpdateJob = async () => {
  //   try {
  //     const token = localStorage.getItem("auth_token");
  //     const response = await fetch(`https://jobseeker-backend-jy1y.onrender.com/employeer/api/job-postings/${selectedJob.id}/`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(jobForm),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update job");
  //     }

  //     const updatedJob = await response.json();
  //     setPostedJobs((prev) =>
  //       prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
  //     );

  //     setIsModalOpen(false);
  //     alert("Job updated successfully");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to update job");
  //   }
  // };

  // Added the New Handle UpdateJob
  const handleUpdateJob = async () => {
    if (!selectedJob?.id) {
      toast.error("No job selected for update", {
      description: "Please select a job and try again."
     });
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("You must be logged in to update a job.", {
        description: "Please log in and try again."
        });
        return;
      }

      const response = await fetch(
        `https://jobseeker-backend-jy1y.onrender.com/employeer/job-postings/${selectedJob.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobForm),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update job:", errorData);
        toast.error(`Error: ${errorData.detail || "Unable to update job"}`, {
        description: "Please try again or check your network connection."
        });
        return;
      }

      const updatedJob = await response.json();

      // Update the state with the new job data
      setPostedJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
      );

      setIsEditMode(false); // Close the dialog

      toast.success("Job updated successfully!");
    } catch (err) {
      console.error("Update job error:", err);
      toast.error("An error occurred while updating the job.", {
      description: "Please try again or check your network connection."
      });
    }
  };

  // SHORTLIST
  const handleShortlistCandidate = async ( candidate: any) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("Token missing", {
        description: "Please log in again to continue."
        });
        return;
      }

      const response = await fetch(
        `https://jobseeker-backend-jy1y.onrender.com/employeer/api/employer/applications/${candidate.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            application_status: "shortlisted",
          }),
        }
      );

      const updated = await response.json();
      // console.log("Updated Response:", updated);

      if (!response.ok) {
         toast.error(updated.error || "Update failed", {
         description: "Please check and try again."
         });
        return;
      }

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === updated.id ? { ...c, status: updated.application_status } : c
        )
      );

      setSelectedCandidate((prev) =>
        prev && prev.id === updated.id
          ? { ...prev, status: updated.application_status }
          : prev
      );

      // setSelectedCandidate((prev) =>
      //   prev && prev.id === updated.id
      //     ? { ...prev, status: updated.application_status }
      //     : prev
      // );
      // console.log("Now>>>>>>>", selectedCandidate);

      toast.success("Candidate Shortlisted!");
    } catch (err) {
      console.log("Shortlist error:", err);
      toast.error("Network error. Please try again.");
    }
  };

  /* REJECT */
  const handleRejectCandidate = async (candidate: Pick<Candidate, "id">) => {
    try {
      // console.log("Rejecting candidate: ", candidate);

      if (!candidate?.id) {
        toast.error("Candidate ID missing", {
        description: "Please select a candidate and try again."
        });
        return;
      }

      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("Token missing", {
         description: "Please log in again to continue."
        });
        return;
      }

      const response = await fetch(
        `https://jobseeker-backend-jy1y.onrender.com/employeer/api/employer/applications/${candidate.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            application_status: "Rejected",
          }),
        }
      );

      const text = await response.text();
      // console.log("Raw Response → ", text);

      let data: ApplicationUpdateResponse | null = null;
      try {
        data = JSON.parse(text) as ApplicationUpdateResponse
      } catch {
        console.log("HTML Error Response Received");
      }

      if (!response.ok) {
        toast.error(data?.detail || "Update failed", {
        description: "Please check and try again."
        });
        return;
      }

      if (!data) {
      toast.error("Invalid server response", {
        description: "Please try again later."
      });
      return;
      }
      const { id, application_status } = data;
      // setCandidates((prev) =>
      //   prev.map((c) =>
      //     c.id === data.id ? { ...c, status: data.application_status } : c
      //   )
      // );

      // setSelectedCandidate((prev) =>
      //   prev && prev.id === data.id
      //     ? { ...prev, status: data.application_status }
      //     : prev
      // );
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: application_status } : c
        )
      );

      setSelectedCandidate((prev) =>
        prev && prev.id === id
          ? { ...prev, status: application_status }
          : prev
      );

      // setSelectedCandidate((prev) =>
      //   prev && prev.id === data.id
      //     ? { ...prev, status: data.application_status }
      //     : prev
      // );

      toast.error("Candidate Rejected!");
    } catch (err) {
      console.log("Reject error: ", err);
      toast.error("Network error. Please try again.");
    }
  };

  // INTERVIEW SCHEDULE
  const handleScheduleInterview = (candidate: any) => {
    setSelectedCandidate(candidate);
    setOpenSchedule(true);
  };

  const handleScheduleSubmit = async () => {
    if (!selectedCandidate) {
    toast.error("No candidate selected", {
      description: "Please select a candidate and try again."
    });
    return;
  }
     if (!interviewDate) {
    toast.warning("Please select interview date");
    return;
  }


    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return toast.error("Token missing", {
                         description: "Please log in again to continue."
                         });

      const res = await fetch(
        `https://jobseeker-backend-jy1y.onrender.com/employeer/api/employer/applications/${selectedCandidate.id}/schedule-interview/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            interview_date: interviewDate,
            interview_time: interviewTime,
            interview_mode: interviewMode,
            notes: interviewNotes,
          }),
        }
      );
   // meet_link: meetLink,
      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return toast.error("Failed to schedule interview", {
        description: "Please try again or check your network connection."
         });

      }

      const data = await res.json();

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === data.id ? { ...c, status: data.application_status } : c
        )
      );

      setSelectedCandidate((prev) =>
        prev && prev.id === data.id
          ? { ...prev, status: data.application_status }
          : prev
      );

      toast.success("Interview Scheduled!");
      setOpenSchedule(false);
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    router.push("/employer/login");
  };

  const tabs = [
    { id: "post-job", label: "Post a Job", icon: Plus },
    { id: "manage-jobs", label: "Manage Jobs", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    // { id: 'analytics', label: 'Analytics', icon: TrendingUp }
    {
    id: "profiles",
    label: "profiles",
    icon: UserCircle,
    component: <CandidatesPage />,
  },
    {
    id: "quota",
    label: "Quota Usage",
    icon: BarChart3,
    component: <QuotaUsagePage />,
  },
  ];

  const getWorkModeColor = (workMode: string) => {
    switch (workMode) {
      case "Remote":
        return "bg-green-100 text-green-800";
      case "Hybrid":
        return "bg-blue-100 text-blue-800";
      case "Office":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeSincePosted = (postedDate: string) => {
    const now = new Date().getTime();
    const posted = new Date(postedDate).getTime();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // let companyInfoSize;
  // if(typeof selectedJob ==="object" && selectedJob?.companyInfo.size){
  //  selectedJob.requirements.map((req, index) => (
  //                        )
  // }

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const res = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/employeer/api/employeer_register/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        // console.log("Company API → ", data);

        if (data?.company_name) {
          setJobForm((prev) => ({
            ...prev,
            company: prev.company ? prev.company : data.company_name
          }));
        }
      } catch (err) {
        console.error("Company fetch error:", err);
      }
    };

    fetchCompany();
  }, []);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    experience: "",
    salaryRange: [0, 50],
    designation: "",
    department_Role :"",
    Industry :"",
    Notice_Period :"",
    Gender :"",
    Age :[0, 50],
    Degree_Course :"",
    college_Name :"",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                jobseeker
              </span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                Employer Dashboard
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="relative">
                 <div
                   onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                   className="cursor-pointer relative select-none"
                  >
                  <Bell className="w-5 h-5 text-gray-700 hover:text-purple-600" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                 </div>

                 {isNotificationOpen && (
                   <>

                     <div
                       className="fixed inset-0 z-40 bg-black/20 md:bg-transparent"
                       onClick={() => setIsNotificationOpen(false)}
                     />
                     <div
                       className="
                        fixed md:absolute
                        inset-x-0 bottom-0 md:inset-auto
                        md:right-0 md:top-full
                        w-full md:w-80
                        bg-white
                        border
                        shadow-lg
                        rounded-t-xl md:rounded-lg
                        z-50
                      "
                     >
                       <div className="p-3 border-b font-semibold text-gray-700 flex justify-between items-center">
                        Notifications
                        <button
                          className="md:hidden text-gray-500"
                          onClick={() => setIsNotificationOpen(false)}
                        >
                          ✕
                        </button>
                       </div>

                       <div className="max-h-64 overflow-y-auto">
                         <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                           <p className="text-sm font-medium text-gray-800">
                             New job matched your profile
                           </p>
                           <p className="text-xs text-gray-500">2 minutes ago</p>
                         </div>

                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm font-medium text-gray-800">
                            Employer viewed your profile
                          </p>
                          <p className="text-xs text-gray-500">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your job postings and find the perfect candidates
            </p>
          </div>
          {activeTab === "candidates" && (
            <Button onClick={exportToExcel} className="bg-green-600 text-white">
              Export Excel
            </Button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Job Tab */}
        {activeTab === "post-job" && (
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
                    <Label className="text-sm font-medium">
                      Job Category *
                    </Label>

                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value);
                        setJobForm((prev) => ({
                          ...prev,
                          category: value,
                          jobTitle: "",
                        }));
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select job category">
                          {jobCategories.find(
                            (category) =>
                              category.id?.toString() === selectedCategory
                          )?.name || "Select job category"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <div className="p-2 sticky top-0 bg-white z-10 border-b">
                          <Input
                            placeholder="Search category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>

                        {Array.isArray(jobCategories) &&
                        jobCategories.length > 0 ? (
                          jobCategories
                            .filter((category) => {
                              if (!searchTerm) return true;
                              return category?.name
                                ?.toLowerCase()
                                .startsWith(searchTerm.toLowerCase());
                            })
                            .map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id?.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            {jobCategories.length === 0
                              ? "No categories found"
                              : "No matching results"}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Specific Job Title *
                    </Label>
                    <Select
                      value={jobForm.jobTitle}
                      onValueChange={(value) =>
                        setJobForm((prev) => ({ ...prev, jobTitle: value }))
                      }
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue
                          placeholder={
                            selectedCategory
                              ? "Select job title"
                              : "Select category first"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent>
                        <div className="p-2 sticky top-0 bg-white z-10 border-b">
                          <Input
                            placeholder="Search job title..."
                            value={searchJobTitle}
                            onChange={(e) => setSearchJobTitle(e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>

                        {Array.isArray(jobTitles) && jobTitles.length > 0 ? (
                          jobTitles
                            .filter((title) =>
                              title?.title
                                ?.toLowerCase()
                                .startsWith(searchJobTitle.toLowerCase())
                            )
                            .map((title) => (
                              <SelectItem
                                key={title.id}
                                value={title.id.toString()}
                              >
                                {title.title}
                              </SelectItem>
                            ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            {jobTitles.length === 0
                              ? "No job titles found"
                              : "No matching results"}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-sm font-medium">
                      Company Name *
                    </Label>
                    <Input
                      id="company"
                      value={CompanyName}
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
                    <Label className="text-sm font-medium">
                      Job Location *
                    </Label>

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
                                      .startsWith(search.toLowerCase())
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
                      Salary Range (PA)
                    </Label>
                    {/* <div className="flex gap-2 mt-1">
                      <Select defaultValue="INR">
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">₹</SelectItem>
                          <SelectItem value="USD">$</SelectItem>
                          <SelectItem value="EUR">€</SelectItem>
                          <SelectItem value="GBP">£</SelectItem>
                        </SelectContent>
                      </Select>

                    </div> */}
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
                            <SelectItem
                              key={curr.id}
                              value={curr.id.toString()}
                            >
                              {curr.symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="salary"
                        value={jobForm.salary}
                        onChange={(e) =>
                          setJobForm((prev) => ({
                            ...prev,
                            salary: e.target.value,
                          }))
                        }
                        placeholder="e.g., 5-8 PA"
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
                        setJobForm((prev) => ({ ...prev, isUrgent: checked === true }))
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
                        setJobForm((prev) => ({ ...prev, isRemote: checked === true }))
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
                      onCheckedChange={(checked) =>
                        setAskQuestionEnabled(!!checked)
                      }
                    />
                    <Label htmlFor="ask-question" className="text-sm">
                      Ask Question
                    </Label>
                  </div>

                  {askQuestionEnabled && (
                    <div className="space-y-2">
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
                </div>

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
        )}

        {/* Manage Jobs Tab */}
        {activeTab === "manage-jobs" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <CardTitle>Manage Your Jobs</CardTitle>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
    
                  {/* Date Filter */}
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Filter by Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Date</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Job Filter */}
                  <Select value={jobFilter} onValueChange={setJobFilter}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Search */}
                  <div className="relative w-full sm:w-56 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>

                </div>
              </div>

            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No jobs found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || jobFilter !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Start by posting your first job."}
                    </p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {job.title}
                            </h3>
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                          </div>
                          <p className="text-purple-600 font-medium mb-2">
                            {job.company}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{job.location?.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              <span>{job.experience} Years</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {/* <span>
                                Posted:{" "}
                                {new Date(job.created_at).toLocaleDateString()}
                              </span> */}
                              <span>
                            Posted:{" "}
                            {job.created_at
                              ? new Date(job.created_at).toLocaleDateString()
                              : "N/A"}
                          </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div
                              className="flex items-center text-blue-600 cursor-pointer"
                              onClick={() => handleApplicationsClick(job.id)}
                            >
                              <Users className="w-4 h-4 mr-1" />
                              <span>{job.applicants || 0} Applications</span>
                            </div>

                            <div className="flex items-center text-green-600">
                              <Eye className="w-4 h-4 mr-1" />
                              <span>{job.apply_clicks || 0} Views</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewJob(job)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditJob(job)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewJob(job)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditJob(job)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Job
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleJobStatus(job)}
                              >
                                {job.status?.toLowerCase() === "active" ||
                                job.status?.toLowerCase() === "open" ? (
                                  <>
                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                    Close Job
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                    Activate Job
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteJob(job)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {selectedJob.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Company Info */}
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-purple-600 mb-1">
                        {selectedJob.company}
                      </h3>
                      {/* <p className="text-gray-600 mb-2">{selectedJob.companyInfo.about}</p> */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {/* <span>{selectedJob.companyInfo.size}</span> */}
                        </div>
                        {/* <div className="flex items-center">
                                  <Building2 className="w-4 h-4 mr-1" />
                                  <span>{selectedJob.companyInfo.industry}</span>
                                </div>
                                <div className="flex items-center">
                                  <Globe className="w-4 h-4 mr-1" />
                                  <a href={selectedJob.companyInfo.website} className="text-purple-600 hover:underline">
                                    Website
                                  </a> */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{selectedJob.location?.name}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span>{selectedJob.experience}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{selectedJob.salary}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{selectedJob.job_type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      <Badge
                        className={getWorkModeColor(selectedJob.work_mode)}
                      >
                        {selectedJob.work_mode}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Posted {selectedJob.created_at ? getTimeSincePosted(selectedJob.created_at) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Job Description
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Requirements
                  </h4>
                  <ul className="space-y-2">{selectedJob.requirements}</ul>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Benefits
                  </h4>
                  <ul className="space-y-2">{selectedJob.benefits}</ul>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-100 text-purple-800"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* questions */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Questions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.questions &&
                    selectedJob.questions.length > 0 ? (
                      selectedJob.questions.map((question, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          {question}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No questions added
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {/* <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            <Button
                              onClick={() => {
                                setIsJobDetailOpen(false);
                                handleApply(selectedJob);
                              }}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Apply Now
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleBookmark(selectedJob.id)}
                              className={`flex-1 ${selectedJob.isBookmarked ? 'border-purple-600 text-purple-600' : ''}`}
                            >
                              <Bookmark className={`w-4 h-4 mr-2 ${selectedJob.isBookmarked ? 'fill-current' : ''}`} />
                              {selectedJob.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleShare(selectedJob)}
                              className="flex-1"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div> */}
                {/* </div> */}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* FIX: THE Values are not showing, Preset the Value */}
        <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Edit Job Profile
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Left Column */}
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={jobForm.title || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    name="category"
                    value={jobForm.category || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Job Title</Label>
                  <Input
                    name="jobTitle"
                    value={jobForm.jobTitle || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    name="company"
                    value={jobForm.company || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    name="location"
                    value={jobForm.location || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Experience</Label>
                  <Input
                    name="experience"
                    value={jobForm.experience || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Salary</Label>
                  <Input
                    name="salary"
                    value={jobForm.salary || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Input
                    name="currency"
                    value={jobForm.currency || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div>
                  <Label>Job Type</Label>
                  <Input
                    name="job_type"
                    value={jobForm.job_type || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Work Mode</Label>
                  <Input
                    name="workMode"
                    value={jobForm.workMode || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={jobForm.description || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Requirements</Label>
                  <Textarea
                    name="requirements"
                    value={jobForm.requirements || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Benefits</Label>
                  <Textarea
                    name="benefits"
                    value={jobForm.benefits || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Skills</Label>
                  <Textarea
                    name="skills"
                    value={jobForm.skills || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Application Deadline</Label>
                  <Input
                    type="date"
                    name="applicationDeadline"
                    value={jobForm.applicationDeadline || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Vacancies</Label>
                  <Input
                    type="number"
                    name="vacancies"
                    value={jobForm.vacancies || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={jobForm.isUrgent === true}
                      onCheckedChange={(checked) =>
                        setJobForm({ ...jobForm, isUrgent: !!checked })
                      }
                    />
                    <Label>Urgent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={jobForm.isRemote === true}
                      onCheckedChange={(remote) =>
                        setJobForm({ ...jobForm, isUrgent: !!remote })
                      }
                    />
                    <Label>Remote</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost">Cancel</Button>
              {/* FIX : Put the Onclick handle update method */}
              <Button onClick={handleUpdateJob}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Candidates Tab */}
        {activeTab === "candidates" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Candidates List */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Applications</CardTitle>

                      <Badge variant="secondary">
                        {filteredCategories.length}
                      </Badge>
                    </div>

                    <button
                      onClick={() => {
                        setStatusFilter("All");
                        setLocationFilter("All");
                        setSalaryFilter("All");
                        setExperienceFilter("All");
                        setJobTitleFilter("All");
                      }}
                      className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
                    >
                      Clear Filters
                    </button>
                  </div>

                  {/*  Search Bar  */}
                  <div className="mb-4">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search by name, role or applied job..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-11 pl-10"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/*  Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {/*  Status Filter */}
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="Under Review">
                          Under Review
                        </SelectItem>
                        <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Location Filter */}
                    <Select
                      value={locationFilter}
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Locations</SelectItem>
                        {Array.from(new Set(candidates.map((c) => c.location)))
                          .filter(Boolean)
                          .map((loc, i) => (
                            <SelectItem key={i} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {/* Experience Filter */}
                    <Select
                      value={experienceFilter}
                      onValueChange={setExperienceFilter}
                    >
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Experience</SelectItem>
                        <SelectItem value="Fresher">Fresher</SelectItem>
                        <SelectItem value="1-3 Years">1–3 Years</SelectItem>
                        <SelectItem value="3-5 Years">3–5 Years</SelectItem>
                        <SelectItem value="5+ Years">5+ Years</SelectItem>
                      </SelectContent>
                    </Select>
                   
                    <Select
                      value={jobTitleFilter}
                      onValueChange={setJobTitleFilter}
                    >
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Job Title" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="All">All Job Titles</SelectItem>

                        {Array.from(
                          new Set(candidates.map((c) => c.appliedFor))
                        )
                          .filter(Boolean)
                          .map((title, i) => (
                            <SelectItem key={i} value={title}>
                              {title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* {candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setIsCandidateModalOpen(true);
                        }}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                          selectedCandidate?.id === candidate.id
                            ? "border-l-blue-500 bg-blue-50"
                            : "border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {candidate.name}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              {candidate.currentRole}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {candidate.appliedFor}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge
                                className={`text-xs ${getStatusColor(
                                  candidate.status
                                )}`}
                              >
                                {candidate.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  candidate.appliedDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))} */}

                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((candidate) => (
                      <div
                        key={candidate.id}
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setIsCandidateModalOpen(true);
                        }}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                          selectedCandidate?.id === candidate.id
                            ? "border-l-blue-500 bg-blue-50"
                            : "border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {candidate.name}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              {candidate.currentRole}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {candidate.appliedFor}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge
                                className={`text-xs ${getStatusColor(
                                  candidate.status
                                )}`}
                              >
                                {candidate.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  candidate.appliedDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No candidates found</p>
                  )}
                  <div className="flex flex-wrap gap-3 mb-4 items-center"></div>
                </CardContent>
              </Card>
            </div>

            {/* Candidate Profile */}
            <div className="lg:col-span-2">
              {selectedCandidate ? (
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {selectedCandidate.name}
                          </h2>
                          <p className="text-purple-600 font-medium">
                            {selectedCandidate.currentRole}
                          </p>
                          <p className="text-gray-600">
                            {selectedCandidate.currentCompany}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{selectedCandidate.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              <span>{selectedCandidate.experience}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                                             
                        <Button variant="outline" size="sm">
                          {selectedCandidate.resumeUrl ? (
                            <a
                              href={selectedCandidate.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 underline inline-flex items-center gap-1"
                            >
                              View Resume
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">
                              No resume uploaded
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedCandidate.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span>
                           +{selectedCandidate.phoneCode}
                            {selectedCandidate.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Application Details
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Applied for:</span>
                            <p className="font-medium">
                              {selectedCandidate.appliedFor}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Application Date:
                            </span>
                            <p className="font-medium">
                              {new Date(
                                selectedCandidate.appliedDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <Badge
                              className={`ml-2 ${getStatusColor(
                                selectedCandidate.status
                              )}`}
                            >
                              {selectedCandidate.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Professional Summary
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedCandidate.summary}
                      </p>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-purple-100 text-purple-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Work Experience */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Work Experience
                      </h3>
                      <div className="space-y-4">
                        {selectedCandidate.workExperience.map((exp, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-purple-200 pl-4"
                          >
                            <h4 className="font-medium text-gray-900">
                              {exp.role}
                            </h4>
                            <p className="text-purple-600 font-medium">
                              {exp.company}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              {exp.duration}
                            </p>
                            <p className="text-gray-700 text-sm">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Education
                      </h3>
                      <div className="space-y-4">
                        {selectedCandidate.educationDetails.map(
                          (edu, index) => (
                            <div
                              key={index}
                              className="border-l-2 border-green-200 pl-4"
                            >
                              <h4 className="font-medium text-gray-900">
                                {edu.degree}
                              </h4>
                              <p className="text-green-600 font-medium">
                                {edu.field}
                              </p>
                              <p className="text-gray-600">{edu.institution}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span>Year: {edu.year}</span>
                                <span>Grade: {edu.grade}</span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    {/* Certifications */}
                    {Array.isArray(selectedCandidate.qa) &&
                      selectedCandidate.qa.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            Application Q&A
                          </h4>
                          <div className="space-y-3">
                            {selectedCandidate.qa.map((item, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded p-3"
                              >
                                <p className="text-sm font-medium text-gray-800">
                                  Q{(item.question_index ?? index) + 1}.{" "}
                                  {item.question_text || "Question"}
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                  {item.answer_text || "-"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                     

                    {selectedCandidate.certifications.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Certifications
                        </h3>
                        <div className="space-y-3">
                          {selectedCandidate.certifications.map(
                            (cert, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg"
                              >
                                <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {cert.name}
                                  </h4>
                                  <p className="text-yellow-600 font-medium">
                                    {cert.issuer}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Issued: {cert.year}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                       <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowResume(!showResume)}
                      >
                        View Resume
                      </Button>

                      {showResume && selectedCandidate.resumeUrl && (
                        <div className="mt-4 h-[500px] border rounded">
                          <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(
                              selectedCandidate.resumeUrl
                            )}&embedded=true`}
                            className="w-full h-full"
                            title="Resume Preview"
                          />
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        {/* UNDER REVIEW */}
                        {selectedCandidate?.status === "Under Review" && (
                          <>
                            <Button
                              className="bg-green-600 hover:bg-green-700 flex-1"
                              onClick={() =>
                                handleShortlistCandidate(selectedCandidate)
                              }
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Shortlist Candidate
                            </Button>

                         <AlertDialog>
                           <AlertDialogTrigger asChild>
                             <Button
                               variant="outline"
                               className="border-red-600 text-red-600 hover:bg-red-50 flex-1"
                             >
                               <XCircle className="w-4 h-4 mr-2" />
                               Reject Application
                             </Button>
                           </AlertDialogTrigger>

                           <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject this application?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The candidate will be marked as rejected.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleRejectCandidate(selectedCandidate)}
                              >
                                Yes, Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                          </>
                        )}

                        {/* SHORTLISTED */}
                        {selectedCandidate?.status === "shortlisted" && (
                          <Button
                            variant="outline"
                            className="flex-1 border-blue-600 text-blue-600"
                            onClick={() =>
                              handleScheduleInterview(selectedCandidate)
                            }
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Schedule Interview
                          </Button>
                        )}

                        {/* REJECTED */}
                        {selectedCandidate?.status === "Rejected" && (
                          <Button
                            disabled
                            variant="outline"
                            className="border-red-600 text-red-600 flex-1 opacity-50 cursor-not-allowed"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Application Rejected
                          </Button>
                        )}
                      </div>

                      {openSchedule && (
  <Dialog open={openSchedule} onOpenChange={() => setOpenSchedule(false)}>
    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto rounded-xl">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          Schedule Interview
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 mt-3">
        {/* Candidate Name */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-xs text-gray-500">Candidate</p>
          <p className="font-semibold text-gray-800">
            {selectedCandidate?.name}
          </p>
        </div>

        {/* Candidate Email */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-xs text-gray-500">Email</p>
          <p className="font-semibold text-gray-800">
            {selectedCandidate?.email}
          </p>
        </div>

        {/* Interview Date */}
        <div>
          <label className="text-sm font-medium">Interview Date</label>
          <input
          required
            type="date"
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            
          />
        </div>

        {/* Interview Time */}
        <div className="flex space-x-2 items-center">
          <label className="text-sm font-medium">Interview Time</label>

          

                <input
                 type="text"
                 placeholder="hh:mm AM"
                 className="w-32 border rounded-lg p-2 text-center"
                 value={time}
                 onChange={(e) => {
                   let value = e.target.value.toUpperCase();
               
                   value = value.replace(/[^0-9:APM ]/g, "");
                               
                   if (value.length === 2 && !value.includes(":")) {
                     value = value + ":";
                   }
               
                   if (value.length > 8) return;
               
                   setTime(value);
                 }}
                 onBlur={() => {
                  
                   const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/;
                   if (!regex.test(time)) {
                     setTime(""); 
                   }
                 }}
               />


          <select
            className="border rounded-lg p-2"
            value={ampm}
            onChange={(e) => setAmPm(e.target.value)}
          >
            <option>AM</option>
            <option>PM</option>
          </select>

            {/* ✅ Time Zone Dropdown */}
          <select
            className="border rounded-lg p-2"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
          >
            <option value="IST">IST</option>
            <option value="UTC">UTC</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
            <option value="CST">CST</option>
          </select>
        </div>

        {/* Interview Mode */}
        <div>
          <label className="text-sm font-medium">Interview Mode</label>
          <select
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
            value={interviewMode}
            onChange={(e) => setInterviewMode(e.target.value)}
          >
            <option>Online</option>
            <option>Office</option>
            <option>Phone Call</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm text-gray-700">Notes</label>
          <textarea
            className="w-full border rounded-md p-2 mt-1 text-sm focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter instructions or notes..."
            value={interviewNotes}
            onChange={(e) => setInterviewNotes(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="mt-3">
        <Button variant="outline" onClick={() => setOpenSchedule(false)}>
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleScheduleSubmit}
        >
          Schedule
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}

                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a Candidate
                    </h3>
                    <p className="text-gray-600">
                      Choose a candidate from the list to view their detailed
                      profile
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === "profiles" && (
        <CandidatesPage/>
         )}
         {activeTab === "quota" && (
        <QuotaUsagePage />
         )}
        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Analytics dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Candidate Detail Modal */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            {isEditMode ? (
              <>
                <h2 className="text-xl font-bold mb-4">Edit Job</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateJob();
                  }}
                  className="space-y-4"
                >
                  {/* Title */}
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      value={jobForm.title}
                      onChange={(e) =>
                        setJobForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {/* Company */}
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={jobForm.company}
                      onChange={(e) =>
                        setJobForm((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {/* Salary */}
                  <div>
                    <Label>Salary</Label>
                    <Input
                      value={jobForm.salary}
                      onChange={(e) =>
                        setJobForm((prev) => ({
                          ...prev,
                          salary: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {/* Description */}
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={jobForm.description}
                      onChange={(e) =>
                        setJobForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update Job</Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">{selectedJob?.title}</h2>
                <p className="text-gray-600 mb-2">
                  Company: {selectedJob?.company}
                </p>
                <p className="text-gray-600 mb-2">
                  Salary: {selectedJob?.salary}
                </p>
                <p className="text-gray-600 mb-2">
                  Description: {selectedJob?.description}
                </p>
                <p className="text-gray-600 mb-2">
                  Status: {selectedJob?.status}
                </p>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
    
  );
}
