
import { useState, useMemo } from 'react';
import { LogEntry } from '../types';

type SortField = 'documentName' | 'documentType' | 'timestamp' | 'status' | null;
type SortOrder = 'asc' | 'desc' | null;

export const useLogsFilter = (logs: LogEntry[]) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setDateFilter('all');
  };

  const filteredAndSortedLogs = useMemo(() => {
    let result = [...logs];
    
    if (statusFilter !== 'all') {
      result = result.filter(log => log.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      result = result.filter(log => log.documentType === typeFilter);
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    if (dateFilter === 'today') {
      result = result.filter(log => {
        const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
        return timestamp >= today;
      });
    } else if (dateFilter === 'yesterday') {
      result = result.filter(log => {
        const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
        return timestamp >= yesterday && timestamp < today;
      });
    } else if (dateFilter === 'lastWeek') {
      result = result.filter(log => {
        const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
        return timestamp >= lastWeek;
      });
    } else if (dateFilter === 'lastMonth') {
      result = result.filter(log => {
        const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
        return timestamp >= lastMonth;
      });
    }
    
    if (sortField && sortOrder) {
      result.sort((a, b) => {
        if (sortField === 'timestamp') {
          const aTimestamp = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
          const bTimestamp = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
          return sortOrder === 'asc' ? aTimestamp.getTime() - bTimestamp.getTime() : bTimestamp.getTime() - aTimestamp.getTime();
        }
        
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        
        return 0;
      });
    }
    
    return result;
  }, [logs, sortField, sortOrder, statusFilter, typeFilter, dateFilter]);

  return {
    sortField,
    sortOrder,
    statusFilter,
    typeFilter,
    dateFilter,
    showFilters,
    filteredAndSortedLogs,
    handleSort,
    setStatusFilter,
    setTypeFilter,
    setDateFilter,
    setShowFilters,
    resetFilters
  };
};
