'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ExtractionPanel } from '@/components/ExtractionPanel';
import { MarkupSettingsPanel } from '@/components/MarkupSettingsPanel';
import { StagingArea } from '@/components/StagingArea';
import { ExtractionHistory } from '@/components/ExtractionHistory';
import { EditProductModal } from '@/components/EditProductModal';
import { ConfirmModal } from '@/components/ConfirmModal';
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
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchProducts();
      showToast('Data produk berhasil diperbarui!');
    } catch {
      showToast('Gagal memuat ulang data produk.', 'error');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
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

  const onRequestDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await fetch(`/api/products/${deleteTargetId}`, { method: 'DELETE' });
      showToast('Produk berhasil dihapus dari staging.');
      fetchProducts();
    } catch (err) {
      showToast('Gagal menghapus produk.', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const onRequestDeleteAll = () => {
    if (products.length === 0) return;
    setIsDeleteAllConfirmOpen(true);
  };

  const executeDeleteAll = async () => {
    try {
      const res = await fetch('/api/products', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Seluruh produk staging berhasil dihapus!');
        fetchProducts();
      } else {
        showToast(data.error || 'Gagal menghapus produk.', 'error');
      }
    } catch {
      showToast('Gagal menghapus produk.', 'error');
    } finally {
      setIsDeleteAllConfirmOpen(false);
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
        return 'Jualin App | Katalog & Automatisasi Shopee';
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
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          productCount={products.length}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
          {activeSidebarTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-7 flex flex-col">
                  <ExtractionPanel
                    urlInput={urlInput}
                    setUrlInput={setUrlInput}
                    onScrape={handleScrape}
                    isScraping={isScraping}
                  />
                </div>
                <div className="lg:col-span-5 flex flex-col">
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
                onDelete={onRequestDelete}
                onDeleteAll={onRequestDeleteAll}
                onDownloadExcel={handleDownloadExcel}
              />
            </>
          )}

          {activeSidebarTab === 'extract' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <ExtractionPanel
                  urlInput={urlInput}
                  setUrlInput={setUrlInput}
                  onScrape={handleScrape}
                  isScraping={isScraping}
                />
              </div>
              <div className="lg:col-span-5 flex flex-col">
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
              onDelete={onRequestDelete}
              onDeleteAll={onRequestDeleteAll}
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
          © 2026 Jualin Automation Hub. IqbalMaulanaDhiti
        </footer>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        setProduct={setSelectedProduct}
        onSave={handleSaveEdit}
      />

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Hapus Produk Staging?"
        message="Apakah Anda yakin ingin menghapus produk ini dari daftar staging? Produk yang dihapus tidak akan dapat di-export ke Shopee."
        confirmText="Ya, Hapus Produk"
        cancelText="Batal"
        type="danger"
        onConfirm={executeDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <ConfirmModal
        isOpen={isDeleteAllConfirmOpen}
        title="Hapus Semua Produk Staging?"
        message={`Apakah Anda yakin ingin menghapus seluruh (${products.length}) produk dari daftar staging? Seluruh data hasil ekstraksi akan dibersihkan agar tidak masuk ke file Excel.`}
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
        type="danger"
        onConfirm={executeDeleteAll}
        onCancel={() => setIsDeleteAllConfirmOpen(false)}
      />

      <Toast toast={toast} />
    </div>
  );
}
