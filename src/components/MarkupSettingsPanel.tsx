'use client';

import React from 'react';
import { Calculator } from 'lucide-react';

interface MarkupSettingsPanelProps {
  markupPercent: number;
  setMarkupPercent: (val: number) => void;
  fixedMargin: number;
  setFixedMargin: (val: number) => void;
  showBrowserWindow: boolean;
  setShowBrowserWindow: (val: boolean) => void;
}

function formatRupiah(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const MarkupSettingsPanel: React.FC<MarkupSettingsPanelProps> = ({
  markupPercent,
  setMarkupPercent,
  fixedMargin,
  setFixedMargin,
  showBrowserWindow,
  setShowBrowserWindow,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Aturan Markup & Bot Demo</h3>
            <p className="text-xs text-slate-500 font-medium">Penyesuaian margin profit & bot</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Margin Percent Slider */}
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-bold">
              <span>Margin Keuntungan (%)</span>
              <span className="text-teal-600 font-mono font-black">{markupPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={markupPercent}
              onChange={(e) => setMarkupPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          {/* Fixed Admin Fee Input */}
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-bold">
              <span>Biaya Admin / Packaging Tambahan (Rp)</span>
              <span className="text-teal-700 font-mono">Rp {formatRupiah(fixedMargin)}</span>
            </div>
            <input
              type="number"
              step="500"
              value={fixedMargin}
              onChange={(e) => setFixedMargin(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          {/* Chrome Toggle Switch */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-700 font-bold">Buka Jendela Chrome Fisik (Local Demo)</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBrowserWindow}
                onChange={(e) => setShowBrowserWindow(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Formula Pill (Matching Mockup) */}
      <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/60 text-[11px] text-teal-800 font-mono">
        <strong>Rumus:</strong> (Harga Modal × (1 + {markupPercent}%)) + Rp {formatRupiah(fixedMargin)}
      </div>
    </div>
  );
};
