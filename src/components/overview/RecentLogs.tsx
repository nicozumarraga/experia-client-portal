
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogsFilter } from './hooks/useLogsFilter';
import { formatDate } from './utils/dateUtils';
import FilterPopover from './logs/FilterPopover';
import LogsTable from './logs/LogsTable';
import { LogEntry } from './types';

interface RecentLogsProps {
  logs: LogEntry[];
}

const RecentLogs: React.FC<RecentLogsProps> = ({ logs }) => {
  const {
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
  } = useLogsFilter(logs);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>View the status of your recent document uploads</CardDescription>
        </div>
        <FilterPopover
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          resetFilters={resetFilters}
        />
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
