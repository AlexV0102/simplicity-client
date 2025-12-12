import { useState, useEffect } from 'react';
import { getAnnouncementById } from '../api/announcements';
import type { Announcement } from '../types/announcement';

export function useAnnouncement(id: string | undefined) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) {
        setLoading(false);
        setError(null);
        setAnnouncement(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getAnnouncementById(id);
        setAnnouncement(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch announcement';
        setError(message);
        console.error('Failed to fetch announcement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  return {
    announcement,
    loading,
    error,
  };
}

