'use client';

import React from 'react';
import { useHOAInfo, useBrandingAssets } from '@/lib/branding/context';

interface BrandedHeaderProps {
  showHOAConnect?: boolean;
  className?: string;
}

export function BrandedHeader({ showHOAConnect = true, className = '' }: BrandedHeaderProps) {
  const hoaInfo = useHOAInfo();
  const assets = useBrandingAssets();

  return (
    <header className={`bg-white border-b border-border w-full ${className}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - HOA Connect + HOA Logo */}
          <div className="flex items-center space-x-4">
            {showHOAConnect && (
              <div className="flex items-center">
                <img
                  src="/hoa-connect-logo.png"
                  alt="HOA Connect"
                  className="h-8 w-auto object-contain"
                />
                <div className="w-px h-6 bg-border mx-4" />
              </div>
            )}
            
            {assets.logo?.url && (
              <div className="flex items-center">
                <img
                  src={assets.logo.url}
                  alt={`${hoaInfo.name} Logo`}
                  className="h-8 w-auto object-contain"
                />
              </div>
            )}
            
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {hoaInfo.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {hoaInfo.address.city}, {hoaInfo.address.state}
              </p>
            </div>
          </div>

          {/* Right side - Admin Info */}
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {hoaInfo.admin.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {hoaInfo.admin.role}
            </p>
            {hoaInfo.admin.email && (
              <p className="text-xs text-muted-foreground">
                {hoaInfo.admin.email}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function CompactBrandedHeader({ className = '' }: { className?: string }) {
  const hoaInfo = useHOAInfo();
  const assets = useBrandingAssets();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {assets.logo?.url && (
        <img
          src={assets.logo.url}
          alt={`${hoaInfo.name} Logo`}
          className="h-6 w-auto object-contain"
        />
      )}
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          {hoaInfo.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {hoaInfo.address.city}, {hoaInfo.address.state}
        </p>
      </div>
    </div>
  );
}
