'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { DemoTooltip } from '@/components/ui/DemoTooltip';
import { 
  SAMPLE_NEW_RESIDENT_KPIS, 
  SAMPLE_NEW_RESIDENTS, 
  SAMPLE_WELCOME_COMMITTEE,
  SAMPLE_CAPTAIN_ALERTS 
} from '@/lib/onboarding/captain-data';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Clock, 
  Star, 
  Mail,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MessageSquare,
  Phone,
  UserPlus,
  Settings,
  Heart,
  Route
} from 'lucide-react';
import Link from 'next/link';

export default function NewResidentsPage() {
  const { hasPermission } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  
  const kpis = SAMPLE_NEW_RESIDENT_KPIS;
  const residents = SAMPLE_NEW_RESIDENTS;
  const alerts = SAMPLE_CAPTAIN_ALERTS;

  const scrollToAlerts = () => {
    const alertsSection = document.getElementById('alerts-section');
    if (alertsSection) {
      alertsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'needs-attention': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'new': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-ink-800 bg-neutral-50 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Sub-Navigation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-ink-900">New Resident Onboarding</h1>
          </div>
          
          <div className="flex gap-3">
            <Button variant="primary" size="sm">
              <UserPlus size={16} />
              Add New Resident
            </Button>
          </div>
        </div>

        {/* Sub-Navigation */}
        <div className="flex gap-1 border-b border-neutral-200">
          <Link href="/dashboard/new-residents">
            <button className="px-4 py-2 text-body font-medium text-primary border-b-2 border-primary bg-primary/5">
              Overview
            </button>
          </Link>
          <Link href="/dashboard/new-residents/welcome-committee">
            <button className="px-4 py-2 text-body font-medium text-ink-800 hover:text-primary hover:bg-primary/5 transition-colors">
              <Heart size={16} className="inline mr-2" />
              Welcome Committee
            </button>
          </Link>
          <Link href="/dashboard/new-residents/onboarding-setup">
            <button className="px-4 py-2 text-body font-medium text-ink-800 hover:text-primary hover:bg-primary/5 transition-colors">
              <Route size={16} className="inline mr-2" />
              Onboarding Journey
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alerts & Action Items - First Priority */}
        <Tooltip content="Click to view alerts that need immediate attention from new residents">
          <div 
            className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
            onClick={scrollToAlerts}
          >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-ink-800 uppercase tracking-wide">Active Alerts</p>
              <p className="text-h3 font-bold text-ink-900">{alerts.length}</p>
              <p className="text-caption text-red-600 flex items-center gap-1">
                <AlertTriangle size={12} />
                1 urgent, 1 needs attention
              </p>
            </div>
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          </div>
        </Tooltip>

        {/* Welcome Experience Rating - Second Priority */}
        <Tooltip content="Average rating from new residents about their welcome experience and onboarding process">
          <div 
            className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
            onClick={scrollToReviews}
          >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-ink-800 uppercase tracking-wide">Welcome Rating</p>
              <p className="text-h3 font-bold text-ink-900">{kpis.averageWelcomeRating}/5</p>
              <p className="text-caption text-green-600 flex items-center gap-1">
                <Star size={12} />
                {kpis.welcomeEmailResponseRate}% response rate
              </p>
            </div>
            <Star size={24} className="text-primary" />
          </div>
          </div>
        </Tooltip>

        {/* Average Completion Time */}
        <Tooltip content="Average days from move-in date to complete all required onboarding and welcome steps">
          <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-ink-800 uppercase tracking-wide">Avg Completion Days</p>
              <p className="text-h3 font-bold text-ink-900">{kpis.averageCompletionTime} days</p>
              <p className="text-caption text-green-600 flex items-center gap-1">
                <TrendingDown size={12} />
                -2 days vs previous period
              </p>
            </div>
            <Clock size={24} className="text-primary" />
          </div>
          </div>
        </Tooltip>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div id="alerts-section" className="rounded-card border border-red-200 bg-red-50 shadow-elev1 p-6">
          <h3 className="text-h4 font-medium text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Action Required
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 bg-white rounded-ctl border border-red-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-ink-900">{alert.residentName}</span>
                    <span className={`text-caption px-2 py-1 rounded font-medium ${
                      alert.type === 'overdue' ? 'bg-red-100 text-red-800' :
                      alert.type === 'needs-attention' ? 'bg-orange-100 text-orange-800' :
                      alert.type === 'follow-up-required' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.type === 'overdue' ? 'Urgent' :
                       alert.type === 'needs-attention' ? 'Needs Attention' :
                       alert.type === 'follow-up-required' ? 'Need Follow Up' :
                       alert.type}
                    </span>
                  </div>
                  <p className="text-body text-ink-800 mb-2">{alert.message}</p>
                  <p className="text-caption text-ink-700">
                    <strong>Action:</strong> {alert.actionRequired}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">View Details</Button>
                  <Button variant="primary" size="sm">Take Action</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Residents List */}
      <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
        <h3 className="text-h3 font-medium text-ink-900 mb-6">New Residents</h3>

        <div className="space-y-4">
          {residents.map((resident) => (
            <div key={resident.id} className="border border-neutral-200 rounded-ctl p-4 hover:border-neutral-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-h4 font-medium text-ink-900">{resident.name}</h4>
                  </div>
                  
                  <p className="text-body text-ink-800 mb-2">
                    {resident.address} • 
                    {resident.daysInCommunity >= 0 
                      ? ` ${resident.daysInCommunity} days in community`
                      : ` Moving in ${Math.abs(resident.daysInCommunity)} days`
                    }
                  </p>

                  <div className="flex items-center gap-6 text-caption text-ink-800">
                    <span>Steps completed: {resident.requiredItemsCompleted}/{resident.totalRequiredItems}</span>
                  </div>

                  {resident.alerts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {resident.alerts.map((alert, index) => (
                        <span key={index} className="text-caption bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {alert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">View Details</Button>
                  <Button variant="secondary" size="sm">View Progress</Button>
                </div>
              </div>

              {/* Progress Bar with Percentage */}
              <div className="relative w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${resident.overallProgress}%` }}
                >
                  <span className="text-xs text-white font-medium">
                    {resident.overallProgress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Requests */}
      <div id="reviews-section" className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
        <h3 className="text-h3 font-medium text-ink-900 mb-6">Onboarding Experience Reviews</h3>
        
        <div className="space-y-4">
          {/* Review #1 - Jennifer Martinez */}
          <div className="border border-green-200 bg-green-50 rounded-ctl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-body font-medium text-ink-900">Jennifer Martinez</h4>
                  <span className="text-caption bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                    Review Submitted
                  </span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={14} className="text-yellow-500 fill-current" />
                    ))}
                    <span className="text-caption text-ink-900 ml-1">5/5</span>
                  </div>
                </div>
                
                <p className="text-body text-ink-800 mb-2">
                  "Honestly, I was dreading all the HOA paperwork, but this was actually kind of fun! 😊 The checklist made it feel like a game, and Sarah from the welcome committee brought us cookies. Rob (the HOA President) personally called to welcome us, and his wife Roberta even invited us to the community book club. Having everything organized in one place was a lifesaver during our chaotic move!"
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-caption text-ink-800">
                  <div>
                    <div>Moved in:</div>
                    <div>1/15/2024</div>
                  </div>
                  <div>
                    <div>Completed onboarding:</div>
                    <div>1/23/2024 (8 days)</div>
                  </div>
                  <div>
                    <div>Submitted:</div>
                    <div>2 days ago</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View Details</Button>
                <Button variant="secondary" size="sm">Send Thank You</Button>
              </div>
            </div>
          </div>

          {/* Review #2 - Michael Chen */}
          <div className="border border-green-200 bg-green-50 rounded-ctl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-body font-medium text-ink-900">Michael Chen</h4>
                  <span className="text-caption bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                    Review Submitted
                  </span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4].map((star) => (
                      <Star key={star} size={14} className="text-yellow-500 fill-current" />
                    ))}
                    <Star size={14} className="text-yellow-500" />
                    <span className="text-caption text-ink-900 ml-1">4/5</span>
                  </div>
                </div>
                
                <p className="text-body text-ink-800 mb-2">
                  "Pretty smooth process overall! The gate code took a bit longer than expected (had to call twice), but Rob personally followed up to make sure it was working. The pool rules were way more reasonable than our last community. Roberta stopped by with homemade muffins and gave us the real scoop on the best walking trails around here!"
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-caption text-ink-800">
                  <div>
                    <div>Moved in:</div>
                    <div>1/08/2024</div>
                  </div>
                  <div>
                    <div>Completed onboarding:</div>
                    <div>1/18/2024 (10 days)</div>
                  </div>
                  <div>
                    <div>Submitted:</div>
                    <div>5 days ago</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View Details</Button>
                <Button variant="secondary" size="sm">Send Thank You</Button>
              </div>
            </div>
          </div>

          {/* Review #3 - Lisa Park */}
          <div className="border border-green-200 bg-green-50 rounded-ctl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-body font-medium text-ink-900">Lisa Park</h4>
                  <span className="text-caption bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                    Review Submitted
                  </span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={14} className="text-yellow-500 fill-current" />
                    ))}
                    <span className="text-caption text-ink-900 ml-1">5/5</span>
                  </div>
                </div>
                
                <p className="text-body text-ink-800 mb-2">
                  "As someone who's moved 6 times in 10 years (military family), this was BY FAR the most organized HOA onboarding I've experienced! 🎉 Rob and Roberta personally delivered a welcome basket with local restaurant recommendations and even helped us find a babysitter. The kids loved getting their own pool passes, and the emergency contact list actually had people who answered their phones. We already feel at home!"
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-caption text-ink-800">
                  <div>
                    <div>Moved in:</div>
                    <div>12/28/2023</div>
                  </div>
                  <div>
                    <div>Completed onboarding:</div>
                    <div>1/05/2024 (8 days)</div>
                  </div>
                  <div>
                    <div>Submitted:</div>
                    <div>1 week ago</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View Details</Button>
                <Button variant="secondary" size="sm">Send Thank You</Button>
              </div>
            </div>
          </div>

          {/* Pending Review Request */}
          <div className="border border-blue-200 bg-blue-50 rounded-ctl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-body font-medium text-ink-900">Robert Kim</h4>
                  <span className="text-caption bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                    Review Requested
                  </span>
                  <span className="text-caption text-ink-800 flex items-center gap-1">
                    <Clock size={12} />
                    Sent 1 day ago
                  </span>
                </div>
                
                <div className="text-body text-ink-800 mb-2">
                  <p className="font-medium mb-2">Outreach attempts:</p>
                  <ul className="space-y-1 text-caption text-ink-700">
                    <li>• Email sent 1/22/2024 at 3:00 PM - Delivered, not opened</li>
                    <li>• SMS reminder sent 1/23/2024 at 10:00 AM - Delivered</li>
                    <li>• Follow-up email sent 1/24/2024 at 9:00 AM - Delivered, not opened</li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-caption text-ink-800">
                  <div>
                    <div>Moved in:</div>
                    <div>1/12/2024</div>
                  </div>
                  <div>
                    <div>Completed onboarding:</div>
                    <div>1/22/2024 (10 days)</div>
                  </div>
                  <div>
                    <div>Email status:</div>
                    <div>Delivered, not opened</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <MessageSquare size={14} />
                  Follow Up
                </Button>
                <Button variant="secondary" size="sm">Resend Request</Button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
