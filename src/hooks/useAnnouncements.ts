import { useState, useEffect } from 'react';
import { getAnnouncements } from '../api/announcements';
import type { Announcement } from '../types/announcement';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnnouncements({
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          searchText: searchText.trim() || undefined,
        });
        setAnnouncements(data.items);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch announcements';
        setError(message);
        console.error('Failed to fetch announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchAnnouncements();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText, selectedCategories]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedCategories([]);
  };

  return {
    announcements,
    loading,
    error,
    searchText,
    setSearchText,
    selectedCategories,
    handleCategoryToggle,
    handleClearFilters,
  };
}
