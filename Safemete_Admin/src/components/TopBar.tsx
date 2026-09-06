import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  Check,
  ChevronRight,
  ShieldAlert,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { formatCategory } from '../lib/utils';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  isCollapsed: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu, isCollapsed }) => {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Breadcrumb
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const name = segment === 'products' ? 'Products & Equipment' : segment === 'users' ? 'User Management' : segment === 'profile' ? 'Profile & Security' : segment.charAt(0).toUpperCase() + segment.slice(1);
    return { name, url, isLast: index === pathSegments.length - 1 };
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    success('Logged out', 'You have securely signed out of SAFEMETE portal.');
  };

  const mockNotifications = [
    {
      id: 'n-1',
      title: 'Low Pressure Warning',
      desc: 'Annual maintenance cycle due for HydroReel System 30m.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 'n-2',
      title: '2FA Policy Active',
      desc: 'MFA requirement enforced for all operational managers.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'n-3',
      title: 'Database Backup Completed',
      desc: 'Encrypted catalog snapshot archived to secondary vault.',
      time: '3h ago',
      unread: true,
    },
  ];

  return (
    <header
      id="app-topbar"
      className={`fixed top-0 right-0 z-30 h-16 bg-[#202528] border-b border-[#2D3439] flex items-center justify-between px-4 sm:px-8 transition-all duration-300 ${
        isCollapsed ? 'left-0 lg:left-[72px]' : 'left-0 lg:left-[280px]'
      }`}
    >
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          id="btn-mobile-menu-trigger"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D3439] transition-colors cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail matching Design */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
          <span>Pages</span>
          <span className="text-gray-600">/</span>
          {breadcrumbItems.map((item) => (
            <React.Fragment key={item.url}>
              {item.isLast ? (
                <span className="text-white font-medium truncate max-w-[200px]" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link to={item.url} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                  <span className="text-gray-600">/</span>
                </>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Theme Toggle */}
        <button
          type="button"
          id="btn-theme-toggle"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D3439] transition-all cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifMenuRef}>
          <button
            type="button"
            id="btn-notifications-toggle"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D3439] transition-all relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E5252B] rounded-full border-2 border-[#202528]" />
            )}
          </button>

          {notificationsOpen && (
            <div
              id="notifications-dropdown-menu"
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#262C31] border border-[#2D3439] shadow-2xl p-4 text-gray-100 z-50 animate-fade-in"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2D3439]">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">System Alerts</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E5252B]/10 text-[#E5252B] border border-[#E5252B]/20">
                    {unreadNotifications} new
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-clear-notifications"
                  onClick={() => setUnreadNotifications(0)}
                  className="text-xs text-gray-400 hover:text-[#E5252B] transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-[#2D3439] mt-1 max-h-72 overflow-y-auto custom-scroll">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="py-3 flex items-start gap-3 group">
                    <div className="p-2 rounded-lg bg-[#1A1E21] text-amber-400 border border-[#2D3439] shrink-0 mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white truncate">{notif.title}</p>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{notif.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Section matching Professional Polish Design */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            id="btn-user-avatar-menu"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-[#2D3439] transition-all cursor-pointer group"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-white leading-none">
                {user?.name || 'Marcus Vancore'}
              </span>
              <span className="text-[11px] text-[#E5252B] font-bold uppercase tracking-wider mt-1">
                {user?.role === 'super_admin'
                  ? 'Super Admin'
                  : user?.role === 'support_staff'
                    ? 'Support Staff'
                    : 'Catalog Editor'}
              </span>
            </div>

            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#2D3439] shadow-md"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#E5252B] to-[#C22126] border-2 border-[#2D3439] flex items-center justify-center font-bold text-white text-sm shadow-md">
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'MV'}
              </div>
            )}
          </button>

          {userMenuOpen && (
            <div
              id="user-dropdown-menu"
              className="absolute right-0 mt-2 w-64 rounded-xl bg-[#262C31] border border-[#2D3439] shadow-2xl p-2 text-gray-100 z-50 animate-fade-in"
            >
              {/* User overview */}
              <div className="p-3 rounded-lg bg-[#1A1E21] border border-[#2D3439] mb-2">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E5252B]/10 text-[#E5252B] border border-[#E5252B]/20 uppercase">
                    {user?.role?.replace('_', ' ')}
                  </span>
                  {user?.mfaEnabled && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      2FA Active
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="space-y-1">
                <Link
                  to="/profile"
                  id="menu-item-profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 hover:bg-[#1A1E21] hover:text-white transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Profile & Settings
                </Link>

                <div className="my-1 border-t border-[#2D3439]" />

                <button
                  type="button"
                  id="menu-item-logout"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#E5252B] hover:bg-[#E5252B]/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
