'use client';

import { useState } from 'react';
import { useHOAInfo, useBrandingAssets } from '@/lib/branding/context';
import { useAuth } from '@/lib/auth/context';
import { BrandingConfig } from '@/components/branding/BrandingConfig';
import { KenBurnsSlideshow } from '@/components/branding/KenBurnsSlideshow';
import { RoleSwitcher } from '@/components/auth/RoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Home as HomeIcon, Play, FileText, Palette } from 'lucide-react';
import Link from 'next/link';

export default function OriginalHome() {
  const hoaInfo = useHOAInfo();
  const assets = useBrandingAssets();
  const { userProfile, hasPermission } = useAuth();
  const [showBrandingConfig, setShowBrandingConfig] = useState(false);

  // Get community image URLs for slideshow
  const communityImageUrls = assets.communityImages?.map(img => img.url) || [];
  console.log('Community images for slideshow:', communityImageUrls.length, 'images');

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      {/* Ken Burns Slideshow Background */}
      {communityImageUrls.length > 0 ? (
        <KenBurnsSlideshow images={communityImageUrls} duration={6} />
      ) : (
        <div className="absolute inset-0 bg-white" />
      )}
      
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Content Container with Subtle White Background */}
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white border-opacity-30">
        
        {/* HOA Connect Header with branding */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img
              src="/hoa-connect-logo.png"
              alt="HOA Connect"
              className="h-12 w-auto object-contain"
            />
          </div>
          
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            {hoaInfo.name}
          </h2>
          
          
          <p className="text-lg text-gray-700">
            {hoaInfo.address.city}, {hoaInfo.address.state}
          </p>
          
          {hoaInfo.presentedTo && (
            <p className="text-md text-green-700 font-medium mt-4 bg-green-50 inline-block px-4 py-2 rounded-lg border border-green-200">
              {hoaInfo.presentedTo}
            </p>
          )}
        </div>


        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link href="/dashboard">
            <Button size="lg" className="flex items-center gap-2">
              <Play size={18} />
              Get Started
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => {
              console.log('Customize Demo button clicked');
              setShowBrandingConfig(true);
            }}
            className="bg-white bg-opacity-85 flex items-center gap-2"
          >
            <Palette size={18} />
            Customize Demo
          </Button>
        </div>

          {/* HOA Admin Contact Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {hoaInfo.admin.name} - {hoaInfo.admin.role}
            </p>
            {hoaInfo.admin.email && (
              <p className="text-xs text-gray-600">
                {hoaInfo.admin.email}
                {hoaInfo.admin.phone && ` • ${hoaInfo.admin.phone}`}
              </p>
            )}
          </div>

        </div> {/* Close white background container */}
      </div>

      {/* Branding Configuration Modal */}
      <BrandingConfig 
        isOpen={showBrandingConfig}
        onClose={() => setShowBrandingConfig(false)}
      />
    </div>
  );
}




