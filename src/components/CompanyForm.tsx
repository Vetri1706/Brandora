'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, ChevronDown, Check, X } from 'lucide-react';
import { CompanyProfile, CompanyType } from '@/types';
import { brandingApi } from '@/lib/api';
import AIWritingAssistant from '@/components/AIWritingAssistant';

interface CompanyFormProps {
  onSubmit: (profile: CompanyProfile) => void;
  isLoading: boolean;
}

export default function CompanyForm({ onSubmit, isLoading }: CompanyFormProps) {
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [brandValueSuggestions, setBrandValueSuggestions] = useState<string[]>([]);
  const [showValueSuggestions, setShowValueSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<CompanyProfile>({
    name: '',
    company_type: 'saas',
    industry: '',
    description: '',
    target_audience: '',
    brand_values: [],
    tone: 'professional',
  });
  const [brandValuesInput, setBrandValuesInput] = useState('');

  // Popular brand values for autocomplete
  const popularValues = [
    'Innovation', 'Quality', 'Trust', 'Integrity', 'Excellence',
    'Reliability', 'Transparency', 'Sustainability', 'Customer Focus',
    'Teamwork', 'Creativity', 'Accountability', 'Passion', 'Growth',
    'Security', 'Privacy', 'Speed', 'Simplicity', 'Professionalism',
    'Authenticity', 'Empowerment', 'Diversity', 'Collaboration', 'Leadership',
    'Efficiency', 'Results-Driven', 'User-Centric', 'Agility', 'Responsiveness'
  ];

  useEffect(() => {
    // Fetch company types on mount
    setLoadingTypes(true);
    brandingApi.getCompanyTypes()
      .then((response) => {
        console.log('Company types response:', response.data);
        const types = response.data.company_types || [];
        setCompanyTypes(types);
        // Set first type as default if available
        if (types.length > 0 && !formData.company_type) {
          setFormData(prev => ({ ...prev, company_type: types[0].id }));
        }
      })
      .catch((error) => {
        console.error('Failed to fetch company types:', error);
        // Set default types as fallback
        const defaultTypes = [
          { id: 'saas', name: 'SaaS', description: 'Software as a Service' },
          { id: 'fintech', name: 'FinTech', description: 'Financial Technology' },
          { id: 'ecommerce', name: 'E-Commerce', description: 'E-Commerce Platform' },
        ];
        setCompanyTypes(defaultTypes);
      })
      .finally(() => setLoadingTypes(false));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
      if (valuesRef.current && !valuesRef.current.contains(event.target as Node)) {
        setShowValueSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter brand value suggestions based on input
  useEffect(() => {
    if (brandValuesInput.trim()) {
      const filtered = popularValues.filter(value =>
        value.toLowerCase().includes(brandValuesInput.toLowerCase()) &&
        !formData.brand_values.includes(value)
      );
      setBrandValueSuggestions(filtered);
      setShowValueSuggestions(filtered.length > 0);
    } else {
      setBrandValueSuggestions([]);
      setShowValueSuggestions(false);
    }
  }, [brandValuesInput, formData.brand_values]);

  const handleAddValue = (value?: string) => {
    const valueToAdd = value || brandValuesInput.trim();
    if (valueToAdd && formData.brand_values.length < 5 && !formData.brand_values.includes(valueToAdd)) {
      setFormData({
        ...formData,
        brand_values: [...formData.brand_values, valueToAdd],
      });
      setBrandValuesInput('');
      setShowValueSuggestions(false);
    }
  };

  const handleRemoveValue = (index: number) => {
    setFormData({
      ...formData,
      brand_values: formData.brand_values.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter company name');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter company description');
      return;
    }
    if (formData.brand_values.length === 0) {
      alert('Please add at least one brand value');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Name */}
      <div className="relative">
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          What's your business name? *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your business name"
            className="w-full px-5 py-3.5 pr-28 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={isLoading}
          />
          <AIWritingAssistant
            fieldName="name"
            fieldLabel="Company Name"
            currentValue={formData.name}
            onApply={(value) => setFormData({ ...formData, name: value })}
            placeholder="Describe your business type, e.g., 'tech startup', 'healthcare platform'"
            context={{
              industry: formData.industry,
              companyType: formData.company_type
            }}
          />
        </div>
      </div>

      {/* Company Type - Custom Dropdown */}
      <div ref={dropdownRef} className="relative">
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          What type of business? *
        </label>
        <button
          type="button"
          onClick={() => setShowTypeDropdown(!showTypeDropdown)}
          disabled={isLoading || loadingTypes}
          className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between hover:bg-slate-900/70 disabled:opacity-50"
        >
          <span className="text-left">
            {loadingTypes ? (
              'Loading types...'
            ) : (
              companyTypes.find(t => t.id === formData.company_type)?.name || 'Select business type'
            )}
            {!loadingTypes && companyTypes.find(t => t.id === formData.company_type)?.description && (
              <span className="text-slate-400 text-sm ml-2">
                - {companyTypes.find(t => t.id === formData.company_type)?.description}
              </span>
            )}
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showTypeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-600/50 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto"
            >
              {companyTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, company_type: type.id });
                    setShowTypeDropdown(false);
                  }}
                  className={`w-full px-5 py-4 text-left hover:bg-slate-800 transition-all flex items-start gap-3 ${
                    formData.company_type === type.id ? 'bg-blue-600/20 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{type.name}</span>
                      {formData.company_type === type.id && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{type.description}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Industry */}
      <div className="relative">
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          What industry are you in? *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="e.g., Technology, Healthcare, Finance"
            className="w-full px-5 py-3.5 pr-28 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={isLoading}
          />
          <AIWritingAssistant
            fieldName="industry"
            fieldLabel="Industry"
            currentValue={formData.industry}
            onApply={(value) => setFormData({ ...formData, industry: value })}
            placeholder="Describe your industry briefly, e.g., 'health tech', 'fintech'"
            context={{
              companyName: formData.name,
              companyType: formData.company_type
            }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="relative">
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          Tell us about your business *
        </label>
        <div className="relative">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What does your business do? What makes you unique?"
            rows={4}
            className="w-full px-5 py-3.5 pr-28 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-3">
            <AIWritingAssistant
              fieldName="description"
              fieldLabel="Business Description"
              currentValue={formData.description}
              onApply={(value) => setFormData({ ...formData, description: value })}
              placeholder="Describe what makes your business unique..."
              context={{
                companyName: formData.name,
                industry: formData.industry,
                companyType: formData.company_type
              }}
            />
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="relative">
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          Who are your customers? *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.target_audience}
            onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
            placeholder="e.g., Small business owners, Young professionals"
            className="w-full px-5 py-3.5 pr-28 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={isLoading}
          />
          <AIWritingAssistant
            fieldName="target_audience"
            fieldLabel="Target Audience"
            currentValue={formData.target_audience}
            onApply={(value) => setFormData({ ...formData, target_audience: value })}
            placeholder="Describe your ideal customers..."
            context={{
              companyName: formData.name,
              industry: formData.industry,
              companyType: formData.company_type
            }}
          />
        </div>
      </div>

      {/* Brand Values - With Autocomplete */}
      <div ref={valuesRef} className="relative">
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          What values define your brand? (Add 1-5 values) *
        </label>
        <div className="flex gap-2 mb-3 relative">
          <div className="flex-1 relative">
            <input
              type="text"
              value={brandValuesInput}
              onChange={(e) => setBrandValuesInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddValue();
                }
              }}
              onFocus={() => {
                if (brandValuesInput.trim()) {
                  const filtered = popularValues.filter(value =>
                    value.toLowerCase().includes(brandValuesInput.toLowerCase()) &&
                    !formData.brand_values.includes(value)
                  );
                  if (filtered.length > 0) {
                    setBrandValueSuggestions(filtered);
                    setShowValueSuggestions(true);
                  }
                }
              }}
              placeholder="e.g., Innovation, Trust, Quality (or type to see suggestions)"
              className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              disabled={isLoading}
            />
            
            {/* Autocomplete Suggestions */}
            <AnimatePresence>
              {showValueSuggestions && brandValueSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-600/50 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                >
                  {brandValueSuggestions.slice(0, 10).map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAddValue(suggestion)}
                      className="w-full px-5 py-3 text-left hover:bg-slate-800 transition-all flex items-center justify-between group"
                    >
                      <span className="text-white">{suggestion}</span>
                      <span className="text-xs text-slate-500 group-hover:text-blue-400 transition-colors">
                        Click to add
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => handleAddValue()}
            disabled={isLoading || formData.brand_values.length >= 5}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
        {formData.brand_values.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.brand_values.map((value, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-600/30 transition-all"
              >
                {value}
                <button
                  type="button"
                  onClick={() => handleRemoveValue(index)}
                  className="ml-1 hover:text-blue-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-500 mt-2">
          💡 Start typing to see popular value suggestions, or add your own custom values
        </p>
      </div>

      {/* Tone */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          What's your brand's personality?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { value: 'professional', label: 'Professional', icon: '💼' },
            { value: 'creative', label: 'Creative', icon: '🎨' },
            { value: 'playful', label: 'Playful', icon: '🎉' },
            { value: 'sophisticated', label: 'Sophisticated', icon: '✨' },
            { value: 'bold', label: 'Bold', icon: '⚡' },
          ].map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => setFormData({ ...formData, tone: tone.value })}
              disabled={isLoading}
              className={`px-4 py-3 rounded-xl border-2 transition-all text-center ${
                formData.tone === tone.value
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                  : 'border-slate-600/50 bg-slate-900/30 text-slate-400 hover:border-slate-500 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-2xl mb-1">{tone.icon}</div>
              <div className="text-xs font-medium">{tone.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Your Brand Identity...
          </>
        ) : (
          <>
            Generate My Brand Identity
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>

      {/* Info Text */}
      <p className="text-center text-sm text-slate-500">
        This will take just a few seconds. We'll create logos, taglines, colors, and complete brand guidelines.
      </p>
    </form>
  );
}
