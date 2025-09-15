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

export default function Home() {
  const hoaInfo = useHOAInfo();
  const assets = useBrandingAssets();
  const { userProfile, hasPermission } = useAuth();
  const [showBrandingConfig, setShowBrandingConfig] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      
      // Force reload
      video.load();
      
      // Aggressive play strategy
      const forcePlay = async () => {
        try {
          // Ensure it's muted and ready
          video.muted = true;
          video.volume = 0;
          
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            console.log('✅ Video autoplay SUCCESS!');
            video.style.opacity = '1';
          }
        } catch (error) {
          console.log('❌ Autoplay blocked:', error.name, error.message);
          
          // Try different approaches
          if (error.name === 'NotAllowedError') {
            console.log('🔄 Trying intersection observer approach...');
            
            // Use Intersection Observer to play when visible
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                  try {
                    await video.play();
                    console.log('✅ Video played via intersection observer');
                    observer.disconnect();
                  } catch (e) {
                    console.log('❌ Intersection observer play failed');
                  }
                }
              });
            });
            observer.observe(video);
          }
        }
      };
      
      // Try multiple times with different delays
      const attempts = [0, 100, 500, 1000, 2000];
      attempts.forEach(delay => {
        setTimeout(forcePlay, delay);
      });
      
      // Try when video metadata loads
      video.addEventListener('loadedmetadata', forcePlay);
      video.addEventListener('canplay', forcePlay);
      
      // User interaction fallback
      const playOnInteraction = async () => {
        try {
          await video.play();
          console.log('✅ Video started after user interaction');
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        } catch (e) {
          console.log('❌ User interaction play failed');
        }
      };
      
      document.addEventListener('click', playOnInteraction);
      document.addEventListener('touchstart', playOnInteraction);
      
      return () => {
        clearTimeout(preloaderTimer);
        clearInterval(progressInterval);
        video.removeEventListener('loadedmetadata', forcePlay);
        video.removeEventListener('canplay', forcePlay);
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
      };
    } else {
      return () => {
        clearTimeout(preloaderTimer);
        clearInterval(progressInterval);
      };
    }
  }, []);

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
        }}
        onError={(e) => {
          console.log('❌ Video error:', e.currentTarget.error);
          e.currentTarget.style.display = 'none';
        }}
      >
        <source src="/HOAConnect_Demo_720.webm" type="video/webm; codecs=vp9" />
        <source src="/HOAConnect_Demo_BG-Video.mp4" type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
      </video>
      
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 w-full h-full bg-black opacity-40"
        style={{ zIndex: 0 }}
      />
      
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