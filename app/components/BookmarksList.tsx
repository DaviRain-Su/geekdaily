'use client';

import { useState, useEffect } from 'react';
import { GeekDailyItem } from '@/app/types/geekdaily';
import { useBookmarks } from '@/app/hooks/useBookmarks';
import GeekDailyItemComponent from './GeekDailyItem';
import BatchShareButton from './BatchShareButton';
import { fetchGeekDailies } from '@/app/lib/api';

export default function BookmarksList() {
  const { bookmarks, bookmarkCount, clearBookmarks } = useBookmarks();
  const [bookmarkedItems, setBookmarkedItems] = useState<GeekDailyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookmarkedItems = async () => {
      if (bookmarks.length === 0) {
        setBookmarkedItems([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Since we don't have a direct API to fetch specific IDs,
        // we'll need to fetch pages and filter
        // This is a simple implementation - in a real app you'd want server-side filtering
        const items: GeekDailyItem[] = [];
        
        // Fetch multiple pages in parallel to find bookmarked items
        const pagePromises = [];
        for (let page = 1; page <= 5; page++) {
          pagePromises.push(
            fetchGeekDailies({ page, pageSize: 100 }).catch(err => {
              console.warn(`Failed to fetch page ${page}:`, err);
              return null;
            })
          );
        }
        
        const responses = await Promise.all(pagePromises);
        
        for (const response of responses) {
          if (response) {
            const foundItems = response.data.filter(item => bookmarks.includes(item.id));
            items.push(...foundItems);
          }
        }

        // Sort by bookmark order (most recently bookmarked first)
        const sortedItems = items.sort((a, b) => {
          const aIndex = bookmarks.indexOf(a.id);
          const bIndex = bookmarks.indexOf(b.id);
          return bIndex - aIndex;
        });

        setBookmarkedItems(sortedItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载收藏文章时出错');
      } finally {
        setLoading(false);
      }
    };

    loadBookmarkedItems();
  }, [bookmarks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (bookmarkCount === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          还没有收藏任何文章
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          浏览文章时点击星星图标来收藏感兴趣的内容
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              我的收藏
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              共收藏了 <span className="font-semibold">{bookmarkCount}</span> 篇文章
            </p>
          </div>
          
          {bookmarkCount > 0 && (
            <button
              onClick={() => {
                if (confirm('确定要清空所有收藏吗？此操作不可撤销。')) {
                  clearBookmarks();
                }
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20 transition-colors"
            >
              清空收藏
            </button>
          )}
        </div>

        {/* Batch Share Button */}
        {bookmarkedItems.length > 0 && (
          <div className="flex justify-center mb-4">
            <BatchShareButton items={bookmarkedItems} />
          </div>
        )}
      </div>

      {bookmarkedItems.length < bookmarks.length && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            部分收藏的文章可能需要更多时间加载，当前显示 {bookmarkedItems.length} / {bookmarks.length} 篇
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {bookmarkedItems.map((item) => (
          <GeekDailyItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}