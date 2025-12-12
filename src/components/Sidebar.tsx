import { Link, useLocation } from 'react-router';
import styles from './Sidebar.module.css';
import Icon from './Icon';

export default function Sidebar() {
  const location = useLocation();
  const isAnnouncementsActive = location.pathname.startsWith('/announcements');

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>🏛️</div>
        <span className={styles.title}>Test city</span>
      </div>
      <nav className={styles.nav}>
        <Link
          to="/announcements"
          className={`${styles.navItem} ${isAnnouncementsActive ? styles.active : ''}`}
        >
          <span className={styles.icon}>
            <Icon name="announcement" alt="Announcement" />
          </span>
          <span className={styles.label}>Announcements</span>
        </Link>
      </nav>
    </aside>
  );
}
