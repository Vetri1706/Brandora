'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, Wand2 } from 'lucide-react';

interface AIWritingAssistantProps {
  fieldName: string;
  fieldLabel: string;
  currentValue: string;
  onApply: (value: string) => void;
  placeholder?: string;
  context?: {
    companyName?: string;
    industry?: string;
    companyType?: string;
  };
}

export default function AIWritingAssistant({
  fieldName,
  fieldLabel,
  currentValue,
  onApply,
  placeholder,
  context
}: AIWritingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim() && !context?.companyName) {
      return;
    }

    setGenerating(true);
    setGeneratedText('');

    try {
      // Simulate AI generation with intelligent templates
      await new Promise(resolve => setTimeout(resolve, 1500));

      let generated = '';
      
      switch (fieldName) {
        case 'name':
          generated = generateCompanyName(prompt, context);
          break;
        case 'description':
          generated = generateDescription(prompt, context);
          break;
        case 'industry':
          generated = generateIndustry(prompt, context);
          break;
        case 'target_audience':
          generated = generateTargetAudience(prompt, context);
          break;
        case 'brand_values':
          generated = generateBrandValues(prompt, context);
          break;
        default:
          generated = generateGeneric(prompt, fieldLabel, context);
      }

      setGeneratedText(generated);
    } catch (error) {
      console.error('Generation error:', error);
      setGeneratedText('Sorry, I could not generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = () => {
    onApply(generatedText);
    setIsOpen(false);
    setPrompt('');
    setGeneratedText('');
  };

  // AI Generation Templates
  const generateCompanyName = (userPrompt: string, ctx?: any) => {
    const keywords = userPrompt.toLowerCase().split(' ').filter(w => w.length > 2);
    const prefixes = ['Tech', 'Cloud', 'Smart', 'Pro', 'Inno', 'Next', 'Digital', 'Flex', 'Rapid'];
    const suffixes = ['Flow', 'Hub', 'Sync', 'Labs', 'AI', 'Sphere', 'Wave', 'Solutions'];
    
    if (keywords.length > 0) {
      const mainKeyword = keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1);
      return `${mainKeyword}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }
    
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  };

  const generateDescription = (userPrompt: string, ctx?: any) => {
    const companyName = ctx?.companyName || 'Our company';
    const industry = ctx?.industry || 'technology';
    const type = ctx?.companyType || 'business';

    if (userPrompt.trim()) {
      return `${companyName} is revolutionizing the ${industry} industry by ${userPrompt}. We leverage cutting-edge technology to deliver exceptional value to our clients, combining innovation with reliability to create solutions that drive real business results.`;
    }

    const templates = [
      `${companyName} is a leading ${type} company specializing in ${industry} solutions. We combine innovation, expertise, and customer-centric approach to deliver transformative results for businesses worldwide.`,
      `At ${companyName}, we're reshaping the ${industry} landscape with intelligent ${type} solutions. Our mission is to empower organizations with technology that drives growth, efficiency, and sustainable success.`,
      `${companyName} provides cutting-edge ${industry} services through our innovative ${type} platform. We're committed to helping businesses thrive in the digital age with solutions that are both powerful and easy to use.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generateIndustry = (userPrompt: string, ctx?: any) => {
    if (userPrompt.trim()) {
      // Enhance user input
      const keywords = userPrompt.toLowerCase();
      if (keywords.includes('health') || keywords.includes('medical')) return 'Healthcare Technology';
      if (keywords.includes('finance') || keywords.includes('bank')) return 'Financial Technology (FinTech)';
      if (keywords.includes('shop') || keywords.includes('commerce')) return 'E-Commerce & Retail';
      if (keywords.includes('ai') || keywords.includes('machine')) return 'Artificial Intelligence & Machine Learning';
      if (keywords.includes('security') || keywords.includes('cyber')) return 'Cybersecurity';
      if (keywords.includes('blockchain') || keywords.includes('crypto')) return 'Blockchain & Web3';
      if (keywords.includes('education') || keywords.includes('learn')) return 'Education Technology (EdTech)';
      return userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1) + ' Technology';
    }

    const industries = [
      'Software as a Service (SaaS)',
      'Healthcare Technology',
      'Financial Technology (FinTech)',
      'Artificial Intelligence & Machine Learning',
      'E-Commerce & Digital Retail',
      'Cybersecurity Solutions'
    ];

    return industries[Math.floor(Math.random() * industries.length)];
  };

  const generateTargetAudience = (userPrompt: string, ctx?: any) => {
    if (userPrompt.trim()) {
      return `${userPrompt}, including decision-makers, technical teams, and business leaders looking for innovative solutions to drive growth and efficiency in their organizations.`;
    }

    const audiences = [
      'Enterprise businesses seeking scalable technology solutions to optimize operations and drive digital transformation',
      'Small to medium-sized businesses looking for affordable, powerful tools to compete in the modern marketplace',
      'Tech-savvy professionals and decision-makers who value innovation, efficiency, and data-driven insights',
      'Forward-thinking organizations committed to leveraging technology for competitive advantage and sustainable growth',
      'B2B companies across industries seeking reliable partners to help them navigate digital disruption'
    ];

    return audiences[Math.floor(Math.random() * audiences.length)];
  };

  const generateBrandValues = (userPrompt: string, ctx?: any) => {
    const valuePool = [
      'Innovation', 'Trust', 'Excellence', 'Integrity', 'Transparency',
      'Customer Success', 'Quality', 'Reliability', 'Agility', 'Security',
      'Collaboration', 'Sustainability', 'Empowerment', 'Simplicity', 'Growth'
    ];

    if (userPrompt.trim()) {
      // Include user's input as first value
      const userValue = userPrompt.split(',')[0].trim();
      const selectedValues = [userValue];
      
      // Add 2-3 complementary values
      const remaining = valuePool.filter(v => v.toLowerCase() !== userValue.toLowerCase());
      for (let i = 0; i < 2 && selectedValues.length < 3; i++) {
        const randomValue = remaining[Math.floor(Math.random() * remaining.length)];
        if (!selectedValues.includes(randomValue)) {
          selectedValues.push(randomValue);
        }
      }
      
      return selectedValues.join(', ');
    }

    // Return 3 random values
    const shuffled = [...valuePool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).join(', ');
  };

  const generateGeneric = (userPrompt: string, label: string, ctx?: any) => {
    if (userPrompt.trim()) {
      return userPrompt;
    }
    return `AI-generated content for ${label}`;
  };

  return (
    <>
      {/* AI Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-purple-500/25"
        title="AI Writing Assistant"
      >
        <Sparkles size={14} />
        <span>AI Write</span>
      </button>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-slate-700"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Wand2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AI Writing Assistant</h3>
                    <p className="text-sm text-white/80">Generate content for: {fieldLabel}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 max-h-[calc(80vh-140px)] overflow-y-auto">
                {/* Current Value */}
                {currentValue && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-400 mb-2">Current Value:</p>
                    <p className="text-sm text-slate-300">{currentValue}</p>
                  </div>
                )}

                {/* Context Info */}
                {context && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-xs font-semibold text-blue-400 mb-2">Context:</p>
                    <div className="text-sm text-slate-300 space-y-1">
                      {context.companyName && <p>• Company: {context.companyName}</p>}
                      {context.industry && <p>• Industry: {context.industry}</p>}
                      {context.companyType && <p>• Type: {context.companyType}</p>}
                    </div>
                  </div>
                )}

                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Tell AI what you want (optional):
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={placeholder || `Describe what you want for ${fieldLabel.toLowerCase()}...`}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    rows={3}
                    disabled={generating}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    💡 Tip: Leave blank to auto-generate based on your company info
                  </p>
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate with AI
                    </>
                  )}
                </button>

                {/* Generated Result */}
                {generatedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm font-semibold text-purple-400">✨ AI Generated:</p>
                      <button
                        type="button"
                        onClick={() => setGeneratedText('')}
                        className="text-slate-400 hover:text-slate-300 text-xs"
                      >
                        Clear
                      </button>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{generatedText}</p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-800/50 px-6 py-4 flex justify-end gap-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!generatedText}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply to Field
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
