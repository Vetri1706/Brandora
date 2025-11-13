'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 px-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Create Your Dream Logo
              </span>
              <br />
              <span className="text-white">In Seconds</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Professional AI-powered brand identity generator. Get logos, taglines, color palettes, and complete brand guidelines instantly.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/generate')}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all"
              >
                Start Creating Now - It's Free! →
              </motion.button>
              <button
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-4 rounded-full text-white font-semibold text-lg border-2 border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10 transition-all"
              >
                See How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free to use
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Instant generation
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Professional quality
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Unlimited edits
              </div>
            </div>
          </motion.div>

          {/* Preview Cards - Logo Examples */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { style: 'Modern', color: 'from-blue-500 to-cyan-400' },
              { style: 'Geometric', color: 'from-purple-500 to-pink-500' },
              { style: 'Minimal', color: 'from-orange-500 to-red-500' },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 transition-all shadow-lg"
              >
                <div className={`w-24 h-24 mx-auto mb-4 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl font-bold shadow-xl`}>
                  LOGO
                </div>
                <p className="text-slate-300 font-medium">{item.style} Style</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">Choose from Templates</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Don't want to start from scratch? Browse our curated collection of professional logo templates 
              and customize them to match your brand.
            </p>
          </motion.div>

          {/* Template Preview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {[
              { 
                name: 'Venture Capital', 
                category: 'Business', 
                preview: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="28" fill="#2563EB" stroke="#1E40AF" stroke-width="1"/>
                  <circle cx="40" cy="40" r="20" fill="none" stroke="white" stroke-width="1" opacity="0.3"/>
                  <polygon points="40,28 32,36 32,44 40,52 48,44 48,36" fill="white"/>
                </svg>` 
              },
              { 
                name: 'Natural Organics', 
                category: 'Lifestyle', 
                preview: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="28" fill="white" stroke="#10B981" stroke-width="2"/>
                  <ellipse cx="40" cy="36" rx="10" ry="14" fill="#10B981"/>
                  <ellipse cx="34" cy="42" rx="8" ry="6" fill="#059669"/>
                  <ellipse cx="46" cy="42" rx="8" ry="6" fill="#059669"/>
                </svg>` 
              },
              { 
                name: 'Nexus Tech', 
                category: 'Technology', 
                preview: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                  <rect x="24" y="24" width="32" height="32" rx="3" fill="none" stroke="#3B82F6" stroke-width="2"/>
                  <circle cx="40" cy="40" r="8" fill="#1E40AF"/>
                  <circle cx="40" cy="40" r="3" fill="white"/>
                </svg>` 
              },
              { 
                name: 'Invicta Creative', 
                category: 'Creative', 
                preview: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="creativeGradHome" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#8B5CF6"/>
                      <stop offset="100%" style="stop-color:#EC4899"/>
                    </linearGradient>
                  </defs>
                  <circle cx="40" cy="40" r="28" fill="url(#creativeGradHome)"/>
                  <circle cx="40" cy="40" r="12" fill="white" opacity="0.9"/>
                  <text x="40" y="44" text-anchor="middle" fill="#8B5CF6" font-family="serif" font-size="12" font-weight="bold">I</text>
                </svg>` 
              },
              { 
                name: 'Unity Building', 
                category: 'Construction', 
                preview: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                  <rect x="24" y="32" width="32" height="24" fill="#374151"/>
                  <rect x="28" y="36" width="5" height="6" fill="#6B7280"/>
                  <rect x="35" y="36" width="5" height="6" fill="#6B7280"/>
                  <rect x="42" y="36" width="5" height="6" fill="#6B7280"/>
                  <rect x="49" y="36" width="5" height="6" fill="#6B7280"/>
                  <rect x="28" y="44" width="5" height="6" fill="#6B7280"/>
                  <rect x="35" y="44" width="5" height="6" fill="#6B7280"/>
                  <rect x="42" y="44" width="5" height="6" fill="#6B7280"/>
                  <rect x="49" y="44" width="5" height="6" fill="#6B7280"/>
                </svg>` 
              },
              { 
                name: 'Artisan Coffee', 
                category: 'Food', 
                preview: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="28" fill="#F59E0B"/>
                  <ellipse cx="40" cy="38" rx="10" ry="12" fill="#D97706"/>
                  <rect x="38" y="28" width="4" height="6" rx="2" fill="#D97706"/>
                  <path d="M34 32 Q40 29 46 32" stroke="#D97706" stroke-width="1" fill="none"/>
                </svg>` 
              },
            ].map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center hover:border-blue-500 transition-all cursor-pointer"
                onClick={() => router.push('/templates')}
              >
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 mb-3 h-24 flex items-center justify-center">
                  <div 
                    className="w-16 h-16"
                    dangerouslySetInnerHTML={{ __html: template.preview }}
                  />
                </div>
                <h4 className="text-white text-sm font-medium mb-1">{template.name}</h4>
                <p className="text-slate-400 text-xs">{template.category}</p>
              </motion.div>
            ))}
          </div>

          {/* Browse Templates CTA */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/templates')}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-violet-500/50 transition-all"
            >
              Browse All Templates →
            </motion.button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-300">Create your complete brand identity in 3 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Enter Your Business Details',
                description: 'Tell us about your company, industry, and values. Our AI will understand your unique brand personality.',
                icon: '📝',
              },
              {
                step: '2',
                title: 'Generate Instantly',
                description: 'Get 3 unique logo designs, taglines, color palettes, typography, and complete brand guidelines in seconds.',
                icon: '⚡',
              },
              {
                step: '3',
                title: 'Customize & Download',
                description: 'Edit colors, fonts, and layouts. Download high-quality files in multiple formats ready for any use.',
                icon: '🎨',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center hover:border-blue-500 transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {step.step}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-slate-300">Complete brand identity toolkit powered by AI</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Logo Designs', desc: '3 unique professional logos' },
              { icon: '💬', title: 'Taglines', desc: 'Compelling brand messages' },
              { icon: '🎨', title: 'Color Palettes', desc: 'Perfect color combinations' },
              { icon: '✍️', title: 'Typography', desc: 'Font recommendations' },
              { icon: '📱', title: 'Instant Download', desc: 'High-resolution files' },
              { icon: '🔄', title: 'Unlimited Edits', desc: 'Customize everything' },
              { icon: '📋', title: 'Brand Guidelines', desc: 'Complete usage guide' },
              { icon: '💾', title: 'Export JSON', desc: 'Save your brand data' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 transition-all"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Create Your Brand?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses who created their brand identity with us
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/generate')}
              className="px-12 py-5 bg-white text-blue-600 rounded-full font-bold text-xl hover:shadow-2xl transition-all"
            >
              Get Started Now - 100% Free →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-slate-400 border-t border-slate-800">
        <p>© 2025 Brand Identity Generator. Powered by AI. Built with ❤️</p>
      </footer>
    </div>
  );
}
