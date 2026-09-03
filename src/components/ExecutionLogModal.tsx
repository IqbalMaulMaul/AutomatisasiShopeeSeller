'use client';

import React from 'react';
import { Terminal, X, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface ExecutionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
  isPublishing: boolean;
  screenshotUrl: string | null;
}

export const ExecutionLogModal: React.FC<ExecutionLogModalProps> = ({
  isOpen,
  onClose,
  logs,
  isPublishing,
  screenshotUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-xs text-slate-900">
              Shopee Automation Bot — Live Execution Logs
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1 font-mono text-xs">
          {/* Terminal Console Box */}
          <div className="bg-slate-900 p-4 rounded-xl text-slate-200 space-y-1.5 max-h-60 overflow-y-auto shadow-inner border border-slate-800">
            {logs.map((line, idx) => (
              <div key={idx} className="leading-relaxed">
                {line}
              </div>
            ))}
            {isPublishing && (
              <div className="flex items-center gap-2 text-indigo-400 pt-2 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sedang menjalankan automasi browser Playwright...</span>
              </div>
            )}
          </div>

          {/* Proof Screenshot */}
          {screenshotUrl && (
            <div className="space-y-2 pt-1">
              <span className="font-bold text-slate-700 flex items-center gap-2 font-sans text-xs">
                <ImageIcon className="w-4 h-4 text-indigo-600" /> Bukti Hasil Eksekusi (Proof of Result):
              </span>
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-950">
                <img
                  src={screenshotUrl}
                  alt="Verification Proof"
                  className="w-full h-auto object-cover max-h-80"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
          >
            Tutup Konsol
          </button>
        </div>
      </div>
    </div>
  );
};
