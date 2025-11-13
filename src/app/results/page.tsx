'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Edit2, Save, Download, Share2, ArrowLeft, Sparkles, RefreshCcw, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import LogoEditor from '@/components/LogoEditor';
import GodModeAssistant from '@/components/GodModeAssistant';
import { BrandingResponse } from '@/types';
import { brandingApi } from '@/lib/api';

export default function ResultsPage() {
  const router = useRouter();
  const [branding, setBranding] = useState<BrandingResponse | null>(null);
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [editedValues, setEditedValues] = useState<any>({});
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<any>(null);
  const [selectedLogoIndex, setSelectedLogoIndex] = useState<number>(0);
  const [showRefineModal, setShowRefineModal] = useState(false);
  const [showGodMode, setShowGodMode] = useState(false);
  const [refineInputs, setRefineInputs] = useState({
    feedback: '',
    focusArea: 'all'
  });

  // --- Dynamic color helpers ---
  const clamp = (n: number, min = 0, max = 255) => Math.max(min, Math.min(max, n));
  const hexToRgb = (hex?: string) => {
    if (!hex || typeof hex !== 'string') return null;
    const normalized = hex.replace('#', '');
    if (![3, 6].includes(normalized.length)) return null;
    const full = normalized.length === 3
      ? normalized.split('').map((c) => c + c).join('')
      : normalized;
    const num = parseInt(full, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return { r, g, b };
  };
  const rgbToHex = (r: number, g: number, b: number) =>
    `#${[r, g, b].map((v) => clamp(Math.round(v)).toString(16).padStart(2, '0')).join('')}`;
  const lighten = (hex: string, amt = 20) => {
    const rgb = hexToRgb(hex); if (!rgb) return hex;
    return rgbToHex(rgb.r + (255 - rgb.r) * (amt / 100), rgb.g + (255 - rgb.g) * (amt / 100), rgb.b + (255 - rgb.b) * (amt / 100));
  };
  const darken = (hex: string, amt = 20) => {
    const rgb = hexToRgb(hex); if (!rgb) return hex;
    return rgbToHex(rgb.r * (1 - amt / 100), rgb.g * (1 - amt / 100), rgb.b * (1 - amt / 100));
  };
  const pickHex = (val: any) => typeof val === 'string' ? val : (val?.hex || val);

  const { primary, secondary, primaryDark, secondaryDark, primaryLight } = useMemo(() => {
    // Fallback premium theme (indigo/cyan)
    const fallbackPrimary = '#6366F1';
    const fallbackSecondary = '#06B6D4';
    const palette = editedValues?.color_palette || {};
    // filter usable colors, ignore non-color meta keys
    const entries = Object.entries(palette)
      .filter(([name]) => !['psychology', 'usage_guidelines'].includes(name))
      .map(([, v]) => pickHex(v))
      .filter((c) => typeof c === 'string' && (c as string).startsWith('#')) as string[];

    const p = (palette.primary && pickHex(palette.primary)) || entries[0] || fallbackPrimary;
    const s = (palette.secondary && pickHex(palette.secondary)) || entries[1] || fallbackSecondary;
    const primaryHex = typeof p === 'string' ? p : fallbackPrimary;
    const secondaryHex = typeof s === 'string' ? s : fallbackSecondary;
    return {
      primary: primaryHex,
      secondary: secondaryHex,
      primaryDark: darken(primaryHex, 45),
      secondaryDark: darken(secondaryHex, 45),
      primaryLight: lighten(primaryHex, 20),
    };
  }, [editedValues?.color_palette]);

  useEffect(() => {
    const storedBranding = localStorage.getItem('latest_branding');
    if (storedBranding) {
      const data = JSON.parse(storedBranding);
      setBranding(data);
      setEditedValues(data);
    } else {
      toast.error('No branding data found');
      router.push('/generate');
    }
  }, [router]);

  const handleEdit = (field: string) => {
    setIsEditing({ ...isEditing, [field]: true });
  };
    

  const handleSave = (field: string) => {
    setIsEditing({ ...isEditing, [field]: false });
    setBranding(editedValues);
    localStorage.setItem('latest_branding', JSON.stringify(editedValues));
    toast.success('Changes saved!');
  };
                

  const handleExport = () => {
    const dataStr = JSON.stringify(editedValues, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${editedValues.brand_name || 'branding'}-identity.json`;
    link.click();
    toast.success('Exported successfully!');
  };

  const openLogoEditor = (logo: any, index: number) => {
    setSelectedLogo(logo);
    setSelectedLogoIndex(index);
    setEditorOpen(true);
  };

  const handleRefineRegenerate = async () => {
    try {
      toast.loading('Regenerating with your feedback...', { id: 'refine' });
      
      // Get original company profile (stored in branding data)
      const companyProfile = (branding as any)?.company_profile || (editedValues as any)?.company_profile || {
        name: editedValues.brand_name || 'Company',
        company_type: 'saas',
        industry: 'Technology',
        description: 'Tech company',
        target_audience: 'Enterprise',
        brand_values: ['Innovation', 'Quality'],
        tone: 'professional'
      };
      
      // Add feedback as additional context
      const refinedProfile = {
        ...companyProfile,
        additional_context: `${companyProfile?.additional_context || ''}. User feedback: ${refineInputs.feedback}`
      };

      // Make API call to regenerate using centralized API client
      const { data } = await brandingApi.generateBranding({
        company_id: Date.now().toString(),
        company_profile: refinedProfile,
        num_variations: 3,
        focus: refineInputs.focusArea,
      });
      
      // Merge new results with existing ones based on focus
      let updatedData = { ...editedValues };
      
      if (refineInputs.focusArea === 'logo' || refineInputs.focusArea === 'all') {
        updatedData.logos = data.logos || data.logo_prompts;
      }
      if (refineInputs.focusArea === 'tagline' || refineInputs.focusArea === 'all') {
        updatedData.taglines = data.taglines;
      }
      if (refineInputs.focusArea === 'palette' || refineInputs.focusArea === 'all') {
        updatedData.color_palette = data.color_palette;
      }
      if (refineInputs.focusArea === 'typography' || refineInputs.focusArea === 'all') {
        updatedData.typography = data.typography;
      }
      if (refineInputs.focusArea === 'all') {
        updatedData.brand_guidelines = data.brand_guidelines;
      }

      setBranding(updatedData);
      setEditedValues(updatedData);
      localStorage.setItem('latest_branding', JSON.stringify(updatedData));
      
      toast.success('Regenerated successfully!', { id: 'refine' });
      setShowRefineModal(false);
      setRefineInputs({ feedback: '', focusArea: 'all' });
    } catch (error: any) {
      console.error('Refine error:', error?.response?.data || error?.message || error);
      const msg = error?.response?.data?.detail || 'Failed to regenerate. Please try again.';
      toast.error(msg, { id: 'refine' });
    }
  };

  // Extract colors for editor
  const brandColors = useMemo(() => {
    const palette = editedValues?.color_palette || {};
    return Object.entries(palette)
      .filter(([name]) => !['psychology', 'usage_guidelines'].includes(name))
      .map(([, v]) => pickHex(v))
      .filter((c) => typeof c === 'string' && (c as string).startsWith('#')) as string[];
  }, [editedValues?.color_palette]);

  if (!branding) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${primaryDark} 0%, ${secondaryDark} 50%, #0b1220 100%)`,
        }}
      >
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        // Brand-aware background gradient
        background: `linear-gradient(135deg, ${primaryDark} 0%, #0b1220 45%, ${secondaryDark} 100%)`,
      }}
    >
      <Toaster position="top-right" />
      <Header />

      {/* Logo Editor Modal */}
      {editorOpen && selectedLogo && (
        <LogoEditor
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          logoData={selectedLogo}
          companyName={editedValues.company_profile?.name || editedValues.brand_name || 'Your Company'}
          colors={brandColors}
        />
      )}

      {/* God Mode Modal */}
      <GodModeAssistant
        isOpen={showGodMode}
        onClose={() => setShowGodMode(false)}
        companyProfile={editedValues?.company_profile || {
          name: editedValues.brand_name,
          company_type: 'saas',
          industry: 'Technology',
          description: 'Tech company',
          target_audience: 'Enterprise',
          brand_values: ['Innovation','Quality'],
          tone: 'professional'
        }}
        onResult={(data: any) => {
          const updatedData = { ...editedValues, ...data };
          setEditedValues(updatedData);
          setBranding(updatedData);
          localStorage.setItem('latest_branding', JSON.stringify(updatedData));
        }}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white transition-colors"
            style={{ color: 'white' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = primaryLight; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
            <button
              onClick={() => setShowGodMode(true)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors bg-gradient-to-r from-violet-600 to-fuchsia-600"
            >
              <Sparkles size={18} />
              God Mode
            </button>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
              style={{ backgroundColor: primary, boxShadow: `0 0 0 1px ${darken(primary, 15)} inset` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = darken(primary, 10); }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = primary; }}
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => toast.success('Share feature coming soon!')}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
              style={{ backgroundColor: secondary, boxShadow: `0 0 0 1px ${darken(secondary, 15)} inset` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = darken(secondary, 10); }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = secondary; }}
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            {editedValues.brand_name || 'Your Brand'}
          </h1>
          <p className="text-xl text-slate-300">Your Complete Brand Identity</p>
        </motion.div>

        {/* Logo Designs */}
        <Section title="Logo Designs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(editedValues.logos || editedValues.logo_prompts)?.map((logo: any, index: number) => {
              // Handle both formats: object with prompt_used and image_url, or simple string
              const promptText = typeof logo === 'string' ? logo : logo?.prompt_used || logo?.description || '';
              const imageUrl = typeof logo === 'object' ? logo?.image_url : null;
              const logoStyle = typeof logo === 'object' ? logo?.style : 'Modern';
              
              // Debug logging
              if (index === 0) {
                console.log('Logo data:', logo);
                console.log('Image URL:', imageUrl);
                console.log('Image URL length:', imageUrl ? imageUrl.length : 0);
              }
              
              return (
                <motion.div
                  key={`logo-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm border rounded-xl p-6 transition-all"
                  style={{ borderColor: darken(primary, 40) }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">Logo {index + 1} - {logoStyle}</h3>
                  </div>

                  {/* Display Logo Image */}
                  {imageUrl && (
                    <div className="mb-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[350px]">
                      <img 
                        src={imageUrl} 
                        alt={`Logo ${index + 1}`}
                        className="max-w-full max-h-[240px] object-contain mb-6"
                      />
                      {/* Company Name under logo */}
                      <div className="text-center">
                        <h4 className="text-3xl font-bold text-slate-800 mb-1">
                          {editedValues.company_profile?.name || 'Your Company'}
                        </h4>
                        <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">
                          {logoStyle} Style
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Show prompt in an info box */}
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-sm font-medium" style={{ color: secondary }}>Design Brief:</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{promptText}</p>
                  </div>

                  {/* Download Button */}
                  {imageUrl && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = imageUrl;
                          link.download = `logo-${index + 1}.png`;
                          link.click();
                        }}
                        className="flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        style={{ backgroundColor: primary }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = darken(primary, 10); }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = primary; }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => openLogoEditor(logo, index)}
                        className="flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        style={{ backgroundColor: secondary }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = darken(secondary, 10); }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = secondary; }}
                      >
                        <Sparkles className="w-5 h-5" />
                        Edit Logo
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* Taglines */}
        <Section title="Taglines">
          {editedValues.taglines?.map((tagline: any, index: number) => (
            <EditableCard
              key={`tagline-${index}`}
              title={`Tagline ${index + 1}`}
              value={typeof tagline === 'string' ? tagline : tagline.text || ''}
              isEditing={isEditing[`tagline-${index}`]}
              onEdit={() => handleEdit(`tagline-${index}`)}
              onSave={() => handleSave(`tagline-${index}`)}
              onChange={(value) => {
                const newTaglines = [...editedValues.taglines];
                // Keep the object structure but update the text
                if (typeof newTaglines[index] === 'object') {
                  newTaglines[index] = { ...newTaglines[index], text: value };
                } else {
                  newTaglines[index] = value;
                }
                setEditedValues({ ...editedValues, taglines: newTaglines });
              }}
            />
          ))}
        </Section>

        {/* Color Palette */}
        <Section title="Color Palette">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {editedValues.color_palette &&
              Object.entries(editedValues.color_palette)
                .filter(([name]) => name !== 'psychology' && name !== 'usage_guidelines')
                .map(([name, color]: [string, any]) => {
                  // Handle both string format and object format from backend
                  const hexColor = typeof color === 'string' ? color : color?.hex || color;
                  if (!hexColor || typeof hexColor !== 'string') return null;
                  
                  return (
                    <ColorCard
                      key={name}
                      name={name}
                      color={hexColor}
                      onChange={(newColor) => {
                        setEditedValues({
                          ...editedValues,
                          color_palette: {
                            ...editedValues.color_palette,
                            [name]: newColor,
                          },
                        });
                      }}
                    />
                  );
                })}
          </div>
        </Section>

        {/* Typography */}
        {editedValues.typography && (
          <Section title="Typography">
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(editedValues.typography).map(([type, font]: [string, any]) => (
                <TypographyCard
                  key={type}
                  type={type}
                  font={font as string}
                  onChange={(newFont) => {
                    setEditedValues({
                      ...editedValues,
                      typography: {
                        ...editedValues.typography,
                        [type]: newFont,
                      },
                    });
                  }}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Brand Guidelines */}
        <Section title="Brand Guidelines">
          <EditableCard
            title="Guidelines"
            value={editedValues.brand_guidelines || ''}
            isEditing={isEditing['guidelines']}
            onEdit={() => handleEdit('guidelines')}
            onSave={() => handleSave('guidelines')}
            onChange={(value) => setEditedValues({ ...editedValues, brand_guidelines: value })}
            isTextArea
          />
        </Section>

        {/* Not Satisfied? Regenerate Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-orange-400" />
            <h3 className="text-2xl font-bold text-white mb-3">Not Satisfied with the Results?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Let us refine and regenerate your brand identity! Tell us what you'd like to change, 
              and we'll create new options tailored to your feedback.
            </p>
            <button
              onClick={() => setShowRefineModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/30"
            >
              <RefreshCcw size={20} />
              Refine & Regenerate
            </button>
          </div>
        </motion.div>

        {/* Refine Modal */}
        {showRefineModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-700"
            >
              <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <RefreshCcw size={24} className="text-white" />
                  <h3 className="text-xl font-bold text-white">Refine & Regenerate</h3>
                </div>
                <button
                  onClick={() => setShowRefineModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    What would you like to change?
                  </label>
                  <textarea
                    value={refineInputs.feedback}
                    onChange={(e) => setRefineInputs({ ...refineInputs, feedback: e.target.value })}
                    placeholder="E.g., 'Make logos more modern', 'Use different colors', 'More professional tone'..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    What to regenerate?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { value: 'all', label: 'Everything', icon: '🎯' },
                      { value: 'logo', label: 'Logos Only', icon: '🎨' },
                      { value: 'tagline', label: 'Taglines', icon: '✍️' },
                      { value: 'palette', label: 'Colors', icon: '🎨' },
                      { value: 'typography', label: 'Typography', icon: '🔤' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRefineInputs({ ...refineInputs, focusArea: option.value })}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                          refineInputs.focusArea === option.value
                            ? 'border-orange-500 bg-orange-600/20 text-orange-300'
                            : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-xl mb-1">{option.icon}</div>
                        <div className="text-xs font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowRefineModal(false)}
                    className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRefineRegenerate}
                    disabled={!refineInputs.feedback.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={18} />
                    Regenerate Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

function EditableCard({
  title,
  value,
  isEditing,
  onEdit,
  onSave,
  onChange,
  isTextArea = false,
}: {
  title: string;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onChange: (value: string) => void;
  isTextArea?: boolean;
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button
          onClick={isEditing ? onSave : onEdit}
          className="transition-colors"
          style={{ color: '#ffffff' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#cbd5e1'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
        >
          {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
        </button>
      </div>
      {isEditing ? (
        isTextArea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none"
            rows={10}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
          />
        )
      ) : (
        <p className="text-slate-300 whitespace-pre-wrap">{value}</p>
      )}
    </div>
  );
}

function ColorCard({
  name,
  color,
  onChange,
}: {
  name: string;
  color: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
      <div
        className="w-full h-24 rounded-lg mb-3 cursor-pointer relative group"
        style={{ backgroundColor: color }}
      >
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2 size={24} className="text-white drop-shadow-lg" />
        </div>
      </div>
      <p className="text-white font-medium capitalize">{name}</p>
      <p className="text-slate-400 text-sm font-mono">{color}</p>
    </div>
  );
}

function TypographyCard({
  type,
  font,
  onChange,
}: {
  type: string;
  font: string;
  onChange: (font: string) => void;
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <p className="text-slate-400 text-sm mb-2 capitalize">{type}</p>
      <input
        type="text"
        value={font}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white mb-3"
      />
      <p className="text-2xl text-white" style={{ fontFamily: font }}>
        The quick brown fox
      </p>
    </div>
  );
}
