'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { UserRole } from '@/lib/auth/types';
import { Button } from '@/components/ui/Button';
import { Play, Users, FileText, Wrench, MessageSquare, Home as HomeIcon, AlertTriangle, Clock, CheckCircle, Bot, Send, User, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

// Bot response database
const BOT_RESPONSES: Record<string, string> = {
  // Pool related
  'pool': 'Pool hours are 6 AM - 10 PM daily. Lap swimming is reserved for 6-8 AM on weekdays. Pool maintenance is scheduled monthly.',
  'pool hours': 'Pool hours are 6 AM - 10 PM daily. Lap swimming is reserved for 6-8 AM on weekdays.',
  'swim': 'Pool hours are 6 AM - 10 PM daily. Lap swimming is reserved for 6-8 AM on weekdays.',
  
  // ARC related
  'arc': 'To submit an ARC request, click "My ARC Requests" in the sidebar, then "New Request". You can track your request progress and communicate with the HOA Manager directly.',
  'arc request': 'To submit an ARC request, click "My ARC Requests" in the sidebar, then "New Request". You can track your request progress and communicate with the HOA Manager directly.',
  'architectural': 'For architectural changes, you need to submit an ARC request. Click "My ARC Requests" to get started.',
  'renovation': 'All renovations require ARC approval. Submit your request through "My ARC Requests" with project details and contractor information.',
  
  // HOA Fees
  'fees': 'HOA fees are $285 per month, due on the 1st of each month. You can view your payment status in the "My Account" section.',
  'hoa fees': 'HOA fees are $285 per month, due on the 1st of each month. You can view your payment status in the "My Account" section.',
  'payment': 'Your next HOA payment of $285 is due March 1st. You can update your payment method in the "My Account" billing section.',
  'dues': 'HOA dues are $285 monthly. Your account is currently up to date with payments processed automatically.',
  
  // Parking
  'parking': 'Each unit has 2 assigned parking spaces. Guest parking is available in marked areas for up to 72 hours. Overnight guest parking requires a permit.',
  'guest parking': 'Guest parking is available in marked areas for up to 72 hours. For overnight guests, please request a permit from the HOA office.',
  
  // Maintenance
  'maintenance': 'For maintenance requests, contact Pacific Property Management at (949) 555-0123 or submit a request through the resident portal.',
  'repair': 'For repairs, contact Pacific Property Management at (949) 555-0123. Emergency repairs are available 24/7.',
  
  // Rules and CC&Rs
  'rules': 'Community rules and CC&Rs are available in your ARC request section. Key rules include quiet hours (10 PM - 7 AM) and architectural approval requirements.',
  'noise': 'Quiet hours are 10 PM to 7 AM daily. Please be considerate of neighbors during these times.',
  'pets': 'Pets are allowed with a maximum of 2 pets per unit. Dogs must be leashed in common areas and waste must be cleaned up immediately.',
  
  // Events and amenities
  'events': 'Community events are posted on the bulletin board near the mailboxes. Upcoming: Movie Night (Feb 15) and HOA Meeting (Feb 20).',
  'amenities': 'Community amenities include pool, spa, clubhouse, and fitness center. Hours vary by facility - check posted schedules.',
  
  // Contact info
  'contact': 'HOA Manager: Mike Thompson, mike.thompson@pacificprop.com, (949) 555-0156. Office hours: Mon-Fri 9 AM - 5 PM.',
  'manager': 'Your HOA Manager is Mike Thompson. You can reach him at mike.thompson@pacificprop.com or (949) 555-0156.',
  
  // Gate and access
  'gate': 'For gate keys or access cards, I can help you contact the right person through HOA Connect. Would you like me to send a message to the HOA Manager or get their direct phone number?',
  'gate key': 'For gate keys or access cards, I can help you contact the right person through HOA Connect. Would you like me to send a message to the HOA Manager or get their direct phone number?',
  'gate keys': 'For gate keys or access cards, I can help you contact the right person through HOA Connect. Would you like me to send a message to the HOA Manager or get their direct phone number?',
  'front gate': 'For gate access issues, I can help you contact the HOA Manager through HOA Connect. Would you like me to send a message or provide their direct contact info?',
  'access': 'For access-related questions, I can connect you with the HOA Manager through HOA Connect or provide their direct contact information. What would you prefer?',
  
  // Default responses
  'hello': 'Hi there! I\'m here to help with any questions about your community. What would you like to know?',
  'hi': 'Hello! I can help you with community rules, HOA fees, ARC requests, and more. What can I assist you with?',
  'help': 'I can help with pool hours, HOA fees, ARC requests, parking rules, maintenance, and community information. What would you like to know?',
  'thanks': 'You\'re welcome! Feel free to ask if you have any other questions about the community.',
  'thank you': 'Happy to help! Let me know if you need anything else.',
};

const FALLBACK_RESPONSES = [
  "I don't have that specific information, but I can help you contact the right person through HOA Connect. Would you like me to send a message to the HOA Manager or provide their direct contact info?",
  "That's a great question! I can connect you with HOA Manager Mike Thompson through HOA Connect, or if you prefer, their direct number is (949) 555-0156.",
  "For that specific question, I'd recommend contacting the HOA Manager through HOA Connect's messaging system, or you can call them directly at (949) 555-0156.",
];

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function DashboardPage() {
  const { userProfile, hasPermission, currentRole } = useAuth();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I can help you with community rules, ARC requests, fees, and more. What would you like to know?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [hiddenAlerts, setHiddenAlerts] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Banner image management
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [communityBannerImage, setCommunityBannerImage] = useState('/HOAConnect_Demo_BG.jpg');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hideAlert = (alertId: string) => {
    setHiddenAlerts(prev => new Set([...prev, alertId]));
  };

  // Load banner image from localStorage on mount
  useEffect(() => {
    const savedBannerImage = localStorage.getItem('hoa-connect-community-banner');
    if (savedBannerImage) {
      setCommunityBannerImage(savedBannerImage);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file must be smaller than 5MB');
      return;
    }

    setUploadingImage(true);

    // Create object URL for immediate preview
    const imageUrl = URL.createObjectURL(file);
    
    // Simulate upload delay for demo
    setTimeout(() => {
      setCommunityBannerImage(imageUrl);
      localStorage.setItem('hoa-connect-community-banner', imageUrl);
      setUploadingImage(false);
      setShowImageUploadModal(false);
      
      // Clean up the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1000);
  };

  const resetToDefaultImage = () => {
    setCommunityBannerImage('/HOAConnect_Demo_BG.jpg');
    localStorage.removeItem('hoa-connect-community-banner');
    setShowImageUploadModal(false);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only scroll when messages change, not when typing or input changes
    scrollToBottom();
  }, [chatMessages]);

  const findBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    
    // Return random fallback response
    return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)] || "I'm here to help! Please try asking about community rules, HOA procedures, or services.";
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate bot thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    const botResponse = findBotResponse(chatInput);
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      isBot: true,
      timestamp: new Date()
    };

    setIsTyping(false);
    setChatMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-8">
      {(currentRole as UserRole) === 'homeowner' ? (
        // Homeowner Dashboard
        <div className="space-y-6">
          {/* Page Header Format - Minimal */}
          <div className="space-y-4">
            <div>
              <h1 className="text-h1 font-bold text-ink-900">Welcome, {userProfile.name.split(' ')[0]}</h1>
            </div>
          </div>

          {/* Two-Column Layout for Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* HOA Connect Bot - Left Column (3/5 width) */}
            <div className="lg:col-span-3 rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="text-primary" size={20} />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-h3 font-semibold text-ink-900">HOA Connect Bot</h2>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                    AI Powered - Simulator
                  </span>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="space-y-3 h-64 overflow-y-auto bg-neutral-50 rounded-lg p-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.isBot ? '' : 'justify-end'}`}>
                      {message.isBot && (
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="text-primary" size={14} />
                        </div>
                      )}
                      <div className={`rounded-lg p-3 max-w-xs ${
                        message.isBot 
                          ? 'bg-white border border-neutral-200' 
                          : 'bg-primary text-white'
                      }`}>
                        <p className={`text-caption ${message.isBot ? 'text-ink-800' : 'text-white'}`}>
                          {message.text}
                        </p>
                      </div>
                    {!message.isBot && (
                      <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {userProfile.profilePhoto ? (
                          <img 
                            src={userProfile.profilePhoto} 
                            alt={userProfile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="text-neutral-500" size={16} />
                        )}
                      </div>
                    )}
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="text-primary" size={14} />
                      </div>
                      <div className="bg-white border border-neutral-200 rounded-lg p-3 max-w-xs">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about community rules, procedures, or services..."
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-control text-body focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isTyping}
                  />
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={isTyping || !chatInput.trim()}
                  >
                    <Send size={14} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Account Alerts - Right Column (2/5 width) */}
            <div className="lg:col-span-2 rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
              <h2 className="text-h3 font-semibold text-ink-900 mb-4">Account Alerts</h2>
              
              <div className="space-y-3">
                {/* ARC Request Alert - Compact */}
                {!hiddenAlerts.has('arc-alert') && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-control">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="text-yellow-600" size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-ink-900">ARC Request Needs Your Reply</p>
                        <p className="text-xs text-ink-600 mt-1">HOA Manager is waiting for clarification</p>
                        <p className="text-xs text-ink-500 mt-2">Jan 29, 2024 at 10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Link href="/dashboard/arc" className="flex items-center gap-1 text-xs text-primary hover:text-primary-700 hover:underline font-medium cursor-pointer">
                        View request
                        <ArrowRight size={12} />
                      </Link>
                      <button 
                        onClick={() => hideAlert('arc-alert')}
                        className="flex items-center gap-1 text-xs text-ink-600 hover:text-ink-800 hover:underline cursor-pointer"
                      >
                        <X size={12} />
                        Hide
                      </button>
                    </div>
                  </div>
                )}

                {/* Community Alert - Compact */}
                {!hiddenAlerts.has('pool-alert') && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-control">
                    <div className="flex items-start gap-3 mb-3">
                      <MessageSquare className="text-blue-600" size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-ink-900">Pool Maintenance Notice</p>
                        <p className="text-xs text-ink-600 mt-1">Scheduled for next week</p>
                        <p className="text-xs text-ink-500 mt-2">Jan 28, 2024 at 2:15 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <button className="flex items-center gap-1 text-xs text-primary hover:text-primary-700 hover:underline font-medium cursor-pointer">
                        Read notice
                        <ArrowRight size={12} />
                      </button>
                      <button 
                        onClick={() => hideAlert('pool-alert')}
                        className="flex items-center gap-1 text-xs text-ink-600 hover:text-ink-800 hover:underline cursor-pointer"
                      >
                        <X size={12} />
                        Hide
                      </button>
                    </div>
                  </div>
                )}

                {/* HOA Fee Alert - Compact */}
                {!hiddenAlerts.has('fee-alert') && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-control">
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle className="text-green-600" size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-ink-900">HOA Fees Current</p>
                        <p className="text-xs text-ink-600 mt-1">February payment processed</p>
                        <p className="text-xs text-ink-500 mt-2">Feb 1, 2024 at 8:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => hideAlert('fee-alert')}
                        className="flex items-center gap-1 text-xs text-ink-600 hover:text-ink-800 hover:underline cursor-pointer"
                      >
                        <X size={12} />
                        Hide
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Admin/Management/Board Dashboard (existing)
        <div className="space-y-8">
          {/* Community Banner */}
          <div className="relative rounded-card overflow-hidden border border-ink-900/8 shadow-elev1">
            {/* Banner Image */}
            <div className="relative h-48 md:h-56">
              <img
                src={communityBannerImage}
                alt="Community Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-700');
                  }
                }}
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-end">
                <div className="p-6 md:p-8 text-white">
                  <div className="text-sm font-medium opacity-90 mb-2">
                    {userProfile.role === 'captain' && 'HOA Captain Dashboard'}
                    {userProfile.role === 'management-company' && 'Management Dashboard'}
                    {userProfile.role === 'board-member' && 'Board Member Dashboard'}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Welcome back, {userProfile.name.split(' ')[0]}
                  </h1>
                </div>
              </div>

              {/* Image Edit Button - HOA Manager Only */}
              {(userProfile.role === 'management-company' || userProfile.role === 'captain') && (
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() => setShowImageUploadModal(true)}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white transition-colors rounded-full p-2 shadow-lg group"
                    title="Change community banner image"
                  >
                    <svg 
                      className="w-4 h-4 text-ink-700 group-hover:text-ink-900" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ARC Management Alerts & Messages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ARC Request Alerts */}
            <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h3 font-semibold text-ink-900 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-600" size={20} />
                  ARC Request Alerts
                </h3>
                <Link href="/dashboard/arc-management">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {/* High Priority Alert */}
                <div className="p-6 border border-neutral-200 rounded-lg hover:border-red-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-ink-900 mb-2">
                        Board review overdue - Solar Panel Installation
                      </h4>
                      <p className="text-sm text-ink-600 mb-1">
                        David Martinez
                      </p>
                      <p className="text-sm text-ink-600 mb-2">
                        1423 Oceanview Dr
                      </p>
                      <p className="text-sm text-red-600 font-medium">
                        5 days overdue
                      </p>
                    </div>
                    <Link href="/dashboard/arc-management/arc-001">
                      <Button variant="primary" size="sm" className="ml-6">
                        Review Now
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Medium Priority Alert */}
                <div className="p-6 border border-neutral-200 rounded-lg hover:border-yellow-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-ink-900 mb-2">
                        Neighbor sign-offs pending
                      </h4>
                      <p className="text-sm text-ink-600 mb-1">
                        Sarah Johnson
                      </p>
                      <p className="text-sm text-ink-600 mb-2">
                        1427 Oceanview Dr
                      </p>
                      <p className="text-sm text-yellow-600 font-medium">
                        2 neighbors pending
                      </p>
                    </div>
                    <Link href="/dashboard/arc-management/arc-002">
                      <Button variant="primary" size="sm" className="ml-6">
                        Send Reminders
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Info Alert */}
                <div className="p-6 border border-neutral-200 rounded-lg hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-ink-900 mb-2">
                        New request submitted
                      </h4>
                      <p className="text-sm text-ink-600 mb-1">
                        Robert Chen
                      </p>
                      <p className="text-sm text-ink-600 mb-2">
                        1429 Oceanview Dr
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        Today, 2:30 PM
                      </p>
                    </div>
                    <Link href="/dashboard/arc-management/arc-003">
                      <Button variant="primary" size="sm" className="ml-6">
                        Start Review
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages & Inquiries */}
            <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h3 font-semibold text-ink-900 flex items-center gap-2">
                  <MessageSquare className="text-blue-600" size={20} />
                  Recent Messages
                </h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Urgent Message */}
                <div className="p-6 border border-neutral-200 rounded-lg hover:border-orange-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-ink-900 mb-2">
                        Permit requirements clarification needed
                      </h4>
                      <p className="text-sm text-ink-600 mb-1">
                        David Martinez
                      </p>
                      <p className="text-sm text-ink-600 mb-2">
                        1423 Oceanview Dr
                      </p>
                      <p className="text-sm text-orange-600 font-medium">
                        2 hours ago
                      </p>
                    </div>
                    <Button variant="primary" size="sm" className="ml-6">
                      Reply
                    </Button>
                  </div>
                </div>

                {/* Standard Message */}
                <div className="p-6 border border-neutral-200 rounded-lg hover:border-green-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-ink-900 mb-2">
                        Thank you message for approval
                      </h4>
                      <p className="text-sm text-ink-600 mb-1">
                        Sarah Johnson
                      </p>
                      <p className="text-sm text-ink-600 mb-2">
                        1425 Oceanview Dr
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        1 day ago
                      </p>
                    </div>
                    <Button variant="primary" size="sm" className="ml-6">
                      Reply
                    </Button>
                  </div>
                </div>

                {/* Board Inquiry */}
                <div className="p-6 border border-neutral-200 rounded-lg hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-ink-900 mb-2">
                        CC&R amendments input needed
                      </h4>
                      <p className="text-sm text-ink-600 mb-1">
                        Lisa Chen
                      </p>
                      <p className="text-sm text-ink-600 mb-2">
                        Board Member
                      </p>
                      <p className="text-sm text-purple-600 font-medium">
                        3 hours ago
                      </p>
                    </div>
                    <Button variant="primary" size="sm" className="ml-6">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Image Upload Modal */}
          {showImageUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-ink-900 mb-4">Change Community Banner</h3>
                
                {/* Current Image Preview */}
                <div className="mb-4">
                  <p className="text-sm text-ink-600 mb-2">Current banner:</p>
                  <div className="relative h-24 rounded-lg overflow-hidden border border-neutral-200">
                    <img
                      src={communityBannerImage}
                      alt="Current banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">
                      Upload New Image
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-ink-500 mt-1">
                      Recommended: 1200x400px or similar aspect ratio. Max 5MB.
                    </p>
                  </div>

                  {/* Loading State */}
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                      Uploading image...
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => setShowImageUploadModal(false)}
                      disabled={uploadingImage}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={resetToDefaultImage}
                      disabled={uploadingImage}
                    >
                      Reset to Default
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
