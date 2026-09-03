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
  icons: {
    icon: '/logo-jualin.png',
    apple: '/logo-jualin.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`h-full dark ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.className} min-h-full flex flex-col antialiased bg-[#070A12] text-slate-100 selection:bg-blue-500 selection:text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}


