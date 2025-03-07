
import React, { useState, useRef } from 'react';
import { X, Upload, File, Folder, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUploadModals, uploadFiles } from '@/hooks/use-upload-modals';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface CategoryFiles {
  category: string;
  files: File[];
}

const DocumentUploadModal: React.FC = () => {
  const { isDocumentUploadOpen, closeDocumentUpload } = useUploadModals();
  const [activeTab, setActiveTab] = useState<string>(DOCUMENT_CATEGORIES[0]);
  const [categoryFiles, setCategoryFiles] = useState<CategoryFiles[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get total file count across all categories
  const totalFileCount = categoryFiles.reduce((acc, category) => acc + category.files.length, 0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      addFilesToCategory(activeTab, filesArray);
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
      addFilesToCategory(activeTab, filesArray);
    }
  };

  const addFilesToCategory = (category: string, files: File[]) => {
    setCategoryFiles(prev => {
      const categoryIndex = prev.findIndex(c => c.category === category);
      
      if (categoryIndex >= 0) {
        // Category exists, add files to it
        const updatedCategories = [...prev];
        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          files: [...updatedCategories[categoryIndex].files, ...files]
        };
        return updatedCategories;
      } else {
        // New category
        return [...prev, { category, files }];
      }
    });
  };

  const removeFile = (category: string, fileIndex: number) => {
    setCategoryFiles(prev => {
      const updatedCategories = prev.map(c => {
        if (c.category === category) {
          return {
            ...c,
            files: c.files.filter((_, i) => i !== fileIndex)
          };
        }
        return c;
      }).filter(c => c.files.length > 0); // Remove categories with no files
      
      return updatedCategories;
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (totalFileCount === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);
    try {
      // Upload files for each category
      for (const { category, files } of categoryFiles) {
        await uploadFiles(files, 'document', category);
      }
      
      // Reset state
      setCategoryFiles([]);
      closeDocumentUpload();
      toast.success(`All documents uploaded successfully to their respective categories`);
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

  // Find if category has files already
  const getCategoryFileCount = (category: string) => {
    const categoryData = categoryFiles.find(c => c.category === category);
    return categoryData ? categoryData.files.length : 0;
  };

  return (
    <Dialog open={isDocumentUploadOpen} onOpenChange={closeDocumentUpload}>
      <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload Documents by Category</DialogTitle>
          <DialogDescription>
            Organize and upload documents to their respective categories
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue={DOCUMENT_CATEGORIES[0]} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 flex flex-wrap max-w-full h-auto">
              {DOCUMENT_CATEGORIES.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="relative flex-shrink-0">
                  {cat}
                  {getCategoryFileCount(cat) > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {getCategoryFileCount(cat)}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {DOCUMENT_CATEGORIES.map((cat) => (
              <TabsContent key={cat} value={cat} className="pt-2">
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
                  <FolderOpen className="h-10 w-10 text-company mx-auto mb-2" />
                  <p className="text-muted-foreground mb-2">
                    Drag and drop files for <strong>{cat}</strong> category here, or
                  </p>
                  <Button type="button" onClick={handleBrowseClick} variant="outline">
                    Browse Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Any file type is supported
                  </p>
                </div>
                
                {categoryFiles.find(c => c.category === cat)?.files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Selected Files for {cat}</h4>
                    <ScrollArea className="max-h-40 md:max-h-60">
                      <div className="space-y-2 pr-2">
                        {categoryFiles.find(c => c.category === cat)?.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md hover:bg-muted transition-colors">
                            <div className="flex items-center gap-2 overflow-hidden flex-1">
                              <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              <span className="truncate text-sm">{file.name}</span>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                ({formatFileSize(file.size)})
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(cat, index)}
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {totalFileCount > 0 && (
            <div className="mt-6 p-3 bg-muted/50 rounded-md">
              <h4 className="font-medium mb-2">Upload Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                {categoryFiles.map((category) => (
                  <div key={category.category} className="flex justify-between items-center p-2 bg-background rounded-md">
                    <span className="font-medium">{category.category}</span>
                    <Badge variant="outline">{category.files.length} files</Badge>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Total: {totalFileCount} files across {categoryFiles.length} categories
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={closeDocumentUpload} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={totalFileCount === 0 || isUploading}
            className="bg-company hover:bg-company-dark"
          >
            {isUploading ? (
              <>
                <span className="animate-pulse">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload All Documents
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
