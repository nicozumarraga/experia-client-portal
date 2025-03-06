import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogsFilter } from './hooks/useLogsFilter';
import { formatDate } from './utils/dateUtils';
import FilterPopover from './logs/FilterPopover';
import LogsTable from './logs/LogsTable';
import { LogEntry } from './types';

interface RecentLogsProps {
  logs: LogEntry[];
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onResetFilters: () => void;
}

const RecentLogs: React.FC<RecentLogsProps> = ({ logs, statusFilter, onStatusFilterChange, onResetFilters }) => {
  const {
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
    resetFilters
  } = useLogsFilter({ logs, statusFilter });

  const handleResetFilters = () => {
    resetFilters();
    onResetFilters();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>View the status of your recent document uploads</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <FilterPopover
            statusFilter={statusFilter}
            setStatusFilter={onStatusFilterChange}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            resetFilters={handleResetFilters}
          />
        </div>
      </CardHeader>
      <CardContent>
        <LogsTable
          logs={filteredAndSortedLogs}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
          formatDate={formatDate}
        />
      </CardContent>
    </Card>
  );
};

export default RecentLogs;
