import { useNavigate } from 'react-router';
import { flexRender, type ColumnDef } from '@tanstack/react-table';
import type { Announcement } from '../types/announcement';
import { formatDateTime, formatDateTimeShort } from '../lib/date';
import { AVAILABLE_CATEGORIES } from '../config/categories';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useAnnouncementsTable } from '../hooks/useAnnouncementsTable';
import Icon from '../components/Icon';
import styles from './AnnouncementsList.module.css';

export default function AnnouncementsList() {
  const navigate = useNavigate();
  const {
    announcements,
    loading,
    error,
    searchText,
    setSearchText,
    selectedCategories,
    handleCategoryToggle,
    handleClearFilters,
  } = useAnnouncements();

  const columns: ColumnDef<Announcement>[] = [
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
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/announcements/${announcement.id}/edit`);
            }}
            aria-label="Edit"
          >
            <Icon name="edit" alt="Edit" />
          </button>
        );
      },
    },
  ];

  const table = useAnnouncementsTable(announcements, columns, searchText, selectedCategories);

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
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search in title and content..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.th}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  No announcements found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.original.id)}
                  className={styles.tableRow}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.td}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {announcements.length > 0 && (
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
      )}
    </div>
  );
}
