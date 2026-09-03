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
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
  Sliders,
  FileSpreadsheet,
  Terminal,
  Image as ImageIcon,
  Check,
  X,
  ShieldCheck,
  Zap,
  Tag,
  TrendingUp,
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

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'ready') return p.status === 'EXTRACTED' || p.status === 'REVIEWED';
    if (activeTab === 'published') return p.status === 'PUBLISHED';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[400px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-xl sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>JakMall</span>
                  <span className="text-emerald-400 font-bold">➔</span>
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    Shopee Automation Hub
                  </span>
                </h1>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Shopee: IqbalMaulMaul</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                PoC Assessment — Buruh Ketik Candidate Test
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://seller.shopee.co.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white transition-all text-xs font-semibold shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Shopee Seller Portal</span>
            </a>
            <button
              onClick={() => handleDownloadExcel()}
              disabled={products.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-900/30 transition-all text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Export All (Shopee Excel)</span>
            </button>
            <button
              onClick={fetchProducts}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Control Grid: URL Extractor & Rule Calculator */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Extraction Form (2 Columns) */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Ekstraksi Produk JakMall</h2>
                  <p className="text-xs text-slate-400">Masukkan URL katalog produk JakMall untuk diproses secara otomatis</p>
                </div>
              </div>

              <form onSubmit={handleScrape} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Tempel URL katalog/produk JakMall (cth: https://www.jakmall.com/...)"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-4 py-3.5 bg-[#0B0F19]/90 border border-slate-700/80 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={isScraping}
                    className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isScraping ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Mengekstrak...</span>
                      </>
                    ) : (
                      <>
                        <span>Ekstrak & Normalisasi</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Preset Demo Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Contoh Demo 1-Klik:
                  </span>
                  {sampleUrls.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setUrlInput(s.url)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 border border-slate-700/60 transition-all font-medium hover:border-emerald-500/50"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Auto-Sanitasi Judul, Atribut & Deskripsi
              </span>
              <span className="text-slate-500 font-mono">Format Standard Shopee ID 2026</span>
            </div>
          </div>

          {/* Pricing Rules & Bot Configuration (1 Column) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Aturan Markup & Bot Demo</h2>
                  <p className="text-xs text-slate-400">Penyesuaian margin & pengaturan automasi</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-2">
                    <span className="font-medium text-slate-300">Margin Keuntungan (%)</span>
                    <span className="font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                      +{markupPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={markupPercent}
                    onChange={(e) => setMarkupPercent(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span className="font-medium text-slate-300">Biaya Admin / Packaging (Rp)</span>
                    <span className="font-bold text-cyan-400">Rp {formatRupiah(fixedMargin)}</span>
                  </div>
                  <input
                    type="number"
                    step="500"
                    value={fixedMargin}
                    onChange={(e) => setFixedMargin(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#0B0F19]/90 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                </div>

                {/* Visible Window Toggle for Local Demo */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">Buka Jendela Chrome Fisik (Local Demo)</span>
                  <input
                    type="checkbox"
                    checked={showBrowserWindow}
                    onChange={(e) => setShowBrowserWindow(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
              Rumus: <code className="text-emerald-300">(Harga Modal × (1 + {markupPercent}%)) + Rp {formatRupiah(fixedMargin)}</code>
            </div>
          </div>
        </section>

        {/* Product Staging Dashboard */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Layers className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Staging Area & Hasil Pemetaan</span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {products.length} Produk
                  </span>
                </h2>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#0B0F19] p-1.5 rounded-2xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('ready')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'ready'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Siap Upload ({products.filter((p) => p.status === 'EXTRACTED' || p.status === 'REVIEWED').length})
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'published'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Terupload ({products.filter((p) => p.status === 'PUBLISHED').length})
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="glass-panel border-dashed border-slate-800 rounded-3xl p-14 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Belum Ada Produk di Staging</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Masukkan URL katalog JakMall pada form di atas atau klik salah satu contoh demo 1-klik untuk memulai ekstraksi data produk.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="glass-card glass-card-hover rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group border border-slate-800/80"
                >
                  <div>
                    {/* Image Container & Floating Badges */}
                    <div className="relative aspect-video w-full bg-[#050810] overflow-hidden">
                      <img
                        src={p.mainImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-xl text-[11px] font-extrabold backdrop-blur-xl shadow-lg border ${
                            p.status === 'PUBLISHED'
                              ? 'bg-emerald-500/80 text-white border-emerald-400/40 shadow-emerald-500/20'
                              : p.status === 'UPLOADING'
                              ? 'bg-amber-500/80 text-white border-amber-400/40 shadow-amber-500/20'
                              : p.status === 'FAILED'
                              ? 'bg-rose-500/80 text-white border-rose-400/40 shadow-rose-500/20'
                              : 'bg-cyan-500/80 text-white border-cyan-400/40 shadow-cyan-500/20'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-[#0B0F19]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-slate-300 font-mono border border-slate-700/60 shadow-md">
                        {p.sku}
                      </div>
                    </div>

                    {/* Card Content Info */}
                    <div className="p-5 space-y-4">
                      <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors" title={p.title}>
                        {p.title}
                      </h3>

                      {/* Price Comparison Container */}
                      <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-[#0B0F19]/90 rounded-2xl border border-slate-800">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-medium">Harga Modal JakMall</span>
                          <span className="font-semibold text-slate-300 font-mono">
                            Rp {formatRupiah(p.basePrice)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-medium">Harga Jual Shopee</span>
                          <span className="font-extrabold text-emerald-400 font-mono">
                            Rp {formatRupiah(p.finalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Stats Pills */}
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-medium">
                        <span>Stok: <strong className="text-slate-200">{p.stock}</strong></span>
                        <span>Berat: <strong className="text-slate-200">{p.weightGrams} gr</strong></span>
                        <span>Varian: <strong className="text-slate-200">{p.variations?.[0]?.options?.length || 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-[#0B0F19]/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
                        title="Review & Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 text-rose-400 transition-colors border border-slate-700/60"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDownloadExcel(p.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
                      title="Download template Shopee Mass Upload khusus produk ini"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
                      <span>Export Excel (.xlsx)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Technical Architecture Notes */}
        <section className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Arsitektur & Ketentuan Teknis Penilaian</h2>
              <p className="text-xs text-slate-400">Implementasi teknis automation engine & data pipeline</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 bg-[#0B0F19]/80 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Multi-Tier Scraper
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Menggabungkan Fast Axios/Cheerio untuk ekstraksi JSON-LD/OpenGraph + Playwright Chromium fallback untuk rendering dinamis secara 100% gratis.
              </p>
            </div>

            <div className="p-4 bg-[#0B0F19]/80 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-cyan-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Smart Normalizer
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Memetakan field JakMall ke standar Shopee: markup margin dinamis, sanitasi judul (max 120 char), formatting deskripsi terstruktur, dan penanganan variasi.
              </p>
            </div>

            <div className="p-4 bg-[#0B0F19]/80 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-teal-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Dual Publishing Engine
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Mendukung eksekusi via Playwright Browser Automation (dengan bukti screenshot logging) serta ekspor template resmi Shopee Mass Upload (.xlsx).
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel border-slate-700/80 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0B0F19]/90">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-slate-100">Review & Edit Data Produk Shopee</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-200">
              <div>
                <label className="block font-semibold mb-1.5 text-slate-300">Nama Produk (Shopee)</label>
                <input
                  type="text"
                  value={selectedProduct.title}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#050810] border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-300">Harga Modal (Rp)</label>
                  <input
                    type="number"
                    value={selectedProduct.basePrice}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        basePrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#050810] border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-300">Harga Jual Shopee (Rp)</label>
                  <input
                    type="number"
                    value={selectedProduct.finalPrice}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        finalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#050810] border border-slate-800 rounded-xl text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-300">Berat (Gram)</label>
                  <input
                    type="number"
                    value={selectedProduct.weightGrams}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        weightGrams: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#050810] border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-slate-300">Deskripsi Lengkap</label>
                <textarea
                  rows={6}
                  value={selectedProduct.description}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#050810] border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none font-mono text-[11px] leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#0B0F19]/90 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Automation Execution Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel border-slate-700/80 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0B0F19]/90">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  Shopee Automation Bot — Live Execution Logs
                </h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 font-mono text-xs">
              {/* Terminal Logs Window */}
              <div className="bg-[#050810] p-4 rounded-2xl border border-slate-800 text-slate-300 space-y-1.5 max-h-60 overflow-y-auto shadow-inner">
                {currentLogs.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {line}
                  </div>
                ))}
                {isPublishing && (
                  <div className="flex items-center gap-2 text-emerald-400 pt-2 font-semibold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sedang menjalankan automasi browser Playwright...</span>
                  </div>
                )}
              </div>

              {/* Proof Screenshot Inspector */}
              {currentScreenshot && (
                <div className="space-y-2 pt-2">
                  <span className="font-bold text-slate-200 flex items-center gap-2 font-sans text-xs">
                    <ImageIcon className="w-4 h-4 text-emerald-400" /> Bukti Hasil Eksekusi (Proof of Result):
                  </span>
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#050810]">
                    <img
                      src={currentScreenshot}
                      alt="Verification Proof"
                      className="w-full h-auto object-cover max-h-80"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#0B0F19]/90 flex justify-end">
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
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
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold backdrop-blur-xl border transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

