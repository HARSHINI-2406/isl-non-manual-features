import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import { 
  LayoutDashboard, Video, History, BarChart3, Settings, 
  ShieldAlert, LogOut, Menu, X, Bell, User, Cpu, Layers, Sun, Moon, Eye, Type
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, fontSize, setTheme, setFontSize } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Translator', path: '/workspace', icon: Video },
    { name: 'Architecture Hub', path: '/architecture', icon: Layers },
    { name: 'History Logs', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'System Overview';
    if (path.startsWith('/workspace')) return 'Live Translation Workspace';
    if (path.startsWith('/architecture')) return 'Technical Architecture Deck';
    if (path.startsWith('/history')) return 'Prediction History Logs';
    if (path.startsWith('/analytics')) return 'Analytics Dashboard';
    if (path.startsWith('/profile')) return 'Profile & Platform Settings';
    if (path.startsWith('/admin')) return 'Administration Panel';
    return 'SignLink AI';
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Collapsible Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 theme-sidebar flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b theme-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu className="w-4.5 h-4.5 text-white animate-pulse" />
            </div>
            <span className="font-bold text-lg tracking-tight theme-text-main">
              SignLink AI
            </span>
          </div>
          <button 
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-500/10 theme-text-muted"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accent Bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-600 opacity-60"></div>

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
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'theme-text-muted hover:bg-slate-500/5 hover:theme-text-main'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'theme-text-light'}`} />
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
                  ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-700/20'
                  : 'theme-text-muted hover:bg-slate-500/5 hover:theme-text-main'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <ShieldAlert className="w-5 h-5 text-indigo-500" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t theme-border theme-bg-sub">
          <div className="flex items-center gap-3 px-2 py-1.5 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-600 flex items-center justify-center font-bold text-white shadow-md">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold theme-text-main truncate">{user?.name}</p>
              <p className="text-xs theme-text-muted truncate capitalize">{user?.role} Profile</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border theme-border theme-text-muted hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 theme-nav z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-500/10 theme-text-main"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg lg:text-xl font-bold theme-text-main tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Accessibility / Theme Adjuster Dropdown */}
            <div className="relative">
              <button 
                className="p-2.5 rounded-xl border theme-border hover:bg-slate-500/5 theme-text-muted hover:theme-text-main transition-all flex items-center gap-1.5"
                onClick={() => {
                  setIsAccessibilityOpen(!isAccessibilityOpen);
                  setIsNotificationsOpen(false);
                  setIsProfileOpen(false);
                }}
                aria-label="Accessibility Settings"
                title="Accessibility Preferences"
              >
                <Sun className="w-4 h-4 hidden dark:hidden contrast:hidden light:block" />
                <Moon className="w-4 h-4 hidden dark:block" />
                <Eye className="w-4 h-4 hidden contrast:block" />
                <span className="hidden sm:inline text-xs font-semibold">Preferences</span>
              </button>

              {isAccessibilityOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl border theme-border theme-bg-card shadow-xl p-5 z-45">
                  <div className="pb-3 border-b theme-border mb-4">
                    <h3 className="text-sm font-bold theme-text-main flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-indigo-500" />
                      Accessibility Settings
                    </h3>
                  </div>

                  {/* Theme Mode Selector */}
                  <div className="space-y-2 mb-4">
                    <label className="text-[10px] theme-text-light font-bold uppercase tracking-wider block">Visual Theme</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => setTheme('light')}
                        className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all ${
                          theme === 'light' 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'theme-bg-sub border-transparent theme-text-muted hover:theme-text-main'
                        }`}
                      >
                        Light
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all ${
                          theme === 'dark' 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'theme-bg-sub border-transparent theme-text-muted hover:theme-text-main'
                        }`}
                      >
                        Dark
                      </button>
                      <button 
                        onClick={() => setTheme('contrast')}
                        className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all ${
                          theme === 'contrast' 
                            ? 'bg-yellow-500 text-black border-yellow-500' 
                            : 'theme-bg-sub border-transparent theme-text-muted hover:theme-text-main'
                        }`}
                      >
                        Contrast
                      </button>
                    </div>
                  </div>

                  {/* Font Size Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] theme-text-light font-bold uppercase tracking-wider block flex items-center gap-1">
                      <Type className="w-3 h-3" /> Text Size
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => setFontSize('sm')}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                          fontSize === 'sm' 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'theme-bg-sub border-transparent theme-text-muted hover:theme-text-main'
                        }`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setFontSize('base')}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                          fontSize === 'base' 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'theme-bg-sub border-transparent theme-text-muted hover:theme-text-main'
                        }`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setFontSize('lg')}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                          fontSize === 'lg' 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'theme-bg-sub border-transparent theme-text-muted hover:theme-text-main'
                        }`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Toggle */}
            <div className="relative">
              <button 
                className="p-2.5 rounded-xl border theme-border hover:bg-slate-500/5 theme-text-muted hover:theme-text-main transition-all relative"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                  setIsAccessibilityOpen(false);
                }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border theme-border theme-bg-card shadow-xl p-4 z-40">
                  <div className="flex items-center justify-between pb-3 border-b theme-border mb-3">
                    <h3 className="text-sm font-semibold theme-text-main">System Notifications</h3>
                    <button className="text-xs text-indigo-500 hover:underline">Mark all read</button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                    <div className="p-2.5 rounded-xl theme-bg-sub hover:opacity-90 transition-all">
                      <p className="text-xs font-semibold theme-text-main">Pipeline calibration updated</p>
                      <p className="text-[10px] theme-text-muted mt-1">Dual-hand gesture tracking ratios initialized at 3Hz capture rate.</p>
                    </div>
                    <div className="p-2.5 rounded-xl theme-bg-sub hover:opacity-90 transition-all">
                      <p className="text-xs font-semibold theme-text-main">NMF detection threshold active</p>
                      <p className="text-[10px] theme-text-muted mt-1">Telemetry log filters ignore predictions with confidence under 80%.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1 rounded-full border theme-border hover:bg-slate-500/5 pr-3 transition-all"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                  setIsAccessibilityOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-600 flex items-center justify-center font-bold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium theme-text-main">{user?.name}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-2xl border theme-border theme-bg-card shadow-xl py-2 z-40">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-2.5 text-sm theme-text-muted hover:bg-slate-500/5 hover:theme-text-main transition-all"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 px-4 py-2.5 text-sm theme-text-muted hover:bg-slate-500/5 hover:theme-text-main transition-all"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t theme-border my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-all text-left font-medium"
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
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 theme-bg-sub">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
