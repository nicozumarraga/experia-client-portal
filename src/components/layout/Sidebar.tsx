import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  toggleSidebar
}) => {
  const location = useLocation();

  const Logo = () => (
    <div className="flex items-center justify-between gap-2 px-4 py-4 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 flex items-center justify-center p-0">
          <img src="/assets/experia_icon.svg" alt="Experia Icon" className="w-7 h-7" />
          {!collapsed && (
            <img src="/assets/experia_text.svg" alt="Experia Text" className="ml-2 h-2.5" />
          )}
        </div>
      </div>
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="sm"
        className={cn(
          "flex md:flex justify-center items-center h-8 w-8 p-0 text-gray-500",
          collapsed && "ml-5"
        )}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </Button>
    </div>
  );

  const SidebarItem = ({
    path,
    label,
    icon
  }: {
    path: string;
    label: string;
    icon: React.ReactNode;
  }) => {
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
        <SidebarItem path="/" label="Overview" icon={<LayoutDashboard size={20} />} />
      </nav>

      <div className="mt-auto px-2 py-4 border-t border-border">
        <SidebarItem path="/settings" label="Settings" icon={<Settings size={20} />} />
      </div>
    </aside>
  );
};

export default Sidebar;
