"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("post-job");
  const [jobCategories, setJobCategories] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [jobFilter, setJobFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [askQuestionEnabled, setAskQuestionEnabled] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  // The Dialog box
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const router = useRouter();
  // Sample data for posted jobs
  // const [postedJobs] = useState([
  //   {
  //     id: 1,
  //     title: "Senior Software Developer",
  //     company: "Tech Solutions Pvt Ltd",
  //     location: "Mumbai",
  //     experience: "3-5 years",
  //     salary: "8-12 LPA",
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
  //     salary: "6-10 LPA",
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
  //     salary: "15-20 LPA",
  //     jobType: "Full Time",
  //     postedDate: "2024-01-08",
  //     applications: 28,
  //     status: "Closed",
  //     views: 156,
  //   },
  // ]);
  const [postedJobs, setPostedJobs] = useState([]);

  // Sample data for candidates
  const [candidates, setCandidates] = useState([
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

  const [jobForm, setJobForm] = useState({
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
  const [currency, setCurrency] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    console.log("LOG TOKEN:", token);
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        const res = await fetch('https://jobseeker-backend-jy1y.onrender.com/employeer/api/employer/applications/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          console.error('Failed to fetch employer applications');
          return;
        }
        const data = await res.json();
        console.log('Employer applications:', data);
        // Map API to UI candidate shape
        const mapped = (Array.isArray(data) ? data : []).map((app) => ({
          id: app.id,
          name: app.profile?.full_name || app.user_email || 'Unknown',
          email: app.profile?.email || app.user_email,
          phone: app.profile?.phone || 'Not provided',
          location: [app.profile?.city, app.profile?.state, app.profile?.country].filter(Boolean).join(', '),
          experience: app.profile?.experience || 'N/A',
          currentRole: '',
          currentCompany: '',
          skills: app.profile?.skills || [],
          education: '',
          appliedFor: app.job_title,
          appliedDate: app.applied_at,
          status: 'Under Review',
          resumeUrl: app.profile?.resume || '#',
          profileImage: null,
          summary: '',
          workExperience: app.profile?.experiences || [],
          educationDetails: app.profile?.educations || [],
          certifications: app.profile?.certifications || [],
          qa: app.answers || [],
        }));
        setCandidates(mapped);
      } catch (e) {
        console.error('Failed to fetch employer applications', e);
      }
    };
    fetchApplications();
  }, []);

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

        if (!response.ok) {
          console.error("Failed to fetch jobs");
          return;
        }

        const data = await response.json();
        setPostedJobs(data); // Set jobs into state
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
        console.log("Currency data:", data);
        setCurrency(data);
      });
  }, []);

  useEffect(() => {
    // Fetch job categories
    fetch("https://jobseeker-backend-jy1y.onrender.com/master/api/jobs_category/")
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
    if (selectedCategory){
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

  const handleAddQuestion = () => {
  if (newQuestion.trim() && !jobForm.questions.includes(newQuestion.trim())) {
    const updated = [...jobForm.questions, newQuestion.trim()];
    setJobForm((prev) => ({ ...prev, questions: updated }));
    setQuestions(updated); // ✅ keep them in sync
    setNewQuestion("");
  }
};

  const handleRemoveQuestion = (indexToRemove) => {
  const updated = jobForm.questions.filter((_, index) => index !== indexToRemove);
  setJobForm((prev) => ({ ...prev, questions: updated }));
  setQuestions(updated);
};

  const handleRemoveSkill = (skillToRemove) => {
    setJobForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("You must be logged in to post a job.");
        return;
      }
      const payload = {
        title: jobForm.title,
        category: parseInt(jobForm.category),       // Convert string ID to integer
        job_title: parseInt(jobForm.jobTitle),     // Convert string ID to integer
        company: jobForm.company,
        location: parseInt(jobForm.location),      // Convert string ID to integer
        experience: jobForm.experience,
        salary: jobForm.salary,
        job_type: jobForm.job_type,
        work_mode: jobForm.workMode,
        vacancies: parseInt(jobForm.vacancies) || 1,  // Ensure integer
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
      console.log("Payload:", payload);
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
        alert(`Failed to post job: ${errorData.detail || "Unknown error"}`);
        return;
      }

      const data = await response.json();
      console.log("Job posted successfully:", data);
      setPostedJobs((prev) => [...prev, data]);
      alert("Job posted successfully!");
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
      alert("An error occurred while posting the job.");
    }
  };

  const getStatusColor = (status) => {
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
    return matchesFilter && matchesSearch;
  });

  const handleViewJob = async (job) => {
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
      console.log("Job details:", data);
      setSelectedJob(data);
      setIsEditMode(false);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching job details", err);
    }
  };
