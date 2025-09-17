'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Building2, 
  Users,
  Calendar,
  Star,
  Bookmark,
  Share2,
  ExternalLink,
  Filter,
  Search,
  X,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Award,
  Eye,
  Send
} from 'lucide-react';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    experience: '',
    jobType: '',
    workMode: '',
    salaryRange: [0, 50],
    companies: [],
    skills: [],
    postedWithin: ''
  });

  // Sample job data - in real app, this would come from API
  const sampleJobs = [
    {
      id: 1,
      title: 'Senior Software Developer',
      company: 'Tech Solutions Pvt Ltd',
      location: 'Mumbai, Maharashtra',
      experience: '3-5 years',
      salary: '8-12 LPA',
      jobType: 'Full Time',
      workMode: 'Hybrid',
      postedDate: '2024-01-15',
      applications: 45,
      description: 'We are looking for a Senior Software Developer to join our dynamic team. The ideal candidate should have strong experience in React, Node.js, and cloud technologies. You will be responsible for developing scalable web applications and mentoring junior developers.',
      requirements: [
        '3+ years of experience in software development',
        'Strong proficiency in React.js and Node.js',
        'Experience with cloud platforms (AWS/Azure)',
        'Knowledge of database systems (MongoDB, PostgreSQL)',
        'Excellent problem-solving skills'
      ],
      responsibilities: [
        'Develop and maintain web applications',
        'Collaborate with cross-functional teams',
        'Code review and mentoring',
        'Participate in architectural decisions',
        'Ensure code quality and best practices'
      ],
      benefits: [
        'Competitive salary and benefits',
        'Health insurance coverage',
        'Flexible working hours',
        'Professional development opportunities',
        'Work from home options'
      ],
      skills: ['React', 'Node.js', 'JavaScript', 'AWS', 'MongoDB'],
      companyLogo: null,
      isBookmarked: false,
      urgentHiring: false,
      companyInfo: {
        size: '500-1000 employees',
        industry: 'Information Technology',
        website: 'https://techsolutions.com',
        about: 'Leading technology solutions provider with 15+ years of experience in delivering innovative software solutions.'
      }
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'Digital Innovations Inc',
      location: 'Bangalore, Karnataka',
      experience: '2-4 years',
      salary: '6-10 LPA',
      jobType: 'Full Time',
      workMode: 'Remote',
      postedDate: '2024-01-14',
      applications: 32,
      description: 'Join our frontend team to build amazing user experiences. We work with modern technologies and follow best practices in UI/UX development.',
      requirements: [
        '2+ years of frontend development experience',
        'Proficiency in React.js and Vue.js',
        'Strong CSS and HTML skills',
        'Experience with responsive design',
        'Knowledge of modern build tools'
      ],
      responsibilities: [
        'Build responsive web interfaces',
        'Collaborate with designers',
        'Optimize application performance',
        'Write clean, maintainable code',
        'Stay updated with latest technologies'
      ],
      benefits: [
        'Remote work flexibility',
        'Learning and development budget',
        'Health and wellness programs',
        'Stock options',
        'Flexible PTO policy'
      ],
      skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'HTML'],
      companyLogo: null,
      isBookmarked: true,
      urgentHiring: true,
      companyInfo: {
        size: '100-500 employees',
        industry: 'Digital Marketing',
        website: 'https://digitalinnovations.com',
        about: 'Innovative digital marketing agency helping businesses grow through technology.'
      }
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Delhi, India',
      experience: '5-8 years',
      salary: '15-20 LPA',
      jobType: 'Full Time',
      workMode: 'Office',
      postedDate: '2024-01-13',
      applications: 28,
      description: 'Lead product strategy and development for our innovative platform. Work closely with engineering and design teams to deliver exceptional user experiences.',
      requirements: [
        '5+ years of product management experience',
        'Strong analytical and strategic thinking',
        'Experience with agile methodologies',
        'Excellent communication skills',
        'Technical background preferred'
      ],
      responsibilities: [
        'Define product roadmap and strategy',
        'Work with cross-functional teams',
        'Analyze market trends and user feedback',
        'Manage product lifecycle',
        'Drive product launches'
      ],
      benefits: [
        'Equity participation',
        'Comprehensive health coverage',
        'Professional growth opportunities',
        'Flexible work arrangements',
        'Team building activities'
      ],
      skills: ['Product Management', 'Analytics', 'Strategy', 'Leadership'],
      companyLogo: null,
      isBookmarked: false,
      urgentHiring: false,
      companyInfo: {
        size: '50-100 employees',
        industry: 'Technology Startup',
        website: 'https://startupxyz.com',
        about: 'Fast-growing startup revolutionizing the e-commerce space with AI-powered solutions.'
      }
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Analytics Corp',
      location: 'Pune, Maharashtra',
      experience: '3-6 years',
      salary: '10-15 LPA',
      jobType: 'Full Time',
      workMode: 'Hybrid',
      postedDate: '2024-01-12',
      applications: 67,
      description: 'Analyze complex datasets and build machine learning models to drive business insights and decision making.',
      requirements: [
        '3+ years in data science',
        'Strong Python and R skills',
        'Experience with ML frameworks',
        'Statistical analysis expertise',
        'Business acumen'
      ],
      responsibilities: [
        'Build predictive models',
        'Analyze large datasets',
        'Create data visualizations',
        'Collaborate with business teams',
        'Present insights to stakeholders'
      ],
      benefits: [
        'Competitive compensation',
        'Learning opportunities',
        'Conference attendance',
        'Health benefits',
        'Flexible schedule'
      ],
      skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'Statistics'],
      companyLogo: null,
      isBookmarked: false,
      urgentHiring: true,
      companyInfo: {
        size: '200-500 employees',
        industry: 'Data Analytics',
        website: 'https://analyticscorp.com',
        about: 'Leading data analytics company providing insights to Fortune 500 companies.'
      }
    },
    {
      id: 5,
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'Hyderabad, Telangana',
      experience: '2-5 years',
      salary: '5-9 LPA',
      jobType: 'Full Time',
      workMode: 'Remote',
      postedDate: '2024-01-11',
      applications: 89,
      description: 'Create beautiful and intuitive user interfaces. Work on web and mobile applications with a focus on user experience.',
      requirements: [
        '2+ years of UI/UX design experience',
        'Proficiency in Figma and Adobe Creative Suite',
        'Strong portfolio showcasing design skills',
        'Understanding of user-centered design',
        'Knowledge of design systems'
      ],
      responsibilities: [
        'Design user interfaces and experiences',
        'Create wireframes and prototypes',
        'Conduct user research',
        'Collaborate with development teams',
        'Maintain design systems'
      ],
      benefits: [
        'Creative freedom',
        'Remote work options',
        'Design tool subscriptions',
        'Portfolio development support',
        'Collaborative environment'
      ],
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
      companyLogo: null,
      isBookmarked: true,
      urgentHiring: false,
      companyInfo: {
        size: '20-50 employees',
        industry: 'Design Agency',
        website: 'https://designstudio.com',
        about: 'Award-winning design studio creating exceptional digital experiences for global brands.'
      }
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'Cloud Systems Ltd',
      location: 'Chennai, Tamil Nadu',
      experience: '4-7 years',
      salary: '12-18 LPA',
      jobType: 'Full Time',
      workMode: 'Hybrid',
      postedDate: '2024-01-10',
      applications: 23,
      description: 'Manage cloud infrastructure and deployment pipelines. Ensure system reliability and scalability.',
      requirements: [
        '4+ years of DevOps experience',
        'Strong knowledge of AWS/Azure',
        'Experience with Docker and Kubernetes',
        'CI/CD pipeline expertise',
        'Infrastructure as Code experience'
      ],
      responsibilities: [
        'Manage cloud infrastructure',
        'Build and maintain CI/CD pipelines',
        'Monitor system performance',
        'Implement security best practices',
        'Automate deployment processes'
      ],
      benefits: [
        'Cloud certification support',
        'Technical training budget',
        'Health insurance',
        'Performance bonuses',
        'Work-life balance'
      ],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
      companyLogo: null,
      isBookmarked: false,
      urgentHiring: true,
      companyInfo: {
        size: '100-200 employees',
        industry: 'Cloud Services',
        website: 'https://cloudsystems.com',
        about: 'Premier cloud services provider helping enterprises migrate and scale their infrastructure.'
      }
    }
  ];

  const [companies] = useState([
    'Tech Solutions Pvt Ltd',
    'Digital Innovations Inc',
    'StartupXYZ',
    'Analytics Corp',
    'Design Studio',
    'Cloud Systems Ltd'
  ]);

  const [locations] = useState([
    'Mumbai',
    'Bangalore',
    'Delhi',
    'Pune',
    'Hyderabad',
    'Chennai'
  ]);

  const [skillsList] = useState([
    'React', 'Node.js', 'JavaScript', 'Python', 'AWS', 'MongoDB',
    'Vue.js', 'TypeScript', 'CSS', 'HTML', 'Machine Learning',
    'SQL', 'Tableau', 'Figma', 'Adobe XD', 'Docker', 'Kubernetes'
  ]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(sampleJobs);
      setFilteredJobs(sampleJobs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Experience filter
    if (filters.experience) {
      filtered = filtered.filter(job =>
        job.experience.includes(filters.experience)
      );
    }

    // Job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job =>
        job.jobType === filters.jobType
      );
    }

    // Work mode filter
    if (filters.workMode) {
      filtered = filtered.filter(job =>
        job.workMode === filters.workMode
      );
    }

    // Company filter
    if (filters.companies.length > 0) {
      filtered = filtered.filter(job =>
        filters.companies.includes(job.company)
      );
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(job =>
        filters.skills.some(skill => job.skills.includes(skill))
      );
    }

    // Salary range filter
    const [minSalary, maxSalary] = filters.salaryRange;
    filtered = filtered.filter(job => {
      const salaryMatch = job.salary.match(/(\d+)-(\d+)/);
      if (salaryMatch) {
        const jobMinSalary = parseInt(salaryMatch[1]);
        const jobMaxSalary = parseInt(salaryMatch[2]);
        return jobMaxSalary >= minSalary && jobMinSalary <= maxSalary;
      }
      return true;
    });

    // Posted within filter
    if (filters.postedWithin) {
      const now = new Date();
      filtered = filtered.filter(job => {
        const postedDate = new Date(job.postedDate);
        const diffTime = Math.abs(now - postedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filters.postedWithin) {
          case '1': return diffDays <= 1;
          case '3': return diffDays <= 3;
          case '7': return diffDays <= 7;
          case '30': return diffDays <= 30;
          default: return true;
        }
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCompanyFilter = (company, checked) => {
    setFilters(prev => ({
      ...prev,
      companies: checked 
        ? [...prev.companies, company]
        : prev.companies.filter(c => c !== company)
    }));
  };

  const handleSkillFilter = (skill, checked) => {
    setFilters(prev => ({
      ...prev,
      skills: checked 
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      location: '',
      experience: '',
      jobType: '',
      workMode: '',
      salaryRange: [0, 50],
      companies: [],
      skills: [],
      postedWithin: ''
    });
  };

  const handleApply = (job) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please login to apply for jobs');
      window.location.href = '/login';
      return;
    }
    
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsJobDetailOpen(true);
  };

  const handleBookmark = (jobId) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );
  };

  const handleShare = (job) => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  const submitApplication = () => {
    // Simulate application submission
    console.log('Applying for job:', selectedJob);
    alert(`Application submitted for ${selectedJob.title} at ${selectedJob.company}!`);
    setIsApplyModalOpen(false);
    setSelectedJob(null);
  };

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

  if (loading) {
    return (
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Latest Job Opportunities
          </h2>
          <p className="text-gray-600 text-lg">
            Discover your next career move from {jobs.length}+ active job postings
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Search Jobs
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Job title, skills, company..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Location
                    </Label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => handleFilterChange('location', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="">All Locations</SelectItem> */}
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Experience
                    </Label>
                    <Select
                      value={filters.experience}
                      onValueChange={(value) => handleFilterChange('experience', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="">All Experience</SelectItem> */}
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-4">2-4 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-8">5-8 years</SelectItem>
                        <SelectItem value="8+">8+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Job Type */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Job Type
                    </Label>
                    <Select
                      value={filters.jobType}
                      onValueChange={(value) => handleFilterChange('jobType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="">All Types</SelectItem> */}
                        <SelectItem value="Full Time">Full Time</SelectItem>
                        <SelectItem value="Part Time">Part Time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Work Mode */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Work Mode
                    </Label>
                    <Select
                      value={filters.workMode}
                      onValueChange={(value) => handleFilterChange('workMode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select work mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="">All Modes</SelectItem> */}
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Salary Range (LPA)
                    </Label>
                    <div className="px-2">
                      <Slider
                        value={filters.salaryRange}
                        onValueChange={(value) => handleFilterChange('salaryRange', value)}
                        max={50}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{filters.salaryRange[0]} LPA</span>
                        <span>{filters.salaryRange[1]} LPA</span>
                      </div>
                    </div>
                  </div>

                  {/* Posted Within */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Posted Within
                    </Label>
                    <Select
                      value={filters.postedWithin}
                      onValueChange={(value) => handleFilterChange('postedWithin', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="">Any time</SelectItem> */}
                        <SelectItem value="1">Last 24 hours</SelectItem>
                        <SelectItem value="3">Last 3 days</SelectItem>
                        <SelectItem value="7">Last week</SelectItem>
                        <SelectItem value="30">Last month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Companies */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Companies
                    </Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {companies.map((company) => (
                        <div key={company} className="flex items-center space-x-2">
                          <Checkbox
                            id={`company-${company}`}
                            checked={filters.companies.includes(company)}
                            onCheckedChange={(checked) => handleCompanyFilter(company, checked)}
                          />
                          <Label
                            htmlFor={`company-${company}`}
                            className="text-sm text-gray-600 cursor-pointer"
                          >
                            {company}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Skills
                    </Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {skillsList.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={filters.skills.includes(skill)}
                            onCheckedChange={(checked) => handleSkillFilter(skill, checked)}
                          />
                          <Label
                            htmlFor={`skill-${skill}`}
                            className="text-sm text-gray-600 cursor-pointer"
                          >
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Sort by: Relevance</span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or check back later for new opportunities.
                  </p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-purple-500">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Job Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-6 h-6 text-purple-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 hover:text-purple-600 cursor-pointer transition-colors">
                                    {job.title}
                                  </h3>
                                  {job.urgentHiring && (
                                    <Badge className="bg-red-100 text-red-800 text-xs">
                                      Urgent
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-purple-600 font-medium text-base md:text-lg mb-2">
                                  {job.company}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                    <span>{job.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Briefcase className="w-4 h-4 mr-1 flex-shrink-0" />
                                    <span>{job.experience}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
                                    <span>{job.salary}</span>
                                  </div>
                                  <Badge className={getWorkModeColor(job.workMode)}>
                                    {job.workMode}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBookmark(job.id)}
                                className={job.isBookmarked ? 'text-purple-600' : 'text-gray-400'}
                              >
                                <Bookmark className={`w-4 h-4 ${job.isBookmarked ? 'fill-current' : ''}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare(job)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Job Description */}
                          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
                            {job.description}
                          </p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 5 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                +{job.skills.length - 5} more
                              </Badge>
                            )}
                          </div>

                          {/* Footer Info */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{getTimeSincePosted(job.postedDate)}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{job.applications} applicants</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32">
                          <Button
                            onClick={() => handleApply(job)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            Apply Now
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-purple-200 text-purple-600 hover:bg-purple-50"
                            onClick={() => handleViewDetails(job)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Load More Button */}
            {filteredJobs.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" className="px-8 py-3">
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Job Details Modal */}
        <Dialog open={isJobDetailOpen} onOpenChange={setIsJobDetailOpen}>
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
                      <p className="text-gray-600 mb-2">{selectedJob.companyInfo.about}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{selectedJob.companyInfo.size}</span>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-1" />
                          <span>{selectedJob.companyInfo.industry}</span>
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          <a href={selectedJob.companyInfo.website} className="text-purple-600 hover:underline">
                            Website
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{selectedJob.location}</span>
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
                        <span>{selectedJob.jobType}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building2 className="w-4 h-4 mr-2" />
                        <Badge className={getWorkModeColor(selectedJob.workMode)}>
                          {selectedJob.workMode}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Posted {getTimeSincePosted(selectedJob.postedDate)}</span>
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
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Responsibilities */}
                  <div>
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

                  {/* Benefits */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {selectedJob.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <Award className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
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

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
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
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Apply Modal */}
        <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
          <DialogContent className="max-w-md">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Apply for {selectedJob.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-purple-600 mb-1">{selectedJob.company}</h4>
                    <p className="text-sm text-gray-600">{selectedJob.location}</p>
                    <p className="text-sm text-gray-600">{selectedJob.salary}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">
                      Your profile and resume will be sent to the employer.
                    </p>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Profile information</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Resume/CV</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Contact information</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={submitApplication}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsApplyModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}