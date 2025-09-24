'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  DollarSign,
  Calendar,
  Home as HomeIcon,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  LayoutDashboard,
  Grid3X3,
  List,
  FileText
} from 'lucide-react';

interface ReserveData {
  reserveHealth: {
    percentage: number;
    status: 'good' | 'fair' | 'poor';
    description: string;
  };
  memberDues: {
    monthlyReserveAmount: number;
    totalMonthlyDues: number;
    reservePercentage: number;
  };
  upcomingProjects: Array<{
    name: string;
    year: number;
    estimatedCost: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  riskAreas: Array<{
    component: string;
    fundingLevel: number;
    risk: 'high' | 'medium' | 'low';
  }>;
  budgetBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

const RANCHO_MADRINA_DATA: ReserveData = {
  reserveHealth: {
    percentage: 57.24,
    status: 'fair',
    description: "Our reserves are at 57% of the recommended level ($887k on hand vs $1.55M needed). This means we're in a fair position, but not fully funded."
  },
  memberDues: {
    monthlyReserveAmount: 53.53,
    totalMonthlyDues: 346.05, // Actual 2025 dues per unit per month
    reservePercentage: 15.47 // Reserves share if 2024 contribution continued
  },
  upcomingProjects: [
    { name: 'Community Painting', year: 2025, estimatedCost: 50119, priority: 'high' },
    { name: 'Street Repairs', year: 2025, estimatedCost: 659315, priority: 'high' },
    { name: 'Access Equipment & Fencing', year: 2026, estimatedCost: 1161288, priority: 'high' },
    { name: 'Lighting System Upgrades', year: 2027, estimatedCost: 84200, priority: 'medium' },
    { name: 'Tot Lot Improvements', year: 2029, estimatedCost: 118000, priority: 'medium' }
  ],
  riskAreas: [
    { component: 'Mailboxes & Monuments', fundingLevel: 0, risk: 'high' },
    { component: 'Tot Lot', fundingLevel: 5.3, risk: 'high' },
    { component: 'Access Equipment & Fencing', fundingLevel: 8.3, risk: 'high' },
    { component: 'Lighting Systems', fundingLevel: 21.3, risk: 'medium' },
    { component: 'Streets', fundingLevel: 56.6, risk: 'medium' },
    { component: 'Landscape', fundingLevel: 314.5, risk: 'low' }
  ],
  budgetBreakdown: [
    { category: 'Landscaping', amount: 107, percentage: 21.48 },
    { category: 'Water & Sewer', amount: 55, percentage: 11.04 },
    { category: 'Insurance', amount: 46, percentage: 9.27 },
    { category: 'Management Services', amount: 23, percentage: 4.67 },
    { category: 'Electricity', amount: 13, percentage: 2.53 },
    { category: 'Other Operations', amount: 254, percentage: 50.99 } // Patrol, legal, street sweeping, etc.
  ]
};

export default function ReserveStudyPage() {
  const { hasPermission } = useAuth();
  const [reserveData] = useState<ReserveData>(RANCHO_MADRINA_DATA);
  const [viewMode, setViewMode] = useState<'dashboard' | 'cards'>('dashboard');
  const [interactiveCharts, setInteractiveCharts] = useState(true);

  // Animation states for counters
  const [animatedReserveHealth, setAnimatedReserveHealth] = useState(0);
  const [animatedDuesAmount, setAnimatedDuesAmount] = useState(0);

  // Animate counters on mount
  useEffect(() => {
    const animateValue = (start: number, end: number, setter: (value: number) => void, duration: number = 1000) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(start + (end - start) * progress);
        setter(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    setTimeout(() => {
      animateValue(0, reserveData.reserveHealth.percentage, setAnimatedReserveHealth, 1500);
      animateValue(0, reserveData.memberDues.monthlyReserveAmount, setAnimatedDuesAmount, 1200);
    }, 300);
  }, []);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-blue-600" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-ink-900">Reserve Study</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'dashboard' ? 'cards' : 'dashboard')}
            className="flex items-center gap-2 text-primary hover:text-primary-700 transition-colors text-body font-medium"
          >
            {viewMode === 'dashboard' ? <List size={16} /> : <Grid3X3 size={16} />}
            {viewMode === 'dashboard' ? 'Card View' : 'Dashboard View'}
          </button>
          <button
            onClick={() => window.open('/community-documents/reserve-study/2024-002 Full Report OCR.pdf', '_blank')}
            className="flex items-center gap-2 text-primary hover:text-primary-700 transition-colors text-body font-medium"
          >
            <FileText size={16} />
            View Full Report
          </button>
        </div>
      </div>

      {/* Dashboard View */}
      {viewMode === 'dashboard' ? (
        <div className="space-y-6">
          {/* Row 1: Reserve Health and Your Monthly Dues */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reserve Health */}
            <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="text-blue-600" size={16} />
              </div>
              <h3 className="text-h3 font-semibold text-ink-900">Reserve Health</h3>
            </div>
            
            <div className="text-center mb-4">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-neutral-200"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className={reserveData.reserveHealth.status === 'good' ? 'text-green-500' : 
                              reserveData.reserveHealth.status === 'fair' ? 'text-yellow-500' : 'text-red-500'}
                    strokeDasharray={`${animatedReserveHealth * 2.51} 251`}
                    style={{ 
                      transition: 'stroke-dasharray 0.5s ease-in-out',
                      animation: interactiveCharts ? 'pulse 2s infinite' : 'none'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-ink-900">{animatedReserveHealth}%</span>
                </div>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getHealthColor(reserveData.reserveHealth.status)}`}>
                {reserveData.reserveHealth.status === 'good' && <CheckCircle size={14} />}
                {reserveData.reserveHealth.status === 'fair' && <Info size={14} />}
                {reserveData.reserveHealth.status === 'poor' && <AlertTriangle size={14} />}
                <span className="text-caption font-medium capitalize">{reserveData.reserveHealth.status}</span>
              </div>
            </div>
            
            <p className="text-body text-ink-600 text-center mb-3">
              {reserveData.reserveHealth.description}
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-caption text-blue-700">
                <strong>What this means:</strong> Think of reserves like a savings account for big repairs. We have about half of what experts recommend, so we may need special assessments for major projects.
              </p>
            </div>
            </div>

            {/* Your Monthly Dues */}
            <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={16} />
              </div>
              <h3 className="text-h3 font-semibold text-ink-900">Your Monthly Dues</h3>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-ink-900 mb-1">
                ${animatedDuesAmount}
              </div>
              <p className="text-caption text-ink-600">per month goes to reserves</p>
            </div>
            
            {/* Simple pie chart representation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-body text-ink-700">Reserves</span>
                <span className="text-body font-medium text-ink-900">${reserveData.memberDues.monthlyReserveAmount}</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${reserveData.memberDues.reservePercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body text-ink-700">Operations</span>
                <span className="text-body font-medium text-ink-900">${reserveData.memberDues.totalMonthlyDues - reserveData.memberDues.monthlyReserveAmount}</span>
              </div>
            </div>
            
            <p className="text-body text-ink-600 text-center mt-4">
              In 2024, about $53.53 per month from each home went into long-term reserves to protect the community from large special assessments.
            </p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-600" />
                <span className="text-caption font-medium text-red-800">Critical: 2025 Budget Issue</span>
              </div>
              <p className="text-caption text-red-700 mt-1">
                The 2025 budget shows $0 allocated to reserves while we need $77k annually. This could worsen our funding deficit.
              </p>
            </div>
          </div>

          {/* Row 2: Next 5 Years and Risk Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Next 5 Years */}
            <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-purple-600" size={16} />
                </div>
                <h3 className="text-h3 font-semibold text-ink-900">Next 5 Years</h3>
              </div>
            
              <div className="space-y-3 mb-4">
                {reserveData.upcomingProjects.slice(0, 3).map((project, index) => (
                  <div key={project.name} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-body font-medium text-ink-900">{project.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.priority === 'high' ? 'bg-red-100 text-red-700' :
                          project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {project.priority}
                        </span>
                      </div>
                      <span className="text-caption text-ink-600">{project.year}</span>
                    </div>
                    <span className="text-body font-medium text-ink-900">{formatCurrency(project.estimatedCost)}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-body text-ink-600 text-center mb-3">
                Top priorities include street repairs, community painting, and fencing/wall replacements.
              </p>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-caption text-purple-700">
                  <strong>What this means:</strong> These are major expenses coming up that your reserves help pay for. Without adequate reserves, these could become special assessments.
                </p>
              </div>
            </div>

            {/* Risk Areas */}
            <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={16} />
                </div>
                <h3 className="text-h3 font-semibold text-ink-900">Risk Areas</h3>
              </div>
            
              <div className="space-y-3 mb-4">
                {reserveData.riskAreas.map((area) => (
                  <div key={area.component} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-body text-ink-700">{area.component}</span>
                      <span className="text-caption font-medium text-ink-900">{area.fundingLevel}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                          area.risk === 'high' ? 'bg-red-500' :
                          area.risk === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(area.fundingLevel, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-body text-ink-600 text-center mb-3">
                Multiple components are critically underfunded: Mailboxes (0%), Tot Lot (5%), and Fencing (8%). These may require special assessments.
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-caption text-red-700">
                  <strong>What this means:</strong> Red and yellow items don't have enough money saved for future repairs. When they need fixing, you might get a special bill.
                </p>
              </div>
            </div>
          </div>

          {/* Row 3: Monthly Dues Breakdown (Full Width) */}
          <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <PieChart className="text-indigo-600" size={16} />
              </div>
              <h3 className="text-h3 font-semibold text-ink-900">Monthly Dues Breakdown</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Enlarged Donut Chart */}
              <div className="md:col-span-2 flex items-center justify-center">
                <div className="relative w-80 h-80">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {reserveData.budgetBreakdown.map((item, index) => {
                      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                      const startAngle = reserveData.budgetBreakdown.slice(0, index).reduce((sum, prev) => sum + (prev.percentage * 3.6), 0);
                      const endAngle = startAngle + (item.percentage * 3.6);
                      
                      return (
                        <circle
                          key={item.category}
                          cx="50"
                          cy="50"
                          r="35"
                          stroke={colors[index]}
                          strokeWidth="12"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${item.percentage * 2.2} 220`}
                          strokeDashoffset={-startAngle * 2.2 / 3.6}
                          style={{
                            transition: 'stroke-dasharray 1s ease-in-out',
                            animation: interactiveCharts ? `spin-${index} 2s ease-in-out` : 'none'
                          }}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-ink-900">${reserveData.memberDues.totalMonthlyDues}</div>
                      <div className="text-caption text-ink-600">Total Dues</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="space-y-4">
                {reserveData.budgetBreakdown.map((item, index) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                  return (
                    <div key={item.category} className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                        <span className="text-body text-ink-700">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-body font-medium text-ink-900">${item.amount}</div>
                        <div className="text-caption text-ink-600">{item.percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <p className="text-body text-ink-600 text-center mt-4 mb-3">
              Your $346/month dues primarily fund landscaping (21%), water/sewer (11%), and insurance (9%). Note: 2025 shows $0 for reserves.
            </p>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-caption text-indigo-700">
                <strong>What this means:</strong> This shows where your monthly HOA dues go. Most pays for day-to-day operations like maintaining the landscape and paying insurance.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="space-y-6">
          {/* Reserve Health Card */}
          <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
            <h2 className="text-2xl font-semibold text-ink-900 mb-4">Reserve Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-ink-900 mb-2">{animatedReserveHealth}%</div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getHealthColor(reserveData.reserveHealth.status)}`}>
                  <span className="text-body font-medium capitalize">{reserveData.reserveHealth.status}</span>
                </div>
              </div>
              <div>
                <p className="text-body text-ink-600">{reserveData.reserveHealth.description}</p>
              </div>
            </div>
          </div>

          {/* Member Dues Card */}
          <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
            <h2 className="text-2xl font-semibold text-ink-900 mb-4">Member Dues Allocation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-ink-900 mb-2">${animatedDuesAmount}</div>
                <p className="text-body text-ink-600">per month to reserves</p>
              </div>
              <div>
                <p className="text-body text-ink-600 mb-3">
                  About $53.53 per month from each home goes into long-term reserves to protect the community from large special assessments.
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <span className="text-caption font-medium text-amber-800">2025 Budget Alert</span>
                  </div>
                  <p className="text-caption text-amber-700 mt-1">
                    The 2025 budget shows $0 allocated to reserves - this needs board attention.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Projects Card */}
          <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
            <h2 className="text-2xl font-semibold text-ink-900 mb-4">Upcoming Projects (Next 5 Years)</h2>
            <div className="space-y-3">
              {reserveData.upcomingProjects.map((project) => (
                <div key={project.name} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                  <div>
                    <span className="text-body font-medium text-ink-900">{project.name}</span>
                    <span className="text-caption text-ink-600 ml-2">({project.year})</span>
                  </div>
                  <span className="text-body font-medium text-ink-900">{formatCurrency(project.estimatedCost)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Areas Card */}
          <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
            <h2 className="text-2xl font-semibold text-ink-900 mb-4">Risk Areas</h2>
            <div className="space-y-3">
              {reserveData.riskAreas.map((area) => (
                <div key={area.component} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                  <span className="text-body text-ink-700">{area.component}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-body font-medium text-ink-900">{area.fundingLevel}%</span>
                    <div className={`w-3 h-3 rounded-full ${
                      area.risk === 'high' ? 'bg-red-500' :
                      area.risk === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Snapshot Card */}
          <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
            <h2 className="text-2xl font-semibold text-ink-900 mb-4">Budget Snapshot</h2>
            <div className="space-y-3">
              {reserveData.budgetBreakdown.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-body text-ink-700">{item.category}</span>
                  <div className="text-right">
                    <div className="text-body font-medium text-ink-900">${item.amount}</div>
                    <div className="text-caption text-ink-600">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
