import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getAnnouncements } from '../api/announcements';
import type { Announcement } from '../types/announcement';
import { formatDateTime, formatDateTimeShort } from '../lib/date';
import Icon from '../components/Icon';
import styles from './AnnouncementsList.module.css';

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnnouncements();
        setAnnouncements(data.items);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch announcements';
        setError(message);
        console.error('Failed to fetch announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleRowClick = (id: string) => {
    navigate(`/announcements/${id}`);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error loading announcements</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Announcements</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Publication date</th>
            <th>Last update</th>
            <th>Categories</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {announcements.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.empty}>
                No announcements found
              </td>
            </tr>
          ) : (
            announcements.map((announcement) => (
              <tr
                key={announcement.id}
                onClick={() => handleRowClick(announcement.id)}
                className={styles.tableRow}
              >
                <td>{announcement.title}</td>
                <td>{formatDateTime(announcement.createdAt)}</td>
                <td>{formatDateTimeShort(announcement.updatedAt)}</td>
                <td>{announcement.categories.join(', ')}</td>
                <td>
                  <button
                    className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/announcements/${announcement.id}/edit`);
                  }}
                    aria-label="Edit"
                  >
                    <Icon name="edit" alt="Edit" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
