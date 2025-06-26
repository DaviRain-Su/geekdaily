'use client';

import { useState } from 'react';
import { GeekDailyItem } from '@/app/types/geekdaily';
import { shareLinks, openShareWindow } from '@/app/lib/share';

interface BatchShareButtonProps {
  items: GeekDailyItem[];
  className?: string;
}

export default function BatchShareButton({ items, className = '' }: BatchShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  if (items.length === 0) return null;

  const createBatchShareData = (platform: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    switch (platform) {
      case 'text':
        // Create a text summary of all articles
        return items.map((item, index) => 
          `${index + 1}. ${item.attributes.title} - ${item.attributes.url}`
        ).join('\n\n');
      
      case 'markdown':
        // Create a markdown list
        return `# 我收藏的极客日报文章\n\n${items.map((item, index) => 
          `${index + 1}. [${item.attributes.title}](${item.attributes.url}) - by ${item.attributes.author}`
        ).join('\n')}`;
      
      case 'summary':
        // Create a summary for social media
        const count = items.length;
        const titles = items.slice(0, 3).map(item => item.attributes.title).join('、');
        return `我在极客日报收藏了${count}篇优质技术文章，包括：${titles}${count > 3 ? '等' : ''}。快来看看吧！${baseUrl}`;
      
      default:
        return '';
    }
  };

  const handleBatchShare = async (type: string) => {
    setIsOpen(false);

    switch (type) {
      case 'copy-list':
        try {
          const text = createBatchShareData('text');
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
          } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
          }
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;

      case 'copy-markdown':
        try {
          const markdown = createBatchShareData('markdown');
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(markdown);
          } else {
            const textArea = document.createElement('textarea');
            textArea.value = markdown;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
          }
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;

      case 'weibo':
        const weiboText = createBatchShareData('summary');
        const weiboUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(weiboText)}`;
        openShareWindow(weiboUrl, 'weibo');
        break;

      case 'twitter':
        const twitterText = createBatchShareData('summary');
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
        openShareWindow(twitterUrl, 'twitter');
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        批量分享 ({items.length}篇)
        {copyFeedback && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            已复制到剪贴板
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              批量分享选项
            </div>
            
            <button
              onClick={() => handleBatchShare('copy-list')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <span className="text-lg">📝</span>
              <span>复制文章列表</span>
            </button>
            
            <button
              onClick={() => handleBatchShare('copy-markdown')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <span className="text-lg">📄</span>
              <span>复制 Markdown 格式</span>
            </button>
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            
            <button
              onClick={() => handleBatchShare('weibo')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <span className="text-lg">🔴</span>
              <span>分享到微博</span>
            </button>
            
            <button
              onClick={() => handleBatchShare('twitter')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <span className="text-lg">🐦</span>
              <span>分享到 Twitter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}