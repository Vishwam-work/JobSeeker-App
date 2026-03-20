"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { BookmarkX , Check, ChevronsUpDown ,ChevronDown } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
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
import Footer from "@/components/Footer";
import { useMemo } from "react";
import AsyncCreatableSelect from 'react-select/async-creatable'
import AsyncSelect from "react-select/async";
import Link from "next/link";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import exp from "node:constants";
import { profile } from "node:console";
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from "@mui/material";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);


export default function Profile() {
  // Form states, data, and functions, etc.
  // const { savedJobs, removeSavedJob } = useSavedJobs();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      fullName: "",
      email: "",
      gender: "",
      date_of_birth: "",
      phone: "",
      phoneCode: "",
      countryId: "",
      stateId: "",
      cityId: "",
      currentcurrency: "",
      expectedCurrency: "",
      experience: "",
      currentSalary: null,
      expectedSalary: null,
      noticePeriod: "",
      professional_summary: "",
      profile_image: "",
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    summary: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState({
    resume: false,
  });
  const [open, setOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [dobInput, setDobInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dobError, setDobError] = useState("");
  const [startInput, setStartInput] = useState("");
 const [endInput, setEndInput] = useState("");
 const [dateError, setDateError] = useState<string | null>(null);
 const [scoreError, setScoreError] = useState<string | null>(null);
 const [yearError, setYearError] = useState("");


  // States for inline forms
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ApiExperience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [experienceForm, setExperienceForm] = useState<ExperienceForm>({
    company: "",
    job_title: "",
    category: "",
    location: "",
    startDate: null,
    endDate: null,
    isCurrentJob: false,
    description: "",
  });
  
  const [educationForm, setEducationForm] = useState<EducationForm>({
    education: "",
    education_name: "",
    course: "",
    course_name: "",
    institution: "",
    start_year: null,
    end_year: null,
    percentage: "",
    score_type: "",
    course_type: "",
  });
  const [courseSuggestions, setCourseSuggestions] = useState<CourseSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [companySuggestions, setCompanySuggestions] = useState<any[]>([]);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  const [jobCategorySuggestions, setJobCategorySuggestions] = useState<any[]>([]);
  const [showJobCategorySuggestions, setShowJobCategorySuggestions] = useState(false);

  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<any[]>([]);
  const [showJobTitleSuggestions, setShowJobTitleSuggestions] = useState(false);

  const [certificationForm, setCertificationForm] = useState<CertificationForm>({
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
    // { id: "save", label: "Jobs", icon: Briefcase },
  ];
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [currency, setCurrency] = useState<Currency[]>([]);
  const [savedJobsData, setSavedJobsData] = useState<SavedJob[]>([]);
  const [activeSaveTab, setActiveSaveTab] = useState("SavedJobs");
  const [isProfileSubmitted, setIsProfileSubmitted] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loadingAppliedJobs, setLoadingAppliedJobs] = useState(false);

  const [noticeRanges] = useState([
    "Immediate Joiner",
    "1-15 days",
    "15-30 days",
    "30-60 days",
    "60-90 days",
    "90+ days",
  ]);



const handleSummaryChange = (value: string) => {
  const words = value.trim().split(/\s+/).filter(Boolean);

  // if (words.length > 0 && words.length < 5) {
  //   setSummaryError("Profile summary must contain at least 5 words");
  // } else {
  //   setSummaryError("");
  // }

  setProfileData((prev) => ({
    ...prev,
    personalInfo: {
      ...prev.personalInfo,
      professional_summary: value,
    },
  }));
};

const uniquePhoneCodes = useMemo(() => {
  return Array.from(
    new Map(
      countries.map((c) => [c.phonecode, c])
    ).values()
  );
}, [countries]);
useEffect(() => {
  if (
    profileData?.personalInfo?.countryId &&
    uniquePhoneCodes?.length > 0
  ) {
    const selectedCountry = uniquePhoneCodes.find(
      (country) =>
        String(country.id) ===
        String(profileData.personalInfo.countryId)
    );

    if (selectedCountry?.phonecode) {
      setProfileData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          phoneCode: selectedCountry.phonecode,
        },
      }));
    }
  }
}, [profileData.personalInfo.countryId, uniquePhoneCodes]);

type CourseSuggestion ={
  id: string | number;
  name: string;
}
type Currency = {
  id: string | number;
  name: string;
  symbol_native: string;
  code: string;
}
type JobCategory = {
  id: string;
  name: string;
};

type JobTitle = {
  id: string;
  title: string;
};

type ExperienceForm = {
  company: string;
  job_title: string;
  category: string;
  location: string;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  isCurrentJob: boolean;
  description: string;
};

type ApiExperience = {
  id?: string | number;
  company?: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string;

  job_title?: string;

  category?: string;

  location?: string;
};
type ProfileExperience = {
  id?: string | number;
  company: string;

  category?: string;

  job_title?: string;
  location?:string;

  start_date?: string;
  end_date?: string | null;
  description?: string;
};

type Certification = {
  id?: string | number;
  name: string;
  issuer: string;
  year?: number | string | null;
};

type CertificationForm = {
  name: string;
  issuer: string;
  year: dayjs.Dayjs | null;
};

type ProfileData = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    phoneCode: string;
    countryId: string;
    stateId: string;
    cityId: string;
    currentcurrency: string;
    expectedCurrency: string;
    experience: string;
    currentSalary: number | null;
    expectedSalary: number | null;
     symbol_native?: string;
    noticePeriod: string;
    resume?: string | null;
    profile_image?: string | null;
    professional_summary?: string;
    gender?: string;
    date_of_birth?: string;
  };
  experience: ProfileExperience[]; 
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  summary: string;
};
type Education = {
  id?: string | number;
  education: string ;
  education_name: string;
  course: string | number ;
  course_name: string;
  institution: string;
  start_year?: number | string | null;
  end_year?: number | string | null;
  percentage?: string;
  score_type?: string;
  course_type?: string;
};

type EducationForm = {
  education: string ;
  education_name: string;
  course: string | number ;
  course_name: string;
  institution: string;
  start_year: dayjs.Dayjs | null; 
  end_year: dayjs.Dayjs | null; 
  percentage: string;
  score_type: string;
  course_type: string;
};

type Skill = {
  id?: string | number;
  name: string;
};

type WithId = {
  id: string | number;
};
type DeletableSection =
  | "experience"
  | "education"
  | "skills"
  | "certifications";

type Country = {
  id: string | number;
  name?: string;
  phonecode: string;
  code: string;
  currency: string;
  currency_name: string;
};

type StateItem = {
  id: string | number;
  name: string;
};
 
type CityItem = {
  id: string | number;
  name: string;
};
type Company = {
  id: string | number;
  name: string;
};
interface SavedJob {
  id: string | number;
  job_title?: string;
  job?: {
    company?: string;
    location?: {
      name?: string;
    };
  };
}

type MajorCategory = {
  id: string | number;
  name: string;
};

type Major = {
  id: string | number;
  name: string;
  category: string | number;
};

useEffect(() => {
  if (profileData?.personalInfo?.date_of_birth) {
    const d = dayjs(
      profileData.personalInfo.date_of_birth,
      "DD/MM/YYYY",
      true // strict parsing
    );

    if (d.isValid()) {
      setDobInput(d.format("DD/MM/YYYY"));
      setSelectedDate(d.toDate());
    }
  }
}, [profileData?.personalInfo?.date_of_birth]);

