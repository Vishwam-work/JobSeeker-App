'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';

export default function SearchSection() {
  return (
    <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Find your dream job now
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12">
          5 lakh+ jobs for you to explore
        </p>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 mb-8 md:mb-12">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-stretch lg:items-end">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Enter skills / designations / companies"
                  className="pl-10 h-12 md:h-14 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="w-full lg:w-48">
              <Select>
                <SelectTrigger className="h-12 md:h-14 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Experience" />
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

            <div className="flex-1 min-w-0">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Enter location"
                  className="pl-10 h-12 md:h-14 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 md:h-14 px-6 md:px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Search
            </Button>
          </div>
        </div>

        {/* Resume Help Section */}
        <div className="bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Need help with your resume?</h3>
              <p className="text-teal-100 text-sm md:text-base">Get experts to build your resume from scratch</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button 
                variant="secondary" 
                className="bg-white hover:bg-gray-100 text-teal-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                View details
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">jobseeker 360</span>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-24 md:w-32 h-24 md:h-32 opacity-20">
            <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
          </div>
        </div>
      </div>
    </section>
  );
}