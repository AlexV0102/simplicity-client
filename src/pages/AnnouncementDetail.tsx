import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getAnnouncementById } from '../api/announcements';
import type { Announcement } from '../types/announcement';
import styles from './AnnouncementDetail.module.css';

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAnnouncementById(id);
        setAnnouncement(data);
      } catch (error) {
        console.error('Failed to fetch announcement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!announcement) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Announcement not found</h2>
          <button onClick={() => navigate('/announcements')} className={styles.backButton}>
            Back to Announcements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/announcements')} className={styles.backButton}>
        ← Back to Announcements
      </button>
      <article className={styles.article}>
        <h1 className={styles.title}>{announcement.title}</h1>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Publication date:</span>
            <span>{announcement.publicationDate}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Last update:</span>
            <span>{announcement.lastUpdate}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Categories:</span>
            <span>{announcement.categories.join(', ')}</span>
          </div>
        </div>
        <div className={styles.content}>
          {announcement.content || 'No content available.'}
        </div>
      </article>
    </div>
  );
}

