import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import styles from './RootLayout.module.css';

export default function RootLayout() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

