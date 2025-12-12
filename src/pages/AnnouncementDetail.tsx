import { useNavigate, useParams } from 'react-router';
import { useAnnouncement } from '../hooks/useAnnouncement';
import { formatDateTime, formatDateTimeShort } from '../lib/date';
import styles from './AnnouncementDetail.module.css';

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const { announcement, loading, error } = useAnnouncement(id);
  const navigate = useNavigate();

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Error loading announcement</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/announcements')} className={styles.backButton}>
            Back to Announcements
          </button>
        </div>
      </div>
    );
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
            <span>{formatDateTime(announcement.createdAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Last update:</span>
            <span>{formatDateTimeShort(announcement.updatedAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Categories:</span>
            <span>{announcement.categories.join(', ')}</span>
          </div>
        </div>
        {announcement.content && <div className={styles.content}>{announcement.content}</div>}
      </article>
    </div>
  );
}
