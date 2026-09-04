'use client';

import React from 'react';
import {
  Link as LinkIcon,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface SampleUrl {
  name: string;
  url: string;
  image?: string;
}

interface ExtractionPanelProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  onScrape: (e?: React.FormEvent) => void;
  isScraping: boolean;
  sampleUrls?: SampleUrl[];
}

export const ExtractionPanel: React.FC<ExtractionPanelProps> = ({
  urlInput,
  setUrlInput,
  onScrape,
  isScraping,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
            <LinkIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Ekstraksi Produk JakMall</h3>
            <p className="text-xs text-slate-500 font-medium">Tempel link katalog produk untuk diproses</p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={onScrape} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Tempel URL katalog/produk JakMall (cth: https://www.jakmall.com/...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isScraping}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 active:scale-95"
          >
            {isScraping ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Mengekstrak...</span>
              </>
            ) : (
              <>
                <span>Ekstrak & Normalisasi</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
