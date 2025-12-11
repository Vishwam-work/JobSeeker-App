import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building2, 
  Code, 
  TrendingUp, 
  Rocket, 
  Truck,
  BarChart3,
  Database,
  DollarSign,
  Users,
  Target
} from 'lucide-react';

const jobTypes = [
  { icon: Home, label: 'Remote', count: '12k+' },
  { icon: Building2, label: 'MNC', count: '8k+' },
  { icon: Code, label: 'Software &...', count: '15k+' },
  { icon: TrendingUp, label: 'Fortune 500', count: '3k+' },
  { icon: Rocket, label: 'Startup', count: '5k+' },
  { icon: Truck, label: 'Supply Ch...', count: '2k+' },
];

const skillCategories = [
  { icon: BarChart3, label: 'Analytics', count: '4k+' },
  { icon: Database, label: 'Data Scien...', count: '6k+' },
  { icon: DollarSign, label: 'Banking & ...', count: '7k+' },
  { icon: Users, label: 'HR', count: '3k+' },
  { icon: Target, label: 'Marketing', count: '5k+' },
];

export default function JobCategories() {
  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Types */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8 md:mb-12">
          {jobTypes.map((type, index) => {
            const IconComponent = type.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-16 md:h-20 flex-col space-y-1 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
              >
                <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">{type.label}</span>
                <span className="text-xs text-gray-500">{type.count}</span>
              </Button>
            );
          })}
        </div>

        {/* Skill Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-16 md:h-20 flex-col space-y-1 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
              >
                <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">{category.label}</span>
                <span className="text-xs text-gray-500">{category.count}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}