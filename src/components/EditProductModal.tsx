'use client';

import React from 'react';
import { Edit3, X, Check } from 'lucide-react';
import { ShopeeProductMapping } from '@/types/product';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ShopeeProductMapping | null;
  setProduct: React.Dispatch<React.SetStateAction<ShopeeProductMapping | null>>;
  onSave: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  setProduct,
  onSave,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Review & Edit Data Produk Shopee</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1 text-slate-700">Nama Produk (Shopee)</label>
            <input
              type="text"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700">Harga Modal (Rp)</label>
              <input
                type="number"
                value={product.basePrice}
                onChange={(e) => {
                  const newBase = Number(e.target.value);
                  const markup = product.markupPercent ?? 15;
                  const fixed = product.fixedMargin ?? 2500;
                  const newFinal = Math.round((newBase * (1 + markup / 100) + fixed) / 100) * 100;
                  setProduct({ ...product, basePrice: newBase, finalPrice: newFinal });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700">Harga Jual Shopee (Rp)</label>
              <input
                type="number"
                value={product.finalPrice}
                onChange={(e) =>
                  setProduct({ ...product, finalPrice: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-indigo-600 font-mono font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700">Berat (Gram)</label>
              <input
                type="number"
                value={product.weightGrams}
                onChange={(e) =>
                  setProduct({ ...product, weightGrams: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700">Deskripsi Lengkap</label>
            <textarea
              rows={6}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-[11px] leading-relaxed"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
