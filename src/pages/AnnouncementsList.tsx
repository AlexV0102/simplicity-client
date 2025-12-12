import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { ColumnDef } from '@tanstack/react-table';
import type { Announcement } from '../types/announcement';
import { formatDateTime, formatDateTimeShort } from '../lib/date';
import { AVAILABLE_CATEGORIES } from '../config/categories';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useAnnouncementsTable } from '../hooks/useAnnouncementsTable';
import AnnouncementsTable from '../components/AnnouncementsTable';
import AnnouncementsPagination from '../components/AnnouncementsPagination';
import Icon from '../components/Icon';
import styles from './AnnouncementsList.module.css';

export default function AnnouncementsList() {
  const navigate = useNavigate();
  const {
    announcements,
    loading,
    error,
    searchText,
    handleSearchChange,
    handleSearchBlur,
    selectedCategories,
    handleCategoryToggle,
    handleClearFilters,
  } = useAnnouncements();

  const handleEditClick = useCallback(
    (id: string) => {
      navigate(`/announcements/${id}/edit`);
    },
    [navigate],
  );

  const columns = useMemo<ColumnDef<Announcement>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'createdAt',
        header: 'Publication date',
        cell: (info) => formatDateTime(info.getValue() as string),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Last update',
        cell: (info) => formatDateTimeShort(info.getValue() as string),
      },
      {
        accessorKey: 'categories',
        header: 'Categories',
        cell: (info) => (info.getValue() as string[]).join(', '),
      },
      {
        id: 'actions',
        header: '',
        cell: (info) => {
          const announcement = info.row.original;
          return (
            <button
              className={styles.editButton}
              onClick={() => handleEditClick(announcement.id)}
              aria-label="Edit"
            >
              <Icon name="edit" alt="Edit" />
            </button>
          );
        },
      },
    ],
    [handleEditClick],
  );

  const table = useAnnouncementsTable(announcements, columns, searchText, selectedCategories);

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
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search in title and content..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            onBlur={handleSearchBlur}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.categoriesContainer}>
          <div className={styles.categoriesLabel}>Filter by categories:</div>
          <div className={styles.categoriesList}>
            {AVAILABLE_CATEGORIES.map((category) => (
              <label key={category} className={styles.categoryCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>
        {(searchText || selectedCategories.length > 0) && (
          <button onClick={handleClearFilters} className={styles.clearFiltersButton}>
            Clear filters
          </button>
        )}
      </div>
      <AnnouncementsTable table={table} columns={columns} />
      {announcements.length > 0 && <AnnouncementsPagination table={table} />}
    </div>
  );
}
