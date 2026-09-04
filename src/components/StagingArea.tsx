'use client';

import React, { useState } from 'react';
import { Layers, Search, ShoppingBag } from 'lucide-react';
import { ShopeeProductMapping } from '@/types/product';
import { ProductCard } from './ProductCard';

interface StagingAreaProps {
  products: ShopeeProductMapping[];
  onEdit: (product: ShopeeProductMapping) => void;
  onDelete: (id: string) => void;
  onDownloadExcel: (id: string) => void;
}

export const StagingArea: React.FC<StagingAreaProps> = ({
  products,
  onEdit,
  onDelete,
  onDownloadExcel,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ready' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const readyCount = products.filter(
    (p) => p.status === 'EXTRACTED' || p.status === 'REVIEWED'
  ).length;
  const publishedCount = products.filter((p) => p.status === 'PUBLISHED').length;

  const filteredProducts = products
    .filter((p) => {
      if (activeTab === 'ready') return p.status === 'EXTRACTED' || p.status === 'REVIEWED';
      if (activeTab === 'published') return p.status === 'PUBLISHED';
      return true;
    })
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      return (
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Staging Area & Hasil Pemetaan</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 font-mono">
                {products.length} Produk
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Review dan publish data produk ke Shopee</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'ready'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Siap Upload ({readyCount})
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'published'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terupload ({publishedCount})
          </button>
        </div>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">Belum Ada Produk di Staging Area</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Gunakan form ekstraksi di atas untuk menyedot data produk dari JakMall ke area ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              onDownloadExcel={onDownloadExcel}
            />
          ))}
        </div>
      )}
    </div>
  );
};
