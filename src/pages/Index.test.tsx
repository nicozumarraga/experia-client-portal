
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import Index from './Index';
import { mockUseRecentLogsStore, mockAuthStore } from '@/test/mocks/mockStores';
import { mockLogs } from '@/test/mocks/logData';

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when auth is loading', () => {
    // Override mock to show loading
    vi.mocked(mockAuthStore.isLoading).mockReturnValue(true);
    
    render(<Index />);
    
    expect(screen.getByRole('status')).toBeInTheDocument(); // The loading spinner
  });

  it('displays welcome message with user name', async () => {
    render(<Index />);
    
    expect(screen.getByText(`Welcome, ${mockAuthStore.user.name}`)).toBeInTheDocument();
  });

  it('shows summary cards with correct values', () => {
    render(<Index />);
    
    expect(screen.getByText('Total Documents')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    
    // Check if the counts match the mock data
    const pendingCount = mockLogs.filter(log => log.status === 'pending').length;
    const failedCount = mockLogs.filter(log => ['failed', 'rejected'].includes(log.status)).length;
    
    expect(screen.getByText(mockLogs.length.toString())).toBeInTheDocument(); // Total
    expect(screen.getByText(pendingCount.toString())).toBeInTheDocument(); // Pending
    expect(screen.getByText(failedCount.toString())).toBeInTheDocument(); // Failed
  });

  it('displays recent logs when logs exist', () => {
    render(<Index />);
    
    expect(screen.getByText('Recent Uploads')).toBeInTheDocument();
    expect(screen.getByText('Document Name')).toBeInTheDocument(); // Table header
  });

  it('shows empty state when no logs exist', () => {
    // Override mock to return empty logs
    vi.mocked(mockUseRecentLogsStore.logs).mockReturnValue([]);
    
    render(<Index />);
    
    expect(screen.getByText('No documents yet')).toBeInTheDocument();
    expect(screen.getByText('Upload your first documents to get started')).toBeInTheDocument();
  });

  it('opens invoice upload modal when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Index />);
    
    // Override mock to return empty logs to see the empty state
    vi.mocked(mockUseRecentLogsStore.logs).mockReturnValue([]);
    
    const uploadButton = screen.getByRole('button', { name: 'Upload Invoice' });
    await user.click(uploadButton);
    
    // Verify the modal open function was called
    expect(mockUseUploadModals.openInvoiceUpload).toHaveBeenCalled();
  });
});
