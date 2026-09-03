'use client';

import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  History,
  Store,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'extract' | 'staging' | 'history';
  setActiveTab: (tab: 'dashboard' | 'extract' | 'staging' | 'history') => void;
  productCount: number;
}

interface MenuItem {
  id: 'dashboard' | 'extract' | 'staging' | 'history';
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  productCount,
}) => {
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'extract',
      label: 'Ekstraksi Produk',
      icon: Sparkles,
    },
    {
      id: 'staging',
      label: 'Staging Area',
      icon: Layers,
      badge: productCount > 0 ? productCount : undefined,
    },
    {
      id: 'history',
      label: 'Riwayat Ekstraksi',
      icon: History,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 h-screen sticky top-0 shrink-0 z-30 shadow-sm">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <img
              src="/logo-jualin.png"
              alt="Jualin Logo"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none">Jualin</h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Shopee Automation Hub</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Connected Store Badge at Sidebar Bottom */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white space-y-2 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white">
            <Store className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] text-indigo-100 font-semibold block uppercase tracking-wider">
              Toko Terhubung
            </span>
            <h4 className="text-xs font-bold text-white truncate">Shopee: IqbalMaulMaul</h4>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[10px]">
          <span className="text-indigo-100">Status Sesi:</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-white font-bold border border-emerald-300/30">
            ● Aktif
          </span>
        </div>
      </div>
    </aside>
  );
};
