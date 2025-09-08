'use client';

import { useState, useEffect } from 'react';

interface KenBurnsSlideshowProps {
  images: string[];
  duration?: number; // Duration in seconds for each image
  className?: string;
}

export function KenBurnsSlideshow({ 
  images, 
  duration = 6, 
  className = '' 
}: KenBurnsSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [images.length, duration]);

  if (images.length === 0) return null;

  return (
    <div className={`absolute inset-0 ${className}`}>
      {images.map((imageUrl, index) => (
        <div
          key={`${imageUrl}-${index}`}
          className={`fixed inset-0 transition-opacity duration-2000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            backgroundColor: '#ffffff'
          }}
        />
      ))}
      
      {/* White overlay */}
      <div 
        className="fixed inset-0 bg-white" 
        style={{ opacity: 0.65 }}
      />
      
    </div>
  );
}