const formatDOB = (value: string) => {
  let input = value.replace(/\D/g, "");

  if (input.length > 8) input = input.slice(0, 8);

  let day = input.slice(0, 2);
  let month = input.slice(2, 4);
  let year = input.slice(4, 8);

  let error = "";

  // DAY FIX
  if (day.length === 1) {
    if (!["0", "1", "2", "3"].includes(day)) {
      day = "0" + day;
    }
  }

  if (day.length === 2) {
    let d = parseInt(day);
    if (d > 31) day = "31";
    if (d === 0) day = "01";
  }

  // MONTH FIX
  if (month.length === 1) {
    if (month !== "0" && month !== "1") {
      month = "0" + month;
    }
  }

  if (month.length === 2) {
    let m = parseInt(month);
    if (m > 12) month = "12";
    if (m === 0) month = "01";
  }

  const currentYear = dayjs().year();

  if (year.length === 4) {
    let y = parseInt(year);

    if (y > currentYear) {
      error = "Future year not allowed";
    }

    if (y < 1900) {
      error = "Year must be after 1900";
    }
  }

  // ✅ FULL DATE VALIDATION 
  if (day.length === 2 && month.length === 2 && year.length === 4) {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    // Leap year check
    const isLeapYear =
      (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

    const daysInMonth = [
      31,
      isLeapYear ? 29 : 28, // Feb
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];

    if (m >= 1 && m <= 12) {
      if (d > daysInMonth[m - 1]) {
        error = `Invalid day for month`;
      }
    }

    // Extra safety with dayjs
    const parsedCheck = dayjs(
      `${day}/${month}/${year}`,
      "DD/MM/YYYY",
      true
    );

    if (!parsedCheck.isValid()) {
      error = "Invalid date";
    }

    if (parsedCheck.isAfter(dayjs())) {
      error = "Future date not allowed";
    }
  }

  // ✅ FORMAT OUTPUT
  let formatted = day;
  if (month) formatted += "/" + month;
  if (year) formatted += "/" + year;

  const parsed = dayjs(formatted, "DD/MM/YYYY", true);

  return { formatted, parsed, error };
};

useEffect(() => {
  const userKey = getUserKey();
  if (!userKey) return;

  const submitted = localStorage.getItem(
    `profile_submitted_${userKey}`
  );

  if (submitted === "true") {
    setIsProfileSubmitted(true);
  }
}, []);

const validateDates = (start: Dayjs | null, end: Dayjs | null) => {
  if (!start || !end) return null;
  if (end.isBefore(start, "day")) {
    return "End date can't be before start date";
  }
  return null;
};

  const token =
  typeof window !== "undefined"
    ? localStorage.getItem("auth_token")
    : null;

const getUserKey = () => {
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.user_id || decoded.id || decoded.email;
  } catch {
    return null;
  }
};


  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Give the refrence to the Resume button
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Functions to handle inline forms

  const getCategoryName = (id: string) =>
    jobCategories.find((c) => c.id === id)?.name || "";

  const getJobTitleName = (id: string) =>
    jobTitles.find((t) => t.id === id)?.title || "";

  const resetExperienceForm = () => {
    setExperienceForm({
      company: "",
      job_title: "",
      category: "",
      location: "",
      startDate: null,
      endDate: null,
      isCurrentJob: false,
      description: "",
    });
  };
  

  const resetEducationForm = () => {
    setEducationForm({
      education: "",
      education_name: "",
      course: "",
      course_name: "",
      institution: "",
      start_year: null,
      end_year: null,
      percentage: "",
      score_type: "",
      course_type: "",
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
    setStartInput("");
    setEndInput("");
  };
  const handleEditExperience = (exp: ApiExperience) => {
     const startDate = exp.start_date
    ? dayjs(exp.start_date, "DD/MM/YYYY", true)
    : null;
  const endDate = exp.end_date
    ? dayjs(exp.end_date, "DD/MM/YYYY", true)
    : null;

    setExperienceForm({
      company: exp.company || "",
      job_title: exp.job_title || "",
      startDate: startDate,
      endDate: endDate,
      isCurrentJob: !exp.end_date,
      location: exp.location || "",
      category: exp.category || "",
      description: exp.description || "",
    });
    setStartInput(startDate ? startDate.format("DD/MM/YYYY") : "");
    setEndInput(endDate ? endDate.format("DD/MM/YYYY") : "");
    setEditingExperience(exp);
    setShowAddExperience(true);
  };

  const handleSaveExperience = () => {
  const today = dayjs();
  const minDate = dayjs("1960-01-01");

  // ✅ REQUIRED FIELDS
  if (
    !experienceForm.company?.trim() ||
    !experienceForm.job_title?.trim() ||
    !experienceForm.category?.trim() ||
    !startInput // input string bhi required
  ) {
    toast("Incomplete form", {
      description: "Please fill in all required fields before continuing.",
    });
    return;
  }

  // 🔹 START DATE VALIDATION USING formatDOB
  const startCheck = formatDOB(startInput);
  if (startCheck.error || !startCheck.parsed.isValid()) {
    toast.error(startCheck.error || "Invalid start date");
    return;
  }
  if (startCheck.parsed.isAfter(today)) {
    toast.error("Start date cannot be in the future");
    return;
  }
  if (startCheck.parsed.isBefore(minDate)) {
    toast.error("Start date cannot be before 1960");
    return;
  }

  // 🔹 END DATE VALIDATION
  let formattedEnd: string | null = null;
  if (!experienceForm.isCurrentJob) {
    if (!endInput) {
      toast.error("End date is required");
      return;
    }
    const endCheck = formatDOB(endInput);
    if (endCheck.error || !endCheck.parsed.isValid()) {
      toast.error(endCheck.error || "Invalid end date");
      return;
    }
    if (endCheck.parsed.isBefore(startCheck.parsed)) {
      toast.error("End date cannot be before start date");
      return;
    }
    if (endCheck.parsed.isAfter(today)) {
      toast.error("End date cannot be in the future");
      return;
    }
    if (endCheck.parsed.isBefore(minDate)) {
      toast.error("End date cannot be before 1960");
      return;
    }

    formattedEnd = endCheck.parsed.format("DD/MM/YYYY");
  }

  // ✅ FORMAT DATES (Backend Safe)
  const formattedStart = startCheck.parsed.format("DD/MM/YYYY");

  const newExperience = {
    id: editingExperience ? editingExperience.id : Date.now(),
    company: experienceForm.company.trim(),
    job_title: experienceForm.job_title.trim(),
    category: experienceForm.category,
    start_date: formattedStart,
    end_date: formattedEnd,
    location: experienceForm.location,
    description: experienceForm.description,
  };
  console.log("New Experience to Save:", newExperience);

    if (editingExperience) {
      console.log("Updating experience with ID:", editingExperience.id);
      setProfileData((prev) => ({
        ...prev,
        experience: prev.experience.map((exp) =>
          exp.id === editingExperience.id ? newExperience : exp
        ),
      }));
    } else {
      console.log("Adding new experience");
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

  const handleEditEducation = (edu: Education) => {
  setEducationForm({
    education: edu.education,
    education_name: edu.education_name,
    course: edu.course,
    course_name: edu.course_name,
    institution: edu.institution,
    start_year: edu.start_year ? dayjs(edu.start_year, "YYYY") : null,
    end_year: edu.end_year ? dayjs(edu.end_year, "YYYY") : null,
    percentage: edu.percentage ?? "",
    score_type: edu.score_type ? edu.score_type.toLowerCase() : "",
    course_type: edu.course_type ? edu.course_type : "",
  });
  setSelectedCategory(edu.education);
  setEditingEducation(edu);
  setShowAddEducation(true);
};

const handleSaveEducation = () => {
  if (
    !educationForm.education ||
    !educationForm.course ||
    !educationForm.institution ||
    !educationForm.score_type ||
    !educationForm.course_type
  ) {
    toast("Incomplete form", {
      description: "Please fill in all required fields before continuing.",
    });

    return;
  }
        if (educationForm.start_year && educationForm.end_year) {
    const selectedStartYear = educationForm.start_year.year();
    const selectedEndYear = educationForm.end_year.year();
    const currentYear = dayjs().year();

    if (selectedStartYear > selectedEndYear) {
      toast.error("Invalid year", {
        description: "Year of graduation cannot be in the Past.",
      });
      return;
    }

    if (selectedStartYear < 1960) {
      toast.error("Invalid year", {
        description: "Year of graduation cannot be before 1960.",
      });
      return;
    }
  }

  const newEducation = {
    id: editingEducation ? editingEducation.id : Date.now(),
    education: educationForm.education,
    course: educationForm.course,
    education_name: educationForm.education_name,
    course_name: educationForm.course_name,
    institution: educationForm.institution,
      // year: educationForm.year ? educationForm.year.format("YYYY") : "",
    start_year: educationForm.start_year ? educationForm.start_year.format("YYYY") : "",
    end_year: educationForm.end_year ? educationForm.end_year.format("YYYY") : "",

    percentage: educationForm.percentage,
      score_type : educationForm.score_type,
      course_type : educationForm.course_type,
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

  const handleEditCertification = (cert: Certification) => {
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
      
      toast("Incomplete form", {
      description: "Please fill in all required fields before continuing.",
      });

      return;
    }

  // ✅ Year validation
  if (!certificationForm.year) {
    toast.error("Year required", {
      description: "Please select the year obtained.",
    });
    return;
  }

  const selectedYear = certificationForm.year.year();
  const currentYear = dayjs().year();

  if (selectedYear > currentYear) {
    toast.error("Invalid year", {
      description: "Year obtained cannot be in the future.",
    });
    return;
  }

  if (selectedYear < 1960) {
    toast.error("Invalid year", {
      description: "Year obtained cannot be before 1960.",
    });
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
  const handleBack = () => {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };
  const handleNext = () => {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

const handleAddSkill = () => {
  const skillName = newSkill.trim();
  if (!skillName) return;

  if (!profileData.skills.some((s) => s.name === skillName)) {
    setProfileData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: skillName }],
    }));
    setNewSkill("");
  }
};
  
const handleRemoveSkill = (skillToRemove: Skill) => {
  setProfileData((prev) => ({
    ...prev,
    skills: prev.skills.filter((s) => s.name !== skillToRemove.name),
  }));
};

  const handleDeleteItem = (
  type: DeletableSection,
  id: string | number
) => {
  setProfileData((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      [type]: (prev[type] as WithId[]).filter(
        (item) => item.id !== id
      ),
    };
  });
};


 const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // File type validation
  if (!allowedTypes.includes(file.type)) {
    toast.error("Only PDF or DOC/DOCX files are allowed");
    event.target.value = ""; // reset
    return;
  }

  // 2MB size validation
  if (file.size > 2 * 1024 * 1024) {
    toast.error("Resume must be less than 2MB");
    event.target.value = ""; // reset
    return;
  }

  setResumeFile(file);
  event.target.value = ""; // reset
  toast.info(`Selected file: ${file.name}`);
};

const loadCategories = async (inputValue: string) => {
  const token = localStorage.getItem("auth_token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_MASTER}/categories/?q=${inputValue}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();

  return data.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};
const loadMajors = async (inputValue: string) => {
  if (!selectedCategory) return [];

  const token = localStorage.getItem("auth_token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_MASTER}/majors/category/${selectedCategory}/?q=${inputValue}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();

  return data.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};

const loadCountryOptions = async (inputValue: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_MASTER}/locations/search/?q=${inputValue || ""}`
    );

    const data = await res.json();

    return data.map((country: any) => ({
      label: country.name,
      value: country.name,
    }));
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};


 const getCompanyOptions = async (inputValue: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_MASTER}/companies?q=${inputValue || ""}`
    );

    const data = await res.json();

    return data.map((company: any) => ({
      label: company.name,
      value: company.name,
    }));
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};
const getSelectedCompany = () => {
  if (!experienceForm.company) return null;

  return {
    label: experienceForm.company,
    value: experienceForm.company,
  };
};

const getSelectedLocation = () => {
  if (!experienceForm.location) return null;

  return {
    label: experienceForm.location,
    value: experienceForm.location,
  };
}
const getJobCategoryOptions = async (inputValue: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_category?q=${inputValue || ""}`
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
  if (!experienceForm.category) return null;

  return {
    label: experienceForm.category,
    value: experienceForm.category,
  };
};

const getJobTitlesOptions = async (inputValue: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_title/?q=${inputValue || ""}`
    );

    const data = await res.json();

    return data.map((category: any) => ({
      label: category.title,
      value: category.title,
    }));
  } catch (error) {
    console.error("Error fetching job categories:", error);
    return [];
  }
};
const getSelectedJobTitle = () => {
  if (!experienceForm.job_title) return null;

  return {
    label: experienceForm.job_title,
    value: experienceForm.job_title,
  };
};
  // Fetch and send The Data From API
  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_APP}/profile/`,
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


           if (data && data.id) {
           setIsProfileSubmitted(true);
           }
           if (data.resume) {
            try {
              const fileResponse = await fetch(data.resume);
              const blob = await fileResponse.blob();

              const fileName = data.resume.split("/").pop() || "resume.pdf";

              const file = new File([blob], fileName, {
                type: blob.type,
              });
              console.log("Converted resume file:", file);

              setResumeFile(file);
            } catch (error) {
              console.error("Error converting resume URL to File:", error);
            }
          }

          setProfileData({
            personalInfo: {
              fullName: data.full_name || "",
              email: data.email || "",
              gender: data.gender ? data.gender.toLowerCase() : "",
              date_of_birth: data.date_of_birth || "", 
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
              professional_summary: data.professional_summary || "",

            },
            experience: (data.experiences || []).map((exp: ProfileExperience) => ({
              ...exp,
              job_title: exp.job_title || "",
              category: exp.category || "",
              location: exp.location || "",
            })),
           education: (data.educations || []).map((e: any) => ({
            id: e.id,
            education: e.education,
            course: e.course,
            education_name: e.education_detail?.name || "",
            course_name: e.course_detail?.name || "",
            institution: e.institution,
            start_year: e.start_year,
            end_year: e.end_year,
            percentage: e.percentage,
            score_type: e.score_type?.toLowerCase() || "cgpa",
            course_type: e.course_type,
          })),
            skills: (data.skills || []).map((skill: Skill) => ({id: skill.id,name: skill.name,})),
            certifications: data.certifications || [],
            summary: "", // Optional: if you use a summary course
          });
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
      finally { 
         setLoading(false);
      }
    };

    fetchProfile();
  }, []);

 console.log("Profile Data ---->After Fetch", profileData);
  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_APP}/saved-jobs-all/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          // console.log("Saved jobs data:", data);
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/currencies/`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Currency data:", data);
        setCurrency(data);
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/countries/`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("Country data:", data);
        setCountries(data);
      })
      .catch((err) => console.error(err));
  }, []);
const selectedCurrency = currency.find(
  (c) => c.id.toString() === profileData.personalInfo.currentcurrency
);
const code = selectedCurrency?.code;
const symbol = selectedCurrency?.symbol_native || "";

const selectedExpectedCurrency = currency.find(
  (c) => String(c.id) === profileData.personalInfo.expectedCurrency
);

const expectedCode = selectedExpectedCurrency?.code || "";
const formatNumber = (
  value: number | string | null | undefined,
  currency?: string,
  symbol?: string
): string => {
  if (value === null || value === undefined || value === "") return "";

  const curr = currency?.toString().trim().toUpperCase();
 
  const locale = curr === "INR" ? "en-IN" : "en-US";

  const formatted = new Intl.NumberFormat(locale).format(Number(value));

  return symbol ? `${symbol} ${formatted}` : formatted;
};

const parseNumber = (value: string): string => {
  return value.replace(/,/g, "");
};


  useEffect(() => {
    if (profileData.personalInfo.countryId) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/states/?country_id=${profileData.personalInfo.countryId}`
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
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/cities/?state=${profileData.personalInfo.stateId}`
      )
        .then((res) => res.json())
        .then(setCities)
        .catch((err) => console.error(err));
    }
  }, [profileData.personalInfo.stateId]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/companies/`)
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
      })
      .catch((err) => console.error(err));
  }, []);


  const uploadResume = async () => {
    if (!resumeFile) {
    return false;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/profile/upload-resume/`,
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
        // console.log("Resume uploaded:", data.resume_url);
        // console.log("Resume Data uploaded:", data);
       setProfileData((prev) => ({
  ...prev,
  personalInfo: {
    ...prev.personalInfo,
    resume: data.resume_url || data.resume,
  },
}));

        setIsDialogOpen(prev => ({ ...prev, resume: false }));
        setResumeFile(null);
        if (fileInputRef.current) {
  fileInputRef.current.value = "";
}
        return true;
      } else {
        const error = await res.json();
        console.error("Failed to upload resume:", error);

        toast.error("Resume upload failed", {
        description: error?.message || "Unknown error. Please try again.",
        });

        return false;
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Network error while uploading resume");
      return false;
    }
  };
const uploadedResumeName =
  profileData?.personalInfo?.resume?.split("/").pop();
 const uploadProfileImage = async () => {
  if (!selectedImage) return true;

  const formData = new FormData();
  formData.append("profile_image", selectedImage);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_APP}/profile/`,
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
  const userKey = getUserKey();
  if (!userKey) {
    setIsProfileSubmitted(false);
    return;
  }

  const submitted = localStorage.getItem(
    `profile_submitted_${userKey}`
  );

  setIsProfileSubmitted(submitted === "true");
}, []);



  // Save Api
  const handleSaveProfile = async () => {
  // REQUIRED FIELD VALIDATION
  if (!profileData.personalInfo.fullName?.trim()) {
    return toast.error("Full Name is required");
  }

  if (!profileData.personalInfo.email?.trim()) {
    return toast.error("Email is required");
  }

  if (!profileData.personalInfo.phone?.trim()) {
    return toast.error("Phone number is required");
  }

  if (!profileData.personalInfo.countryId) {
    return toast.error("Country is required");
  }

  if (!profileData.personalInfo.stateId) {
    return toast.error("State is required");
  }

  if (!profileData.personalInfo.cityId) {
    return toast.error("City is required");
  }
  if (!profileData.personalInfo.currentSalary) {
    return toast.error("Current salary is required");
  }
  if(!profileData.personalInfo.expectedSalary) {
    return toast.error("Expected salary is required");
  }


  // DOB validation
  const dob = profileData.personalInfo.date_of_birth;
  if (!dob) return toast.error("Date of Birth is required");

  const dobCheck = formatDOB(dob); // ✅ Use your formatDOB function

  if (dobCheck.error || !dobCheck.parsed.isValid()) {
    return toast.error(dobCheck.error || "Invalid Date of Birth");
  }

  if (dobCheck.parsed.isAfter(dayjs())) {
    return toast.error("Future date not allowed");
  }

  // ✅ Use DD/MM/YYYY for backend
  const formattedDOB = dobCheck.formatted; 

  if (selectedImage) {
    const imageUploaded = await uploadProfileImage();
    if (!imageUploaded) {
      return toast.error("Image upload failed. Please try again.");
    }
  }




    const payload = {
      full_name: profileData.personalInfo.fullName,
      email: profileData.personalInfo.email,
      gender: profileData.personalInfo.gender,
      date_of_birth: profileData.personalInfo.date_of_birth,
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
      professional_summary: profileData.personalInfo.professional_summary || "",
      experiences: profileData.experience.map(exp => ({
        id: exp.id,
        company: exp.company,
        job_title: exp.job_title,
        category: exp.category,
        location: exp.location || "",
        start_date: exp.start_date,
        end_date: exp.end_date,
        description: exp.description,
      })),
      educations: profileData.education.map((edu) => ({
        ...edu,
        score_type: edu.score_type?.toLowerCase() || "cgpa",
      })),
      certifications: profileData.certifications,
      skills:profileData.skills.map((skill) => ({
  name: skill.name,
})),
    };
    console.log("Payload:", payload);
    console.log("Token:", localStorage.getItem("auth_token"));
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_APP}/profile/`,
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
            professional_summary: data.professional_summary || "",
            gender: data.gender || "",
            date_of_birth: data.date_of_birth || "",
          },
          experience: data.experiences || [],
          education: (data.educations || []).map((e: any) => ({
          id: e.id,
          education: e.education,
          course: e.course,
          education_name: e.education_detail?.name || "",
          course_name: e.course_detail?.name || "",
          institution: e.institution,
          start_year: e.start_year,
          end_year: e.end_year,
          percentage: e.percentage,
          score_type: e.score_type?.toLowerCase() || "cgpa",
          course_type: e.course_type || "",
        })),
          skills:(data.skills || []).map((s: Skill) => ({
  id: s.id,
  name: s.name,
})),
          certifications: data.certifications || [],
          summary: profileData.summary,
        });
      } catch (e) {
        // If response has no JSON body, silently skip state update
        console.warn("Profile saved; response body parse skipped", e);
      }
      const userKey = getUserKey();
  if (userKey) {
    localStorage.setItem(
      `profile_submitted_${userKey}`,
      "true"
    );
    setIsProfileSubmitted(true);
  }
    localStorage.setItem("full_name", profileData.personalInfo.fullName || "");
      toast.success("Profile saved successfully!", {
      description: "Your changes have been saved.",
      });
    } else {
      const errText = await res.text();
      console.error("Save profile failed:", errText);
      toast.error(`Error saving profile. ${errText}`);
    }
  };

  // Fetch User Data for Profile Name, Email, Phone or country
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.warn("No auth token found");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_APP}/register/`,
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
            country_id: user.country?.id?.toString() || "",
            countryId: user.country?.id?.toString() || "",
          },
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchAppliedJobs = async () => {
  try {
    setLoadingAppliedJobs(true);

    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.warning("Please login to view applied jobs");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_APP}/my-applied-jobs/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Failed to load applied jobs");
      return;
    }

    const data = await response.json();
    // console.log("Applied jobs data:", data);
    setAppliedJobs(data || []);
  } catch (error) {
    console.error(error);
    toast.error("Network error while loading applied jobs");
  } finally {
    setLoadingAppliedJobs(false);
  }
};

