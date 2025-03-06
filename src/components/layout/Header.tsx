import React from 'react';
import { PlusCircle, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
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
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
            <Button className="bg-[#182561] hover:bg-[#121d4e] text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent align="end" className="w-48 animate-scale-in p-0 mt-0">
            <div className="h-[20px] absolute -top-[20px] w-full" />
            <div
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 text-sm"
              onClick={openInvoiceUpload}
            >
              Upload Invoices
            </div>
            <div
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 text-sm"
              onClick={openDocumentUpload}
            >
              Upload Other Documents
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </header>
  );
};

export default Header;
