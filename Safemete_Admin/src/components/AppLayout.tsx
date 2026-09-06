import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#202528] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E5252B] flex items-center justify-center shadow-xl shadow-[#E5252B]/30 animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
          <p className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
            Loading SAFEMETE Portal...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#202528] text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Top Bar */}
      <TopBar
        onOpenMobileMenu={() => setMobileOpen(true)}
        isCollapsed={isCollapsed}
      />

      {/* Main Content Area */}
      <main
        id="main-content-viewport"
        className={`flex-1 transition-all duration-300 pt-16 min-h-screen ${
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[280px]'
        }`}
      >
        <div className="max-w-[1280px] mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
