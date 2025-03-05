
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  
  const Logo = () => (
    <div className="flex items-center gap-2 px-2 py-4">
      <div className="flex-shrink-0 w-8 h-8 bg-fiduciary-700 rounded-md flex items-center justify-center">
        <span className="text-white font-semibold text-lg">F</span>
      </div>
      {!collapsed && (
        <span className="font-semibold text-lg truncate animate-fade-in">
          Fiduciary
        </span>
      )}
    </div>
  );
  
  const SidebarItem = ({ path, label, icon }: { path: string; label: string; icon: React.ReactNode }) => {
    const isActive = location.pathname === path;
    
    return (
      <Link 
        to={path}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 sidebar-item",
          isActive ? "active" : "hover:bg-sidebar-accent/70"
        )}
      >
        {icon}
        {!collapsed && (
          <span className={cn("truncate", collapsed ? "opacity-0" : "animate-fade-in")}>
            {label}
          </span>
        )}
      </Link>
    );
  };
  
  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen border-r border-border transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <Logo />
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        <SidebarItem 
          path="/" 
          label="Overview" 
          icon={<LayoutDashboard size={20} />} 
        />
        <SidebarItem 
          path="/settings" 
          label="Settings" 
          icon={<Settings size={20} />} 
        />
      </nav>
      
      <div className="p-2 border-t border-border">
        <Button 
          onClick={toggleSidebar}
          variant="ghost" 
          size="sm" 
          className="w-full flex justify-center items-center"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
