import { useState, useEffect, useRef, useCallback } from 'react';
import { getAnnouncements } from '../api/announcements';
import type { Announcement } from '../types/announcement';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTextRef = useRef(searchText);
  const categoriesRef = useRef(selectedCategories);

  useEffect(() => {
    searchTextRef.current = searchText;
  }, [searchText]);

  useEffect(() => {
    categoriesRef.current = selectedCategories;
  }, [selectedCategories]);

  const loadAnnouncements = useCallback(async (search: string, categories: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnnouncements({
        categories: categories.length > 0 ? categories : undefined,
        searchText: search.trim() || undefined,
      });
      setAnnouncements(data.items);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch announcements';
      setError(message);
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements('', []);
  }, [loadAnnouncements]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      loadAnnouncements(searchTextRef.current, categoriesRef.current);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchText, selectedCategories, loadAnnouncements]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleSearchBlur = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    loadAnnouncements(searchTextRef.current, categoriesRef.current);
  }, [loadAnnouncements]);

  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchText('');
    setSelectedCategories([]);
  }, []);

  return {
    announcements,
    loading,
    error,
    searchText,
    handleSearchChange,
    handleSearchBlur,
    selectedCategories,
    handleCategoryToggle,
    handleClearFilters,
  };
}
