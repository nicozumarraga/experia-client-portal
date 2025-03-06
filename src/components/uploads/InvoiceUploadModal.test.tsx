
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import InvoiceUploadModal from './InvoiceUploadModal';
import { uploadFiles } from '@/hooks/use-upload-modals';

// Mock useUploadModals to control the open state
vi.mock('@/hooks/use-upload-modals', async () => {
  const actual = await vi.importActual('@/hooks/use-upload-modals');
  return {
    ...actual,
    useUploadModals: vi.fn().mockReturnValue({
      isInvoiceUploadOpen: true,
      closeInvoiceUpload: vi.fn(),
    }),
    uploadFiles: vi.fn().mockResolvedValue({ success: true, fileResults: [] }),
  };
});

// Mock createObjectURL
URL.createObjectURL = vi.fn().mockReturnValue('mock-url');

describe('InvoiceUploadModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal when open', () => {
    render(<InvoiceUploadModal />);
    
    expect(screen.getByText('Upload Invoices')).toBeInTheDocument();
    expect(screen.getByText('Upload invoice files for validation and processing.')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop files here, or')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse Files' })).toBeInTheDocument();
  });

  it('allows file selection through button click', async () => {
    const user = userEvent.setup();
    render(<InvoiceUploadModal />);
    
    const file = new File(['dummy content'], 'test-invoice.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByTestId('file-input');
    
    await user.upload(fileInput, file);
    
    expect(screen.getByText('Selected Files (1)')).toBeInTheDocument();
    expect(screen.getByText('test-invoice.pdf')).toBeInTheDocument();
  });

  it('allows removing selected files', async () => {
    const user = userEvent.setup();
    render(<InvoiceUploadModal />);
    
    // Add a file
    const file = new File(['dummy content'], 'test-invoice.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);
    
    // Find and click the remove button
    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);
    
    // File should be removed
    expect(screen.queryByText('test-invoice.pdf')).not.toBeInTheDocument();
  });

  it('calls uploadFiles when Upload button is clicked', async () => {
    const user = userEvent.setup();
    render(<InvoiceUploadModal />);
    
    // Add a file
    const file = new File(['dummy content'], 'test-invoice.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);
    
    // Click upload button
    const uploadButton = screen.getByRole('button', { name: /^upload$/i });
    await user.click(uploadButton);
    
    // Check if uploadFiles was called
    await waitFor(() => {
      expect(uploadFiles).toHaveBeenCalledWith([file], 'invoice');
    });
  });
});
