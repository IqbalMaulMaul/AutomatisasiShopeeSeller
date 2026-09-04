'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ExtractionPanel } from '@/components/ExtractionPanel';
import { MarkupSettingsPanel } from '@/components/MarkupSettingsPanel';
import { StagingArea } from '@/components/StagingArea';
import { ExtractionHistory } from '@/components/ExtractionHistory';
import { EditProductModal } from '@/components/EditProductModal';
import { Toast } from '@/components/Toast';
import { ShopeeProductMapping } from '@/types/product';

export default function DashboardPage() {
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    'dashboard' | 'extract' | 'staging' | 'history'
  >('dashboard');

  const [urlInput, setUrlInput] = useState('');
  const [markupPercent, setMarkupPercent] = useState<number>(15);
  const [fixedMargin, setFixedMargin] = useState<number>(2500);
  const [isScraping, setIsScraping] = useState(false);
  const [products, setProducts] = useState<ShopeeProductMapping[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ShopeeProductMapping | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const sampleUrls = [
    {
      name: 'TWS Bluetooth Earphone V5.3',
      url: 'https://www.jakmall.com/tws-audio/tws-bluetooth-53-wireless-earphone-waterproof',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&auto=format&fit=crop&q=60',
    },
    {
      name: 'Smartwatch IP68 Heart Rate',
      url: 'https://www.jakmall.com/wearables/smartwatch-fitness-tracker-ip68-waterproof',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=100&auto=format&fit=crop&q=60',
    },
    {
      name: 'Fast Charging Cable Type-C 65W',
      url: 'https://www.jakmall.com/gadget-acc/kabel-data-type-c-to-type-c-65w-braided',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&auto=format&fit=crop&q=60',
    },
  ];

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleScrape = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) {
      showToast('Masukkan URL produk JakMall terlebih dahulu.', 'error');
      return;
    }

    setIsScraping(true);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          markupPercent,
          fixedMargin,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Produk JakMall berhasil diekstraksi & dinormalisasi!');
        setUrlInput('');
        fetchProducts();
      } else {
        showToast(data.error || 'Gagal mengekstrak produk.', 'error');
      }
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message || 'Terjadi kesalahan jaringan.', 'error');
    } finally {
      setIsScraping(false);
    }
  };

  const handleDownloadExcel = (productId?: string) => {
    const url = productId ? `/api/export-excel?id=${productId}` : '/api/export-excel';
    window.open(url, '_blank');
    showToast('File template Shopee Mass Upload sedang diunduh.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini dari daftar staging?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      showToast('Produk dihapus.');
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedProduct),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Perubahan produk berhasil disimpan!');
        setIsEditModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      showToast('Gagal menyimpan perubahan.', 'error');
    }
  };

  const getPageTitle = () => {
    switch (activeSidebarTab) {
      case 'extract':
        return 'Ekstraksi Produk JakMall';
      case 'staging':
        return 'Staging Area Produk';
      case 'history':
        return 'Riwayat Ekstraksi';
      default:
        return 'Jualin ➔ Shopee Automation Hub';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans">
      <Sidebar
        activeTab={activeSidebarTab}
        setActiveTab={setActiveSidebarTab}
        productCount={products.length}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={getPageTitle()}
          onDownloadAllExcel={() => handleDownloadExcel()}
          onRefresh={fetchProducts}
          productCount={products.length}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
          {activeSidebarTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <ExtractionPanel
                    urlInput={urlInput}
                    setUrlInput={setUrlInput}
                    onScrape={handleScrape}
                    isScraping={isScraping}
                    sampleUrls={sampleUrls}
                  />
                </div>
                <div className="lg:col-span-5">
                  <MarkupSettingsPanel
                    markupPercent={markupPercent}
                    setMarkupPercent={setMarkupPercent}
                    fixedMargin={fixedMargin}
                    setFixedMargin={setFixedMargin}
                  />
                </div>
              </div>

              <StagingArea
                products={products}
                onEdit={(p) => {
                  setSelectedProduct(p);
                  setIsEditModalOpen(true);
                }}
                onDelete={handleDelete}
                onDownloadExcel={handleDownloadExcel}
              />
            </>
          )}

          {activeSidebarTab === 'extract' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ExtractionPanel
                  urlInput={urlInput}
                  setUrlInput={setUrlInput}
                  onScrape={handleScrape}
                  isScraping={isScraping}
                  sampleUrls={sampleUrls}
                />
              </div>
              <div className="lg:col-span-5">
                <MarkupSettingsPanel
                  markupPercent={markupPercent}
                  setMarkupPercent={setMarkupPercent}
                  fixedMargin={fixedMargin}
                  setFixedMargin={setFixedMargin}
                />
              </div>
            </div>
          )}

          {activeSidebarTab === 'staging' && (
            <StagingArea
              products={products}
              onEdit={(p) => {
                setSelectedProduct(p);
                setIsEditModalOpen(true);
              }}
              onDelete={handleDelete}
              onDownloadExcel={handleDownloadExcel}
            />
          )}

          {activeSidebarTab === 'history' && (
            <ExtractionHistory
              products={products}
              onDownloadExcel={handleDownloadExcel}
            />
          )}
        </main>

        <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200">
          © 2026 Jualin Automation Hub. All rights reserved.
        </footer>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        setProduct={setSelectedProduct}
        onSave={handleSaveEdit}
      />

      <Toast toast={toast} />
    </div>
  );
}
