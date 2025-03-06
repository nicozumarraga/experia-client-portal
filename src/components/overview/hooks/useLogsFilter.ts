import { useState, useMemo } from 'react';
import { LogEntry } from '../types';

interface UseLogsFilterProps {
  logs: LogEntry[];
  statusFilter: string;
}

export const useLogsFilter = ({ logs, statusFilter }: UseLogsFilterProps) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
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
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        switch (dateFilter) {
          case 'today':
            return logDate >= today;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return logDate >= yesterday && logDate < today;
          case 'lastWeek':
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);
            return logDate >= lastWeek;
          case 'lastMonth':
            const lastMonth = new Date(today);
            lastMonth.setDate(lastMonth.getDate() - 30);
            return logDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a: any, b: any) => {
        if (sortField === 'timestamp') {
          return new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
        }
        return a[sortField].localeCompare(b[sortField]);
      });

      if (sortOrder === 'desc') {
        filtered.reverse();
      }
    }

    return filtered;
  }, [logs, statusFilter, typeFilter, dateFilter, sortField, sortOrder]);

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
    setSortField(null);
    setSortOrder(null);
  };

  return {
    sortField,
    sortOrder,
    typeFilter,
    dateFilter,
    showFilters,
    filteredAndSortedLogs,
    handleSort,
    setTypeFilter,
    setDateFilter,
    setShowFilters,
    resetFilters,
  };
};
