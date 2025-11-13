import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import FuturisticCursor from '@/components/FuturisticCursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Brandora - AI Logo Generator',
  description: 'Professional AI-powered logo creation with industry intelligence across 6 categories',
  keywords: ['brandora', 'logo', 'ai', 'generator', 'brand', 'design', 'professional'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} custom-cursor`}>
        <FuturisticCursor />
        {children}
      </body>
    </html>
  );
}
