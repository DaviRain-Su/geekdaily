'use client';

import { useState } from 'react';
import { shareLinks, openShareWindow } from '@/app/lib/share';

interface ShareToolbarProps {
  className?: string;
}

export default function ShareToolbar({ className = '' }: ShareToolbarProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const currentPageData = {
    title: '极客日报 - 技术文章聚合平台',
    url: typeof window !== 'undefined' ? window.location.href : '',
    description: '每日精选技术文章和资源聚合，获取最新的技术动态和开发资源'
  };

  const handleShare = async (platform: string) => {
    switch (platform) {
      case 'native':
        await shareLinks.native(currentPageData);
        break;
      
      case 'copy':
        const success = await shareLinks.copyLink(currentPageData);
        if (success) {
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
        }
        break;
      
      case 'wechat':
        // For WeChat, we'll show a QR code
        const qrUrl = shareLinks.wechat(currentPageData);
        const qrWindow = window.open('', 'wechat-qr', 'width=300,height=350');
        if (qrWindow) {
          qrWindow.document.write(`
            <html>
              <head><title>微信分享</title></head>
              <body style="text-align:center; padding:20px; font-family:Arial,sans-serif;">
                <h3>扫描二维码分享到微信</h3>
                <img src="${qrUrl}" alt="QR Code" style="border:1px solid #ddd; padding:10px;">
                <p style="font-size:12px; color:#666; margin-top:10px;">
                  用微信扫描二维码分享极客日报
                </p>
              </body>
            </html>
          `);
        }
        break;
      
      default:
        const shareUrl = shareLinks[platform as keyof typeof shareLinks](currentPageData);
        if (typeof shareUrl === 'string') {
          openShareWindow(shareUrl, platform);
        }
    }
  };

  const shareOptions = [
    { 
      id: 'copy', 
      name: '复制链接', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'hover:text-gray-600 hover:bg-gray-100' 
    },
    { 
      id: 'wechat', 
      name: '微信', 
      icon: '💬',
      color: 'hover:text-green-600 hover:bg-green-50' 
    },
    { 
      id: 'weibo', 
      name: '微博', 
      icon: '🔴',
      color: 'hover:text-red-600 hover:bg-red-50' 
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: '🐦',
      color: 'hover:text-blue-400 hover:bg-blue-50' 
    }
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            分享:
          </span>
          <div className="flex gap-1">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleShare(option.id)}
                className={`p-2 rounded-md transition-all duration-200 ${option.color} dark:hover:bg-gray-700 relative`}
                title={`分享到${option.name}`}
                aria-label={`分享到${option.name}`}
              >
                {typeof option.icon === 'string' ? (
                  <span className="text-lg">{option.icon}</span>
                ) : (
                  option.icon
                )}
                
                {copyFeedback && option.id === 'copy' && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    链接已复制
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}