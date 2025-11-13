'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Download, 
  ArrowLeft, 
  Type, 
  Palette, 
  RotateCcw, 
  Copy,
  Layers,
  Move,
  Sliders
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LogoTemplate {
  id: string;
  name: string;
  category: string;
  style: string;
  colors: string[];
  preview: string;
  tags: string[];
}

interface TemplateEditorProps {
  template: LogoTemplate;
  onClose: () => void;
  onSave: (editedTemplate: LogoTemplate) => void;
}

export default function TemplateEditor({ template, onClose, onSave }: TemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<LogoTemplate>(template);
  const [selectedElement, setSelectedElement] = useState<string>('text');
  const [customText, setCustomText] = useState('YOUR COMPANY');
  const [customSubtext, setCustomSubtext] = useState('TAGLINE');
  const [selectedColors, setSelectedColors] = useState(template.colors);
  const [logoSize, setLogoSize] = useState(100);
  const [logoRotation, setLogoRotation] = useState(0);
  const [textSize, setTextSize] = useState(14);
  const [subtextSize, setSubtextSize] = useState(8);
  const svgRef = useRef<HTMLDivElement>(null);

  // Color presets for quick selection
  const colorPresets = [
    ['#2563EB', '#1E40AF'], // Blue
    ['#059669', '#10B981'], // Green
    ['#DC2626', '#B91C1C'], // Red
    ['#7C3AED', '#EC4899'], // Purple/Pink
    ['#F59E0B', '#D97706'], // Orange
    ['#0F172A', '#64748B'], // Dark
    ['#6366F1', '#8B5CF6'], // Indigo/Violet
    ['#06B6D4', '#0891B2'], // Cyan
  ];

  // Generate updated SVG with current customizations
  const generateCustomSVG = () => {
    // This is a simplified example - in a real implementation, 
    // you'd have a more sophisticated SVG manipulation system
    let customSVG = template.preview;
    
    // Replace colors in the SVG
    selectedColors.forEach((color, index) => {
      if (template.colors[index]) {
        const regex = new RegExp(template.colors[index].replace('#', '\\#'), 'g');
        customSVG = customSVG.replace(regex, color);
      }
    });

    // Update text content
    customSVG = customSVG.replace(/YOUR COMPANY|VENTURE CAP|ORGANIC LANE|WANDERLUST|INVICTA|PREMIERE|BUILDING CO\.|TECH|COFFEE/g, customText.toUpperCase());
    customSVG = customSVG.replace(/TAGLINE|LUXURY TRAVEL|STAND OUT|BRAND OUT|TRUSTED PARTNERS|ROASTERS/g, customSubtext.toUpperCase());
    
    // Update font sizes
    customSVG = customSVG.replace(/font-size="14"/g, `font-size="${textSize}"`);
    customSVG = customSVG.replace(/font-size="12"/g, `font-size="${textSize}"`);
    customSVG = customSVG.replace(/font-size="16"/g, `font-size="${textSize}"`);
    customSVG = customSVG.replace(/font-size="8"/g, `font-size="${subtextSize}"`);
    customSVG = customSVG.replace(/font-size="11"/g, `font-size="${subtextSize}"`);

    return customSVG;
  };

  const handleColorChange = (colorIndex: number, newColor: string) => {
    const newColors = [...selectedColors];
    newColors[colorIndex] = newColor;
    setSelectedColors(newColors);
  };

  const applyColorPreset = (preset: string[]) => {
    setSelectedColors(preset);
  };

  const resetToOriginal = () => {
    setEditedTemplate(template);
    setSelectedColors(template.colors);
    setCustomText('YOUR COMPANY');
    setCustomSubtext('TAGLINE');
    setLogoSize(100);
    setLogoRotation(0);
    setTextSize(14);
    setSubtextSize(8);
    toast.success('Reset to original template');
  };

  const handleSave = () => {
    const updatedTemplate = {
      ...editedTemplate,
      colors: selectedColors,
      preview: generateCustomSVG(),
      name: `${customText} Logo`
    };
    onSave(updatedTemplate);
    toast.success('Template saved successfully!');
  };

  const handleDownload = () => {
    const svgContent = generateCustomSVG();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${customText.toLowerCase().replace(/\s+/g, '-')}-logo.svg`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Logo downloaded!');
  };

  const copyToClipboard = () => {
    const svgContent = generateCustomSVG();
    navigator.clipboard.writeText(svgContent).then(() => {
      toast.success('SVG code copied to clipboard!');
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex">
      {/* Left Panel - Controls */}
      <div className="w-80 bg-slate-900 border-r border-slate-700 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Logo Editor</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          {/* Template Info */}
          <div className="mb-6 p-4 bg-slate-800 rounded-lg">
            <h3 className="text-white font-medium mb-2">{template.name}</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                {template.category}
              </span>
              <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                {template.style}
              </span>
            </div>
          </div>

          {/* Text Controls */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Type className="text-blue-400" size={20} />
              <h3 className="text-white font-medium">Text Content</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tagline/Subtext
                </label>
                <input
                  type="text"
                  value={customSubtext}
                  onChange={(e) => setCustomSubtext(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter tagline"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Text Size
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-400">{textSize}px</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Subtext Size
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="12"
                    value={subtextSize}
                    onChange={(e) => setSubtextSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-400">{subtextSize}px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Controls */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="text-purple-400" size={20} />
              <h3 className="text-white font-medium">Colors</h3>
            </div>

            {/* Current Colors */}
            <div className="space-y-3 mb-4">
              {selectedColors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-slate-600 cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'color';
                      input.value = color;
                      input.onchange = (e) => handleColorChange(index, (e.target as HTMLInputElement).value);
                      input.click();
                    }}
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>

            {/* Color Presets */}
            <div className="grid grid-cols-4 gap-2">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyColorPreset(preset)}
                  className="h-8 rounded-lg border border-slate-600 hover:border-slate-400 transition-colors flex"
                  style={{
                    background: `linear-gradient(135deg, ${preset[0]}, ${preset[1]})`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Transform Controls */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="text-green-400" size={20} />
              <h3 className="text-white font-medium">Transform</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Size
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-slate-400">{logoSize}%</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rotation
                </label>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={logoRotation}
                  onChange={(e) => setLogoRotation(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-slate-400">{logoRotation}°</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={resetToOriginal}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Reset to Original
            </button>

            <button
              onClick={copyToClipboard}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              Copy SVG Code
            </button>

            <button
              onClick={handleDownload}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download SVG
            </button>

            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Template
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Live Preview</h3>
          
          {/* Logo Preview */}
          <div className="bg-white rounded-2xl p-12 shadow-2xl mx-auto max-w-md">
            <div 
              ref={svgRef}
              className="transition-all duration-300"
              style={{
                transform: `scale(${logoSize / 100}) rotate(${logoRotation}deg)`,
                transformOrigin: 'center'
              }}
              dangerouslySetInnerHTML={{ __html: generateCustomSVG() }}
            />
          </div>

          {/* Preview Info */}
          <div className="mt-8 text-slate-300">
            <p className="text-lg font-medium">{customText}</p>
            <p className="text-sm">{customSubtext}</p>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Download size={20} />
              Download
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Save size={20} />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}