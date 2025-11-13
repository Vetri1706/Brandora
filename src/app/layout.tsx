import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import FuturisticCursor from '@/components/FuturisticCursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Brand Identity Generator - AI-Powered Branding',
  description: 'Generate unique brand identities for tech companies using AI',
  keywords: ['branding', 'ai', 'logo', 'identity', 'design', 'tech'],
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
