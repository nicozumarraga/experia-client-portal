
import { create } from 'zustand';
import { toast } from 'sonner';
import { LogEntry } from '@/components/overview/types';

interface LogsState {
  logs: LogEntry[];
  isLoading: boolean;
  addLog: (log: Omit<LogEntry, 'id'>) => void;
  updateStatus: (id: string, status: LogEntry['status'], reason?: string) => void;
  fetchLogs: () => Promise<void>;
}

// Generate a random ID for new logs
const generateId = () => `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Mock data for logs
const generateMockLogs = (): LogEntry[] => {
  const now = new Date();
  const documentTypes = ['invoice', 'document'] as const;
  const statuses = ['pending', 'validated', 'rejected', 'uploaded', 'failed'] as const;
  const categories = ['Correspondence', 'Contracts', 'Tax Documents', 'Financial Statements', 'Receipts'];
  const rejectionReasons = [
    'Missing invoice number', 
    'Invalid date format', 
    'Missing vendor information',
    'Amount format is incorrect',
    'Tax calculation error'
  ];
  
  return Array.from({ length: 10 }, (_, i) => {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - i);
    
    const documentType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `log-${i}`,
      documentName: documentType === 'invoice' 
        ? `Invoice-${1000 + i}.pdf` 
        : `Document-${2000 + i}.pdf`,
      documentType,
      timestamp,
      status,
      category: documentType === 'document' 
        ? categories[Math.floor(Math.random() * categories.length)] 
        : undefined,
      validationReason: status === 'rejected' 
        ? rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)] 
        : undefined
    };
  });
};

export const useRecentLogsStore = create<LogsState>((set, get) => ({
  logs: [],
  isLoading: false,
  
  addLog: (logData) => {
    const newLog = {
      id: generateId(),
      ...logData
    };
    set((state) => ({
      logs: [newLog, ...state.logs]
    }));
  },
  
  updateStatus: (id, status, reason) => {
    set((state) => ({
      logs: state.logs.map(log => 
        log.id === id 
          ? { ...log, status, validationReason: reason } 
          : log
      )
    }));
  },
  
  fetchLogs: async () => {
    set({ isLoading: true });
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        set({ 
          logs: generateMockLogs(),
          isLoading: false 
        });
        resolve();
      }, 1000);
    });
  }
}));
