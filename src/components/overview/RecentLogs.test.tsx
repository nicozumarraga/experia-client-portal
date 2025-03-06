
import { describe, it, expect, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { render } from '@/test/test-utils';
import RecentLogs from './RecentLogs';
import { mockLogs } from '@/test/mocks/logData';
import userEvent from '@testing-library/user-event';

describe('RecentLogs Component', () => {
  it('renders logs table with correct headers', () => {
    render(<RecentLogs logs={mockLogs} />);
    
    expect(screen.getByText('Recent Uploads')).toBeInTheDocument();
    expect(screen.getByText('Document Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('displays logs in the table', () => {
    render(<RecentLogs logs={mockLogs} />);
    
    mockLogs.forEach(log => {
      expect(screen.getByText(log.documentName)).toBeInTheDocument();
    });
  });

  it('shows status badges with correct status', () => {
    render(<RecentLogs logs={mockLogs} />);
    
    expect(screen.getByText('validated')).toBeInTheDocument();
    expect(screen.getByText('uploaded')).toBeInTheDocument();
    expect(screen.getByText('rejected')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('shows filter popover when clicking on filter button', async () => {
    const user = userEvent.setup();
    render(<RecentLogs logs={mockLogs} />);
    
    const filterButton = screen.getByRole('button', { name: /filter/i });
    await user.click(filterButton);
    
    expect(screen.getByText('Filter By Status')).toBeInTheDocument();
    expect(screen.getByText('Filter By Type')).toBeInTheDocument();
    expect(screen.getByText('Filter By Date')).toBeInTheDocument();
  });
});
