'use client';

import React from 'react';
import {
  Edit3,
  Trash2,
  FileSpreadsheet,
  Bot,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { ShopeeProductMapping } from '@/types/product';

interface ProductCardProps {
  product: ShopeeProductMapping;
  onEdit: (product: ShopeeProductMapping) => void;
  onDelete: (id: string) => void;
  onDownloadExcel: (id: string) => void;
  onPublishBot: (product: ShopeeProductMapping) => void;
}

function formatRupiah(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onDownloadExcel,
  onPublishBot,
}) => {
  const profitAmount = product.finalPrice - product.basePrice;
  const profitMarginPercent = product.basePrice > 0
    ? Math.round((profitAmount / product.basePrice) * 100)
    : 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
      {/* Left Block: Image & Basic Info */}
      <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
        {/* Product Image Thumbnail */}
        <div className="relative w-full sm:w-36 aspect-square sm:aspect-auto sm:h-36 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
          <img
            src={product.mainImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm ${
                product.status === 'PUBLISHED'
                  ? 'bg-emerald-600 text-white'
                  : product.status === 'UPLOADING'
                  ? 'bg-amber-600 text-white'
                  : product.status === 'FAILED'
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>

        {/* Info Breakdown */}
        <div className="space-y-2.5 flex-1">
          <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug" title={product.title}>
            {product.title}
          </h4>

          {/* Key Metric Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs py-1">
            <div>
              <span className="text-slate-400 text-[10px] block font-medium">Sumber</span>
              <span className="font-semibold text-slate-700">JakMall</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-medium">Kategori</span>
              <span className="font-semibold text-slate-700 truncate block">
                {product.categoryName || 'Elektronik'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-medium">Harga Modal</span>
              <span className="font-bold text-slate-900 font-mono">
                Rp {formatRupiah(product.basePrice)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-medium">Stok</span>
              <span className="font-bold text-emerald-600">
                {product.stock > 0 ? 'Tersedia' : 'Habis'} ({product.stock})
              </span>
            </div>
          </div>

          {/* Attribute Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-mono">
              ID: {product.sku}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
              {product.weightGrams} gr
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
              Varian: {product.variations?.[0]?.options?.length || 1}
            </span>
          </div>
        </div>
      </div>

      {/* Right Block: Estimated Selling Price, Profit Badge & Actions */}
      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
        <div className="text-left lg:text-right">
          <span className="text-slate-400 text-[10px] font-medium block uppercase tracking-wider">
            Harga Jual (Estimasi)
          </span>
          <div className="text-lg font-black text-indigo-600 font-mono">
            Rp {formatRupiah(product.finalPrice)}
          </div>
          <div className="text-xs font-bold text-emerald-600">
            Keuntungan: Rp {formatRupiah(profitAmount)} ({profitMarginPercent}%)
          </div>
        </div>

        {/* Action Button Group */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Lihat Detail & Edit"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Detail</span>
          </button>

          <button
            onClick={() => onPublishBot(product)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 active:scale-95"
            title="Jalankan Bot Automasi Shopee"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Siap Upload</span>
          </button>

          <button
            onClick={() => onDownloadExcel(product.id)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
            title="Download Template Shopee Excel Produk Ini"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-rose-600 transition-all border border-slate-200"
            title="Hapus Produk"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
