import { useState, useMemo } from 'react';
import { LogEntry } from '../types';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface UseLogsFilterProps {
  logs: LogEntry[];
  statusFilter: string;
}

export const useLogsFilter = ({ logs, statusFilter }: UseLogsFilterProps) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = [...logs];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => {
        if (statusFilter === 'failed') {
          return log.status === 'failed' || log.status === 'rejected';
        }
        return log.status === statusFilter;
      });
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(log => log.documentType === typeFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all' || (dateRange.from && dateRange.to)) {
      const now = new Date();
      const today = startOfDay(now);

      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);

        // Handle custom date range
        if (dateFilter === 'custom' && dateRange.from && dateRange.to) {
          return isWithinInterval(logDate, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to)
          });
        }

        // Handle predefined ranges
        switch (dateFilter) {
          case 'today':
            return logDate >= today;
          case 'yesterday': {
            const yesterday = startOfDay(new Date(today));
            yesterday.setDate(yesterday.getDate() - 1);
            return logDate >= yesterday && logDate < today;
          }
          case 'lastWeek': {
            const lastWeek = startOfDay(new Date(today));
            lastWeek.setDate(lastWeek.getDate() - 7);
            return logDate >= lastWeek;
          }
          case 'lastMonth': {
            const lastMonth = startOfDay(new Date(today));
            lastMonth.setDate(lastMonth.getDate() - 30);
            return logDate >= lastMonth;
          }
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a: LogEntry, b: LogEntry) => {
        if (sortField === 'timestamp') {
          return new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
        }
        return (a[sortField as keyof LogEntry] as string).localeCompare(b[sortField as keyof LogEntry] as string);
      });

      if (sortOrder === 'desc') {
        filtered.reverse();
      }
    }

    return filtered;
  }, [logs, statusFilter, typeFilter, dateFilter, dateRange, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setTypeFilter('all');
    setDateFilter('all');
    setDateRange({ from: undefined, to: undefined });
    setSortField(null);
    setSortOrder(null);
  };

  return {
    sortField,
    sortOrder,
    typeFilter,
    dateFilter,
    dateRange,
    showFilters,
    filteredAndSortedLogs,
    handleSort,
    setTypeFilter,
    setDateFilter,
    setDateRange,
    setShowFilters,
    resetFilters,
  };
};
