"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wand2, Sparkles } from 'lucide-react';
import { brandingApi } from '@/lib/api';

interface GodModeProps {
  isOpen: boolean;
  onClose: () => void;
  companyProfile: any;
  onResult: (data: any) => void;
}

export default function GodModeAssistant({ isOpen, onClose, companyProfile, onResult }: GodModeProps) {
  const [prompt, setPrompt] = useState('Make it minimal, nature-forward, no letters');
  const [industryOverride, setIndustryOverride] = useState('');
  const [symbols, setSymbols] = useState('flower,leaf');
  const [negative, setNegative] = useState('letters');
  const [colors, setColors] = useState('#16A34A,#EC4899,#A855F7');
  const [style, setStyle] = useState('minimal');
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    try {
      setLoading(true);
      const god_mode = {
        prompt,
        industry_override: industryOverride || undefined,
        symbols: symbols ? symbols.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        negative: negative ? negative.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        color_overrides: colors ? colors.split(',').map(c => c.trim()).filter(Boolean) : undefined,
        style_preference: style || undefined,
      };
      const { data } = await brandingApi.generateBranding({
        company_id: Date.now().toString(),
        company_profile: companyProfile,
        focus: 'logo',
        num_variations: 3,
        god_mode,
      });
      onResult(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <Wand2 className="w-5 h-5 text-violet-400" />
                <h3 className="text-xl font-bold">God Mode</h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-slate-300">What should we do?</label>
                <textarea className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700"
                  rows={3} value={prompt} onChange={e => setPrompt(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300">Industry override (optional)</label>
                  <input className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700" value={industryOverride} onChange={e => setIndustryOverride(e.target.value)} placeholder="e.g., Floral boutique" />
                </div>
                <div>
                  <label className="text-sm text-slate-300">Style</label>
                  <input className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700" value={style} onChange={e => setStyle(e.target.value)} placeholder="minimal, geometric, 3d" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300">Symbols (comma)</label>
                  <input className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700" value={symbols} onChange={e => setSymbols(e.target.value)} placeholder="flower,leaf,shield" />
                </div>
                <div>
                  <label className="text-sm text-slate-300">Avoid (comma)</label>
                  <input className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700" value={negative} onChange={e => setNegative(e.target.value)} placeholder="letters, gradients" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300">Color overrides (3 hex, comma)</label>
                <input className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700" value={colors} onChange={e => setColors(e.target.value)} placeholder="#16A34A,#EC4899,#A855F7" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={onGenerate} disabled={loading} className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50">
                <Sparkles className="w-4 h-4" />
                {loading ? 'Generating…' : 'Generate with God Mode'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
