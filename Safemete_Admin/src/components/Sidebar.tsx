import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Flame,
  Users,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Package,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, hasRole } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'editor', 'support_staff'],
    },
    {
      name: 'Products & Equipment',
      path: '/products',
      icon: Flame,
      roles: ['super_admin', 'editor', 'support_staff'],
      badge: 'Active Catalog',
    },
    {
      name: 'User Management',
      path: '/users',
      icon: Users,
      roles: ['super_admin'],
      badge: 'Admin Only',
    },
    {
      name: 'Profile & Security',
      path: '/profile',
      icon: UserCheck,
      roles: ['super_admin', 'editor', 'support_staff'],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-main-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-40 bg-[#1A1E21] border-r border-[#2D3439] flex flex-col justify-between transition-all duration-300 ${
          isCollapsed ? 'w-[72px]' : 'w-[280px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#2D3439]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-[#E5252B] rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-[#E5252B]/20 shrink-0">
                <Flame className="w-5 h-5 fill-white/20 text-white" />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="font-black text-lg tracking-tight leading-none text-white flex items-center gap-1.5">
                    safemete
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-0.5">
                    Fire Safety System
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              type="button"
              id="btn-sidebar-collapse-toggle"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D3439] transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2" aria-label="Main Navigation">
            {navItems
              .filter((item) => !item.roles || item.roles.some((r) => hasRole(r as any)))
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    id={`nav-link-${item.path.replace('/', '')}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium transition-colors duration-200 group ${
                        isActive
                          ? 'bg-[#E5252B]/10 text-[#E5252B] border-l-4 border-[#E5252B] font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-[#2D3439]'
                      } ${isCollapsed ? 'justify-center px-0 border-l-0' : ''}`
                    }
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105`} />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between truncate">
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              item.badge === 'Admin Only'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                : 'bg-[#2D3439] text-gray-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-[#2D3439]">
          {!isCollapsed ? (
            <div className="p-3 rounded-lg bg-[#262C31] border border-[#2D3439] text-xs">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-gray-200">ISO 9001:2015 Compliant</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Logged in as <span className="font-semibold text-[#E5252B] capitalize">{user?.role?.replace('_', ' ')}</span>
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title="ISO 9001 Certified">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
