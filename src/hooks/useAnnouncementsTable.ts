import { useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Announcement } from '../types/announcement';

export function useAnnouncementsTable(
  data: Announcement[],
  columns: ColumnDef<Announcement>[],
  searchText: string,
  selectedCategories: string[],
) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  useEffect(() => {
    table.setPageIndex(0);
  }, [searchText, selectedCategories, table]);

  return table;
}
