import { flexRender, type ColumnDef, type Table } from '@tanstack/react-table';
import type { Announcement } from '../types/announcement';
import styles from './AnnouncementsTable.module.css';

interface AnnouncementsTableProps {
  table: Table<Announcement>;
  columns: ColumnDef<Announcement>[];
}

export default function AnnouncementsTable({ table, columns }: AnnouncementsTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <TableHeader table={table} />
        <TableBody table={table} columns={columns} />
      </table>
    </div>
  );
}

function TableHeader({ table }: { table: Table<Announcement> }) {
  return (
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
  );
}

function TableBody({
  table,
  columns,
}: {
  table: Table<Announcement>;
  columns: ColumnDef<Announcement>[];
}) {
  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className={styles.empty}>
            No announcements found
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {rows.map((row) => (
        <TableRow key={row.id} row={row} />
      ))}
    </tbody>
  );
}

function TableRow({ row }: { row: ReturnType<Table<Announcement>['getRowModel']>['rows'][0] }) {
  return (
    <tr className={styles.tableRow}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className={styles.td}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}
