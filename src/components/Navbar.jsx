import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, CheckCircle2, ChevronRight, User, Settings, LogOut, Database } from 'lucide-react';
import { NOTIFICATIONS } from '../data/initialData';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onOpenMobileSidebar,
  currentUser = { name: 'John Doe', role: 'FICO User', email: 'john.doe@stackly.erp' },
  onOpenProfile,
  onOpenCompanySettings,
  onSignOut,
  dbStatus = { database: 'MySQL 8.0', status: 'online' }
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Calculate initials from name
  const initials = currentUser.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'JD';

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar - matching exact screenshot */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search here..."
            className="w-full pl-4 pr-10 py-1.5 text-[13.5px] bg-white border border-[#d5dde8] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Real-Time Database Connection Badge */}
        <div
          title={`Connected to ${dbStatus?.database || 'MySQL'} (${dbStatus?.database_target || '127.0.0.1:3306/saperp'})`}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-[11px] font-semibold shadow-2xs"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>{dbStatus?.database || 'MySQL 8.0'}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600 stroke-[1.8]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                      item.unread ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-800 leading-snug">{item.title}</p>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors text-left"
          >
            {/* Circle Avatar with initials */}
            <div className="w-9 h-9 rounded-full bg-[#0d1a38] text-white font-bold text-xs flex items-center justify-center tracking-tight shadow-xs">
              {initials}
            </div>
            {/* User name & role */}
            <div className="hidden sm:block leading-tight">
              <div className="font-semibold text-[13.5px] text-slate-900">{currentUser.name}</div>
              <div className="text-[11.5px] text-slate-500 font-normal">{currentUser.role}</div>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="font-semibold text-sm text-slate-800">{currentUser.name}</p>
                <p className="text-xs text-slate-500">{currentUser.role}</p>
              </div>

              {/* 1. Profile & Account Button */}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" /> Profile & Account
              </button>

              {/* 2. Company Settings Button */}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onOpenCompanySettings) onOpenCompanySettings();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" /> Company Settings
              </button>

              <div className="border-t border-slate-100 my-1"></div>

              {/* 3. Sign Out Button */}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onSignOut) onSignOut();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
