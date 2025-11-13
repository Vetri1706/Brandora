'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, Eye } from 'lucide-react';
import { BrandingResponse } from '@/types';

interface BrandingResultsProps {
  data: BrandingResponse;
  onStartOver: () => void;
}

export default function BrandingResults({ data, onStartOver }: BrandingResultsProps) {
  const handleDownload = () => {
    // Create a comprehensive JSON export
    const exportData = {
      generatedAt: data.generated_at,
      generationTimeSeconds: data.generation_time_seconds,
      logos: data.logos,
      taglines: data.taglines,
      colorPalette: data.color_palette,
      typography: data.typography,
      brandGuidelines: data.brand_guidelines,
    };

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2))
    );
    element.setAttribute('download', `brand-identity-${data.company_id}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-2">Your Brand Identity is Ready! 🎉</h2>
        <p className="text-slate-400">Generated in {data.generation_time_seconds.toFixed(1)}s</p>
      </div>

      {/* Logos Section */}
      {data.logos.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Logo Variations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.logos.map((logo, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <div className="w-full h-40 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center mb-4">
                  <p className="text-slate-400 text-center text-sm">{logo.style} Style</p>
                </div>
                <h4 className="font-semibold text-white mb-2">{logo.description}</h4>
                <p className="text-sm text-slate-400 mb-3">{logo.prompt_used}</p>
                <div className="flex gap-1">
                  {logo.color_scheme.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded border border-slate-600"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Taglines Section */}
      {data.taglines.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Brand Taglines</h3>
          <div className="space-y-4">
            {data.taglines.map((tagline, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <p className="text-lg font-semibold text-white mb-2">"{tagline.text}"</p>
                <p className="text-slate-400 mb-2">{tagline.explanation}</p>
                <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                  Tone: {tagline.tone}
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Color Palette Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { name: 'Primary', color: data.color_palette.primary, psych: data.color_palette.psychology.primary },
            { name: 'Secondary', color: data.color_palette.secondary, psych: data.color_palette.psychology.secondary },
            { name: 'Accent', color: data.color_palette.accent, psych: data.color_palette.psychology.accent },
            { name: 'Neutral', color: data.color_palette.neutral, psych: data.color_palette.psychology.neutral },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div
                className="w-full h-32 rounded-lg border-2 border-slate-600 mb-3"
                style={{ backgroundColor: item.color }}
              />
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-xs text-slate-400 mt-1">{item.color}</p>
              <p className="text-xs text-blue-300 mt-1">{item.psych}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-300 text-sm bg-slate-700/30 p-4 rounded">
          <strong>Usage Guidelines:</strong> {data.color_palette.usage_guidelines}
        </p>
      </motion.section>

      {/* Typography Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
            <p className="text-sm text-slate-400 mb-1">Heading Font</p>
            <p className="text-xl font-bold text-white mb-2">{data.typography.heading_font}</p>
            <p className="text-sm text-slate-300">{data.typography.rationale}</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
            <p className="text-sm text-slate-400 mb-1">Body Font</p>
            <p className="text-lg text-white mb-2">{data.typography.body_font}</p>
            {data.typography.accent_font && (
              <>
                <p className="text-sm text-slate-400 mt-3 mb-1">Accent Font</p>
                <p className="text-sm text-slate-300">{data.typography.accent_font}</p>
              </>
            )}
          </div>
        </div>
      </motion.section>

      {/* Brand Guidelines */}
      {data.brand_guidelines && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Brand Guidelines</h3>
          <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600 max-h-96 overflow-y-auto">
            <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
              {data.brand_guidelines}
            </p>
          </div>
        </motion.section>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Results
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartOver}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Start Over
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
