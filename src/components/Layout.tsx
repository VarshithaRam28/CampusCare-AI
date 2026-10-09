import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import NotificationPanel from './NotificationPanel';
import { 
  LayoutDashboard, PlusCircle, ClipboardList, Bot, 
  MapPin, Bell, Menu, X, RefreshCw, Zap
} from 'lucide-react';

const Layout: React.FC = () => {
  const { role, setRole, notifications, resetData } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const studentNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Issue', path: '/report', icon: PlusCircle },
    { name: 'My Complaints', path: '/tracking', icon: ClipboardList },
    { name: 'AI Assistant', path: '/assistant', icon: Bot },
  ];

  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'All Complaints', path: '/tracking', icon: ClipboardList },
    { name: 'Heat Map', path: '/heatmap', icon: MapPin },
    { name: 'AI Assistant', path: '/assistant', icon: Bot },
  ];

  const navItems = role === 'student' ? studentNav : adminNav;

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    return current ? current.name : 'CampusCare AI';
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 mb-8 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">CAMPUSCARE</span>
          <span className="text-[10px] font-bold bg-white/10 px-1.5 py-0.5 rounded text-purple-400 uppercase border border-purple-500/20">AI</span>
        </Link>

        {/* Role Selector */}
        <div className="flex bg-[#0B1120] p-1 rounded-xl mb-8 border border-white/5">
          <button
            onClick={() => setRole('student')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
              role === 'student' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
              role === 'admin' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/20 glow-blue shadow-[inset_4px_0_0_0_rgba(59,130,246,1)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-400' : ''} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <button 
          onClick={resetData}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-colors border border-white/5"
        >
          <RefreshCw size={16} /> Reset Demo Data
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#060B14] text-gray-100 overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[260px] flex-col bg-[#0F172A]/80 backdrop-blur-xl border-r border-white/10 z-20 shadow-2xl">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-72 max-w-[80%] bg-[#0F172A] border-r border-white/10 shadow-2xl flex flex-col">
            <button 
              className="absolute top-5 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0F172A]/50 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-4 relative">
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              <span className="text-xs font-medium text-gray-300 capitalize">{role} Mode</span>
            </div>
            
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-[#0F172A] rounded-full animate-pulse"></span>
              )}
            </button>
            <NotificationPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-[#060B14] via-[#091122] to-[#0A0718]">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl animate-in fade-in duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
