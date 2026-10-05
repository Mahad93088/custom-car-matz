import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Car,
  ShoppingCart,
  Users,
  Star,
  FileText,
  Tag,
  Mail,
  Image,
  BarChart3,
  UserCog,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AdminLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onExitToStore: () => void;
  children: React.ReactNode;
}

export function AdminLayout({ currentTab, setCurrentTab, onExitToStore, children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || 'admin';

  // Role permissions mapping
  const canAccess = (section: string) => {
    if (role === 'super_admin' || role === 'admin') return true;
    if (role === 'order_manager') {
      return ['dashboard', 'orders', 'customers', 'products'].includes(section);
    }
    if (role === 'content_manager') {
      return ['dashboard', 'blog', 'pages', 'media', 'reviews'].includes(section);
    }
    return false;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'vehicles', label: 'Vehicle Database', icon: Car },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
    { id: 'reviews', label: 'Reviews Moderation', icon: Star },
    { id: 'blog', label: 'Blog & Guides', icon: FileText },
    { id: 'pages', label: 'Pages & Content', icon: FileText },
    { id: 'contacts', label: 'Contact Messages', icon: Mail },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'users', label: 'Users & Roles', icon: UserCog },
    { id: 'settings', label: 'Store Settings', icon: Settings },
    { id: 'audit-logs', label: 'Audit Logs', icon: ShieldAlert }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#111827] flex flex-col lg:flex-row antialiased">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#071A33] text-white p-4 border-b border-[#0D2A4A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm tracking-tight">Custom Car Mats CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-[#0D2A4A] text-gray-200"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#071A33] border-r border-[#0D2A4A] text-white flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-[#0D2A4A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0D2A4A] border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm block tracking-tight text-white">
                  CUSTOM CAR MATS
                </span>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Private Admin CMS
                </span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Staff Badge */}
          <div className="px-5 py-3 bg-[#040D1A] border-b border-[#0D2A4A] flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-amber-400 font-mono capitalize">{user?.role.replace('_', ' ')}</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
            {navItems.map(item => {
              const Icon = item.icon;
              const hasAccess = canAccess(item.id);
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  disabled={!hasAccess}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-[#071A33] shadow-md'
                      : hasAccess
                      ? 'text-gray-300 hover:text-white hover:bg-[#0D2A4A]'
                      : 'text-gray-600 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {!hasAccess && (
                    <span className="text-[9px] uppercase font-bold text-gray-500">Restricted</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#0D2A4A] bg-[#040D1A] space-y-2">
          <button
            onClick={onExitToStore}
            className="w-full py-2 px-3 bg-[#0D2A4A] hover:bg-[#153B66] text-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={logout}
            className="w-full py-2 px-3 text-red-400 hover:bg-red-950/40 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen p-6 sm:p-10 space-y-8">
        {children}
      </main>
    </div>
  );
}
