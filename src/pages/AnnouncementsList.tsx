import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getAnnouncements } from '../api/announcements';
import type { Announcement } from '../types/announcement';
import Icon from '../components/Icon';
import styles from './AnnouncementsList.module.css';

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
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
          {announcements.map((announcement) => (
            <tr
              key={announcement.id}
              onClick={() => handleRowClick(announcement.id)}
              className={styles.tableRow}
            >
              <td>{announcement.title}</td>
              <td>{announcement.publicationDate}</td>
              <td>{announcement.lastUpdate}</td>
              <td>{announcement.categories.join(', ')}</td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(announcement.id);
                  }}
                  aria-label="Edit"
                >
                  <Icon name="edit" alt="Edit" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
