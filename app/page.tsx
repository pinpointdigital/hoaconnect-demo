'use client';

import { useState, useEffect, useRef } from 'react';
import { useHOAInfo, useBrandingAssets } from '@/lib/branding/context';
import { useAuth } from '@/lib/auth/context';
import { BrandingConfig } from '@/components/branding/BrandingConfig';
import { KenBurnsSlideshow } from '@/components/branding/KenBurnsSlideshow';
import { RoleSwitcher } from '@/components/auth/RoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Home as HomeIcon, Play, FileText, Palette, User, Building, UserPlus, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// 🚧 MAINTENANCE MODE TOGGLE - Set to true to enable maintenance mode for live site
const FORCE_MAINTENANCE_MODE = true;

export default function Home() {
  const hoaInfo = useHOAInfo();
  const assets = useBrandingAssets();
  const { userProfile, hasPermission } = useAuth();
  const [showBrandingConfig, setShowBrandingConfig] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showVideoPrompt, setShowVideoPrompt] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  // Check for existing authentication on load
  useEffect(() => {
    // Check if we're in maintenance mode - multiple ways to detect
    const isProduction = window.location.hostname === 'demo.hoaconnect.ai' || 
                         window.location.hostname.includes('railway.app') ||
                         window.location.hostname.includes('vercel.app');
    
    // Also check for environment variable
    const maintenanceEnv = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
    
    // Force maintenance mode if flag is set AND not on localhost
    const isMaintenanceMode = FORCE_MAINTENANCE_MODE && window.location.hostname !== 'localhost';
    
    // If in maintenance mode, force no authentication
    if (isMaintenanceMode) {
      console.log('🚧 Maintenance mode active for:', window.location.hostname);
      setIsAuthenticated(false);
      return;
    }
    
    // For localhost development, check normal authentication
    const authStatus = localStorage.getItem('hoa-connect-demo-auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
    
    // Detect Safari
    const safariDetected = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(safariDetected);
    
    // For Safari, show video prompt immediately
    if (safariDetected) {
      setShowVideoPrompt(true);
    }
  }, []);

  // Password validation
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = 'hoaconnect2025'; // You can change this password
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('hoa-connect-demo-auth', 'authenticated');
      setShowPasswordError(false);
    } else {
      setShowPasswordError(true);
      setPassword('');
    }
  };

  useEffect(() => {
    // Progress counter animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15 + 5; // Random increments for realistic feel
      });
    }, 150);

    // Hide preloader after 3 seconds - simplified timing
    const preloaderTimer = setTimeout(() => {
      setLoadingProgress(100);
      setShowPreloader(false);
    }, 3000);

    const video = videoRef.current;
    if (video) {
      // Set video properties before loading
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.defaultMuted = true;
      
      // Safari-specific fixes
      video.setAttribute('muted', 'true');
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.volume = 0;
      
      // Force reload
      video.load();
      
      // Simple autoplay attempt - only for non-Safari browsers
      const tryAutoplay = async () => {
        if (isSafari) {
          console.log('🍎 Safari detected - skipping autoplay, showing manual button');
          return;
        }
        
        try {
          video.muted = true;
          video.volume = 0;
          video.defaultMuted = true;
          video.setAttribute('muted', 'true');
          video.setAttribute('playsinline', 'true');
          
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            console.log('✅ Video autoplay SUCCESS!');
            video.style.opacity = '1';
            setVideoPlaying(true);
          }
        } catch (error) {
          console.log('❌ Autoplay blocked:', error.name, error.message);
          setShowVideoPrompt(true);
        }
      };
      
      // Try autoplay only for non-Safari browsers
      setTimeout(tryAutoplay, 100);
      
      return () => {
        clearTimeout(preloaderTimer);
        clearInterval(progressInterval);
      };
    } else {
      return () => {
        clearTimeout(preloaderTimer);
        clearInterval(progressInterval);
      };
    }
  }, []);

  // Show password protection screen if not authenticated
  if (!isAuthenticated) {
    // Check if we're in maintenance mode
    const isMaintenanceMode = typeof window !== 'undefined' && 
                             FORCE_MAINTENANCE_MODE && 
                             window.location.hostname !== 'localhost';
    
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                src="/hoa-connect-logo.png"
                alt="HOA Connect"
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback to home icon if logo fails
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `<svg class="text-blue-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg>`;
                  }
                }}
              />
            </div>
            <h1 className="text-h2 font-bold text-ink-900 mb-2">HOA Connect Demo</h1>
            {isMaintenanceMode ? (
              <div>
                <p className="text-body text-amber-600 font-semibold mb-2">🚧 Maintenance Mode</p>
                <p className="text-body text-ink-600">We're currently updating the demo platform with new features and improvements.</p>
              </div>
            ) : (
              <p className="text-body text-ink-600">This demo is currently in development</p>
            )}
          </div>

          {isMaintenanceMode ? (
            // Maintenance mode - no password input
            <div className="text-center">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800 mb-2">
                  <strong>Scheduled Maintenance</strong>
                </p>
                <p className="text-sm text-amber-700">
                  Our team is working hard to bring you an enhanced experience. Please check back soon!
                </p>
              </div>
              
            </div>
          ) : (
            // Development mode - show password form
            <>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">
                    Access Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setShowPasswordError(false);
                    }}
                    placeholder="Enter password to access demo"
                    className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                      showPasswordError 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                        : 'border-ink-200 focus:ring-blue-500'
                    }`}
                    autoFocus
                  />
                  {showPasswordError && (
                    <p className="text-xs text-red-600 mt-1">Incorrect password. Please try again.</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!password.trim()}
                >
                  Access Demo
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-ink-200 text-center">
                <p className="text-xs text-ink-500">
                  Demo access restricted during development phase
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes logoFadeIn {
          0% { 
            opacity: 0;
          }
          100% { 
            opacity: 1;
          }
        }
        
        .logo-visible {
          opacity: 1 !important;
        }
        
        @keyframes logoFloat {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-6px);
          }
        }
        
        @keyframes progressBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
      `}</style>

      {/* Preloader */}
      {showPreloader && (
        <div 
          className="fixed inset-0 w-full h-full flex items-center justify-center"
          style={{ 
            zIndex: 100,
            backgroundColor: '#1a1a1a'
          }}
        >
          <div className="text-center">
            {/* Logo - Full HOA Connect Logo */}
            <div className="mb-12">
              <img
                src="/hoa-connect-logo-full.png"
                alt="HOA Connect"
                className="mx-auto block"
                style={{ 
                  width: '160px',
                  height: 'auto',
                  opacity: 1,
                  display: 'block',
                  visibility: 'visible',
                  animation: 'logoFloat 3s ease-in-out infinite'
                }}
                onLoad={(e) => {
                  console.log('✅ Full HOA Connect logo loaded');
                  // Force visibility in Chrome
                  const img = e.currentTarget;
                  img.style.opacity = '1';
                  img.style.visibility = 'visible';
                  img.style.display = 'block';
                }}
                onError={(e) => {
                  console.log('❌ Full logo failed, using fallback');
                  // Fallback to text logo
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex items-center justify-center gap-2 text-white">
                        <div class="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
                          <span class="text-white font-bold text-xs">H</span>
                        </div>
                        <div class="text-xl font-bold">
                          <span class="text-blue-400">HOA</span>
                          <span class="text-white ml-1">Connect</span>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            
            {/* Progress Bar Animation */}
            <div className="mb-8">
              <div className="w-64 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                >
                  {/* Shimmer Effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    style={{ animation: 'shimmer 2s ease-in-out infinite' }}
                  />
                </div>
              </div>
            </div>
            
            {/* Loading Text and Percentage */}
            <div className="space-y-2">
              <p className="text-white text-base font-medium">
                Loading HOA Connect demo...
              </p>
              <p className="text-blue-300 text-sm font-mono">
                {Math.round(loadingProgress)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Background Image */}
      <img 
        src="/HOAConnect_Demo_BG.jpg"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: -2 }}
      />
      
      {/* Video Background (over image) */}
      <video
        ref={videoRef}
        autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
        controls={false}
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: -1, opacity: 0, transition: 'opacity 0.5s ease-in-out' }}
        onLoadedData={() => console.log('📹 Video data loaded')}
        onCanPlay={() => console.log('▶️ Video can play')}
        onPlay={() => {
          console.log('🎬 Video is playing!');
          setVideoPlaying(true);
          setShowVideoPrompt(false);
          // Make video visible when it starts playing
          if (videoRef.current) {
            videoRef.current.style.opacity = '1';
          }
        }}
        onError={(e) => {
          console.log('❌ Video error:', e.currentTarget.error);
          console.log('❌ Video source:', e.currentTarget.currentSrc);
          e.currentTarget.style.display = 'none';
        }}
        onLoadStart={() => {
          console.log('🎬 Video load started');
        }}
        onCanPlay={() => {
          console.log('🎬 Video can play');
        }}
        onLoadedData={() => {
          console.log('🎬 Video data loaded');
        }}
      >
        <source src="/HOAConnect_Demo_720.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 w-full h-full bg-black opacity-40"
        style={{ zIndex: 0 }}
      />

      {/* Video Play Prompt */}
      {showVideoPrompt && !videoPlaying && (
        <>
          {/* Safari - Center Prompt */}
          {isSafari && (
            <div 
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
              style={{ zIndex: 15 }}
            >
              <div 
                className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    try {
                      const video = videoRef.current;
                      
                      console.log('🍎 Safari play attempt - video source:', video.currentSrc);
                      console.log('🍎 Safari play attempt - ready state:', video.readyState);
                      console.log('🍎 Safari play attempt - can play WebM:', video.canPlayType('video/webm'));
                      
                      video.muted = true;
                      video.volume = 0;
                      video.setAttribute('muted', 'true');
                      video.setAttribute('playsinline', 'true');
                      video.setAttribute('webkit-playsinline', 'true');
                      
                      await video.play();
                      setVideoPlaying(true);
                      setShowVideoPrompt(false);
                      video.style.opacity = '1';
                      console.log('✅ Safari video started manually');
                    } catch (e) {
                      console.log('❌ Safari manual play failed:', e);
                      console.log('❌ Error details:', e.name, e.message);
                    }
                  }
                }}
              >
                {/* HOA Connect Logo */}
                <div className="mb-4">
                  <img
                    src="/hoa-connect-logo.png"
                    alt="HOA Connect"
                    className="h-8 w-auto mx-auto"
                    onError={(e) => {
                      // Fallback to text logo if image fails
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex items-center justify-center gap-2 mb-4">
                            <div class="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                              <span class="text-blue-600 font-bold text-xs">H</span>
                            </div>
                            <div class="text-lg font-bold">
                              <span class="text-blue-600">HOA</span>
                              <span class="text-gray-900 ml-1">Connect</span>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome</h3>
                <p className="text-sm text-gray-600 mb-6">Ready to experience the HOA Connect platform?</p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          )}
          
          {/* Non-Safari - Corner Prompt */}
          {!isSafari && (
            <div 
              className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white px-6 py-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-opacity-95 transition-all shadow-lg border border-white border-opacity-20"
              style={{ zIndex: 10 }}
              onClick={async () => {
                if (videoRef.current) {
                  try {
                    const video = videoRef.current;
                    video.muted = true;
                    video.volume = 0;
                    video.defaultMuted = true;
                    video.setAttribute('muted', 'true');
                    video.setAttribute('playsinline', 'true');
                    
                    await video.play();
                    setVideoPlaying(true);
                    setShowVideoPrompt(false);
                    video.style.opacity = '1';
                  } catch (e) {
                    console.log('Manual play failed:', e);
                  }
                }
              }}
            >
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Play size={16} fill="white" />
              </div>
              <span className="text-sm font-medium">Click to play background video</span>
            </div>
          )}
        </>
      )}
      
      <div className="min-h-screen relative" style={{ zIndex: 1 }}>
        {/* Content */}
        <div className="relative min-h-screen flex items-center justify-center px-4 py-16" style={{ zIndex: 3 }}>
          <div className="text-center">
            {/* Main Content Card */}
            <div 
              className="rounded-2xl p-8 md:p-12 max-w-lg mx-auto"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* HOA Connect Logo */}
              <div className="mb-6">
                <img
                  src="/hoa-connect-logo.png"
                  alt="HOA Connect"
                  className="h-8 w-auto mx-auto"
                />
              </div>
              
              {/* HOA Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {hoaInfo.name}
              </h1>
              <p className="text-gray-600 mb-8">
                {hoaInfo.address.city}, {hoaInfo.address.state}
              </p>

              {/* New Resident Registration - Prominent */}
              <div className="mb-8">
                <Link href="/dashboard/new-residents">
                  <Button size="lg" className="w-full flex items-center justify-center gap-2 py-4 text-lg font-semibold">
                    <UserPlus size={20} />
                    New Resident Registration
                  </Button>
                </Link>
              </div>

              {/* Other Portals */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Link href="/dashboard?role=homeowner">
                  <Button 
                    variant="secondary" 
                    className="w-full flex items-center justify-center gap-2 py-3 font-medium"
                  >
                    <User size={16} />
                    Homeowner Portal
                  </Button>
                </Link>
                
                <Link href="/dashboard?role=captain">
                  <Button 
                    variant="secondary" 
                    className="w-full flex items-center justify-center gap-2 py-3 font-medium"
                  >
                    <Building size={16} />
                    HOA Login
                  </Button>
                </Link>
              </div>

              {/* HOA President Contact */}
              <div className="text-center text-gray-700">
                <p className="font-semibold text-lg">{hoaInfo.admin.name}, HOA President</p>
                {hoaInfo.admin.email && (
                  <p className="text-sm">{hoaInfo.admin.email}</p>
                )}
                {hoaInfo.admin.phone && (
                  <p className="text-sm">{hoaInfo.admin.phone}</p>
                )}
              </div>
            </div>

            {/* Customize Demo Link */}
            <div className="mt-8 pt-8 pb-12">
              <button
                onClick={() => setShowBrandingConfig(true)}
                className="text-white text-xs hover:text-blue-300 underline uppercase tracking-wider opacity-80"
              >
                Customize Demo
              </button>
            </div>
          </div>
        </div>
    </div>

      {/* Branding Configuration Modal */}
      <BrandingConfig 
        isOpen={showBrandingConfig}
        onClose={() => setShowBrandingConfig(false)}
      />
    </>
  );
}