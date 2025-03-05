
import React from 'react';
import { PlusCircle, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUploadModals } from '@/hooks/use-upload-modals';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar
}) => {
  const {
    openInvoiceUpload,
    openDocumentUpload
  } = useUploadModals();

  return (
    <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-2" 
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-company hover:bg-company-dark text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
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
