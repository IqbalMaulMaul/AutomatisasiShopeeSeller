'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  History,
  Store,
  Pencil,
  Check,
  X,
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
  const [storeName, setStoreName] = useState<string>('IqbalMaulMaul');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const savedStore = localStorage.getItem('shopee_store_name');
    if (savedStore) {
      setStoreName(savedStore);
    } else if (process.env.NEXT_PUBLIC_SHOPEE_STORE_NAME) {
      setStoreName(process.env.NEXT_PUBLIC_SHOPEE_STORE_NAME);
    }
  }, []);

  const handleStartEdit = () => {
    setTempName(storeName);
    setIsEditing(true);
  };

  const handleSaveStore = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = tempName.trim();
    if (trimmed) {
      setStoreName(trimmed);
      localStorage.setItem('shopee_store_name', trimmed);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

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
          <div className="w-11 h-11 shrink-0 flex items-center justify-center">
            <img
              src="/logo-jualin.png"
              alt="Jualin Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none">Jualin</h1>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="overflow-hidden min-w-0">
              <span className="text-[10px] text-indigo-100 font-semibold block uppercase tracking-wider">
                Toko Terhubung
              </span>
              {isEditing ? (
                <form onSubmit={handleSaveStore} className="flex items-center gap-1 mt-0.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full bg-white text-slate-900 text-xs px-2 py-0.5 rounded font-medium focus:outline-none"
                    placeholder="Nama Toko"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1 hover:bg-white/20 rounded text-emerald-300 transition-colors"
                    title="Simpan"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="p-1 hover:bg-white/20 rounded text-rose-300 transition-colors"
                    title="Batal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <h4 className="text-xs font-bold text-white truncate" title={`Shopee: ${storeName}`}>
                  Shopee: {storeName}
                </h4>
              )}
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleStartEdit}
              className="p-1.5 hover:bg-white/20 rounded-lg text-indigo-100 hover:text-white transition-colors shrink-0"
              title="Ubah Nama Toko"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[10px]">
          <span className="text-indigo-100 text-[10px]">Status Portal</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-white font-bold border border-emerald-300/30">
            ● Aktif
          </span>
        </div>
      </div>
    </aside>
  );
};
