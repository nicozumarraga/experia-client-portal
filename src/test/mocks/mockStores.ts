
import { vi } from 'vitest';
import { mockLogs } from './logData';

// Mock the useRecentLogsStore
export const mockUseRecentLogsStore = {
  logs: mockLogs,
  isLoading: false,
  fetchLogs: vi.fn().mockResolvedValue(undefined),
  addLog: vi.fn(),
  updateStatus: vi.fn()
};

// Mock the useUploadModals store
export const mockUseUploadModals = {
  isInvoiceUploadOpen: false,
  isDocumentUploadOpen: false,
  openInvoiceUpload: vi.fn(),
  closeInvoiceUpload: vi.fn(),
  openDocumentUpload: vi.fn(),
  closeDocumentUpload: vi.fn()
};

// Mock Auth store
export const mockAuthStore = {
  user: { id: '1', name: 'Test User', email: 'test@example.com' },
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined)
};

// Create mock hooks
vi.mock('@/stores/RecentLogsStore', () => ({
  useRecentLogsStore: vi.fn().mockImplementation((selector) => {
    if (typeof selector === 'function') {
      return selector(mockUseRecentLogsStore);
    }
    return mockUseRecentLogsStore;
  })
}));

vi.mock('@/hooks/use-upload-modals', () => ({
  useUploadModals: vi.fn().mockImplementation((selector) => {
    if (typeof selector === 'function') {
      return selector(mockUseUploadModals);
    }
    return mockUseUploadModals;
  }),
  uploadFiles: vi.fn().mockResolvedValue({ success: true, fileResults: [] }),
  validateInvoice: vi.fn().mockResolvedValue({ isValid: true })
}));

vi.mock('@/providers/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue(mockAuthStore),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));
