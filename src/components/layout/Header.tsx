
import React, { useState } from 'react';
import { PlusCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUploadModals } from '@/hooks/use-upload-modals';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { openInvoiceUpload, openDocumentUpload } = useUploadModals();
  
  return (
    <header className="bg-background border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-lg font-medium">Document Management Portal</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-fiduciary-600 hover:bg-fiduciary-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Upload
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 animate-scale-in">
            <DropdownMenuItem onClick={openInvoiceUpload} className="cursor-pointer">
              Upload Invoices
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openDocumentUpload} className="cursor-pointer">
              Upload Other Documents
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
