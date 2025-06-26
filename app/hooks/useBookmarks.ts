import { useState, useEffect } from 'react';
import { GeekDailyItem } from '@/app/types/geekdaily';

const BOOKMARKS_KEY = 'geekdaily_bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(BOOKMARKS_KEY);
        if (saved) {
          setBookmarks(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  const saveBookmarks = (newBookmarks: number[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
        setBookmarks(newBookmarks);
      } catch (error) {
        console.error('Error saving bookmarks:', error);
      }
    }
  };

  // Add bookmark
  const addBookmark = (id: number) => {
    const newBookmarks = [...bookmarks, id];
    saveBookmarks(newBookmarks);
  };

  // Remove bookmark
  const removeBookmark = (id: number) => {
    const newBookmarks = bookmarks.filter(bookmarkId => bookmarkId !== id);
    saveBookmarks(newBookmarks);
  };

  // Toggle bookmark
  const toggleBookmark = (id: number) => {
    if (isBookmarked(id)) {
      removeBookmark(id);
    } else {
      addBookmark(id);
    }
  };

  // Check if article is bookmarked
  const isBookmarked = (id: number) => {
    return bookmarks.includes(id);
  };

  // Get bookmark count
  const bookmarkCount = bookmarks.length;

  // Clear all bookmarks
  const clearBookmarks = () => {
    saveBookmarks([]);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    bookmarkCount,
    clearBookmarks
  };
}