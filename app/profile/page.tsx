"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { BookmarkX } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Edit,
  Camera,
  Download,
  Eye,
  Star,
  Building2,
  Clock,
  DollarSign,
  Menu,
  X,
  Upload,
  Trash2,
  Save,
  Bookmark,
  Ambulance as Cancel,
} from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import exp from "node:constants";

export default function Profile() {
  // Form states, data, and functions, etc.
  const { savedJobs, removeSavedJob } = useSavedJobs();

  const [profileData, setProfileData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      phoneCode: "",
      countryId: "",
      stateId: "",
      cityId: "",
      currentcurrency: "",
      expectedCurrency: "",
      experience: "",
      currentSalary: "",
      expectedSalary: "",
      noticePeriod: "",
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    summary: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [activeSection, setActiveSection] = useState("personal");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState({
    resume: false,
  });
  const [open, setOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [newSkill, setNewSkill] = useState("");

  // States for inline forms
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);
  const [majors, setMajors] = useState([]);
  const [majorSearch, setMajorSearch] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [experienceForm, setExperienceForm] = useState({
    company: "",
    category_id: "",
    job_title_id: "",
    location_id: "",
    startDate: null,
    endDate: null,
    isCurrentJob: false,
    description: "",
  });
  
  const [educationForm, setEducationForm] = useState({
    degree: "",
    field: "",
    institution: "",
    year: null,
    percentage: "",
    score_type: "",
  });

  const [certificationForm, setCertificationForm] = useState({
    name: "",
    issuer: "",
    year: null,
  });

  const sections = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Award },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "save", label: "Jobs", icon: Briefcase },
  ];
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [savedJobsData, setSavedJobsData] = useState([]);
  const [activeSaveTab, setActiveSaveTab] = useState("SavedJobs");
  const [isProfileSubmitted, setIsProfileSubmitted] = useState(false);

  const [noticeRanges] = useState([
    "1-15 days",
    "15-30 days",
    "30-60 days",
    "60-90 days",
    "90+ days",
  ]);

  const fileInputRef = useRef(null);
  // Give the refrence to the Resume button
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Functions to handle inline forms

  const getCategoryName = (id) =>
    jobCategories.find((c) => c.id === id)?.name || "";

  const getJobTitleName = (id) =>
    jobTitles.find((t) => t.id === id)?.title || "";

  const resetExperienceForm = () => {
    setExperienceForm({
      company: "",
      category_id: "",
      job_title_id: "",
      location_id: "",
      startDate: null,
      endDate: null,
      isCurrentJob: false,
      description: "",
    });
  };
  

  const resetEducationForm = () => {
    setEducationForm({
      degree: "",
      field: "",
      institution: "",
      year: null,
      percentage: "",
      score_type: "",
    });
  };

  const resetCertificationForm = () => {
    setCertificationForm({
      name: "",
      issuer: "",
      year: null,
    });
  };

  const handleAddExperience = () => {
    resetExperienceForm();
    setShowAddExperience(true);
    setEditingExperience(null);
  };
  const handleEditExperience = (exp) => {
    const startDate = exp.start_date ? dayjs(exp.start_date) : null;
    const endDate = exp.end_date ? dayjs(exp.end_date) : null;

    setExperienceForm({
      company: exp.company || "",
      job_title_id: exp.job_title?.id?.toString() || "",
      startDate: startDate,
      endDate: endDate,
      isCurrentJob: !exp.end_date,
      location_id: exp.location?.id?.toString() || "",
      category_id: exp.category?.id?.toString() || "",
      description: exp.description || "",
    });
    setEditingExperience(exp);
    setShowAddExperience(true);
  };

  const handleSaveExperience = () => {
    if (
      !experienceForm.company ||
      !experienceForm.category_id ||
      !experienceForm.job_title_id ||
      !experienceForm.startDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const formattedStart = experienceForm.startDate?.format("YYYY-MM-DD");
    const formattedEnd = experienceForm.isCurrentJob
      ? null
      : experienceForm.endDate?.format("YYYY-MM-DD");

    const newExperience = {
      id: editingExperience ? editingExperience.id : Date.now(),
      company: experienceForm.company,
      category_id: experienceForm.category_id,
      job_title_id: experienceForm.job_title_id,
      start_date: formattedStart,
      end_date: formattedEnd,
      location_id: experienceForm.location_id,
      description: experienceForm.description,
    };

    if (editingExperience) {
      setProfileData((prev) => ({
        ...prev,
        experience: prev.experience.map((exp) =>
          exp.id === editingExperience.id ? newExperience : exp
        ),
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        experience: [...prev.experience, newExperience],
      }));
    }

    setShowAddExperience(false);
    setEditingExperience(null);
    resetExperienceForm();
  };

  const handleCancelExperience = () => {
    setShowAddExperience(false);
    setEditingExperience(null);
    resetExperienceForm();
  };

  const handleAddEducation = () => {
    resetEducationForm();
    setShowAddEducation(true);
    setEditingEducation(null);
  };

  const handleEditEducation = (edu) => {
    setEducationForm({
      degree: edu.degree,
      field: edu.field,
      institution: edu.institution,
      year: edu.year ? dayjs(edu.year, "YYYY") : null,
      percentage: edu.percentage,
      score_type: edu.score_type ? edu.score_type.toLowerCase() : "",
    });
    setEditingEducation(edu);
    setShowAddEducation(true);
  };

  const handleSaveEducation = () => {
    if (
      !educationForm.degree ||
      !educationForm.field ||
      !educationForm.institution ||
      !educationForm.score_type
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newEducation = {
      id: editingEducation ? editingEducation.id : Date.now(),
      degree: educationForm.degree,
      field: educationForm.field,
      institution: educationForm.institution,
      year: educationForm.year ? educationForm.year.format("YYYY") : "",
      percentage: educationForm.percentage,
      score_type : educationForm.score_type,
    };

    if (editingEducation) {
      setProfileData((prev) => ({
        ...prev,
        education: prev.education.map((edu) =>
          edu.id === editingEducation.id ? newEducation : edu
        ),
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        education: [...prev.education, newEducation],
      }));
    }

    setShowAddEducation(false);
    setEditingEducation(null);
    resetEducationForm();
  };

  const handleCancelEducation = () => {
    setShowAddEducation(false);
    setEditingEducation(null);
    resetEducationForm();
  };

  const handleAddCertification = () => {
    resetCertificationForm();
    setShowAddCertification(true);
    setEditingCertification(null);
  };

  const handleEditCertification = (cert) => {
    setCertificationForm({
      name: cert.name,
      issuer: cert.issuer,
      year: cert.year ? dayjs(cert.year, "YYYY") : null,
    });
    setEditingCertification(cert);
    setShowAddCertification(true);
  };

  const handleSaveCertification = () => {
    if (!certificationForm.name || !certificationForm.issuer) {
      alert("Please fill in all required fields");
      return;
    }

    const newCertification = {
      id: editingCertification ? editingCertification.id : Date.now(),
      name: certificationForm.name,
      issuer: certificationForm.issuer,
      year: certificationForm.year ? certificationForm.year.format("YYYY") : "",
    };

    if (editingCertification) {
      setProfileData((prev) => ({
        ...prev,
        certifications: prev.certifications.map((cert) =>
          cert.id === editingCertification.id ? newCertification : cert
        ),
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification],
      }));
    }

    setShowAddCertification(false);
    setEditingCertification(null);
    resetCertificationForm();
  };

  const handleCancelCertification = () => {
    setShowAddCertification(false);
    setEditingCertification(null);
    resetCertificationForm();
  };

  const handleNext = () => {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleDeleteItem = (type, id) => {
    setProfileData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
      alert(`Selected: ${file.name}`);
    }
  };

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        if (!token) {
          console.error("User not logged in — token missing");
          return;
        }

        const res = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/master/api/majors/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        console.log("MAJORS API DATA ---->", data);

        setMajors(data);
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchMajors();
  }, []);

  // Fetch and send The Data From API
  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/api/profile/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("Fetched profile:", data);

          setProfileData({
            personalInfo: {
              fullName: data.full_name || "",
              email: data.email || "",
              phone: data.phone || "",
              phoneCode: data.phone_code || "",
              countryId: data?.country?.id?.toString() ?? "",
              stateId: data?.state?.id?.toString() ?? "",
              cityId: data?.city?.id?.toString() ?? "",
              experience: data.experience || "",
              currentSalary: data.current_salary || "",
              expectedSalary: data.expected_salary || "",
              currentcurrency: data?.current_currency?.id?.toString() ?? "",
              expectedCurrency: data?.expected_currency?.id?.toString() ?? "",
              noticePeriod: data?.notice_period || "",
              resume: data.resume,

                  profile_image: data.profile_image || profileData.personalInfo.profile_image,

            },
            experience: (data.experiences || []).map(exp => ({
              ...exp,
              category_id: exp.category?.id ?? "",
              job_title_id: exp.job_title?.id ?? "",
              location_id: exp.location?.id ?? "",
            })),
            education: (data.educations || []).map(e => ({
              ...e,
              score_type: e.score_type?.toLowerCase() || "cgpa",
            })),
            skills: (data.skills || []).map((skill) => skill.name),
            certifications: data.certifications || [],
            summary: "", // Optional: if you use a summary field
          });
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/api/saved-jobs-all/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("Saved jobs data:", data);
          setSavedJobsData(data);
        } else {
          console.error("Failed to fetch saved jobs");
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      }
    };

    fetchSavedJobs();
  }, []);

  useEffect(() => {
    fetch("https://jobseeker-backend-jy1y.onrender.com/master/api/currencies/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Currency data:", data);
        setCurrency(data);
      });
  }, []);
  useEffect(() => {
    fetch("https://jobseeker-backend-jy1y.onrender.com/master/api/countries/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Country data:", data);
        setCountries(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (profileData.personalInfo.countryId) {
      fetch(
        `https://jobseeker-backend-jy1y.onrender.com/master/api/states/?country_id=${profileData.personalInfo.countryId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setStates(data);
        })
        .catch((err) => console.error(err));
    }
  }, [profileData.personalInfo.countryId]);

  useEffect(() => {
    if (profileData.personalInfo.stateId) {
      fetch(
        `https://jobseeker-backend-jy1y.onrender.com/master/api/cities/?state=${profileData.personalInfo.stateId}`
      )
        .then((res) => res.json())
        .then(setCities)
        .catch((err) => console.error(err));
    }
  }, [profileData.personalInfo.stateId]);

  useEffect(() => {
    fetch("https://jobseeker-backend-jy1y.onrender.com/master/api/companies/")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(
      "https://jobseeker-backend-jy1y.onrender.com/master/api/jobs_category/"
    )
      .then((res) => res.json())
      .then((data) => {
        setJobCategories(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (experienceForm.category_id) {
      fetch(
        `https://jobseeker-backend-jy1y.onrender.com/master/api/jobs_title/?category=${experienceForm.category_id}`
      )
        .then((res) => res.json())
        .then((data) => {
          setJobTitles(data);
        })
        .catch((err) => console.error(err));
    }
  }, [experienceForm.category_id]);

  const uploadResume = async () => {
    if (!resumeFile) return true;

    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const res = await fetch(
        "https://jobseeker-backend-jy1y.onrender.com/api/profile/upload-resume/",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("Resume uploaded:", data.resume_url);
        console.log("Resume Data uploaded:", data);
        setProfileData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            resume: data.resume_url || data.resume,
          },
        }));
        setIsDialogOpen(prev => ({ ...prev, resume: false }));
        setResumeFile(null);
        return true;
      } else {
        const error = await res.json();
        console.error("Failed to upload resume:", error);
        alert(`Resume upload failed: ${error.message || "Unknown error"}`);
        return false;
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Network error while uploading resume");
      return false;
    }
  };

 const uploadProfileImage = async () => {
  if (!selectedImage) return true;

  const formData = new FormData();
  formData.append("profile_image", selectedImage);

  const res = await fetch(
    "https://jobseeker-backend-jy1y.onrender.com/api/profile/",
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: formData,
    }
  );

  return res.ok;
};

