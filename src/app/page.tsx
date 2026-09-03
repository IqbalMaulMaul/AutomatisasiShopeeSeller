'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Download,
  Bot,
  RefreshCw,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
  Sliders,
  FileSpreadsheet,
  Terminal,
  Image as ImageIcon,
  Check,
  X,
  ShieldCheck,
  Zap,
  TrendingUp,
  PackageCheck,
  PackagePlus,
  Rocket,
  Search,
} from 'lucide-react';
import { ShopeeProductMapping, PublishResult } from '@/types/product';

function formatRupiah(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function DashboardPage() {
  const [urlInput, setUrlInput] = useState('');
  const [markupPercent, setMarkupPercent] = useState<number>(15);
  const [fixedMargin, setFixedMargin] = useState<number>(2500);
  const [isScraping, setIsScraping] = useState(false);
  const [products, setProducts] = useState<ShopeeProductMapping[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ShopeeProductMapping | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showBrowserWindow, setShowBrowserWindow] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'ready' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Preset demo URLs
  const sampleUrls = [
    {
      name: 'TWS Bluetooth Earphone V5.3',
      url: 'https://www.jakmall.com/tws-audio/tws-bluetooth-53-wireless-earphone-waterproof',
    },
    {
      name: 'Smartwatch IP68 Heart Rate',
      url: 'https://www.jakmall.com/wearables/smartwatch-fitness-tracker-ip68-waterproof',
    },
    {
      name: 'Fast Charging Cable Type-C 65W',
      url: 'https://www.jakmall.com/gadget-acc/kabel-data-type-c-to-type-c-65w-braided',
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

  const handlePublishBot = async (product: ShopeeProductMapping) => {
    setIsPublishing(true);
    setCurrentLogs([`[${new Date().toLocaleTimeString()}] Memulai inisialisasi Playwright Bot...`]);
    setCurrentScreenshot(null);
    setIsLogModalOpen(true);

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          method: 'PLAYWRIGHT_BOT',
          headless: !showBrowserWindow,
        }),
      });

      const data: PublishResult = await res.json();
      if (data.success) {
        setCurrentLogs(data.logs || []);
        if (data.screenshotUrl) setCurrentScreenshot(data.screenshotUrl);
        showToast('Berhasil memproses listing via Shopee Bot!');
        fetchProducts();
      } else {
        setCurrentLogs(data.logs || [data.message || 'Terjadi kegagalan']);
        showToast(data.message || 'Gagal menjalankan bot automasi.', 'error');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setCurrentLogs((prev) => [...prev, `[ERROR] ${error.message}`]);
      showToast('Gagal menghubungi service automation.', 'error');
    } finally {
      setIsPublishing(false);
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

  const readyCount = products.filter((p) => p.status === 'EXTRACTED' || p.status === 'REVIEWED').length;
  const publishedCount = products.filter((p) => p.status === 'PUBLISHED').length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Corporate Navbar */}
      <header className="border-b border-slate-700/80 bg-[#1E293B] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
              <img
                src="/logo-jualin.png"
                alt="Jualin Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Jualin</h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  Seller Suite
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Shopee: IqbalMaulMaul</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Platform Automasi Ekstraksi JakMall ke Shopee Seller Center
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://seller.shopee.co.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold border border-slate-600 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Shopee Seller Portal</span>
            </a>
            <button
              onClick={() => handleDownloadExcel()}
              disabled={products.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-100" />
              <span>Export All (Shopee Excel)</span>
            </button>
            <button
              onClick={fetchProducts}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* STEPPER DIRECTIONAL NAVIGATION BANNER (Guided Workflow) */}
        <section className="clean-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Alur Kerja Automasi (4 Langkah Mudah):
            </span>
            <span className="text-xs text-slate-400 font-mono">Total Staging: {products.length} Produk</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Step 1 Pill */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/80 text-xs">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                1
              </span>
              <div>
                <span className="font-bold text-white block">Atur Margin & Biaya</span>
                <span className="text-[11px] text-slate-400">Set % margin profit & admin</span>
              </div>
            </div>

            {/* Step 2 Pill */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/80 text-xs">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                2
              </span>
              <div>
                <span className="font-bold text-white block">Ekstrak Katalog JakMall</span>
                <span className="text-[11px] text-slate-400">Paste URL / Pilih preset</span>
              </div>
            </div>

            {/* Step 3 Pill */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/80 text-xs">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                3
              </span>
              <div>
                <span className="font-bold text-white block">Review Staging Area</span>
                <span className="text-[11px] text-slate-400">Periksa & edit data produk</span>
              </div>
            </div>

            {/* Step 4 Pill */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/80 text-xs">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                4
              </span>
              <div>
                <span className="font-bold text-white block">Export & Publish</span>
                <span className="text-[11px] text-slate-400">Unduh Excel / Jalankan Bot</span>
              </div>
            </div>
          </div>
        </section>

        {/* ROW 1: LANGKAH 1 & LANGKAH 2 (Kiri-Kanan Input Configuration Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LANGKAH 1: Aturan Margin & Biaya (5 Columns) */}
          <div className="lg:col-span-5 clean-card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">
                    LANGKAH 1
                  </span>
                  <h2 className="text-sm font-bold text-white">Atur Margin & Biaya Admin</h2>
                </div>
                <Sliders className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-4 text-xs">
                {/* Margin Percentage Slider */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                    <span>Margin Profit (%)</span>
                    <span className="font-bold text-blue-400 font-mono text-sm">+{markupPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={markupPercent}
                    onChange={(e) => setMarkupPercent(Number(e.target.value))}
                    className="w-full h-2 bg-slate-900 rounded appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Fixed Margin Fee */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                    <span>Biaya Admin / Packaging (Rp)</span>
                    <span className="font-bold text-slate-200 font-mono">Rp {formatRupiah(fixedMargin)}</span>
                  </div>
                  <input
                    type="number"
                    step="500"
                    value={fixedMargin}
                    onChange={(e) => setFixedMargin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Physical Chrome Checkbox */}
                <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">Buka Chrome Fisik Saat Bot Berjalan</span>
                  <input
                    type="checkbox"
                    checked={showBrowserWindow}
                    onChange={(e) => setShowBrowserWindow(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/80 text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60">
              Rumus Jual: <code className="text-blue-300">(Modal × (1 + {markupPercent}%)) + Rp {formatRupiah(fixedMargin)}</code>
            </div>
          </div>

          {/* LANGKAH 2: Ekstraksi Produk JakMall (7 Columns) */}
          <div className="lg:col-span-7 clean-card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">
                    LANGKAH 2
                  </span>
                  <h2 className="text-sm font-bold text-white">Masukkan URL Katalog JakMall</h2>
                </div>
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>

              <form onSubmit={handleScrape} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL Katalog / Produk JakMall
                  </label>
                  <input
                    type="text"
                    placeholder="Tempel URL produk JakMall di sini (cth: https://www.jakmall.com/...)"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isScraping}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScraping ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sedang Mengekstrak Data Produk...</span>
                    </>
                  ) : (
                    <>
                      <span>Ekstrak & Normalisasi Data</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Preset Demo Buttons */}
                <div className="pt-2 border-t border-slate-700/80 space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-medium block">
                    Atau Klik Contoh Produk Demo (1-Klik):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {sampleUrls.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUrlInput(s.url)}
                        className="text-left text-[11px] px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700 truncate transition-colors"
                        title={s.name}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Auto-Sanitasi Judul, Atribut & Deskripsi
              </span>
              <span className="font-mono text-slate-500">Format Shopee ID 2026</span>
            </div>
          </div>

        </section>

        {/* ROW 2: LANGKAH 3 & LANGKAH 4 (Staging Area & Action Toolbar) */}
        <section className="space-y-4">
          
          {/* Staging Header & Search / Filter Controls */}
          <div className="clean-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">
                LANGKAH 3
              </span>
              <h2 className="text-base font-bold text-white">Staging Area & Hasil Pemetaan</h2>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-blue-400 border border-slate-700">
                {products.length} Produk
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                  activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('ready')}
                className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                  activeTab === 'ready' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Siap Upload ({readyCount})
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                  activeTab === 'published' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Terupload ({publishedCount})
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="clean-card p-12 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">Belum Ada Produk di Staging Area</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Silakan lakukan **Langkah 2** di atas dengan memasukkan URL JakMall untuk mengekstrak produk ke area ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="clean-card clean-card-hover overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Image & Status Badge */}
                    <div className="relative aspect-video w-full bg-slate-900 border-b border-slate-700/80 overflow-hidden">
                      <img
                        src={p.mainImage}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                            p.status === 'PUBLISHED'
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : p.status === 'UPLOADING'
                              ? 'bg-amber-600 text-white border-amber-500'
                              : p.status === 'FAILED'
                              ? 'bg-rose-600 text-white border-rose-500'
                              : 'bg-blue-600 text-white border-blue-500'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono border border-slate-700">
                        {p.sku}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-bold text-xs text-white line-clamp-2 leading-relaxed" title={p.title}>
                        {p.title}
                      </h3>

                      {/* Price Comparison Box */}
                      <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-slate-900 rounded-lg border border-slate-700/80 font-mono">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-sans">Modal JakMall</span>
                          <span className="font-semibold text-slate-300">
                            Rp {formatRupiah(p.basePrice)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-sans">Harga Jual Shopee</span>
                          <span className="font-bold text-blue-400">
                            Rp {formatRupiah(p.finalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Attributes */}
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
                        <span>Stok: <strong className="text-slate-200">{p.stock}</strong></span>
                        <span>Berat: <strong className="text-slate-200">{p.weightGrams} gr</strong></span>
                        <span>Varian: <strong className="text-slate-200">{p.variations?.[0]?.options?.length || 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* LANGKAH 4: Action Footer (Export / Publish) */}
                  <div className="p-3 bg-slate-900/60 border-t border-slate-700/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        title="Edit Data Produk"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded bg-slate-800 hover:bg-rose-950 text-rose-400 border border-slate-700 transition-colors"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded">
                        LANGKAH 4
                      </span>
                      <button
                        onClick={() => handleDownloadExcel(p.id)}
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                        title="Download template Shopee Mass Upload"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Export Excel</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Corporate Technical Architecture Overview */}
        <section className="clean-card p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
            <Terminal className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Arsitektur Automation Engine & Pipeline Data
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/80 space-y-1">
              <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Multi-Tier Scraper Engine
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Axios/Cheerio fast JSON-LD parser + Playwright Chromium fallback untuk rendering dinamis secara gratis.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/80 space-y-1">
              <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Smart Product Normalizer
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Normalisasi otomatis skema JakMall ke standar Shopee ID 2026: sanitasi judul max 120 char & penanganan variasi.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/80 space-y-1">
              <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Dual Publishing Engine
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Mendukung automasi Playwright browser bot & generator template resmi Shopee Mass Upload (.xlsx).
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="clean-card border-slate-600 w-full max-w-xl rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Review & Edit Data Produk Shopee</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-300">Nama Produk (Shopee)</label>
                <input
                  type="text"
                  value={selectedProduct.title}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Harga Modal (Rp)</label>
                  <input
                    type="number"
                    value={selectedProduct.basePrice}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        basePrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Harga Jual Shopee (Rp)</label>
                  <input
                    type="number"
                    value={selectedProduct.finalPrice}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        finalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-blue-400 font-bold focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Berat (Gram)</label>
                  <input
                    type="number"
                    value={selectedProduct.weightGrams}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        weightGrams: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">Deskripsi Lengkap</label>
                <textarea
                  rows={6}
                  value={selectedProduct.description}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-blue-500 focus:outline-none font-mono text-[11px] leading-relaxed"
                />
              </div>
            </div>

            <div className="p-3 border-t border-slate-700 bg-slate-900 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Execution Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="clean-card border-slate-600 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-3.5 border-b border-slate-700 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-xs text-white">
                  Shopee Automation Bot — Live Execution Logs
                </h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 font-mono text-xs">
              <div className="bg-slate-900 p-3.5 rounded border border-slate-700 text-slate-300 space-y-1 max-h-56 overflow-y-auto">
                {currentLogs.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {line}
                  </div>
                ))}
                {isPublishing && (
                  <div className="flex items-center gap-2 text-blue-400 pt-2 font-semibold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sedang menjalankan automasi browser Playwright...</span>
                  </div>
                )}
              </div>

              {currentScreenshot && (
                <div className="space-y-1.5 pt-1">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 font-sans text-xs">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Bukti Hasil Eksekusi (Proof of Result):
                  </span>
                  <div className="rounded border border-slate-700 bg-slate-900 overflow-hidden">
                    <img
                      src={currentScreenshot}
                      alt="Verification Proof"
                      className="w-full h-auto object-cover max-h-72"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-700 bg-slate-900 flex justify-end">
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Tutup Konsol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs font-bold border transition-all ${
            toast.type === 'success'
              ? 'bg-blue-900/90 text-blue-100 border-blue-500'
              : 'bg-rose-900/90 text-rose-100 border-rose-500'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}



