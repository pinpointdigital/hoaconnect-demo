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

export default function Home() {
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
        
        {/* HOA Connect Header with branding */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img
              src="/hoa-connect-logo.png"
              alt="HOA Connect"
              className="h-12 w-auto object-contain"
            />
          </div>
          
          <h2 className="text-3xl font-semibold text-foreground mb-2">
            {hoaInfo.name}
          </h2>
          
          
          <p className="text-lg text-foreground">
            {hoaInfo.address.city}, {hoaInfo.address.state}
          </p>
          
          {hoaInfo.presentedTo && (
            <p className="text-md text-accent font-medium mt-4 bg-white bg-opacity-90 inline-block px-4 py-2 rounded-lg">
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
            onClick={() => setShowBrandingConfig(true)}
            className="bg-white bg-opacity-85 flex items-center gap-2"
          >
            <Palette size={18} />
            Customize Demo
          </Button>
        </div>

        {/* HOA Admin Contact Info */}
        <div className="bg-white bg-opacity-85 rounded-lg p-4 mb-8">
          <p className="text-sm font-medium text-foreground">
            {hoaInfo.admin.name} - {hoaInfo.admin.role}
          </p>
          {hoaInfo.admin.email && (
            <p className="text-xs text-muted-foreground">
              {hoaInfo.admin.email}
              {hoaInfo.admin.phone && ` • ${hoaInfo.admin.phone}`}
            </p>
          )}
        </div>

      </div>

      {/* Branding Configuration Modal */}
      <BrandingConfig 
        isOpen={showBrandingConfig}
        onClose={() => setShowBrandingConfig(false)}
      />
    </div>
  );
}