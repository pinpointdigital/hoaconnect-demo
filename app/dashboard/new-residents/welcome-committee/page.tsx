'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { SAMPLE_WELCOME_COMMITTEE, SAMPLE_NEW_RESIDENTS } from '@/lib/onboarding/captain-data';
import { Heart, Users, Star, Clock, Mail, Plus, Settings, Phone, Calendar, MessageSquare, UserCheck, Route } from 'lucide-react';
import Link from 'next/link';

export default function WelcomeCommitteePage() {
  const committee = SAMPLE_WELCOME_COMMITTEE;
  const [selectedMember, setSelectedMember] = useState(committee[0]?.id);

  // Get residents assigned to selected member
  const selectedMemberData = committee.find(m => m.id === selectedMember);
  const assignedResidents = SAMPLE_NEW_RESIDENTS.filter(r => 
    selectedMemberData?.assignedResidents.includes(r.id)
  );

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
              <Plus size={16} />
              Add Member
            </Button>
          </div>
        </div>

        {/* Sub-Navigation */}
        <div className="flex gap-1 border-b border-neutral-200">
          <Link href="/dashboard/new-residents">
            <button className="px-4 py-2 text-body font-medium text-ink-800 hover:text-primary hover:bg-primary/5 transition-colors">
              Overview
            </button>
          </Link>
          <Link href="/dashboard/new-residents/welcome-committee">
            <button className="px-4 py-2 text-body font-medium text-primary border-b-2 border-primary bg-primary/5">
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


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Committee Members List */}
        <div className="lg:col-span-2">
          <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
            <h3 className="text-h3 font-medium text-ink-900 mb-6">Committee Members</h3>
            
            <div className="space-y-4">
              {committee.map((member) => (
                <div 
                  key={member.id} 
                  className={`border rounded-ctl p-4 cursor-pointer transition-all duration-150 ${
                    selectedMember === member.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => setSelectedMember(member.id)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar name={member.name} size="md" />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-body font-medium text-ink-900">{member.name}</h4>
                        {member.isBoardMember && (
                          <div className="text-caption px-2 py-1 rounded font-medium bg-blue-100 text-blue-800">
                            Board Member
                          </div>
                        )}
                      </div>
                      <p className="text-caption text-ink-800 mb-2">{member.role}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-caption text-ink-800">
                        <div>
                          <div className="flex items-center gap-1">
                            <UserCheck size={12} />
                            <span>{member.completedWelcomes} welcomes</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>Since {member.memberSince.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Member Details */}
        <div className="lg:col-span-1">
          {selectedMemberData && (
            <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
              <div className="text-center mb-6">
                <Avatar name={selectedMemberData.name} size="lg" className="mx-auto mb-3" />
                <h4 className="text-h4 font-medium text-ink-900">{selectedMemberData.name}</h4>
                <p className="text-caption text-ink-800">{selectedMemberData.role}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-ink-800" />
                  <span className="text-body text-ink-900">{selectedMemberData.email}</span>
                </div>
                {selectedMemberData.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-ink-800" />
                    <span className="text-body text-ink-900">{selectedMemberData.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="text-center">
                  <p className="text-caption text-ink-800 uppercase tracking-wide mb-1">Member Since</p>
                  <p className="text-body font-medium text-ink-900">
                    {selectedMemberData.memberSince.toLocaleDateString()}
                  </p>
                  <p className="text-caption text-ink-700 mt-1">
                    {(() => {
                      const totalMonths = Math.round((new Date().getTime() - selectedMemberData.memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30));
                      const years = Math.floor(totalMonths / 12);
                      const months = totalMonths % 12;
                      
                      if (years > 0 && months > 0) {
                        return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
                      } else if (years > 0) {
                        return `${years} year${years > 1 ? 's' : ''}`;
                      } else {
                        return `${months} month${months > 1 ? 's' : ''}`;
                      }
                    })()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button variant="primary" size="sm" className="w-full">
                  <MessageSquare size={14} />
                  Send Message
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  View Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}