useEffect(() => {
  const submitted = localStorage.getItem("profile_submitted");
  if (submitted === "true") {
    setIsProfileSubmitted(true);
  }
}, []);


  // Save Api
  const handleSaveProfile = async () => {
    const resumeUploaded = await uploadResume();
    if (!resumeUploaded) {
      alert("Resume upload failed. Please try again.");
      return;
    }
    if (selectedImage) {
 
  const imageUploaded = await uploadProfileImage();
  if (!imageUploaded) {
    alert("Image upload failed");
    return;
  }
}


    const payload = {
      full_name: profileData.personalInfo.fullName,
      email: profileData.personalInfo.email,
      phone: profileData.personalInfo.phone,
      phone_code: profileData.personalInfo.phoneCode,
      experience: profileData.personalInfo.experience,
      current_salary: profileData.personalInfo.currentSalary,
      expected_salary: profileData.personalInfo.expectedSalary,
      current_currency_id: profileData.personalInfo.currentcurrency
        ? Number(profileData.personalInfo.currentcurrency)
        : null,

      expected_currency_id: profileData.personalInfo.expectedCurrency
        ? Number(profileData.personalInfo.expectedCurrency)
        : null,

      notice_period: profileData.personalInfo.noticePeriod,
      country_id: profileData.personalInfo.countryId
        ? Number(profileData.personalInfo.countryId)
        : null,
      state_id: profileData.personalInfo.stateId
        ? Number(profileData.personalInfo.stateId)
        : null,
      city_id: profileData.personalInfo.cityId
        ? Number(profileData.personalInfo.cityId)
        : null,
      experiences: profileData.experience.map(exp => ({
        id: exp.id,
        company: exp.company,
        category_id: exp.category_id ? Number(exp.category_id) : null,
        job_title_id: exp.job_title_id ? Number(exp.job_title_id) : null,
        location_id: exp.location_id ? Number(exp.location_id) : null,
        start_date: exp.start_date,
        end_date: exp.end_date,
        description: exp.description,
      })),
      educations: profileData.education.map((edu) => ({
        ...edu,
        score_type: edu.score_type?.toLowerCase() || "cgpa",
      })),
      certifications: profileData.certifications,
      skills: profileData.skills.map((name) => ({ name })),
    };
 
    console.log("Payload:", payload);
    console.log("Token:", localStorage.getItem("auth_token"));
    const res = await fetch(
      "https://jobseeker-backend-jy1y.onrender.com/api/profile/",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(payload),
      }
    );
    console.log("Response:", res);
    if (res.ok) {
      try {
        const data = await res.json();
        // Normalize and set freshly returned data so the UI reflects what is persisted
        setProfileData({
          personalInfo: {
            fullName: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            phoneCode: data.phone_code || "",
            countryId: data.country?.id?.toString() || "",
            stateId: data.state?.id?.toString() || "",
            cityId: data.city?.id?.toString() || "",
            experience: data.experience || "",
            currentSalary: data.current_salary || "",
            expectedSalary: data.expected_salary || "",
            currentcurrency: data.current_currency?.id?.toString() || "",
            expectedCurrency: data.expected_currency?.id?.toString() || "",
            noticePeriod: data.notice_period || "",
            resume: data.resume || profileData.personalInfo.resume,
            profile_image: data.profile_image || profileData.personalInfo.profile_image,
          },
          experience: data.experiences || [],
          education: data.educations || [],
          skills: (data.skills || []).map((s) => s.name),
          certifications: data.certifications || [],
          summary: profileData.summary,
        });
      } catch (e) {
        // If response has no JSON body, silently skip state update
        console.warn("Profile saved; response body parse skipped", e);
      }
      localStorage.setItem("profile_submitted", "true");
      setIsProfileSubmitted(true);
      alert("Profile saved successfully!");
    } else {
      const errText = await res.text();
      console.error("Save profile failed:", errText);
      alert(`Error saving profile. ${errText}`);
    }
  };

  // Fetch User Data for Profile Name, Email, Phone
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.warn("No auth token found");
          return;
        }

        const res = await fetch(
          "https://jobseeker-backend-jy1y.onrender.com/api/register/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch user data");
          return;
        }

        const data = await res.json();
        console.log("Register API data:", data);

        // ✅ Handle both single object or array API responses
        const user = Array.isArray(data) ? data[0] : data;

        setProfileData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            fullName: user.full_name || user.name || "",
            email: user.email || "",
            phone: user.phone || user.number || "",
          },
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="grid lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Left Sidebar - Profile Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="lg:sticky lg:top-24">
                <CardContent className="p-4 lg:p-6">
                  <div className="text-center mb-4 lg:mb-6">
            
                  <div className="relative inline-block">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-3 lg:mb-4">
    
                   {selectedImage ? (
                    <img
                    src={URL.createObjectURL(selectedImage)}
                    className="w-full h-full object-cover"
                    alt="Profile Preview"
                    />
                  ) : profileData.personalInfo.profile_image ? (
                  <img
                   src={profileData.personalInfo.profile_image}
                   className="w-full h-full object-cover"
                   alt="Profile"
                  />
                  ) : (
                  <User className="w-10 h-10 lg:w-12 lg:h-12 text-purple-600" />
                  )}
                </div>

                  <label className="absolute bottom-0 right-0 w-6 h-6 lg:w-8 lg:h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors cursor-pointer">
                   <Camera className="w-3 h-3 lg:w-4 lg:h-4" />
                   <input
                   type="file"
                   accept="image/*"
                   className="hidden"
                   onChange={(e) => {
                   const file = e.target.files[0];
                   if (file) setSelectedImage(file);
                    }}
                    />
                  </label>
             </div>




                    <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
                      {profileData.personalInfo.fullName}
                    </h2>
                  </div>

                  <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                    <div className="flex items-center justify-between text-xs lg:text-sm">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">
                        {profileData.personalInfo.experience}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs lg:text-sm">
                      <span className="text-gray-600">Current Salary</span>
                      <span className="font-medium">
                        {profileData.personalInfo.currentSalary}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs lg:text-sm">
                      <span className="text-gray-600">Notice Period</span>
                      <span className="font-medium">
                        {profileData.personalInfo.noticePeriod}
                      </span>
                    </div>
                  </div>

                  {/* <div className="space-y-2">
                    <Dialog
                      open={isDialogOpen.resume}
                      onOpenChange={(open) =>
                        setIsDialogOpen((prev) => ({ ...prev, resume: open }))
                      }
                    >
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm lg:text-base h-10 lg:h-11">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Resume
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Upload Resume</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-600 mb-4">
                              Choose a file or drag and drop it here
                            </p>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleResumeUpload}
                              ref={fileInputRef}
                              className="hidden"
                              id="resume-upload"
                            />
                            <label htmlFor="resume-upload">
                              <Button
                                variant="outline"
                                className="cursor-pointer"
                                onClick={openFileDialog}
                              >
                                Select File
                              </Button>
                            </label>
                            <p className="text-xs text-gray-500 mt-2">
                              PDF, DOC, DOCX up to 5MB
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                     <Button
                      variant="outline"
                      className="w-full text-sm lg:text-base h-10 lg:h-11"
                      onClick={() => {
                        if (profileData?.personalInfo?.resume) {
                          window.open(`https://jobseeker-backend-jy1y.onrender.com${profileData.personalInfo.resume}`, "_blank");
                        } else {
                          alert("No resume uploaded.");
                        }
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                    <Link href="/review">
                      <Button
                        variant="outline"
                        className="w-full text-sm lg:text-base h-10 lg:h-11"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Profile
                      </Button>
                    </Link>
                  </div> */}
                  <div className="space-y-2">
                    <Dialog
                      open={isDialogOpen.resume}
                      onOpenChange={(open) =>
                        setIsDialogOpen((prev) => ({ ...prev, resume: open }))
                      }
                    >
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm lg:text-base h-10 lg:h-11">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Resume
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Upload Resume</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                          {profileData?.personalInfo?.resume && (
                            <p className="text-sm font-medium text-green-600 truncate">
                              Current Resume:{" "}
                              <span className="text-gray-700">
                                {profileData?.personalInfo?.resume
                                  .split("/")
                                  .pop()}
                              </span>
                            </p>
                          )}

                          {resumeFile && (
                              <p className="text-sm font-medium text-blue-600 truncate">
                                Selected File: <span className="text-gray-700">{resumeFile.name}</span>
                              </p>
                            )}

                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-600 mb-4">
                              Choose a file or drag and drop it here
                            </p>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleResumeUpload}
                              ref={fileInputRef}
                              className="hidden"
                              id="resume-upload"
                            />
                            <label htmlFor="resume-upload">
                              <Button
                                variant="outline"
                                className="cursor-pointer"
                                onClick={openFileDialog}
                              >
                                Select File
                              </Button>
                            </label>
                            <p className="text-xs text-gray-500 mt-2">
                              PDF, DOC, DOCX up to 5MB
                            </p>
                          </div>
                          <Button
                            onClick={uploadResume}
                            disabled={!resumeFile}
                            className={`w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600
                            hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11 mt-6
                            ${!resumeFile ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            SUBMIT
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* DOWNLOAD BUTTON */}
                    <a
                      href={profileData?.personalInfo?.resume || "#"}
                      download
                      className="block"
                    >
                      <Button
                        variant="outline"
                        className="w-full text-sm lg:text-base h-10 lg:h-11"
                        disabled={!profileData?.personalInfo?.resume}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </Button>
                    </a>

                    {/* PREVIEW BUTTON */}
                   {isProfileSubmitted && (
                      <Link href="/review">
                        <Button
                          variant="outline"
                          className="w-full text-sm lg:text-base h-10 lg:h-11"
                        >
                         <Eye className="w-4 h-4 mr-2" />
                          Preview Profile
                        </Button>
                      </Link>
                   )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {/* Mobile Section Selector */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  className="w-full justify-between h-12"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="flex items-center space-x-2">
                    {(() => {
                      const currentSection = sections.find(
                        (s) => s.id === activeSection
                      );
                      const IconComponent = currentSection?.icon || User;
                      return (
                        <>
                          <IconComponent className="w-4 h-4" />
                          <span>{currentSection?.label}</span>
                        </>
                      );
                    })()}
                  </span>
                  {isMobileMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </Button>
                {isMobileMenuOpen && (
                  <Card className="mt-2 shadow-lg">
                    <CardContent className="p-2">
                      <div className="space-y-1">
                        {sections.map((section) => {
                          const IconComponent = section.icon;
                          return (
                            <button
                              key={section.id}
                              onClick={() => {
                                setActiveSection(section.id);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                                activeSection === section.id
                                  ? "bg-purple-100 text-purple-700"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                              <span>{section.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Desktop Navigation Tabs */}
              <div className="hidden lg:block bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
                <div className="flex border-b">
                  <div className="flex border-b relative">
                    {sections.map((tab) => {
                      const IconComponent = tab.icon;

                      // ✅ Normal hover dropdown for "Save"
                      if (tab.id === "save") {
                        return (
                          <div key={tab.id} className="relative group">
                            <button
                              className={`flex items-center space-x-2 px-4 xl:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                ["SavedJobs", "AppliedJobs"].includes(
                                  activeSection
                                )
                                  ? "border-purple-600 text-purple-600"
                                  : "border-transparent text-gray-600 hover:text-purple-600"
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                              <span className="hidden xl:inline">
                                {tab.label}
                              </span>
                            </button>

                            {/* 👇 fixed dropdown - detached from clipped container */}
                            <div
                              className="hidden group-hover:block fixed bg-white border border-gray-200 rounded-lg shadow-lg w-56 z-[9999] mt-1"
                              style={{
                                transform: "translateX(-10px)",
                                top: "70px",
                              }}
                            >
                              <ul className="text-sm text-gray-700">
                                <li
                                  onClick={() => setActiveSection("SavedJobs")}
                                  className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                                >
                                  Saved Jobs
                                </li>
                                <li
                                  onClick={() =>
                                    setActiveSection("AppliedJobs")
                                  }
                                  className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                                >
                                  Applied Jobs
                                </li>
                              </ul>
                            </div>
                          </div>
                        );
                      }

                      // ✅ Default tab buttons
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSection(tab.id)}
                          className={`flex items-center space-x-2 px-4 xl:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeSection === tab.id
                              ? "border-purple-600 text-purple-600"
                              : "border-transparent text-gray-600 hover:text-purple-600"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="hidden xl:inline">{tab.label}</span>
                          <span className="xl:hidden">
                            {tab.label.split(" ")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              {activeSection === "personal" && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                      <User className="w-5 h-5" />
                      <span>Personal Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          value={profileData.personalInfo.fullName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                fullName: e.target.value,
                              },
                            }))
                          }
                          className="mt-1 h-10 lg:h-11"
                          required={true}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.personalInfo.email}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                email: e.target.value,
                              },
                            }))
                          }
                          className="mt-1 h-10 lg:h-11"
                          required={true}
                        />
                      </div>

                      {/* <div>
  <Label htmlFor="fullName" className="text-sm font-medium">
    Full Name *
  </Label>
  <Input
    id="fullName"
    value={profileData.personalInfo.fullName}
    onChange={(e) =>
      setProfileData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: e.target.value,
        },
      }))
    }
    className="mt-1 h-10 lg:h-11"
  />
</div> */}

                      {/* <div>
  <Label htmlFor="email" className="text-sm font-medium">
    Email Address *
  </Label>
  <Input
    id="email"
    type="email"
    value={profileData.personalInfo.email}
    onChange={(e) =>
      setProfileData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          email: e.target.value,
        },
      }))
    }
    className="mt-1 h-10 lg:h-11"
  />
</div> */}

                     
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number *
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Select
                            value={profileData.personalInfo.phoneCode || ""}
                            disabled
                            onValueChange={(value) =>
                              setProfileData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  phoneCode: value,
                                },
                              }))
                            }
                          >
                            <SelectTrigger className="w-20 h-10 lg:h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem
                                  key={country.id}
                                  value={country.phonecode}
                                >
                                  +{country.phonecode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="phone"
                            value={profileData.personalInfo.phone}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  phone: e.target.value,
                                },
                              }))
                            }
                            className="flex-1 h-10 lg:h-11"
                            placeholder="Enter phone number"
                            required={true}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Country *</Label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="w-full mt-1 h-10 lg:h-11 border rounded px-3 text-left">
                              {profileData.personalInfo.countryId
                                ? countries.find(
                                    (c) =>
                                      c.id == profileData.personalInfo.countryId
                                  )?.name
                                : "Select country"}
                            </button>
                          </PopoverTrigger>

                          <PopoverContent className="p-0 w-[300px]">
                            <Command
                              filter={(value, search) =>
                                value
                                  .toLowerCase()
                                  .startsWith(search.toLowerCase())
                                  ? 1
                                  : 0
                              }
                            >
                              <CommandInput placeholder="Search country..." />

                              <CommandList>
                                {countries.map((country) => (
                                  <CommandItem
                                    key={country.id}
                                    value={country.name}
                                    onSelect={() => {
                                      setProfileData((prev) => ({
                                        ...prev,
                                        personalInfo: {
                                          ...prev.personalInfo,
                                          countryId: country.id,
                                          stateId: "",
                                          cityId: "",
                                          phoneCode: country.phonecode,
                                        },
                                      }));
                                    }}
                                  >
                                    {country.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">State *</Label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="w-full mt-1 h-10 lg:h-11 border rounded px-3 text-left">
                              {profileData.personalInfo.stateId
                                ? states.find(
                                    (s) =>
                                      s.id == profileData.personalInfo.stateId
                                  )?.name
                                : "Select state"}
                            </button>
                          </PopoverTrigger>

                          <PopoverContent className="p-0 w-[300px]">
                            <Command
                              filter={(value, search) =>
                                value
                                  .toLowerCase()
                                  .startsWith(search.toLowerCase())
                                  ? 1
                                  : 0
                              }
                            >
                              <CommandInput placeholder="Search state..." />

                              <CommandList>
                                {states.map((state) => (
                                  <CommandItem
                                    key={state.id}
                                    value={state.name}
                                    onSelect={() => {
                                      setProfileData((prev) => ({
                                        ...prev,
                                        personalInfo: {
                                          ...prev.personalInfo,
                                          stateId: state.id,
                                          cityId: "",
                                        },
                                      }));
                                    }}
                                  >
                                    {state.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          City *
                        </Label>

                        <Popover open={cityOpen} onOpenChange={setCityOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between mt-1 h-12"
                            >
                              {profileData.personalInfo.cityId
                                ? cities.find(
                                    (c) =>
                                      c.id == profileData.personalInfo.cityId
                                  )?.name
                                : "Select city"}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent align="start" className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search city..."
                                value={citySearch}
                                onValueChange={setCitySearch}
                              />

                              <CommandList className="max-h-60 overflow-y-auto">
                                <CommandEmpty>No city found.</CommandEmpty>

                                <CommandGroup>
                                  {cities
                                    .filter((city) =>
                                      city.name
                                        .toLowerCase()
                                        .startsWith(citySearch.toLowerCase())
                                    )
                                    .map((city) => (
                                      <CommandItem
                                        key={city.id}
                                        value={city.name}
                                        onSelect={() => {
                                          setProfileData((prev) => ({
                                            ...prev,
                                            personalInfo: {
                                              ...prev.personalInfo,
                                              cityId: city.id,
                                            },
                                          }));
                                          setCityOpen(false);
                                        }}
                                      >
                                        {city.name}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label
                          htmlFor="experience"
                          className="text-sm font-medium"
                        >
                          Total Experience
                        </Label>
                        <Select
                          value={profileData.personalInfo.experience}
                          onValueChange={(value) =>
                            setProfileData((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                experience: value,
                              },
                            }))
                          }
                          required={true}
                        >
                          <SelectTrigger className="mt-1 h-10 lg:h-11">
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fresher">Fresher</SelectItem>
                            <SelectItem value="1 year">1 year</SelectItem>
                            <SelectItem value="2 years">2 years</SelectItem>
                            <SelectItem value="3 years">3 years</SelectItem>
                            <SelectItem value="4 years">4 years</SelectItem>
                            <SelectItem value="5+ years">5+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor="noticePeriod"
                          className="text-sm font-medium"
                        >
                          Notice Period
                        </Label>
                        <Select
                          value={profileData.personalInfo.noticePeriod}
                          onValueChange={(value) =>
                            setProfileData((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                noticePeriod: value,
                              },
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1 h-10 lg:h-11">
                            <SelectValue placeholder="Select notice period" />
                          </SelectTrigger>
                          <SelectContent>
                            {noticeRanges.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor="currentSalary"
                          className="text-sm font-medium"
                        >
                          Current Salary (PA)
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Select
                            value={
                              profileData.personalInfo.currentcurrency || ""
                            }
                            onValueChange={(value) =>
                              setProfileData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  currentcurrency: value,
                                },
                              }))
                            }
                            required={true}
                          >
                            <SelectTrigger className="w-20 h-10 lg:h-11">
                              <SelectValue placeholder="INR" />
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
                            id="currentSalary"
                            type="number"
                            value={profileData.personalInfo.currentSalary}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  currentSalary: e.target.value,
                                },
                              }))
                            }
                            className="flex-1 h-10 lg:h-11"
                            placeholder="Enter amount"
                            max="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="expectedSalary"
                          className="text-sm font-medium"
                        >
                          Expected Salary (PA)
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Select
                            value={
                              profileData.personalInfo.expectedCurrency || ""
                            }
                            onValueChange={(value) =>
                              setProfileData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  expectedCurrency: value,
                                },
                              }))
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
                            id="expectedSalary"
                            type="number"
                            value={profileData.personalInfo.expectedSalary}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  expectedSalary: e.target.value,
                                },
                              }))
                            }
                            className="flex-1 h-10 lg:h-11"
                            placeholder="Enter amount"
                            max="0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                    <Button
                      onClick={handleSaveProfile}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11 mt-6"
                    >
                      SUBMIT
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11 mt-6"
                    >
                      Next
                    </Button>
                    
                  </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience Section */}
              {activeSection === "experience" && (
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                        <Briefcase className="w-5 h-5" />
                        <span>Work Experience</span>
                      </CardTitle>
                      <Button
                        size="sm"
                        onClick={handleAddExperience}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 lg:space-y-6">
                      {/* Existing Experience Items */}
                      {profileData.experience.map((exp) => (
                        <div
                          key={exp.id}
                          className="border rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div className="flex items-start space-x-3 lg:space-x-4">
                              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-base lg:text-lg text-gray-900 break-words">
                                  {getJobTitleName(exp.job_title_id)}
                                </h3>
                                <p className="text-purple-600 font-medium text-sm lg:text-base break-words">
                                  {exp.company}
                                </p>
                                {exp.category && (
                                  <p className="text-gray-600 text-sm break-words">
                                    {getCategoryName(exp.category_id)}
                                  </p>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs lg:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" />
                                    <span>
                                      {exp.start_date &&
                                        dayjs(exp.start_date).format(
                                          "MMM YYYY DD"
                                        )}{" "}
                                      -{" "}
                                      {exp.end_date
                                        ? dayjs(exp.end_date).format(
                                            "MMM YYYY DD"
                                          )
                                        : "Present"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditExperience(exp)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteItem("experience", exp.id)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}

                      {/* Add/Edit Experience Form */}
                      {showAddExperience && (
                        <Card className="border-2 border-purple-200 ">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg">
                              {editingExperience
                                ? "Edit Experience"
                                : "Add New Experience"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">
                                  Company *
                                </Label>
                                <Select
                                  value={experienceForm.company || ""}
                                  onValueChange={(value) =>
                                    setExperienceForm((prev) => ({
                                      ...prev,
                                      company: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger className="mt-1 h-10 lg:h-11">
                                    <SelectValue placeholder="Select company" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {companies.length === 0 && (
                                      <SelectItem value="loading" disabled>
                                        Loading companies...
                                      </SelectItem>
                                    )}
                                    {companies.map((company) => (
                                      <SelectItem
                                        key={company.id}
                                        value={company.name}
                                      >
                                        {company.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="expLocation">Location *</Label>
                                <Select
                                  value={
                                    experienceForm.location_id.toString() || ""
                                  }
                                  onValueChange={(value) =>
                                    setExperienceForm((prev) => ({
                                      ...prev,
                                      location_id: value,
                                    }))
                                  }
                                  placeholder="Select Location"
                                >
                                  <SelectTrigger className="mt-1 h-10 lg:h-11">
                                    <SelectValue placeholder="Select Location" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {countries.map((location) => (
                                      <SelectItem
                                        key={location.id}
                                        value={location.id.toString()}
                                      >
                                        {location.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Job Category *
                                </Label>
                                <Select
                                  value={
                                    experienceForm.category_id.toString() || ""
                                  }
                                  onValueChange={(value) => {
                                    setExperienceForm((prev) => ({
                                      ...prev,
                                      category_id: value,
                                      jobTitle: "", // Reset job title when category changes
                                    }));
                                    setJobTitles([]); // Clear job titles
                                  }}
                                >
                                  <SelectTrigger className="mt-1 h-10 lg:h-11">
                                    <SelectValue placeholder="Select job category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {jobCategories.length === 0 && (
                                      <SelectItem value="loading" disabled>
                                        Loading categories...
                                      </SelectItem>
                                    )}
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
                                  Job Title *
                                </Label>
                                <Select
                                  value={
                                    experienceForm.job_title_id.toString() || ""
                                  }
                                  onValueChange={(value) =>
                                    setExperienceForm((prev) => ({
                                      ...prev,
                                      job_title_id: value,
                                    }))
                                  }
                                  disabled={!experienceForm.category_id}
                                >
                                  <SelectTrigger className="mt-1 h-10 lg:h-11">
                                    <SelectValue
                                      placeholder={
                                        experienceForm.category_id
                                          ? "Select job title"
                                          : "Select category first"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {jobTitles.length === 0 &&
                                      experienceForm.category_id && (
                                        <SelectItem value="loading" disabled>
                                          Loading job titles...
                                        </SelectItem>
                                      )}
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
                                <DatePicker
                                  label="Start Date *"
                                  value={experienceForm.startDate}
                                  onChange={(date) =>
                                    setExperienceForm((prev) => ({
                                      ...prev,
                                      startDate: date,
                                    }))
                                  }
                                  views={["year", "month", "day"]}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      size="small"
                                      sx={{
                                        mt: 1,
                                        "& .MuiOutlinedInput-root": {
                                          height: "44px",
                                          borderRadius: "6px",
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </div>
                              <div>
                                <div className="space-y-2">
                                  {!experienceForm.isCurrentJob && (
                                    <DatePicker
                                      label="End Date"
                                      value={experienceForm.endDate}
                                      onChange={(date) =>
                                        setExperienceForm((prev) => ({
                                          ...prev,
                                          endDate: date,
                                        }))
                                      }
                                      views={["year", "month", "day"]}
                                      minDate={experienceForm.startDate}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          fullWidth
                                          size="small"
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              height: "44px",
                                              borderRadius: "6px",
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Checkbox
                                    id="currentJob"
                                    checked={experienceForm.isCurrentJob}
                                    onCheckedChange={(checked) =>
                                      setExperienceForm((prev) => ({
                                        ...prev,
                                        isCurrentJob: checked,
                                        endDate: checked ? null : prev.endDate,
                                      }))
                                    }
                                  />
                                  <Label
                                    htmlFor="currentJob"
                                    className="text-sm"
                                  >
                                    I currently work here
                                  </Label>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="description">
                                Job Description
                              </Label>
                              <Textarea
                                id="description"
                                value={experienceForm.description}
                                onChange={(e) =>
                                  setExperienceForm((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                rows={4}
                                placeholder="Describe your role and achievements..."
                                className="mt-1"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={handleCancelExperience}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                              <Button onClick={handleSaveExperience}>
                                <Save className="w-4 h-4 mr-2" />
                                {editingExperience ? "Update" : "Save"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <div className="flex justify-between mt-6">
                    <Button
                      onClick={handleSaveProfile}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11 mt-6"
                    >
                      SUBMIT
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11 mt-6"
                    >
                      Next
                    </Button>
                   
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education Section */}
              {activeSection === "education" && (
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                        <GraduationCap className="w-5 h-5" />
                        <span>Education</span>
                      </CardTitle>
                      <Button
                        size="sm"
                        onClick={handleAddEducation}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 lg:space-y-6">
                      {/* Existing Education Items */}
                      {profileData.education.map((edu) => (
                        <div
                          key={edu.id}
                          className="border rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex items-start space-x-3 lg:space-x-4">
                              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-base lg:text-lg text-gray-900 break-words">
                                  {edu.degree}
                                </h3>
                                <p className="text-green-600 font-medium text-sm lg:text-base break-words">
                                  {edu.field}
                                </p>
                                <p className="text-gray-600 text-sm lg:text-base break-words">
                                  {edu.institution}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs lg:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                                  <span>Year: {edu.year}</span>
                                  <span>
                                  Score: {edu.percentage}{" "}
                                  {edu.score_type === "percentage"
                                    ? "(Percentage)"
                                    : edu.score_type === "cgpa"
                                    ? "(CGPA)"
                                    : edu.score_type === "grade"
                                    ? "(Grade)"
                                    : ""}
                                </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditEducation(edu)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteItem("education", edu.id)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {showAddEducation && (
                        <Card className="border-2 border-green-200">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg">
                              {editingEducation
                                ? "Edit Education"
                                : "Add New Education"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">
                                  Degree *
                                </Label>

                                <Popover open={open} onOpenChange={setOpen}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between mt-1 h-12"
                                    >
                                      {educationForm.degree || "Select degree"}
                                    </Button>
                                  </PopoverTrigger>

                                  <PopoverContent
                                    align="start"
                                    className="w-full p-0"
                                  >
                                    <Command>
                                      <CommandInput
                                        placeholder="Search degree..."
                                        value={majorSearch}
                                        onValueChange={setMajorSearch}
                                      />

                                      <CommandList className="max-h-60 overflow-y-auto">
                                        <CommandEmpty>
                                          No degree found.
                                        </CommandEmpty>

                                        <CommandGroup>
                                          {majors
                                            .filter((m: any) =>
                                              m.name
                                                .toLowerCase()
                                                .startsWith(
                                                  majorSearch.toLowerCase()
                                                )
                                            )
                                            .map((major: any) => (
                                              <CommandItem
                                                key={major.id}
                                                value={major.name}
                                                onSelect={() => {
                                                  setEducationForm((prev) => ({
                                                    ...prev,
                                                    degree: major.name,
                                                  }));
                                                  setOpen(false);
                                                }}
                                              >
                                                {major.name}
                                              </CommandItem>
                                            ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div>
                                <Label htmlFor="field">Field of Study *</Label>
                                <Input
                                  id="field"
                                  value={educationForm.field}
                                  onChange={(e) =>
                                    setEducationForm((prev) => ({
                                      ...prev,
                                      field: e.target.value,
                                    }))
                                  }
                                  placeholder="e.g., Computer Science"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="institution">
                                  Institution *
                                </Label>
                                <Input
                                  id="institution"
                                  value={educationForm.institution}
                                  onChange={(e) =>
                                    setEducationForm((prev) => ({
                                      ...prev,
                                      institution: e.target.value,
                                    }))
                                  }
                                  placeholder="Enter institution name"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Year of Graduation *</Label>
                                <DatePicker
                                  value={educationForm.year}
                                  onChange={(date) =>
                                    setEducationForm((prev) => ({
                                      ...prev,
                                      year: date,
                                    }))
                                  }
                                  views={["year"]}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      size="small"
                                      sx={{
                                        mt: 1,
                                        "& .MuiOutlinedInput-root": {
                                          height: "44px",
                                          borderRadius: "6px",
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label className="text-sm font-medium text-gray-700">
                                  Score
                                </Label>

                                <Select
                                value={educationForm.score_type}
                                onValueChange={(value) =>
                                  setEducationForm((prev) => ({
                                    ...prev,
                                    score_type: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="mt-1 h-10">
                                  <SelectValue placeholder="Select score type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">Percentage</SelectItem>
                                  <SelectItem value="cgpa">CGPA</SelectItem>
                                  <SelectItem value="grade">Grade</SelectItem>
                                </SelectContent>
                              </Select>

                                <Input
                                  id="percentage"
                                  value={educationForm.percentage}
                                  onChange={(e) =>
                                    setEducationForm((prev) => ({
                                      ...prev,
                                      percentage: e.target.value,
                                    }))
                                  }
                                  placeholder="e.g., 8.5 CGPA or 85%"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={handleCancelEducation}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                              <Button onClick={handleSaveEducation}>
                                <Save className="w-4 h-4 mr-2" />
                                {editingEducation ? "Update" : "Save"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <div className="flex justify-between mt-6">
                    <Button
                      onClick={handleSaveProfile}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11 mt-6"
                    >
                      SUBMIT
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11 mt-6"
                    >
                      Next
                    </Button>
                    
                  </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills Section */}
              {activeSection === "skills" && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                      <Award className="w-5 h-5" />
                      <span>Skills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Type a skill and press Enter"
                          className="flex-1 h-10 lg:h-11"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                        />
                        <Button
                          onClick={handleAddSkill}
                          className="bg-gradient-to-r from-purple-600 to-blue-600"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Skill
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs lg:text-sm bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                          >
                            <span className="break-all">{skill}</span>
                            <button
                              className="ml-2 text-purple-600 hover:text-purple-800 flex-shrink-0"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                     <Button
                      onClick={handleSaveProfile}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11 mt-6"
                    >
                      SUBMIT
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11 mt-6"
                    >
                      Next
                    </Button>
                    
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Certifications Section */}
              {activeSection === "certifications" && (
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                        <Award className="w-5 h-5" />
                        <span>Certifications</span>
                      </CardTitle>
                      <Button
                        size="sm"
                        onClick={handleAddCertification}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 lg:space-y-6">
                      {/* Existing Certification Items */}
                      {profileData.certifications.map((cert) => (
                        <div
                          key={cert.id}
                          className="border rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex items-start space-x-3 lg:space-x-4">
                              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Award className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-base lg:text-lg text-gray-900 break-words">
                                  {cert.name}
                                </h3>
                                <p className="text-yellow-600 font-medium text-sm lg:text-base break-words">
                                  {cert.issuer}
                                </p>
                                <p className="text-gray-600 text-xs lg:text-sm">
                                  Issued: {cert.year}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCertification(cert)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteItem("certifications", cert.id)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add/Edit Certification Form */}
                      {showAddCertification && (
                        <Card className="border-2 border-yellow-200 bg-yellow-50">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg">
                              {editingCertification
                                ? "Edit Certification"
                                : "Add New Certification"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <Label htmlFor="certName">
                                  Certification Name *
                                </Label>
                                <Input
                                  id="certName"
                                  value={certificationForm.name}
                                  onChange={(e) =>
                                    setCertificationForm((prev) => ({
                                      ...prev,
                                      name: e.target.value,
                                    }))
                                  }
                                  placeholder="e.g., AWS Certified Developer"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="issuer">
                                  Issuing Organization *
                                </Label>
                                <Input
                                  id="issuer"
                                  value={certificationForm.issuer}
                                  onChange={(e) =>
                                    setCertificationForm((prev) => ({
                                      ...prev,
                                      issuer: e.target.value,
                                    }))
                                  }
                                  placeholder="e.g., Amazon Web Services"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Year Obtained *</Label>
                                <DatePicker
                                  value={certificationForm.year}
                                  onChange={(date) =>
                                    setCertificationForm((prev) => ({
                                      ...prev,
                                      year: date,
                                    }))
                                  }
                                  views={["year"]}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      size="small"
                                      sx={{
                                        mt: 1,
                                        "& .MuiOutlinedInput-root": {
                                          height: "44px",
                                          borderRadius: "6px",
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={handleCancelCertification}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                              <Button onClick={handleSaveCertification}>
                                <Save className="w-4 h-4 mr-2" />
                                {editingCertification ? "Update" : "Save"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11 mt-6"
                    >
                      SUBMIT
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeSection === "SavedJobs" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <Bookmark className="w-5 h-5" />
                      <span>Saved Jobs</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {savedJobsData.length > 0 ? (
                      savedJobsData.map((savedJob) => (
                        <div
                          key={savedJob.id}
                          className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-base lg:text-lg text-gray-900">
                                {savedJob.job_title || "No title"}
                              </h3>
                              <p className="text-purple-600 font-medium text-sm">
                                {savedJob.job?.company || "Unknown Company"}
                              </p>
                              <p className="text-gray-600 text-xs">
                                {savedJob.job?.location?.name ||
                                  "Location not available"}
                              </p>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                const token =
                                  localStorage.getItem("auth_token");
                                if (!token) return;
                                try {
                                  const res = await fetch(
                                    `https://jobseeker-backend-jy1y.onrender.com/api/saved-jobs/${savedJob.id}/`,
                                    {
                                      method: "DELETE",
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  if (res.ok) {
                                    setSavedJobsData((prev) =>
                                      prev.filter((j) => j.id !== savedJob.id)
                                    );
                                  }
                                } catch (err) {
                                  console.error(
                                    "Error deleting saved job:",
                                    err
                                  );
                                }
                              }}
                              className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                              <BookmarkX className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No saved jobs yet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === "AppliedJobs" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <Bookmark className="w-5 h-5" />
                      <span>Applied Jobs</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {[
                      {
                        id: 1,
                        job_title: "Backend Developer",
                        job: {
                          company: "TechNova Pvt. Ltd.",
                          location: { name: "Bangalore" },
                        },
                      },
                      {
                        id: 2,
                        job_title: "Full Stack Engineer",
                        job: {
                          company: "NextCore Technologies",
                          location: { name: "Hyderabad" },
                        },
                      },
                      {
                        id: 3,
                        job_title: "Data Engineer",
                        job: {
                          company: "Cloudify Systems",
                          location: { name: "Remote" },
                        },
                      },
                    ].map((appliedJob) => (
                      <div
                        key={appliedJob.id}
                        className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-base lg:text-lg text-gray-900">
                              {appliedJob.job_title}
                            </h3>
                            <p className="text-purple-600 font-medium text-sm">
                              {appliedJob.job.company}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {appliedJob.job.location.name}
                            </p>
                          </div>
                          <div className="text-green-600 text-xs font-medium bg-green-50 px-3 py-1 rounded-full">
                            Applied
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* {activeSection === "save" && (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
        <Bookmark className="w-5 h-5" />
        <span>Saved Jobs</span>
      </CardTitle>
    </CardHeader>

    <CardContent>
      {savedJobsData.length > 0 ? (
        savedJobsData.map((savedJob) => (
          <div
            key={savedJob.id}
            className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-gray-900">
                  {savedJob.job_title || "No title"}
                </h3>
                <p className="text-purple-600 font-medium text-sm">
                  {savedJob.job?.company || "Unknown Company"}
                </p>
                <p className="text-gray-600 text-xs">
                  {savedJob.job?.location?.name || "Location not available"}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const token = localStorage.getItem("auth_token");
                  if (!token) return;
                  try {
                    const res = await fetch(
                      `https://jobseeker-backend-jy1y.onrender.com/api/saved-jobs/${savedJob.id}/`,
                      {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    if (res.ok) {
                      setSavedJobsData((prev) =>
                        prev.filter((j) => j.id !== savedJob.id)
                      );
                    }
                  } catch (err) {
                    console.error("Error deleting saved job:", err);
                  }
                }}
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                <BookmarkX className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No saved jobs yet.</p>
      )}
    </CardContent>
  </Card>
)} */}
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
