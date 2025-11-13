'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Home, Wand2, History, Grid3X3 } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Generate', path: '/generate', icon: <Wand2 size={18} /> },
    { name: 'Templates', path: '/templates', icon: <Grid3X3 size={18} /> },
    { name: 'Results', path: '/results', icon: <History size={18} /> },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-blue-900/50 sticky top-0 z-50 shadow-lg shadow-blue-900/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Brand Identity</h1>
              <p className="text-xs text-blue-300">AI Logo Maker</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  pathname === item.path
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/generate')}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </header>
  );
}
