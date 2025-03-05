
import { create } from 'zustand';
import { toast } from 'sonner';
import { useRecentLogsStore } from '@/stores/RecentLogsStore';

interface UploadModalsStore {
  isInvoiceUploadOpen: boolean;
  isDocumentUploadOpen: boolean;
  openInvoiceUpload: () => void;
  closeInvoiceUpload: () => void;
  openDocumentUpload: () => void;
  closeDocumentUpload: () => void;
}

export const useUploadModals = create<UploadModalsStore>((set) => ({
  isInvoiceUploadOpen: false,
  isDocumentUploadOpen: false,
  openInvoiceUpload: () => set({ isInvoiceUploadOpen: true }),
  closeInvoiceUpload: () => set({ isInvoiceUploadOpen: false }),
  openDocumentUpload: () => set({ isDocumentUploadOpen: true }),
  closeDocumentUpload: () => set({ isDocumentUploadOpen: false }),
}));

// Mock file validation
export const validateInvoice = (file: File): Promise<{ isValid: boolean; reason?: string }> => {
  return new Promise((resolve) => {
    // Simulate API validation delay
    setTimeout(() => {
      // For demo purposes, randomly validate or invalidate
      const isValid = Math.random() > 0.3;
      if (isValid) {
        resolve({ isValid: true });
      } else {
        // Random rejection reasons
        const reasons = [
          "Missing invoice number",
          "Invalid date format",
          "Missing vendor information",
          "Amount format is incorrect",
          "Tax calculation error"
        ];
        resolve({ 
          isValid: false, 
          reason: reasons[Math.floor(Math.random() * reasons.length)]
        });
      }
    }, 1500);
  });
};

// Mock file upload
export const uploadFiles = async (
  files: File[], 
  type: 'invoice' | 'document',
  category?: string
): Promise<{ success: boolean; fileResults: Record<string, any>[] }> => {
  const addLog = useRecentLogsStore.getState().addLog;
  const updateStatus = useRecentLogsStore.getState().updateStatus;
  
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(async () => {
      // For invoices, validate each one
      if (type === 'invoice') {
        const fileResults = await Promise.all(
          files.map(async (file) => {
            // Add initial pending log
            const logId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            addLog({
              documentName: file.name,
              documentType: 'invoice',
              timestamp: new Date(),
              status: 'pending'
            });
            
            // Simulate validation
            setTimeout(async () => {
              const validation = await validateInvoice(file);
              
              // Update status based on validation result
              updateStatus(
                logId, 
                validation.isValid ? 'validated' : 'rejected',
                validation.isValid ? undefined : validation.reason
              );
            }, 2000 + Math.random() * 3000); // Random delay for each file
            
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              uploaded: true,
              logId
            };
          })
        );
        
        toast.success(`${files.length} invoice(s) uploaded for validation`);
        resolve({ success: true, fileResults });
      } else {
        // For other documents, just simulate upload
        const fileResults = files.map(file => {
          // Add log for the document
          addLog({
            documentName: file.name,
            documentType: 'document',
            timestamp: new Date(),
            status: 'uploaded',
            category
          });
          
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            uploaded: true,
            category
          };
        });
        
        toast.success(`${files.length} document(s) uploaded successfully`);
        resolve({ success: true, fileResults });
      }
    }, 2000);
  });
};
