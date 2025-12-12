import { useEffect, useRef } from 'react';
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
  const prevFiltersRef = useRef({ searchText, selectedCategories: selectedCategories.join(',') });

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
    const currentFilters = { searchText, selectedCategories: selectedCategories.join(',') };
    const prevFilters = prevFiltersRef.current;

    if (
      currentFilters.searchText !== prevFilters.searchText ||
      currentFilters.selectedCategories !== prevFilters.selectedCategories
    ) {
      table.setPageIndex(0);
      prevFiltersRef.current = currentFilters;
    }
  }, [searchText, selectedCategories, table]);

  return table;
}
