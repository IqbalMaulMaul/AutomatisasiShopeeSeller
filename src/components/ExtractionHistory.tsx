'use client';

import React from 'react';
import { History, FileSpreadsheet, Bot, ExternalLink, Calendar } from 'lucide-react';
import { ShopeeProductMapping } from '@/types/product';

interface ExtractionHistoryProps {
  products: ShopeeProductMapping[];
  onDownloadExcel: (id: string) => void;
  onPublishBot: (product: ShopeeProductMapping) => void;
}

function formatRupiah(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const ExtractionHistory: React.FC<ExtractionHistoryProps> = ({
  products,
  onDownloadExcel,
  onPublishBot,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Riwayat Ekstraksi Produk</h3>
            <p className="text-xs text-slate-500 font-medium">Log historis pencatatan ekstraksi katalog</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
          Total: {products.length} Entri
        </span>
      </div>

      {products.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Belum ada riwayat ekstraksi produk.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Produk & SKU</th>
                <th className="px-4 py-3">Sumber & Tanggal</th>
                <th className="px-4 py-3">Harga Modal</th>
                <th className="px-4 py-3">Harga Shopee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 flex items-center gap-3">
                    <img
                      src={p.mainImage}
                      alt={p.title}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="max-w-xs">
                      <span className="font-bold text-slate-900 block truncate" title={p.title}>
                        {p.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-800 block">JakMall</span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Realtime Sync
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-600 font-bold">
                    Rp {formatRupiah(p.basePrice)}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-indigo-600 font-black">
                    Rp {formatRupiah(p.finalPrice)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : p.status === 'FAILED'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => onPublishBot(p)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px]"
                      title="Jalankan Bot Automasi"
                    >
                      Bot Upload
                    </button>
                    <button
                      onClick={() => onDownloadExcel(p.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] border border-slate-200"
                      title="Export Excel"
                    >
                      Excel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
