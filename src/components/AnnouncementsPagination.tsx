import type { Table } from '@tanstack/react-table';
import type { Announcement } from '../types/announcement';
import styles from './AnnouncementsPagination.module.css';

interface AnnouncementsPaginationProps {
  table: Table<Announcement>;
}

export default function AnnouncementsPagination({ table }: AnnouncementsPaginationProps) {
  return (
    <div className={styles.pagination}>
      <button
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
        className={styles.pageButton}
      >
        {'<<'}
      </button>
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className={styles.pageButton}
      >
        {'<'}
      </button>
      <span className={styles.pageInfo}>
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </span>
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className={styles.pageButton}
      >
        {'>'}
      </button>
      <button
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
        className={styles.pageButton}
      >
        {'>>'}
      </button>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        className={styles.pageSizeSelect}
      >
        {[10, 20, 30, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
}

