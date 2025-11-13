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
    toast.loading('Generating your logo...', { id: 'generating' });

    try {
      console.log('🚀 Starting logo generation for:', profile);
      
      const response = await brandingApi.generateLogo({
        company_name: profile.name,
        industry: profile.industry,
        color_scheme: 'blue', // Match Railway backend color schemes
        style: 'modern', // Use 'style' instead of 'logo_category'
      });

      console.log('✅ Railway backend response:', response.data);

      toast.dismiss('generating');
      toast.success('Logo generated successfully! 🎉');
      
      // Transform Railway backend response into frontend format
      const brandingData = {
        id: Date.now().toString(),
        company_profile: profile,
        logos: [
          {
            id: '1',
            description: `Professional ${response.data.style} logo for ${response.data.company_name}`,
            color_scheme: [response.data.color_scheme, '#1e40af', '#3b82f6'],
            style: response.data.style || 'combination',
            image_url: `${process.env.NEXT_PUBLIC_API_URL}${response.data.logo_url}`,
            prompt_used: `${response.data.company_name} ${response.data.industry} logo`
          }
        ],
        taglines: [
          {
            id: '1',
            text: `Innovating the Future of ${profile.industry}`,
            tone: 'professional',
            explanation: 'A forward-looking tagline emphasizing innovation and industry leadership'
          },
          {
            id: '2', 
            text: `Your Trusted ${profile.industry} Partner`,
            tone: 'trustworthy',
            explanation: 'Building trust and reliability in your industry'
          }
        ],
        color_palette: {
          primary: '#1e40af',
          secondary: '#3b82f6', 
          accent: '#60a5fa',
          neutral: '#6b7280',
          psychology: {
            primary: 'Trust and professionalism',
            secondary: 'Innovation and growth',
            accent: 'Accessibility and clarity'
          },
          usage_guidelines: 'Use primary color for main branding elements, secondary for interactive elements, and accent for highlights.'
        },
        brand_guidelines: {
          mission: `To deliver exceptional ${profile.industry} solutions that drive success.`,
          vision: `Leading innovation in ${profile.industry} with integrity and excellence.`,
          values: profile.brand_values || ['Innovation', 'Quality', 'Trust'],
          tone_of_voice: profile.tone || 'Professional and approachable',
          logo_usage: 'Maintain clear space around logo equal to the height of the company name. Use on light backgrounds for optimal visibility.',
          typography: 'Use modern, clean fonts that complement the logo design. Recommended: Inter for digital, and a serif font for formal documents.'
        }
      };
      
      console.log('💾 Saving branding data to localStorage:', brandingData);
      
      // Store result in localStorage and navigate to results
      localStorage.setItem('latest_branding', JSON.stringify(brandingData));
      
      console.log('🔄 Navigating to results page...');
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
