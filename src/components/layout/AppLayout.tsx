
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Check if we're in mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Auto-collapse sidebar on mobile after route change
  useEffect(() => {
    if (isMobileView) {
      setShowMobileSidebar(false);
    }
    // We're intentionally NOT collapsing the sidebar on desktop when changing routes
  }, [location.pathname, isMobileView]);

  const toggleSidebar = () => {
    if (isMobileView) {
      setShowMobileSidebar(!showMobileSidebar);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isMobileView && showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar - hidden on mobile unless toggled */}
      <div 
        className={cn(
          "md:relative fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform",
          isMobileView && !showMobileSidebar ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
