'use client';

import { Card, CardContent } from '@/components/ui/card';

const companies = [
  { name: 'TCS', logo: 'TCS', openings: '2.5k+ jobs' },
  { name: 'Infosys', logo: 'INF', openings: '1.8k+ jobs' },
  { name: 'Wipro', logo: 'WIP', openings: '1.2k+ jobs' },
  { name: 'Accenture', logo: 'ACC', openings: '950+ jobs' },
  { name: 'Cognizant', logo: 'COG', openings: '800+ jobs' },
  { name: 'HCL Tech', logo: 'HCL', openings: '750+ jobs' },
  { name: 'Tech Mahindra', logo: 'TM', openings: '650+ jobs' },
  { name: 'Capgemini', logo: 'CAP', openings: '580+ jobs' },
];

export default function TopCompanies() {
  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
          Top companies hiring now
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {companies.map((company, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-gray-200 hover:border-purple-200">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                  <span className="text-purple-600 font-bold text-xs md:text-sm">{company.logo}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base group-hover:text-purple-700 transition-colors">{company.name}</h3>
                <p className="text-xs md:text-sm text-gray-600">{company.openings}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}