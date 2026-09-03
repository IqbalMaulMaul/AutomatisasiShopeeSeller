'use client';

import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 px-4.5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-bold border transition-all animate-bounce ${
        toast.type === 'success'
          ? 'bg-slate-900 text-white border-emerald-500'
          : 'bg-slate-900 text-white border-rose-500'
      }`}
    >
      {toast.type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
      )}
      <span>{toast.message}</span>
    </div>
  );
};
