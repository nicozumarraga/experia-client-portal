
import React, { useState, useRef } from 'react';
import { X, Upload, File, Folder } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUploadModals, uploadFiles } from '@/hooks/use-upload-modals';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const DOCUMENT_CATEGORIES = [
  "Correspondence",
  "Contracts",
  "Tax Documents",
  "Financial Statements",
  "Receipts",
  "Legal Documents",
  "Reports",
  "Other"
];

const DocumentUploadModal: React.FC = () => {
  const { isDocumentUploadOpen, closeDocumentUpload } = useUploadModals();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    if (!category) {
      toast.error("Please select a document category");
      return;
    }

    setIsUploading(true);
    try {
      await uploadFiles(selectedFiles, 'document', category);
      setSelectedFiles([]);
      setCategory("");
      closeDocumentUpload();
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={isDocumentUploadOpen} onOpenChange={closeDocumentUpload}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload documents and assign them to a category.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div 
            className={cn(
              "file-drop-area",
              isDragging && "drag-active"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            <Folder className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-2">Drag and drop files here, or</p>
            <Button type="button" onClick={handleBrowseClick} variant="outline">
              Browse Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Any file type is supported
            </p>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Document Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Selected Files ({selectedFiles.length})</h4>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <File className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={closeDocumentUpload} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={selectedFiles.length === 0 || !category || isUploading}
          >
            {isUploading ? (
              <>
                <span className="animate-pulse">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
