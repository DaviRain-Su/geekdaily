'use client';

import { useState, useEffect, useMemo } from 'react';
import { GeekDailyResponse, GeekDailyItem } from '@/app/types/geekdaily';
import { fetchGeekDailies } from '@/app/lib/api';
import GeekDailyItemComponent from './GeekDailyItem';
import Pagination from './Pagination';
import SearchBar from './SearchBar';

export default function GeekDailyList() {
  const [data, setData] = useState<GeekDailyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetchGeekDailies({ page: currentPage, pageSize, sort: sortOrder });
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据时出错');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, pageSize, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'desc' ? 'asc' : 'desc');
    setCurrentPage(1); // Reset to first page when changing sort
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter items based on search query (only for client-side filtering when searching)
  const filteredItems = useMemo(() => {
    if (!data?.data) return [];
    
    if (!searchQuery.trim()) {
      // No search query - use server-side pagination
      return data.data;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return data.data.filter(item => {
      const { title, author, introduce, episode } = item.attributes;
      return (
        title.toLowerCase().includes(query) ||
        author.toLowerCase().includes(query) ||
        introduce.toLowerCase().includes(query) ||
        episode.toLowerCase().includes(query)
      );
    });
  }, [data?.data, searchQuery]);

  // Determine display items and pagination logic
  const { displayItems, totalPages } = useMemo(() => {
    if (!searchQuery.trim()) {
      // No search - use server-side pagination
      return {
        displayItems: data?.data || [],
        totalPages: data?.meta.pagination.pageCount || 0
      };
    } else {
      // Search active - use client-side pagination on filtered results
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return {
        displayItems: filteredItems.slice(startIndex, endIndex),
        totalPages: Math.ceil(filteredItems.length / pageSize)
      };
    }
  }, [data, filteredItems, currentPage, pageSize, searchQuery]);

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

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">暂无数据</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Stats and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-gray-600 dark:text-gray-400">
          {searchQuery ? (
            <p>
              找到 <span className="font-semibold text-gray-900 dark:text-white">{filteredItems.length}</span> 条匹配结果
              {filteredItems.length > 0 && data && (
                <span className="ml-2 text-sm">
                  （共 {data.meta.pagination.total} 条）
                </span>
              )}
            </p>
          ) : (
            <p>
              共 <span className="font-semibold text-gray-900 dark:text-white">{data?.meta.pagination.total}</span> 条极客日报
            </p>
          )}
        </div>
        
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          {sortOrder === 'desc' ? '最新文章' : '最早文章'}
        </button>
      </div>
      
      {/* Results */}
      {displayItems.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.824-2.471M15 11V9a6 6 0 10-12 0v2m6 0a6 6 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            没有找到匹配的文章
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            尝试使用不同的关键词搜索
          </p>
          <button
            onClick={() => handleSearch('')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            清除搜索
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {displayItems.map((item) => (
              <GeekDailyItemComponent key={item.id} item={item} searchQuery={searchQuery} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}