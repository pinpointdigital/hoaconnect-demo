'use client';

import React, { useState, useEffect } from 'react';
import { useHOAInfo } from '@/lib/branding/context';

interface BrandedFooterProps {
  showTimestamp?: boolean;
  documentId?: string;
  className?: string;
}

export function BrandedFooter({ 
  showTimestamp = true, 
  documentId,
  className = '' 
}: BrandedFooterProps) {
  const hoaInfo = useHOAInfo();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Only set the date on the client side to avoid hydration mismatch
    setCurrentDate(new Date());
  }, []);

  return (
    <footer className={`bg-muted border-t border-border py-4 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          {/* Left side - HOA Info */}
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{hoaInfo.name}</p>
            <p>
              {hoaInfo.address.street}, {hoaInfo.address.city}, {hoaInfo.address.state} {hoaInfo.address.zip}
            </p>
            <p>
              {hoaInfo.admin.name} - {hoaInfo.admin.role}
              {hoaInfo.admin.email && ` • ${hoaInfo.admin.email}`}
              {hoaInfo.admin.phone && ` • ${hoaInfo.admin.phone}`}
            </p>
          </div>

          {/* Right side - Metadata */}
          <div className="text-sm text-muted-foreground text-right">
            {documentId && (
              <p className="font-mono">
                Doc ID: {documentId}
              </p>
            )}
            {showTimestamp && currentDate && (
              <p>
                Generated: {currentDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })} {currentDate.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            )}
            <p className="text-xs">
              Powered by HOA Connect
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PDFFooter({ 
  documentId,
  title 
}: { 
  documentId?: string;
  title?: string;
}) {
  const hoaInfo = useHOAInfo();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Only set the date on the client side to avoid hydration mismatch
    setCurrentDate(new Date());
  }, []);

  return (
    <div className="text-xs text-gray-600 border-t pt-2 mt-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{hoaInfo.name}</p>
          <p>{hoaInfo.address.street}, {hoaInfo.address.city}, {hoaInfo.address.state} {hoaInfo.address.zip}</p>
          <p>{hoaInfo.admin.name} - {hoaInfo.admin.role}</p>
        </div>
        <div className="text-right">
          {title && <p className="font-semibold">{title}</p>}
          {documentId && <p>ID: {documentId}</p>}
          {currentDate && (
            <p>{currentDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })} {currentDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit'
            })}</p>
          )}
        </div>
      </div>
    </div>
  );
}
