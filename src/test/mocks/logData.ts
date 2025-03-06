
import { LogEntry } from '@/components/overview/types';

export const mockLogs: LogEntry[] = [
  {
    id: 'log-1',
    documentName: 'Invoice-1001.pdf',
    documentType: 'invoice',
    timestamp: new Date('2023-10-15T14:30:00'),
    status: 'validated'
  },
  {
    id: 'log-2',
    documentName: 'Contract-2001.pdf',
    documentType: 'document',
    timestamp: new Date('2023-10-14T10:15:00'),
    status: 'uploaded',
    category: 'Contracts'
  },
  {
    id: 'log-3',
    documentName: 'Invoice-1002.pdf',
    documentType: 'invoice',
    timestamp: new Date('2023-10-13T09:45:00'),
    status: 'rejected',
    validationReason: 'Missing invoice number'
  },
  {
    id: 'log-4',
    documentName: 'Tax-3001.pdf',
    documentType: 'document',
    timestamp: new Date('2023-10-12T16:20:00'),
    status: 'pending',
    category: 'Tax Documents'
  }
];
