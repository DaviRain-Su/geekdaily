'use client';

import { useState, useRef, useEffect } from 'react';
import { ShareData, shareLinks, openShareWindow } from '@/app/lib/share';

interface ShareButtonProps {
  shareData: ShareData;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ShareButton({ shareData, size = 'md', className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsNativeShareSupported('share' in navigator);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2'
  };

  const handleShare = async (platform: string) => {
    setIsOpen(false);

    switch (platform) {
      case 'native':
        await shareLinks.native(shareData);
        break;
      
      case 'copy':
        const success = await shareLinks.copyLink(shareData);
        if (success) {
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
        }
        break;
      
      case 'wechat':
        // For WeChat, we'll show a QR code
        const qrUrl = shareLinks.wechat(shareData);
        const qrWindow = window.open('', 'wechat-qr', 'width=300,height=350');
        if (qrWindow) {
          qrWindow.document.write(`
            <html>
              <head><title>微信分享</title></head>
              <body style="text-align:center; padding:20px; font-family:Arial,sans-serif;">
                <h3>扫描二维码分享到微信</h3>
                <img src="${qrUrl}" alt="QR Code" style="border:1px solid #ddd; padding:10px;">
                <p style="font-size:12px; color:#666; margin-top:10px;">
                  用微信扫描二维码分享这篇文章
                </p>
              </body>
            </html>
          `);
        }
        break;
      
      default:
        const shareUrl = shareLinks[platform as keyof typeof shareLinks](shareData);
        if (typeof shareUrl === 'string') {
          openShareWindow(shareUrl, platform);
        }
    }
  };

  const shareOptions = [
    ...(isNativeShareSupported ? [{ 
      id: 'native', 
      name: '系统分享', 
      icon: '📱',
      color: 'text-gray-600' 
    }] : []),
    { 
      id: 'copy', 
      name: '复制链接', 
      icon: '🔗',
      color: 'text-gray-600' 
    },
    { 
      id: 'wechat', 
      name: '微信', 
      icon: '💬',
      color: 'text-green-600' 
    },
    { 
      id: 'weibo', 
      name: '微博', 
      icon: '🔴',
      color: 'text-red-600' 
    },
    { 
      id: 'qq', 
      name: 'QQ', 
      icon: '🐧',
      color: 'text-blue-600' 
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: '🐦',
      color: 'text-blue-400' 
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: '💼',
      color: 'text-blue-700' 
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: '👥',
      color: 'text-blue-600' 
    },
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`
          ${buttonSizeClasses[size]}
          rounded-full
          transition-all duration-200
          hover:bg-gray-100 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          relative
        `}
        title="分享文章"
        aria-label="分享文章"
      >
        <svg 
          className={`${sizeClasses[size]} text-gray-400 hover:text-blue-500`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" 
          />
        </svg>
        
        {copyFeedback && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            链接已复制
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              分享到
            </div>
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleShare(option.id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <span className="text-lg">{option.icon}</span>
                <span className={`${option.color} dark:text-gray-300`}>
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}