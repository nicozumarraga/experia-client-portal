
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogsFilter } from './useLogsFilter';
import { mockLogs } from '@/test/mocks/logData';

describe('useLogsFilter Hook', () => {
  it('should initially return all logs without filtering', () => {
    const { result } = renderHook(() => useLogsFilter(mockLogs));
    
    expect(result.current.filteredAndSortedLogs).toHaveLength(mockLogs.length);
    expect(result.current.sortField).toBeNull();
    expect(result.current.sortOrder).toBeNull();
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.typeFilter).toBe('all');
    expect(result.current.dateFilter).toBe('all');
  });

  it('should filter logs by status', () => {
    const { result } = renderHook(() => useLogsFilter(mockLogs));
    
    act(() => {
      result.current.setStatusFilter('validated');
    });
    
    expect(result.current.filteredAndSortedLogs).toHaveLength(1);
    expect(result.current.filteredAndSortedLogs[0].status).toBe('validated');
  });

  it('should filter logs by document type', () => {
    const { result } = renderHook(() => useLogsFilter(mockLogs));
    
    act(() => {
      result.current.setTypeFilter('invoice');
    });
    
    expect(result.current.filteredAndSortedLogs.every(log => log.documentType === 'invoice')).toBe(true);
  });

  it('should sort logs by timestamp', () => {
    const { result } = renderHook(() => useLogsFilter(mockLogs));
    
    act(() => {
      result.current.handleSort('timestamp');
    });
    
    // Logs should be sorted ascending by timestamp
    expect(result.current.sortField).toBe('timestamp');
    expect(result.current.sortOrder).toBe('asc');
    
    const sortedTimestamps = result.current.filteredAndSortedLogs.map(log => log.timestamp.getTime());
    const isSorted = sortedTimestamps.every((val, i, arr) => i === 0 || val >= arr[i - 1]);
    expect(isSorted).toBe(true);
    
    // Toggle to descending
    act(() => {
      result.current.handleSort('timestamp');
    });
    
    expect(result.current.sortOrder).toBe('desc');
    const sortedDescTimestamps = result.current.filteredAndSortedLogs.map(log => log.timestamp.getTime());
    const isSortedDesc = sortedDescTimestamps.every((val, i, arr) => i === 0 || val <= arr[i - 1]);
    expect(isSortedDesc).toBe(true);
  });

  it('should reset all filters', () => {
    const { result } = renderHook(() => useLogsFilter(mockLogs));
    
    // Set some filters
    act(() => {
      result.current.setStatusFilter('rejected');
      result.current.setTypeFilter('invoice');
      result.current.setDateFilter('today');
    });
    
    // Reset filters
    act(() => {
      result.current.resetFilters();
    });
    
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.typeFilter).toBe('all');
    expect(result.current.dateFilter).toBe('all');
    expect(result.current.filteredAndSortedLogs).toHaveLength(mockLogs.length);
  });
});
