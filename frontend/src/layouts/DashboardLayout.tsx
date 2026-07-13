import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { 
  LayoutDashboard, Video, History, BarChart3, Settings, 
  ShieldAlert, LogOut, Menu, X, Bell, User, Cpu 
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Workspace', path: '/workspace', icon: Video },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile Settings', path: '/profile', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/workspace')) return 'ISL Recognition Workspace';
    if (path.startsWith('/history')) return 'Translation History';
    if (path.startsWith('/analytics')) return 'Analytics Dashboard';
    if (path.startsWith('/profile')) return 'Profile & Settings';
    if (path.startsWith('/admin')) return 'Administration Panel';
    return 'ISL Capture';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Collapsible Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-sidebar flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu className="w-4.5 h-4.5 text-white animate-pulse" />
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              ISL Capture
            </span>
          </div>
          <button 
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}

          {/* Admin Panel Link */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                location.pathname === '/admin'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/5 bg-slate-900/20">
          <div className="flex items-center gap-3 px-2 py-1.5 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role} Profile</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 glass-nav z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-300"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg lg:text-xl font-semibold text-slate-200 tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Toggle */}
            <div className="relative">
              <button 
                className="p-2 rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/5 bg-slate-900 shadow-xl p-4 z-40">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                    <h3 className="text-sm font-semibold text-slate-200">System Notifications</h3>
                    <button className="text-xs text-blue-400 hover:underline">Mark all read</button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                      <p className="text-xs font-semibold text-slate-300">Model accuracy updated</p>
                      <p className="text-[10px] text-slate-500 mt-1">Version v1.2.0 is active now. Confidence margins reduced.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                      <p className="text-xs font-semibold text-slate-300">Recent prediction logged</p>
                      <p className="text-[10px] text-slate-500 mt-1">A negation gesture was identified with 91% accuracy.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1 rounded-full border border-white/5 hover:bg-white/5 pr-3 transition-all"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-slate-300">{user?.name}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-white/5 bg-slate-900 shadow-xl py-2 z-40">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-white/5 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/5 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-950/95">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
