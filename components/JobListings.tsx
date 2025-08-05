'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [loading, setLoading] = useState(true);

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
      description: 'We are looking for a Senior Software Developer to join our dynamic team. The ideal candidate should have strong experience in React, Node.js, and cloud technologies.',
      skills: ['React', 'Node.js', 'JavaScript', 'AWS', 'MongoDB'],
      companyLogo: null,
      isBookmarked: false,
      urgentHiring: false
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
      description: 'Join our frontend team to build amazing user experiences. We work with modern technologies and follow best practices.',
      skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'HTML'],
      companyLogo: null,
      isBookmarked: true,
      urgentHiring: true
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
      description: 'Lead product strategy and development for our innovative platform. Work closely with engineering and design teams.',
      skills: ['Product Management', 'Analytics', 'Strategy', 'Leadership'],
      companyLogo: null,
      isBookmarked: false,
      urgentHiring: false
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
      skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'Statistics'],
      companyLogo: null,
      isBookmarked: false,
      urgentHiring: true
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
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
      companyLogo: null,
      isBookmarked: true,
      urgentHiring: false
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
      skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
      companyLogo: null,
      isBookmarked: false,
      urgentHiring: true
    }
  ];

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

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by location
    if (locationFilter !== 'all') {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by experience
    if (experienceFilter !== 'all') {
      filtered = filtered.filter(job =>
        job.experience.includes(experienceFilter)
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, experienceFilter]);

  const handleApply = (job) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please login to apply for jobs');
      window.location.href = '/login';
      return;
    }
    
    // Simulate job application
    console.log('Applying for job:', job);
    alert(`Application submitted for ${job.title} at ${job.company}!`);
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
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Latest Job Opportunities
          </h2>
          <p className="text-gray-600 text-lg">
            Discover your next career move from {jobs.length}+ active job postings
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full sm:w-48 h-12">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                </SelectContent>
              </Select>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="w-full sm:w-48 h-12">
                  <SelectValue placeholder="All Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-4">2-4 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-8">5-8 years</SelectItem>
                  <SelectItem value="8+">8+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
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
                      <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                        <ExternalLink className="w-4 h-4 mr-2" />
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
    </section>
  );
}