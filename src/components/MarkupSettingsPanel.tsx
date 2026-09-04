'use client';

import React from 'react';
import { Calculator } from 'lucide-react';

interface MarkupSettingsPanelProps {
  markupPercent: number;
  setMarkupPercent: (val: number) => void;
  fixedMargin: number;
  setFixedMargin: (val: number) => void;
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
            <h3 className="text-base font-bold text-slate-900">Aturan Markup Produk</h3>
            <p className="text-xs text-slate-500 font-medium">Penyesuaian margin profit</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Margin Percent Input */}
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-bold">
              <span>Margin Keuntungan (%)</span>
              <span className="text-teal-600 font-mono font-black">{markupPercent}%</span>
            </div>
            <input
              type="number"
              min="0"
              max="500"
              step="1"
              value={markupPercent === 0 ? '' : markupPercent}
              onChange={(e) => {
                const raw = e.target.value;
                setMarkupPercent(raw === '' ? 0 : Math.max(0, Number(raw)));
              }}
              placeholder="0"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
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
              min="0"
              step="500"
              value={fixedMargin === 0 ? '' : fixedMargin}
              onChange={(e) => {
                const raw = e.target.value;
                setFixedMargin(raw === '' ? 0 : Math.max(0, Number(raw)));
              }}
              placeholder="0"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