const BASE_URL = "https://jobseeker-backend-jy1y.onrender.com";

const resumeUrl = profileData?.personalInfo?.resume
  ? profileData.personalInfo.resume.startsWith("http")
    ? profileData.personalInfo.resume
    : `${BASE_URL}${profileData.personalInfo.resume}`
  : null;

useEffect(() => {
  if (activeSection === "AppliedJobs") {
    fetchAppliedJobs();
  }
}, [activeSection]);

const removeAppliedJob = async (applicationId: number) => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please login again");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_APP}/my-applied-jobs/${applicationId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Failed to remove applied job");
      return;
    }

    toast.success("Application removed");

    setAppliedJobs((prev) =>
      prev.filter((job) => job.id !== applicationId)
    );
  } catch (error) {
    toast.error("Network error. Please try again.");
  }
};

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Left Sidebar - Profile Summary */}


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
              <div className="grid lg:grid-cols-4 gap-10 lg:gap-6">
    <div className="lg:col-span-1">
      <div className="w-full order-2 lg:order-1">
      <Card className="lg:sticky lg:top-24 bg-white rounded-xl shadow-sm">
      <CardContent className="p-4">
          {/* Top Section: Profile Photo + Progress + Info */}
      <div className="flex flex-col items-center text-center gap-3">
          {/* Profile Photo*/}
                  <div className="flex flex-col items-center w-28">
              <label className="relative w-28 h-28 cursor-pointer group">

            {/* Border */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-gray-200">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                {!selectedImage && !profileData.personalInfo.profile_image}
              </div>
            </div>

            {/* Profile Image */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
              {selectedImage ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  className="w-24 h-24 rounded-full object-cover"
                  alt="Profile Preview"
                />
              ) : profileData.personalInfo.profile_image ? (
                <img
                  src={profileData.personalInfo.profile_image}
                  className="w-24 h-24 rounded-full object-cover"
                  alt="Profile"
                />
              ) : (
                <User className="w-10 h-10 text-purple-600" />
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition">
              <span className="text-white text-xs font-medium">
                {selectedImage || profileData.personalInfo.profile_image
                  ? "Update Photo"
                  : "Add Photo"}
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                if (!allowedTypes.includes(file.type)) {
                  setImageError("Only JPG, JPEG, PNG, WEBP formats are allowed.");
                  return;
                }

                if (file.size > 1024 * 1024) {
                  setImageError("Image size must be less than 1MB.");
                  return;
                }

                setImageError(null);
                setSelectedImage(file);
              }}
            />
          </label>

             {imageError && (
               <p className="text-red-500 text-xs mt-2 text-center break-words">
                 {imageError}
               </p>
             )}
            </div>
               <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
                   {profileData.personalInfo.fullName}
                </h2>
                      {/* Profile Info */}
                <div className="mt-3 space-y-2 text-sm text-gray-600">

                  <div className="flex gap-4">
                    <span className="font-medium text-gray-500">City, Country:</span>
                    <span className="font-semibold text-gray-800">
                      {profileData.personalInfo.cityId &&
                        cities.find(c => c.id.toString() === profileData.personalInfo.cityId)?.name},{" "}
                      {profileData.personalInfo.countryId &&
                        countries.find(c => c.id.toString() === profileData.personalInfo.countryId)?.name}
                    </span>
                  </div>

                  <div className="flex gap-7">
                    <span className="font-medium text-gray-500">Experience:</span>
                    <span className="font-semibold text-gray-800">
                      {profileData.personalInfo.experience || "-"}
                    </span>
                  </div>

                  <div className="flex gap-14">
                    <span className="font-medium text-gray-500">Phone:</span>
                    <span className="font-semibold text-gray-800">
                      +{profileData.personalInfo.phoneCode || ""}{" "}
                      {profileData.personalInfo.phone || "-"}
                    </span>
                  </div>

                  <div className="flex gap-16">
                    <span className="font-medium text-gray-500">Email:</span>
                    <span className="font-semibold text-gray-800">
                      {profileData.personalInfo.email || "-"}
                    </span>
                  </div>

                  <div className="flex gap-1">
                  <span className="font-medium text-gray-500">Current Salary:</span>
                  <span className="font-semibold text-gray-800">
                    {formatNumber(
                      profileData.personalInfo.currentSalary,
                      selectedCurrency?.code,
                      selectedCurrency?.symbol_native
                    )}
                  </span>
                </div>

                  <div className="flex gap-14 ">
                    <span className="font-medium text-gray-500">Notice:</span>
                    <span className="font-semibold text-gray-800">
                      {profileData.personalInfo.noticePeriod || "-"}
                    </span>
                  </div>

                 </div>

                 {/* Action Buttons*/}
                    <div className="mt-3 space-y-3">
                    <Dialog
                    open={isDialogOpen.resume}
                    onOpenChange={(open) => {
                     setIsDialogOpen((prev) => ({ ...prev, resume: open }));

                     if (!open) {
                       setResumeFile(null);
                     }
                   }}
                    >
                   {(resumeFile || uploadedResumeName) && (
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-xs font-semibold text-gray-600 truncate max-w-[200px]">
                          Resume: {resumeFile?.name || uploadedResumeName}
                        </p>

                        {resumeUrl && (
                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Preview
                            </a>
                          )}
                      </div>
                    )}
                  <DialogTrigger asChild>
                    <Button
                      className={`w-full text-sm lg:text-base h-10 lg:h-11 bg-gradient-to-r from-purple-600 to-blue-600 "${
                        (resumeFile || uploadedResumeName)
                      }`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {(resumeFile || uploadedResumeName )
                        ? "Update Resume"
                        : "Upload Resume"}
                    </Button>
                  </DialogTrigger>


                     <DialogContent className="sm:max-w-md rounded-2xl p-6 overflow-hidden">
                        <DialogHeader>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Upload Resume
                          </h2>

                          <p className="text-sm text-gray-500 mt-1">
                            Supported formats: PDF, DOCX — Max size 2MB
                          </p>
                        </DialogHeader>
                        <div className="mt-6 space-y-4">
                      {(resumeFile || uploadedResumeName) && (
                        <div className="border rounded-xl p-4 bg-gray-50 shadow-sm">
                          <div className="flex items-center gap-4">

                           {/* File Icon */}
                           <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                              <span className="text-blue-600 font-semibold text-sm">
                                {(resumeFile?.name || uploadedResumeName)
                                 ?.split(".")
                                 .pop()
                                  ?.toUpperCase()}
                              </span>
                            </div>
                            {/* File Info */}
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 truncate max-w-[220px]">
                                {resumeFile?.name || uploadedResumeName}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ✅ Replace Section */}
                     <div className="border rounded-xl p-3 flex items-center justify-between bg-white shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-md">
                          <span className="text-blue-600 text-xs font-bold">
                            {(resumeFile?.name || uploadedResumeName)
                              ?.split(".")
                              .pop()
                              ?.toUpperCase() || "PDF"}
                          </span>
                        </div>
                      <p className="text-sm text-gray-700 truncate max-w-[220px]">
                        {resumeFile?.name || uploadedResumeName || "No file selected"}
                      </p>
                       </div>
                      <button
                       onClick={() => {
                         setResumeFile(null);
                         fileInputRef.current?.click();
                       }}
                       className="text-blue-600 text-sm font-medium hover:underline"
                     >
                       {(resumeFile || uploadedResumeName) ? "Replace Resume" : "Upload Resume"}
                     </button>
                     </div>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />

                      {/* ✅ Continue Button */}
                           {resumeFile && resumeFile?.name !== uploadedResumeName && (
                           <button
                             onClick={uploadResume}
                             className="w-full mt-4 h-11 rounded-xl text-white font-medium transition
                             bg-gradient-to-r from-indigo-500 to-blue-600
                             hover:from-indigo-600 hover:to-blue-700"
                           >
                             Continue →
                           </button>
                         )}

                          </div>
                        </DialogContent>
                      </Dialog>

                      {isProfileSubmitted && (
                        <button
                          type="button"
                          onClick={() => window.location.assign("/review")}
                          className="w-full text-sm lg:text-base h-10 lg:h-11 border rounded-md flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Profile
                        </button>
                      )}
                    </div>
                    </div>
                  </CardContent>
                </Card>
                </div>
              </div>
              {/* Desktop Navigation Tabs */}
               <div className=" lg:col-span-3 bg-white rounded-lg shadow-sm mb-6 overflow-x-auto ">
              <div className="flex justify-between items-center border-b ">
                <div className="flex gap-10">
                  {sections.map((tab) => {
                    const IconComponent = tab.icon;

                    const isActive = activeSection === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id)}
                        className="flex items-center gap-2 py-3 text-sm font-medium relative"
                      >
                        <IconComponent
                          className={`w-4 h-4 ${
                            isActive ? "text-purple-600" : "text-gray-400"
                          }`}
                        />

                        <span
                          className={
                            isActive ? "text-purple-600" : "text-gray-500"
                          }
                        >
                          {tab.label}
                        </span>

                        {/* 🔥 Active underline */}
                        {isActive && (
                          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-600 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>



             {loading ? (
              <div className="p-6 max-w-5xl mx-auto space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              activeSection === "personal" && (
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
                          required
                        />
                      </div>
                     {/* Gender */}
                      <div>
                        <Label htmlFor="gender" className="text-sm font-medium">
                          Gender
                        </Label>

                        <Select
                          value={profileData.personalInfo.gender || ""}
                          onValueChange={(value) =>
                            setProfileData((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                gender: value,
                              },
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1 h-10 lg:h-11">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

{/* date_of_birth */}
<div className="w-full">
  <label className="text-sm font-medium">Date Of Birth</label>

  <div className="relative mt-1">
    <input
      type="text"
      placeholder="DD/MM/YYYY"
      maxLength={10}
      value={dobInput}
      onChange={(e) => {
  const raw = e.target.value;

                                const { formatted, parsed, error } = formatDOB(raw);


                                const yearPart = formatted.split("/")[2];

                                if (yearPart && yearPart.length === 4) {
                                  const currentYear = dayjs().year();

    if (parseInt(yearPart) > currentYear) {
      setDobError("Future year not allowed");
      return;
    }
  }

                                setDobInput(formatted);

                                if (error) {
                                  setDobError(error);
                                  setSelectedDate(null);
                                  return;
                                }

                                if (formatted.length < 10) {
                                  setDobError("");
                                  setSelectedDate(null);
                                  return;
                                }

                                if (!parsed.isValid()) {
                                  setDobError("Invalid date");
                                  setSelectedDate(null);
                                  return;
                                }

                                if (parsed.isAfter(dayjs())) {
                                  setDobError("Future date not allowed");
                                  setSelectedDate(null);
                                  return;
                                }

                                setDobError("");
                                setSelectedDate(parsed.toDate());

  setProfileData((prev: any) => ({
    ...prev,
    personalInfo: {
      ...prev.personalInfo,
      date_of_birth: parsed.format("DD/MM/YYYY"),
    },
  }));
}}
      className={`w-full h-[44px] px-3 pr-10 text-sm border rounded-md outline-none
        ${dobError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
      `}
    />

                            {/*  CALENDAR ICON */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <ReactDatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                  if (!date) return;

          const parsed = dayjs(date);

          setSelectedDate(date);
          setDobInput(parsed.format("DD/MM/YYYY"));
          setProfileData((prev: any) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              date_of_birth: parsed.format("DD/MM/YYYY"),
            },
          }));
        }}
        maxDate={new Date()}
        popperPlacement="bottom-end"
        popperClassName="z-[9999]"
        portalId="root"
        customInput={
          <button
            type="button"
            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
          >
            <Calendar size={18} />
          </button>
        }
      />
    </div>

    {dobError && (
      <p className="text-red-500 text-xs mt-1">
        {dobError}
      </p>
    )}
  </div>
</div>


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
                              {uniquePhoneCodes.map((country: Country) => (
                                <SelectItem
                                  key={country.phonecode}
                                  value={country.phonecode}
                                >
                                  +{country.phonecode}
                                </SelectItem>
                              ))}
                            </SelectContent>

                          </Select>
                          <Input
                            id="phone"
                            type="tel"
                            value={profileData.personalInfo.phone}
                            maxLength={10}
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            onChange={(e) => {
                              const value = e.target.value;

                              if (/^\d{0,10}$/.test(value)) {
                                setProfileData((prev) => ({
                                  ...prev,
                                  personalInfo: {
                                    ...prev.personalInfo,
                                    phone: value,
                                  },
                                }));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                e.preventDefault();
                              }
                            }}
                            className="flex-1 h-10 lg:h-11"
                            placeholder="Enter 10-digit phone number"
                            required
                          />

                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Country *</Label>

                        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                          <PopoverTrigger asChild>
                            <button className="w-full mt-1 h-10 lg:h-11 border rounded px-3 flex items-center justify-between">
                                <span>
                              {profileData.personalInfo.countryId
                                ? countries.find(
                                    (c) =>
                                      c.id == profileData.personalInfo.countryId
                                  )?.name
                                : "Select country"}
                                </span>
                                 <ChevronDown className="h-4 w-4 opacity-60" />
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
                                          countryId: country.id.toString(),
                                          stateId: "",
                                          cityId: "",
                                          phoneCode: country.phonecode,
                                        },
                                      }));
                                      setCountryOpen(false);
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

                        <Popover open={stateOpen} onOpenChange={setStateOpen}>
                          <PopoverTrigger asChild>
                            <button className="w-full mt-1 h-10 lg:h-11 border rounded px-3 flex items-center justify-between">
                              <span>
                              {profileData.personalInfo.stateId
                                ? states.find(
                                    (s) =>
                                      s.id == profileData.personalInfo.stateId
                                  )?.name
                                : "Select state"}
                              </span>
                              <ChevronDown className="h-4 w-4 opacity-60" />
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
                                           stateId: state.id.toString(),
                                          cityId: "",
                                        },
                                      }));
                                      setStateOpen(false);
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
                              className=" w-full mt-1 h-10 lg:h-11 border rounded px-3 flex items-center justify-between"
                            >
                                <span>
                              {profileData.personalInfo.cityId
                                ? cities.find(
                                    (c: CityItem) =>
                                      c.id == profileData.personalInfo.cityId
                                  )?.name
                                : "Select city"}
                                </span>
                              <ChevronDown className="h-4 w-4 opacity-60" />
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
                                              cityId: city.id.toString(),
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
                            <SelectItem value="5 years">5 years</SelectItem>
                            <SelectItem value="6 years">6 years</SelectItem>
                            <SelectItem value="7 years">7 years</SelectItem>
                            <SelectItem value="8 years">8 years</SelectItem>
                            <SelectItem value="9 years">9 years</SelectItem>
                            <SelectItem value="10 years">10 years</SelectItem>
                            <SelectItem value="11 years">11 years</SelectItem>
                            <SelectItem value="12 years">12 years</SelectItem>
                            <SelectItem value="13 years">13 years</SelectItem>
                            <SelectItem value="14 years">14 years</SelectItem>
                            <SelectItem value="15 years">15 years</SelectItem>
                            <SelectItem value="16 years">16 years</SelectItem>
                            <SelectItem value="17 years">17 years</SelectItem>
                            <SelectItem value="18 years">18 years</SelectItem>
                            <SelectItem value="19 years">19 years</SelectItem>
                            <SelectItem value="20+ years">20+ years</SelectItem>
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
                          Current Salary (Annual)
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Select
                            value={profileData.personalInfo.currentcurrency || ""}
                            onValueChange={(value) =>
                              setProfileData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  currentcurrency: value,
                                },
                              }))
                            }
                          >
                            <SelectTrigger className="w-28 h-10 lg:h-11">
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>

                            <SelectContent>
                              {currency.map((curr) => (
                                <SelectItem key={curr.id} value={String(curr.id)}>
                                  {curr.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="currentSalary"
                            type="text"
                            value={formatNumber(
                              profileData.personalInfo.currentSalary ?? "",
                              code,
                            )}
                            onChange={(e) => {
                              const rawValue = parseNumber(e.target.value);

                              if (!/^\d*$/.test(rawValue)) return;

                              setProfileData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  currentSalary: rawValue === "" ? null : Number(rawValue),
                                },
                              }));
                            }}
                            className="flex-1 h-10 lg:h-11"
                            placeholder="Enter amount"
                          />

                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="expectedSalary"
                          className="text-sm font-medium"
                        >
                          Expected Salary (Annual)
                        </Label>
                        <div className="flex gap-2 mt-1">
                         <Select
                            value={profileData.personalInfo.expectedCurrency || ""}
                            onValueChange={(value) =>
                              setProfileData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  expectedCurrency: value,
                                },
                              }))
                            }
                          >
                            <SelectTrigger className="w-28 h-10 lg:h-11">
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>

                            <SelectContent>
                              {currency.map((curr) => (
                                <SelectItem key={curr.id} value={String(curr.id)}>
                                  {curr.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                         <Input
                            id="expectedSalary"
                            type="text"
                            value={formatNumber(
                              profileData.personalInfo.expectedSalary ?? "",
                              expectedCode,
                            )}
                            onChange={(e) => {
                              const rawValue = parseNumber(e.target.value);

                              if (!/^\d*$/.test(rawValue)) return;

                              setProfileData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  expectedSalary: rawValue === "" ? null : Number(rawValue),
                                },
                              }));
                            }}
                            className="flex-1 h-10 lg:h-11"
                            placeholder="Enter amount"
                          />

                        </div>
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Profile Summary
                      </h3>

                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      It is the first thing recruiters notice in your profile. Write a concise headline introducing yourself to employers.
                    </p>
                    <textarea
                       value={profileData.personalInfo.professional_summary || ""}
                       onChange={(e) => handleSummaryChange(e.target.value)}
                       maxLength={250}
                       rows={4}
                       placeholder="Example: Senior Oracle Fusion Cloud ERP Consultant with 5+ years’ experience in Financials, SQL and Reporting"
                       className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                     />
                    {/* Footer */}
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                      <span>
                        {(profileData.personalInfo.professional_summary || "").length}/250
                      </span>
                    </div>

                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                     <Button
                      onClick={async () => {
                        await handleSaveProfile();
                            handleNext();
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11"
                    >
                      Save & Next
                    </Button>
                  </div>
                  </CardContent>
                </Card>
              )
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
                                  {exp.job_title}
                                </h3>
                                <p className="text-purple-600 font-medium text-sm lg:text-base break-words">
                                  {exp.company}
                                </p>
                                {exp.category && (
                                  <p className="text-gray-600 text-sm break-words">
                                    {exp.category}
                                  </p>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs lg:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" />
                                    <span>
                                    {exp.start_date && dayjs(exp.start_date, "DD/MM/YYYY").isValid()
                                      ? dayjs(exp.start_date, "DD/MM/YYYY").format("DD/MM/YYYY")
                                      : "N/A"}{" "}
                                    -{" "}
                                    {exp.end_date && dayjs(exp.end_date, "DD/MM/YYYY").isValid()
                                      ? dayjs(exp.end_date, "DD/MM/YYYY").format("DD/MM/YYYY")
                                      : "Present"}
                                  </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{exp.location}</span>
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
                                  handleDeleteItem("experience", exp.id ?? "")
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
                              <div className="relative">
                                 <Label className="text-sm font-medium">Company *</Label>
                                <AsyncCreatableSelect
                                cacheOptions
                                defaultOptions
                                placeholder="e.g., Deloitte"
                                className="mt-1"
                                loadOptions={getCompanyOptions}
                                value={getSelectedCompany()}

                                onChange={(selectedOption: any) => {
                                  setExperienceForm((prev) => ({
                                    ...prev,
                                    company: selectedOption?.value || "",
                                  }));
                                }}

                                isClearable

                                menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                styles={{
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                              />
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Location *</Label>

                                <AsyncSelect
                                  cacheOptions
                                  defaultOptions
                                  loadOptions={loadCountryOptions}
                                  value={getSelectedLocation()}
                                  onChange={(selected: any) => {
                                    setExperienceForm((prev) => ({
                                      ...prev,
                                      location: selected?.value || "",
                                    }));
                                  }}
                                  placeholder="Search Location..."
                                />
                              </div>
                              <div>
                                <div className="relative">
                                <Label className="text-sm font-medium">Job Category *</Label>
                                <AsyncCreatableSelect
                                cacheOptions
                                defaultOptions
                                placeholder="e.g., Accounting"
                                className="mt-1"
                                loadOptions={getJobCategoryOptions}
                                value={getSelectedJobCategory()}

                                onChange={(selectedOption: any) => {
                                  setExperienceForm((prev) => ({
                                    ...prev,
                                    category: selectedOption?.value || "",
                                  }));
                                }}

                                isClearable

                                menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                styles={{
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                              />

                              </div>
                              </div>

                              <div>
                                <div className="relative">
                                <Label className="text-sm font-medium">Job Title *</Label>
                               <AsyncCreatableSelect
                                cacheOptions
                                defaultOptions
                                placeholder="e.g., Oracle Fusion Senior Consultant"
                                className="mt-1"
                                loadOptions={getJobTitlesOptions}
                                value={getSelectedJobTitle()}

                                onChange={(selectedOption: any) => {
                                  setExperienceForm((prev) => ({
                                    ...prev,
                                    job_title: selectedOption?.value || "",
                                  }));
                                }}

                                isClearable

                                menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                styles={{
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                              />
                              </div>
                              </div>

                              <div className="w-full">
                                <label className="text-sm font-medium">Start Date *</label>

                                <div className="relative mt-1">
                                  <input
                                    type="text"
                                    placeholder="DD/MM/YYYY"
                                    maxLength={10}
                                    value={startInput}
                                    onChange={(e) => {
                                      const { formatted, parsed } = formatDOB(e.target.value);

                                      setStartInput(formatted);

                                      if (formatted.length < 10) return;

                                      if (!parsed.isValid()) {
                                        setDateError("Invalid start date");
                                        return;
                                      }

                                      if (parsed.isAfter(dayjs())) {
                                        setDateError("Future date not allowed");
                                        return;
                                      }

                                      setExperienceForm((prev) => ({
                                        ...prev,
                                        startDate: parsed,
                                      }));

                                      setDateError(validateDates(parsed, experienceForm.endDate));
                                    }}
                                    className="w-full h-[44px] px-3 pr-10 border rounded-md"
                                  />

                                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <ReactDatePicker
                                      selected={experienceForm.startDate?.toDate()}
                                      onChange={(date) => {
                                        if (!date) return;

                                        const parsed = dayjs(date);

                                        setStartInput(parsed.format("DD/MM/YYYY"));

                                        setExperienceForm((prev) => ({
                                          ...prev,
                                          startDate: parsed,
                                        }));

                                        setDateError(validateDates(parsed, experienceForm.endDate));
                                      }}
                                      maxDate={new Date()}
                                      customInput={<Calendar size={18} />}
                                    />
                                  </div>
                                </div>

                                {dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}
                              </div>
                                <div>
                              {!experienceForm.isCurrentJob && (
                                <div className="w-full">
                                  <label className="text-sm font-medium">End Date</label>

                                  <div className="relative mt-1">
                                    <input
                                      type="text"
                                      placeholder="DD/MM/YYYY"
                                      maxLength={10}
                                      value={endInput}
                                      onChange={(e) => {
                                        const { formatted, parsed } = formatDOB(e.target.value);

                                        setEndInput(formatted);

                                        if (formatted.length < 10) return;

                                        if (!parsed.isValid()) {
                                          setDateError("Invalid end date");
                                          return;
                                        }

                                        if (parsed.isBefore(experienceForm.startDate)) {
                                          setDateError("End date must be after start date");
                                          return;
                                        }

                                        setExperienceForm((prev) => ({
                                          ...prev,
                                          endDate: parsed,
                                        }));

                                        setDateError(validateDates(experienceForm.startDate, parsed));
                                      }}
                                      className="w-full h-[44px] px-3 pr-10 border rounded-md"
                                    />

                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                      <ReactDatePicker
                                        selected={experienceForm.endDate?.toDate()}
                                        onChange={(date) => {
                                          if (!date) return;

                                          const parsed = dayjs(date);

                                          setEndInput(parsed.format("DD/MM/YYYY"));

                                          setExperienceForm((prev) => ({
                                            ...prev,
                                            endDate: parsed,
                                          }));

                                          setDateError(validateDates(experienceForm.startDate, parsed));
                                        }}
                                        minDate={experienceForm.startDate?.toDate()}
                                        maxDate={new Date()}
                                        customInput={<Calendar size={18} />}
                                      />
                                    </div>
                                  </div>
                                     {dateError && (
                                        <p className="text-red-500 text-xs mt-1">{dateError}</p>
                                      )}
                                </div>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <Checkbox
                                  id="currentJob"
                                  checked={experienceForm.isCurrentJob}
                                  onCheckedChange={(checked) => {
                                    const isChecked = checked === true;

                                    setExperienceForm((prev) => ({
                                      ...prev,
                                      isCurrentJob: isChecked,
                                      endDate: isChecked ? null : prev.endDate,
                                    }));

                                    if (isChecked) {
                                      setEndInput("");
                                      setDateError("");
                                    }
                                  }}
                                />
                                <Label htmlFor="currentJob" className="text-sm">
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
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">

                    <Button
                      onClick={handleBack}
                      className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 h-10 lg:h-11"
                    >
                      Back
                    </Button>

                     <Button
                      onClick={async () => {
                        await handleSaveProfile();
                            handleNext();
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11"
                    >
                      Save & Next
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
                                  {edu.education_name}
                                </h3>
                                <p className="text-green-600 font-medium text-sm lg:text-base break-words">
                                  {edu.course_name}
                                </p>
                                <p className="text-gray-600 text-sm lg:text-base break-words">
                                  {edu.institution}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs lg:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                                  <span>Year: {edu.start_year}-{edu.end_year}</span>

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
                                  handleDeleteItem("education", edu.id ?? "")
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
                                  Education *
                                </Label>
                                <AsyncSelect
                                  cacheOptions
                                  defaultOptions
                                  loadOptions={loadCategories}
                                  value={
                                    educationForm.education
                                      ? {
                                          label: educationForm.education_name || "Selected",
                                          value: educationForm.education,
                                        }
                                      : null
                                  }
                                  onChange={(selected: any) => {
                                    setEducationForm((prev) => ({
                                      ...prev,
                                      education: selected?.value || "",
                                      education_name: selected?.label || "",
                                      course: "", // reset course
                                    }));

                                    setSelectedCategory(selected?.value || "");
                                  }}
                                  placeholder="Search Education..."
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700" htmlFor="course">Course *</Label>
                                <AsyncSelect
                                  cacheOptions
                                  key={selectedCategory}
                                  defaultOptions={selectedCategory ? true : false}
                                  loadOptions={loadMajors}
                                  isDisabled={!selectedCategory}
                                  value={
                                    educationForm.course
                                      ? {
                                          label: educationForm.course_name || "Selected",
                                          value: educationForm.course,
                                        }
                                      : null
                                  }
                                  onChange={(selected: any) => {
                                    setEducationForm((prev) => ({
                                      ...prev,
                                      course: selected?.value || "",
                                      course_name: selected?.label || "",
                                    }));
                                  }}
                                  placeholder="Search Course..."
                                  z-index={9999}
                                  menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                  menuPosition="fixed"
                                  styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                  }}
                                  isClearable

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
                                <Label  className="text-sm font-medium text-gray-700">
                                  Course duration *
                                 </Label>
                                  <div className="mt-1 grid grid-cols-2 gap-3">
                                <DatePicker
                                  views={["year"]}
                                  label=" Starting Year"
                                  value={educationForm.start_year ?? null}
                                  disableFuture
                                  maxDate={dayjs()}
                                  onChange={(date) => {
                                    if (!date) return;

                                    setEducationForm((prev) => ({
                                      ...prev,
                                      start_year: date,
                                    }));
                                      setYearError("");
                                  }}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      size: "small",
                                    },
                                  }}
                                />
                                  <DatePicker
                                  views={["year"]}
                                  label=" Ending Year"
                                  value={educationForm.end_year ?? null}
                                  maxDate={dayjs().add(101, "year")}
                                  onChange={(date) => {
                                    if (!date) return;
                                    if (
                                      educationForm.start_year &&
                                      date.isBefore(educationForm.start_year, "year")
                                    ) {
                                       setYearError("End year must be greater than or equal to Start year");
                                      return;
                                    }

                                    setEducationForm((prev) => ({
                                      ...prev,
                                      end_year: date,
                                    }));
                                    setYearError("");
                                  }}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      size: "small",
                                    },
                                  }}
                                />

                                  </div>
                                  {yearError && (
                                    <p className="text-red-500 text-xs mt-1">{yearError}</p>
                                  )}
                              </div>

                              <div>
                                <Label className="text-sm font-medium text-gray-700">
                                  Score
                                </Label>
                                <div className="mt-1 flex gap-2">
                                <Select
                                value={educationForm.score_type}
                                onValueChange={(value) =>
                                  setEducationForm((prev) => ({
                                    ...prev,
                                    score_type: value,
                                     percentage: "",
                                  }))
                                }
                              >
                                <SelectTrigger className="h-10 w-[140px]">
                                  <SelectValue placeholder="Score type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">Percentage</SelectItem>
                                  <SelectItem value="cgpa">CGPA</SelectItem>
                                  <SelectItem value="grade">Grade</SelectItem>
                                </SelectContent>
                              </Select>

                                <Input
                                   id="score"
                                   className="h-10 flex-1"
                                   placeholder={
                                     educationForm.score_type === "cgpa"
                                       ? "e.g. 8.5"
                                       : educationForm.score_type === "percentage"
                                       ? "e.g. 85%"
                                       : "e.g. A+"
                                   }
                                   value={educationForm.percentage}
                                   onChange={(e) => {
                                     let value = e.target.value;

                                     //  GRADE
                                    if (educationForm.score_type === "grade") {
                                      const upperValue = value.toUpperCase();
                                      if (!/^[A-Z][+-]?$/.test(upperValue) && upperValue !== "") return;
                                      setScoreError(null);
                                    }


                                     //  PERCENTAGE
                                     if (educationForm.score_type === "percentage") {
                                       if (!/^\d{0,3}(\.\d{0,2})?$/.test(value)) return;

                                       const num = Number(value);
                                       if (num > 100) return;

                                       setScoreError(null);
                                     }

                                    //  CGPA
                                if (educationForm.score_type === "cgpa") {
                                   if (!/^\d{0,2}(\.\d{0,2})?$/.test(value)) return;

                                   const num = Number(value);
                                   if (num > 10) return;
                                   if (num < 0) return;

                                   setScoreError(null);
                                 }
                                     setEducationForm((prev) => ({
                                       ...prev,
                                       percentage: value,
                                     }));
                                   }}
                                 />

                                </div>
                              </div>
                              <div>
                                <FormControl>
                                  <FormLabel className="text-sm font-medium">
                                    Course Type
                                  </FormLabel>

                                  <RadioGroup
                                    row
                                    value={educationForm.course_type}
                                    onChange={(e) =>
                                      setEducationForm((prev) => ({
                                        ...prev,
                                        course_type: e.target.value,
                                      }))
                                    }
                                  >
                                    <FormControlLabel
                                      value="Full Time"
                                      control={<Radio />}
                                      label="Full Time"
                                    />

                                    <FormControlLabel
                                      value="Part Time"
                                      control={<Radio />}
                                      label="Part Time"
                                    />

                                    <FormControlLabel
                                      value="Distance Learning"
                                      control={<Radio />}
                                      label="Correspondence / Distance Learning"
                                    />
                                  </RadioGroup>
                                </FormControl>
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
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                    <Button
                      onClick={handleBack}
                      className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 h-10 lg:h-11"
                    >
                      Back
                    </Button>

                     <Button
                      onClick={async () => {
                        await handleSaveProfile();
                            handleNext();
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11"
                    >
                      Save & Next
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
                             <span key={skill.id ?? index}>
                              {skill.name}
                            </span>
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
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">

                      <Button
                        onClick={handleBack}
                        className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 h-10 lg:h-11"
                      >
                        Back
                      </Button>

                       <Button
                      onClick={async () => {
                          await handleSaveProfile();
                            handleNext();
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 lg:h-11"
                    >
                        Save & Next
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
                                  handleDeleteItem("certifications", cert.id ?? "")
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
                        <Card className="border-2 ">
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
                                <div className="mt-1">
                                <DatePicker
                                   value={certificationForm.year ?? undefined} 
                                  onChange={(date) =>
                                    setCertificationForm((prev) => ({
                                      ...prev,
                                      year: date,
                                    }))
                                  }
                                  views={["year"]}
                                   maxDate={dayjs()} 
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      size: "small",
                                      sx: {
                                        mt: 1,
                                        "& .MuiOutlinedInput-root": {
                                          height: "44px",
                                          borderRadius: "6px",
                                        },
                                      },
                                    },
                                  }}
                                />

                                </div>
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
                                    `${process.env.NEXT_PUBLIC_API_URL_APP}/saved-jobs/${savedJob.id}/`,
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
                        {loadingAppliedJobs && (
                          <p className="text-sm text-gray-500">Loading applied jobs...</p>
                        )}
                  
                        {!loadingAppliedJobs && appliedJobs.length === 0 && (
                          <p className="text-sm text-gray-500">No applied jobs found.</p>
                        )}
                  
                        {appliedJobs.map((appliedJob) => (
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
                                  {appliedJob.job?.company}
                                </p>
                  
                                <p className="text-gray-600 text-xs">
                                  {appliedJob.job?.location?.name}
                                </p>
                              </div>
                  
                             <div className="flex items-center gap-2">
                        </div>
                  
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
              )}

              </div>
             </div>      
            </div>
          </div>
        </div>
         <Footer />
      </div>
    </LocalizationProvider>
  );
}
