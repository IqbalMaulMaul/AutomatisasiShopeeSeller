import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JakMall → Shopee Automation Hub | Seller Suite',
  description: 'Ekstraksi otomatis katalog JakMall, kalkulasi margin, dan penerbitan produk ke Shopee Seller Center.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`h-full dark ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.className} min-h-full flex flex-col antialiased bg-[#090D16] text-slate-100 selection:bg-emerald-500 selection:text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

