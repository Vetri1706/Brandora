'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { brandingApi } from '@/lib/api';
import { CompanyProfile, BrandingResponse } from '@/types';
import CompanyForm from '@/components/CompanyForm';
import LoadingAnimation from '@/components/LoadingAnimation';
import Header from '@/components/Header';

export default function GeneratePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateBranding = async (profile: CompanyProfile) => {
    setIsLoading(true);
    toast.loading('Generating your brand identity...', { id: 'generating' });

    try {
      const response = await brandingApi.generateBranding({
        company_id: `company_${Date.now()}`,
        company_profile: profile,
        num_variations: 3,
        focus: 'all',
      });

      toast.dismiss('generating');
      toast.success('Brand identity generated successfully! 🎉');
      
      // Store result in localStorage and navigate to results
      localStorage.setItem('latest_branding', JSON.stringify(response.data));
      router.push('/results');
    } catch (error: any) {
      toast.dismiss('generating');
      const errorMsg = error.response?.data?.detail || 'Failed to generate branding';
      toast.error(errorMsg);
      console.error('Generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Toaster position="top-right" />
      <Header />

      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <LoadingAnimation message="Creating your unique brand identity..." />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Let's Create Your{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                    Perfect Logo
                  </span>
                </h1>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  Answer a few quick questions and we'll generate professional logos,
                  taglines, and a complete brand identity tailored to your business.
                </p>
              </motion.div>

              {/* Progress Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center items-center gap-3 mt-8"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <span className="text-sm text-slate-300">Your Details</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-700"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span className="text-sm text-slate-500">Generate</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-700"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <span className="text-sm text-slate-500">Customize</span>
                </div>
              </motion.div>
            </div>

            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-2xl">
                <CompanyForm onSubmit={handleGenerateBranding} isLoading={isLoading} />
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span>100% Free - No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <span>Instant Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Professional Quality</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
