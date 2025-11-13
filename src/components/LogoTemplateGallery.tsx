'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Palette, Type, Download, Star, Grid3X3, Search, Filter } from 'lucide-react';

interface LogoTemplate {
  id: string;
  name: string;
  category: string;
  style: string;
  colors: string[];
  preview: string; // SVG or base64
  isPopular?: boolean;
  tags: string[];
}

interface LogoTemplateGalleryProps {
  onSelectTemplate: (template: LogoTemplate) => void;
  onEditTemplate: (template: LogoTemplate) => void;
}

export default function LogoTemplateGallery({ onSelectTemplate, onEditTemplate }: LogoTemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<LogoTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Realistic, professional logo templates matching the reference image quality
  const logoTemplates: LogoTemplate[] = [
    {
      id: 'venture-capital',
      name: 'Venture Capital',
      category: 'business',
      style: 'modern',
      colors: ['#2563EB', '#1E40AF'],
      preview: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="70" fill="#2563EB" stroke="#1E40AF" stroke-width="2"/>
        <circle cx="100" cy="100" r="50" fill="none" stroke="white" stroke-width="1.5" opacity="0.3"/>
        <polygon points="100,70 85,90 85,110 100,130 115,110 115,90" fill="white"/>
        <text x="100" y="165" text-anchor="middle" fill="#2563EB" font-family="Arial, sans-serif" font-size="12" font-weight="bold">VENTURE CAP</text>
      </svg>`,
      isPopular: true,
      tags: ['business', 'finance', 'professional']
    },
    {
      id: 'natural-organics',
      name: 'Natural Organics',
      category: 'lifestyle',
      style: 'organic',
      colors: ['#10B981', '#059669'],
      preview: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="70" fill="white" stroke="#10B981" stroke-width="3"/>
        <ellipse cx="100" cy="90" rx="25" ry="35" fill="#10B981"/>
        <ellipse cx="85" cy="105" rx="20" ry="15" fill="#059669"/>
        <ellipse cx="115" cy="105" rx="20" ry="15" fill="#059669"/>
        <text x="100" y="165" text-anchor="middle" fill="#10B981" font-family="Arial, sans-serif" font-size="12" font-weight="bold">NATURALS</text>
        <text x="100" y="177" text-anchor="middle" fill="#059669" font-family="Arial, sans-serif" font-size="8">ONLY LANE</text>
      </svg>`,
      isPopular: true,
      tags: ['nature', 'organic', 'eco']
    },
    {
      id: 'wanderlust-travel',
      name: 'Wanderlust Travel',
      category: 'travel',
      style: 'elegant',
      colors: ['#374151', '#6B7280'],
      preview: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="70" width="100" height="70" rx="8" fill="#374151"/>
        <rect x="60" y="80" width="80" height="50" rx="4" fill="#6B7280"/>
        <polygon points="100,95 90,105 100,115 110,105" fill="white"/>
        <text x="100" y="160" text-anchor="middle" fill="#374151" font-family="serif" font-size="11" font-weight="bold">WANDERLUST</text>
        <text x="100" y="172" text-anchor="middle" fill="#6B7280" font-family="serif" font-size="8">LUXURY TRAVEL</text>
      </svg>`,
      tags: ['travel', 'luxury', 'elegant']
    },
    {
      id: 'invicta-creative',
      name: 'Invicta Creative',
      category: 'creative',
      style: 'artistic',
      colors: ['#8B5CF6', '#EC4899'],
      preview: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="invictaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8B5CF6"/>
            <stop offset="100%" style="stop-color:#EC4899"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="70" fill="url(#invictaGrad)"/>
        <circle cx="100" cy="100" r="30" fill="white" opacity="0.9"/>
        <text x="100" y="105" text-anchor="middle" fill="#8B5CF6" font-family="serif" font-size="20" font-weight="bold">I</text>
        <text x="100" y="165" text-anchor="middle" fill="#8B5CF6" font-family="serif" font-size="14" font-weight="bold">INVICTA</text>
        <text x="100" y="177" text-anchor="middle" fill="#EC4899" font-family="serif" font-size="8">STAND OUT</text>
      </svg>`,
      isPopular: true,
      tags: ['creative', 'artistic', 'colorful']
    },
    {
      id: 'premiere-badge',
      name: 'Premiere Badge',
      category: 'business',
      style: 'premium',
      colors: ['#DC2626', '#B91C1C'],
      preview: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="70" fill="#DC2626"/>
        <circle cx="100" cy="100" r="50" fill="none" stroke="white" stroke-width="2"/>
        <polygon points="100,70 110,85 125,85 115,95 120,110 100,105 80,110 85,95 75,85 90,85" fill="white"/>
        <text x="100" y="160" text-anchor="middle" fill="#DC2626" font-family="Arial, sans-serif" font-size="12" font-weight="bold">PREMIERE</text>
        <text x="100" y="172" text-anchor="middle" fill="#B91C1C" font-family="Arial, sans-serif" font-size="8">BRAND OUT</text>
      </svg>`,
      tags: ['premium', 'badge', 'award']
    },
    {
      id: 'unity-building',
      name: 'Unity Building',
      category: 'construction',
      style: 'industrial',
      colors: ['#374151', '#6B7280'],
      preview: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="80" width="80" height="60" fill="#374151"/>
        <rect x="70" y="90" width="12" height="15" fill="#6B7280"/>
        <rect x="86" y="90" width="12" height="15" fill="#6B7280"/>
        <rect x="102" y="90" width="12" height="15" fill="#6B7280"/>
        <rect x="118" y="90" width="12" height="15" fill="#6B7280"/>
        <rect x="70" y="110" width="12" height="15" fill="#6B7280"/>
        <rect x="86" y="110" width="12" height="15" fill="#6B7280"/>
        <rect x="102" y="110" width="12" height="15" fill="#6B7280"/>
        <rect x="118" y="110" width="12" height="15" fill="#6B7280"/>
        <text x="100" y="160" text-anchor="middle" fill="#374151" font-family="Arial, sans-serif" font-size="11" font-weight="bold">BUILDING CO.</text>
        <text x="100" y="172" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="8">TRUSTED PARTNERS</text>
      </svg>`,
      tags: ['construction', 'building', 'industrial']
    },
    {
      id: 'nexus-tech',
      name: 'Nexus Tech',
      category: 'technology',
      style: 'minimal',
      colors: ['#3B82F6', '#1E40AF'],
      preview: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="60" width="80" height="80" rx="8" fill="none" stroke="#3B82F6" stroke-width="3"/>
        <circle cx="100" cy="100" r="20" fill="#1E40AF"/>
        <circle cx="100" cy="100" r="8" fill="white"/>
        <text x="100" y="165" text-anchor="middle" fill="#3B82F6" font-family="Arial, sans-serif" font-size="14" font-weight="300">NEXUS</text>
        <text x="100" y="177" text-anchor="middle" fill="#1E40AF" font-family="Arial, sans-serif" font-size="8">TECHNOLOGY</text>
      </svg>`,
      tags: ['technology', 'minimal', 'clean']
    },
    {
      id: 'artisan-coffee',
      name: 'Artisan Coffee',
      category: 'food',
      style: 'artisan',
      colors: ['#D97706', '#F59E0B'],
      preview: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="70" fill="#F59E0B"/>
        <ellipse cx="100" cy="95" rx="25" ry="30" fill="#D97706"/>
        <rect x="95" y="70" width="10" height="15" rx="5" fill="#D97706"/>
        <path d="M85 80 Q100 72 115 80" stroke="#D97706" stroke-width="2" fill="none"/>
        <text x="100" y="160" text-anchor="middle" fill="#D97706" font-family="serif" font-size="12" font-weight="bold">ARTISAN</text>
        <text x="100" y="172" text-anchor="middle" fill="#F59E0B" font-family="serif" font-size="8">COFFEE ROASTERS</text>
      </svg>`,
      tags: ['coffee', 'artisan', 'food']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: logoTemplates.length },
    { id: 'business', name: 'Business & Finance', count: logoTemplates.filter(t => t.category === 'business').length },
    { id: 'technology', name: 'Technology & Innovation', count: logoTemplates.filter(t => t.category === 'technology').length },
    { id: 'creative', name: 'Creative & Arts', count: logoTemplates.filter(t => t.category === 'creative').length },
    { id: 'lifestyle', name: 'Lifestyle & Wellness', count: logoTemplates.filter(t => t.category === 'lifestyle').length },
    { id: 'food', name: 'Food & Beverage', count: logoTemplates.filter(t => t.category === 'food').length },
    { id: 'travel', name: 'Travel & Hospitality', count: logoTemplates.filter(t => t.category === 'travel').length },
    { id: 'construction', name: 'Construction & Real Estate', count: logoTemplates.filter(t => t.category === 'construction').length }
  ];

  const filteredTemplates = logoTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const popularTemplates = logoTemplates.filter(t => t.isPopular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Logo Templates</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose from our curated collection of professional logo templates. 
            Customize colors, text, and styling to match your brand.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search templates by name or style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Popular Templates Section */}
        {selectedCategory === 'all' && popularTemplates.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="text-yellow-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Popular Templates</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularTemplates.map((template) => (
                <TemplateCard
                  key={`popular-${template.id}`}
                  template={template}
                  onSelect={() => onSelectTemplate(template)}
                  onEdit={() => onEditTemplate(template)}
                  showPopularBadge
                />
              ))}
            </div>
          </div>
        )}

        {/* All Templates Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedCategory === 'all' ? 'All Templates' : `${categories.find(c => c.id === selectedCategory)?.name} Templates`}
            <span className="text-slate-400 text-lg ml-2">({filteredTemplates.length})</span>
          </h2>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 text-xl mb-4">No templates found</div>
            <p className="text-slate-500">Try adjusting your search or category filters</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => onSelectTemplate(template)}
                onEdit={() => onEditTemplate(template)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: LogoTemplate;
  onSelect: () => void;
  onEdit: () => void;
  showPopularBadge?: boolean;
  viewMode?: 'grid' | 'list';
}

function TemplateCard({ template, onSelect, onEdit, showPopularBadge, viewMode = 'grid' }: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* Popular Badge */}
      {showPopularBadge && template.isPopular && (
        <div className="absolute top-3 right-3 z-10 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Star size={12} />
          Popular
        </div>
      )}

      {/* Logo Preview */}
      <div className={`relative bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center ${
        viewMode === 'list' ? 'w-48 h-32' : 'h-48'
      }`}>
        <div 
          className="w-32 h-32 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: template.preview }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={onSelect}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Use Template
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <Edit2 size={16} />
            Customize
          </button>
        </div>
      </div>

      {/* Template Info */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <h3 className="text-white font-semibold text-lg mb-2">{template.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium capitalize">
            {template.category}
          </span>
          <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium capitalize">
            {template.style}
          </span>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-2 mb-3">
          <Palette size={16} className="text-slate-400" />
          <div className="flex gap-1">
            {template.colors.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-slate-600"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded text-xs">
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {viewMode === 'list' && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={onSelect}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Use Template
            </button>
            <button
              onClick={onEdit}
              className="flex-1 px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 size={16} />
              Customize
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}