//https://jobseeker-backend-jy1y.onrender.com
  const handleEditJob = async (job) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `https://jobseeker-backend-jy1y.onrender.com/employeer/api/job-list-view/${job.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // https://jobseeker-backend-jy1y.onrender.com
      const data = await response.json();
      console.log("Data is prefill")
      // Prefill the form
      setJobForm({
          title: data.title || "",
          category: data.category?.id?.toString() || data.category || "",
          jobTitle: data.job_title?.id?.toString() || data.job_title || "",
          company: data.company || "",
          location: data.location?.id?.toString() || data.location || "",
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

  const handleDeleteJob = async(job) => {
    const token = localStorage.getItem("auth_token");
    try{
      if (
      window.confirm(`Are you sure you want to delete the job: ${job.title}?`)
    ) {
      console.log("Deleting job:", job);

      alert(`Job deleted: ${job.title}`);
    }
      const response = await fetch(`https://jobseeker-backend-jy1y.onrender.com/employeer/job-postings/${job.id}/delete/`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`, 
          },
        }
      )
      if (response.ok) {
      setPostedJobs((prev) => prev.filter((j) => j.id !== job.id));
      alert(`Job deleted: ${job.title}`);}
    else {
      console.error("Failed to delete job");
      alert("Failed to delete job");
    }
    }
    catch (err) {
      console.error("Error fetching job details for edit", err);
    }
  };

  const handleToggleJobStatus = (job) => {
    const newStatus = job.status === "Active" ? "Closed" : "Active";
    console.log(`Changing job status from ${job.status} to ${newStatus}`);
    // Implement status toggle functionality
    alert(`Job status changed to: ${newStatus}`);
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
      alert("No job selected for update");
      return;
    }
  
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("You must be logged in to update a job.");
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
        alert(`Error: ${errorData.detail || "Unable to update job"}`);
        return;
      }

      const updatedJob = await response.json();

      // Update the state with the new job data
      setPostedJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === updatedJob.id ? updatedJob : job
        )
      );

      setIsEditMode(false); // Close the dialog
      alert("Job updated successfully!");
    } catch (err) {
      console.error("Update job error:", err);
      alert("An error occurred while updating the job.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    router.push('/employer/login');
  };

  const tabs = [
    { id: "post-job", label: "Post a Job", icon: Plus },
    { id: "manage-jobs", label: "Manage Jobs", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    // { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const getWorkModeColor = (workMode) => {
    switch (workMode) {
      case 'Remote':
        return 'bg-green-100 text-green-800';
      case 'Hybrid':
        return 'bg-blue-100 text-blue-800';
      case 'Office':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeSincePosted = (postedDate) => {
    const now = new Date();
    const posted = new Date(postedDate);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };


  
  

  // let companyInfoSize;
  // if(typeof selectedJob ==="object" && selectedJob?.companyInfo.size){
  //  selectedJob.requirements.map((req, index) => (
  //                        )
  // }
     
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
            <div className="flex items-center space-x-4">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your job postings and find the perfect candidates
          </p>
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
                        <SelectValue placeholder="Select job category" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
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
                        {jobTitles.map((title) => (
                          <SelectItem
                            key={title.id}
                            value={title.id.toString()}
                          >
                            {title.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-sm font-medium">
                      Company Name *
                    </Label>
                    <Input
                      id="company"
                      value={jobForm.company}
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
                    <Label className="text-sm font-medium">Location *</Label>
                    <Select
                      value={jobForm.location}
                      onValueChange={(value) =>
                        setJobForm((prev) => ({ ...prev, location: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      Salary Range (LPA)
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
                        placeholder="e.g., 5-8 LPA"
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
                        setJobForm((prev) => ({ ...prev, isUrgent: checked }))
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
                        setJobForm((prev) => ({ ...prev, isRemote: checked }))
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

                      {askQuestionEnabled && (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={newQuestion}
                              onChange={(e) => setNewQuestion(e.target.value)}
                              placeholder="Enter a question..."
                              className="flex-1"
                            />
                            <Button type="button" onClick={handleAddQuestion} variant="outline">
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
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Manage Your Jobs</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={jobFilter} onValueChange={setJobFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-48"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
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
                              <span>{job.experience}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>
                                Posted:{" "}
                                {new Date(job.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center text-blue-600">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{job.applications} Applications</span>
                            </div>
                            <div className="flex items-center text-green-600">
                              <Eye className="w-4 h-4 mr-1" />
                              <span>{job.views} Views</span>
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
                                {job.status === "Active" ? (
                                  <>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Close Job
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
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
                                <Badge className={getWorkModeColor(selectedJob.work_mode)}>
                                  {selectedJob.work_mode}
                                </Badge>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Posted {getTimeSincePosted(selectedJob.created_at)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Job Description */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h4>
                            <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                          </div>

                          {/* Requirements */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
                            <ul className="space-y-2">
                              {selectedJob.requirements}
                            </ul>
                          </div>

                          {/* Responsibilities */}
                          {/* <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h4>
                            <ul className="space-y-2">
                              {selectedJob.responsibilities.map((resp, index) => (
                                <li key={index} className="flex items-start">
                                  <Star className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          */}
                          {/* Benefits */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h4>
                            <ul className="space-y-2">
                              {selectedJob.benefits}
                            </ul>
                          </div>
        
                          {/* Skills */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedJob.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                         {/* questions */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Questions</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedJob.questions && selectedJob.questions.length > 0 ? (
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
                                <p className="text-gray-500 text-sm">No questions added</p>
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
          <DialogTitle className="text-2xl font-bold">Edit Job Profile</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Left Column */}
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input name="title" value={jobForm.title || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })}/>
            </div>
            <div>
              <Label>Category</Label>
              <Input name="category" value={jobForm.category?.name || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })} />
            </div>
            <div>
              <Label>Job Title</Label>
              <Input name="jobTitle" value={jobForm.jobTitle || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })} />
            </div>
            <div>
              <Label>Company</Label>
              <Input name="company"  value={jobForm.company || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })}/>
            </div>
            <div>
              <Label>Location</Label>
              <Input name="location" value={jobForm.location?.name || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })} />
            </div>
            <div>
              <Label>Experience</Label>
              <Input name="experience" value={jobForm.experience || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })} />
            </div>
            <div>
              <Label>Salary</Label>
              <Input name="salary" value={jobForm.salary || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })} />
            </div>
            <div>
              <Label>Currency</Label>
              <Input name="currency" value={jobForm.currency || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div>
              <Label>Job Type</Label>
              <Input name="job_type" value={jobForm.job_type|| ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })} />
            </div>
            <div>
              <Label>Work Mode</Label>
              <Input name="workMode" value={jobForm.workMode || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={jobForm.description || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Textarea
                name="requirements"
                value={jobForm.requirements || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Benefits</Label>
              <Textarea
                name="benefits"
                value={jobForm.benefits || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Skills</Label>
              <Textarea
                name="skills"
                value={jobForm.skills || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Application Deadline</Label>
              <Input
                type="date"
                name="applicationDeadline"
                value={jobForm.applicationDeadline || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })}
              />
            </div>
            <div>
              <Label>Vacancies</Label>
              <Input
                type="number"
                name="vacancies"
                value={jobForm.vacancies || ""} onChange={(e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value })}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                 checked={jobForm.isUrgent === true} onCheckedChange={(checked) => setJobForm({ ...jobForm, isUrgent: !!checked })}
                />
                <Label>Urgent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={jobForm.isRemote === true} onCheckedChange={(remote) => setJobForm({ ...jobForm, isUrgent: !!remote })}
                  
                />
                <Label>Remote</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost">
            Cancel
          </Button>
          {/* FIX : Put the Onclick handle update method */}
          <Button onClick={handleUpdateJob} >Save Changes</Button>
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
                    <CardTitle className="text-lg">Applications</CardTitle>
                    <Badge variant="secondary">{candidates.length}</Badge>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search candidates..."
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        onClick={() => { setSelectedCandidate(candidate); }}
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Candidate Profile */}
            <div className="lg:col-span-2">
              {selectedCandidate ? (
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
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
                      <div className="flex items-center space-x-2">
                    <Link href={`mailto:${selectedCandidate.email}`}>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </Link>
                       <Link href={`tel:${selectedCandidate.phone}`}>
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                      </Link>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          {selectedCandidate.resumeUrl ? (
                            <a href={selectedCandidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline inline-flex items-center gap-1">
                              View Resume
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">No resume uploaded</span>
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
                          <span>{selectedCandidate.phone}</span>
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
                    {Array.isArray(selectedCandidate.qa) && selectedCandidate.qa.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Application Q&A</h4>
                    <div className="space-y-3">
                      {selectedCandidate.qa.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded p-3">
                          <p className="text-sm font-medium text-gray-800">Q{(item.question_index ?? index) + 1}. {item.question_text || 'Question'}</p>
                          <p className="text-sm text-gray-700 mt-1">{item.answer_text || '-'}</p>
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                      <Button className="bg-green-600 hover:bg-green-700 flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Shortlist Candidate
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50 flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Application
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Schedule Interview
                      </Button>
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
                  setJobForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            {/* Company */}
            <div>
              <Label>Company</Label>
              <Input
                value={jobForm.company}
                onChange={(e) =>
                  setJobForm((prev) => ({ ...prev, company: e.target.value }))
                }
              />
            </div>
            {/* Salary */}
            <div>
              <Label>Salary</Label>
              <Input
                value={jobForm.salary}
                onChange={(e) =>
                  setJobForm((prev) => ({ ...prev, salary: e.target.value }))
                }
              />
            </div>
            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                value={jobForm.description}
                onChange={(e) =>
                  setJobForm((prev) => ({ ...prev, description: e.target.value }))
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
          <p className="text-gray-600 mb-2">Company: {selectedJob?.company}</p>
          <p className="text-gray-600 mb-2">Salary: {selectedJob?.salary}</p>
          <p className="text-gray-600 mb-2">
            Description: {selectedJob?.description}
          </p>
          <p className="text-gray-600 mb-2">Status: {selectedJob?.status}</p>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
}
