'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
  searchQuery?: string;
}

export default function ExpandableText({ 
  text, 
  maxLines = 2, 
  className = '',
  searchQuery = ''
}: ExpandableTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const textRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
        const maxHeight = lineHeight * maxLines;
        const actualHeight = textRef.current.scrollHeight;
        setIsOverflowing(actualHeight > maxHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text, maxLines]);

  const calculateTooltipPosition = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Default position (below the element)
      let top = rect.bottom + 10;
      let left = rect.left;
      
      // If tooltip would go off bottom of screen, show above
      if (top > viewportHeight - 200) {
        top = rect.top - 10;
      }
      
      // If tooltip would go off right side, adjust left position
      if (left > viewportWidth - 400) {
        left = viewportWidth - 420;
      }
      
      setTooltipPosition({ top, left });
    }
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!isOverflowing) return;
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Calculate position immediately
    calculateTooltipPosition();
    
    // Delay showing tooltip to avoid interference with link clicks
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 text-gray-900 dark:text-gray-100 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p
        ref={textRef}
        className={`${className} ${isOverflowing ? 'cursor-help' : ''}`}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.5'
        }}
        title={isOverflowing ? '悬停查看完整内容' : undefined}
      >
        {highlightText(text, searchQuery)}
      </p>
      
      {isOverflowing && (
        <div className="absolute right-0 bottom-0 bg-gradient-to-l from-white dark:from-gray-800 via-white/80 dark:via-gray-800/80 to-transparent pl-6 pr-1 pointer-events-none">
          <span className="text-xs text-gray-400 opacity-75">
            <span className="text-blue-500 dark:text-blue-400 font-medium">悬停查看全文</span>
          </span>
        </div>
      )}

      {/* Tooltip */}
      {isHovered && isOverflowing && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" />
          
          {/* Tooltip */}
          <div
            className="fixed z-50 max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 animate-in fade-in-0 zoom-in-95 duration-200"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
              {highlightText(text, searchQuery)}
            </div>
            
            {/* Arrow pointing to the original text */}
            <div
              className="absolute w-3 h-3 bg-white dark:bg-gray-900 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"
              style={{
                bottom: tooltipPosition.top > containerRef.current?.getBoundingClientRect().bottom! ? 'auto' : '-6px',
                top: tooltipPosition.top <= containerRef.current?.getBoundingClientRect().top! ? '-6px' : 'auto',
                left: '20px'
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}