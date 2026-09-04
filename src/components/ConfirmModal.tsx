'use client';

import React from 'react';
import { AlertTriangle, Trash2, Info, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-inner">
            <Trash2 className="w-6 h-6" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-inner">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 shadow-md';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200 shadow-md';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 shadow-md';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-white border border-slate-100 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-5 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Header */}
        <div className="flex items-start gap-4">
          {getIcon()}
          <div className="space-y-1 pr-4">
            <h3 className="text-base font-bold text-slate-900 leading-snug">{title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{message}</p>
          </div>
        </div>

        {/* Action Button Group */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
