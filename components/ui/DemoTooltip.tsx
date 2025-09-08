import React, { useState, useRef } from 'react';
import { Info } from 'lucide-react';

interface DemoTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showIndicator?: boolean;
  className?: string;
}

export function DemoTooltip({ 
  content, 
  children, 
  position = 'top', 
  showIndicator = true,
  className = '' 
}: DemoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const hideTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-3'
  };

  return (
    <div 
      className={`relative inline-flex items-center gap-2 ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      {showIndicator && (
        <div className="inline-flex items-center justify-center w-4 h-4 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
          <Info size={10} />
        </div>
      )}
      
      {isVisible && (
        <div 
          className={`absolute z-50 px-3 py-2 text-caption text-white bg-purple-600 rounded-ctl shadow-lg max-w-xs whitespace-normal transition-all duration-200 ease-out border border-purple-500 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${positionClasses[position]}`}
        >
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
            </div>
            <div>{content}</div>
          </div>
          
          {/* Arrow */}
          <div 
            className={`absolute w-2 h-2 bg-purple-600 border-purple-500 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-r border-b' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-l border-t' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2 border-r border-t' :
              'right-full top-1/2 -translate-y-1/2 translate-x-1/2 border-l border-b'
            }`}
          />
        </div>
      )}
    </div>
  );
}

