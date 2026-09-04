'use client';

import React from 'react';
import {
  ExternalLink,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onDownloadAllExcel: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  productCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Jualin ➔ Shopee Automation Hub',
  onDownloadAllExcel,
  onRefresh,
  isRefreshing = false,
  productCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold text-slate-900 leading-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://seller.shopee.co.id"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-semibold shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
          <span>Shopee Seller Portal</span>
        </a>

        <button
          onClick={onDownloadAllExcel}
          disabled={productCount === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="w-4 h-4 text-indigo-100" />
          <span>Export All (Shopee Excel)</span>
        </button>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 active:scale-95 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          title="Refresh Data Produk"
        >
          <RefreshCw className={`w-4 h-4 transition-all ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>
    </header>
  );
};
