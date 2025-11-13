'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  message?: string;
}

export default function LoadingAnimation({ message = 'Generating your brand identity...' }: LoadingAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-slate-600 border-t-purple-500 rounded-full mx-auto mb-4"
        />
        <p className="text-white text-lg font-semibold">{message}</p>
        <p className="text-slate-400 text-sm mt-2">This typically takes 30-60 seconds</p>
      </div>
    </motion.div>
  );
}
