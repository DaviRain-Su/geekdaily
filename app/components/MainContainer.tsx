'use client';

import { useState } from 'react';
import { useBookmarks } from '@/app/hooks/useBookmarks';
import { usePerformance } from '@/app/hooks/usePerformance';
import GeekDailyList from './GeekDailyList';
import BookmarksList from './BookmarksList';
import ShareToolbar from './ShareToolbar';
import PerformancePanel from './PerformancePanel';

export default function MainContainer() {
  const [currentView, setCurrentView] = useState<'articles' | 'bookmarks'>('articles');
  const { bookmarkCount } = useBookmarks();
  const { trackEvent } = usePerformance();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                极客日报
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                每日精选技术文章和资源聚合
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <nav className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentView('articles');
                    trackEvent('view_change', { view: 'articles' });
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'articles'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span className="hidden sm:inline">文章列表</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('bookmarks');
                    trackEvent('view_change', { view: 'bookmarks', bookmarkCount });
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                    currentView === 'bookmarks'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="hidden sm:inline">我的收藏</span>
                    {bookmarkCount > 0 && (
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                        currentView === 'bookmarks' 
                          ? 'bg-white text-blue-600' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {bookmarkCount}
                      </span>
                    )}
                  </span>
                </button>
              </nav>
              
              <div className="text-right hidden lg:block">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  数据来源: GeekDaily API
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'articles' ? <GeekDailyList /> : <BookmarksList />}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © 2024 极客日报聚合 · 使用 Next.js 构建
          </p>
        </div>
      </footer>

      <ShareToolbar />
      <PerformancePanel />
    </div>
  );
}