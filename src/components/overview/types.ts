
export interface LogEntry {
  id: string;
  documentName: string;
  documentType: 'invoice' | 'document';
  timestamp: Date;
  status: 'pending' | 'validated' | 'rejected' | 'uploaded' | 'failed';
  category?: string;
  validationReason?: string;
}
