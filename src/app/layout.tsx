import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jualin | Shopee Seller Automation Suite',
  description: 'Aplikasi otomatisasi ekstraksi katalog produk JakMall, kalkulasi margin profit, dan listing ke Shopee Seller Center.',
  icons: [
    { rel: 'icon', url: '/logo-jualin.png' },
    { rel: 'apple-touch-icon', url: '/logo-jualin.png' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`h-full ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.className} min-h-full flex flex-col antialiased bg-[#F8FAFC] text-slate-900 selection:bg-indigo-600 selection:text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}


