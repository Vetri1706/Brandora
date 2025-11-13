'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Download, RefreshCw, Type, Palette, 
  Circle, Square, Triangle, Maximize2, RotateCw,
  AlignCenter, AlignLeft, AlignRight, Plus, Minus
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LogoEditorProps {
  isOpen: boolean;
  onClose: () => void;
  logoData: {
    image_url: string;
    prompt_used?: string;
    style?: string;
  };
  companyName: string;
  colors: string[];
}

interface EditorState {
  // Logo properties
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  logoSize: number;
  rotation: number;
  opacity: number;
  // Text properties
  text: string;
  fontSize: number;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  showText: boolean;
  // Canvas properties
  canvasBackground: string;
  showGrid: boolean;
}

export default function LogoEditor({ 
  isOpen, 
  onClose, 
  logoData, 
  companyName,
  colors 
}: LogoEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<EditorState>({
    backgroundColor: colors[0] || '#6366F1',
    primaryColor: colors[0] || '#6366F1',
    secondaryColor: colors[1] || '#06B6D4',
    textColor: '#FFFFFF',
    logoSize: 100,
    rotation: 0,
    opacity: 100,
    text: companyName,
    fontSize: 48,
    fontFamily: 'Arial',
    textAlign: 'center',
    showText: true,
    canvasBackground: 'transparent',
    showGrid: false,
  });

  const [activeTab, setActiveTab] = useState<'colors' | 'text' | 'transform' | 'export'>('colors');
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

  // Load original image
  useEffect(() => {
    if (logoData.image_url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = logoData.image_url;
      img.onload = () => {
        setOriginalImage(img);
        redrawCanvas();
      };
    }
  }, [logoData.image_url]);

  // Redraw canvas whenever state changes
  useEffect(() => {
    if (originalImage) {
      redrawCanvas();
    }
  }, [state, originalImage]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    if (state.canvasBackground !== 'transparent') {
      ctx.fillStyle = state.canvasBackground;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Grid
    if (state.showGrid) {
      ctx.strokeStyle = '#00000020';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Save context for transformations
    ctx.save();

    // Apply transformations to logo
    const centerX = canvas.width / 2;
    const centerY = state.showText ? canvas.height / 2 - 50 : canvas.height / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.globalAlpha = state.opacity / 100;

    // Draw logo image with size adjustment
    const scale = state.logoSize / 100;
    const logoWidth = originalImage.width * scale;
    const logoHeight = originalImage.height * scale;
    
    ctx.drawImage(
      originalImage,
      -logoWidth / 2,
      -logoHeight / 2,
      logoWidth,
      logoHeight
    );

    ctx.restore();

    // Draw company name text
    if (state.showText && state.text) {
      ctx.globalAlpha = 1;
      ctx.font = `bold ${state.fontSize}px ${state.fontFamily}`;
      ctx.fillStyle = state.textColor;
      ctx.textBaseline = 'middle';

      let textX = centerX;
      if (state.textAlign === 'left') {
        ctx.textAlign = 'left';
        textX = 50;
      } else if (state.textAlign === 'right') {
        ctx.textAlign = 'right';
        textX = canvas.width - 50;
      } else {
        ctx.textAlign = 'center';
      }

      const textY = state.showText ? canvas.height / 2 + 150 : canvas.height / 2;
      
      // Text shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(state.text, textX, textY);
    }
  };

  const handleDownload = (format: 'png' | 'jpg' | 'svg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      if (format === 'svg') {
        // SVG export (basic)
        toast.success('SVG export coming soon! Use PNG for now.');
        return;
      }

      const link = document.createElement('a');
      link.download = `${companyName.toLowerCase().replace(/\s+/g, '-')}-logo.${format}`;
      
      if (format === 'jpg') {
        // Convert to JPG with white background
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.fillStyle = '#FFFFFF';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(canvas, 0, 0);
          link.href = tempCanvas.toDataURL('image/jpeg', 0.95);
        }
      } else {
        link.href = canvas.toDataURL('image/png');
      }
      
      link.click();
      toast.success(`Logo downloaded as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error('Failed to download logo');
      console.error(error);
    }
  };

  const resetChanges = () => {
    setState({
      ...state,
      logoSize: 100,
      rotation: 0,
      opacity: 100,
      fontSize: 48,
    });
    toast.success('Reset to defaults');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900/50">
            <div>
              <h2 className="text-2xl font-bold text-white">Logo Editor</h2>
              <p className="text-slate-400 text-sm">Customize your professional logo</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex h-[calc(90vh-180px)]">
            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-8">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={800}
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                  style={{
                    background: state.canvasBackground === 'transparent' 
                      ? 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)'
                      : state.canvasBackground,
                    backgroundSize: state.canvasBackground === 'transparent' ? '20px 20px' : 'auto',
                    backgroundPosition: state.canvasBackground === 'transparent' ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'auto',
                  }}
                />
              </div>
            </div>

            {/* Controls Panel */}
            <div className="w-96 bg-slate-900 border-l border-slate-700 overflow-y-auto">
              {/* Tabs */}
              <div className="flex border-b border-slate-700">
                {(['colors', 'text', 'transform', 'export'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors capitalize ${
                      activeTab === tab
                        ? 'text-white border-b-2 border-blue-500 bg-slate-800'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                {/* Colors Tab */}
                {activeTab === 'colors' && (
                  <>
                    <ControlGroup label="Canvas Background">
                      <div className="grid grid-cols-4 gap-2">
                        {['transparent', '#FFFFFF', '#000000', '#F3F4F6', state.primaryColor].map((color) => (
                          <button
                            key={color}
                            onClick={() => setState({ ...state, canvasBackground: color })}
                            className={`h-12 rounded-lg border-2 transition-all ${
                              state.canvasBackground === color
                                ? 'border-blue-500 scale-105'
                                : 'border-slate-600 hover:border-slate-500'
                            }`}
                            style={{
                              background: color === 'transparent'
                                ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%)'
                                : color,
                              backgroundSize: color === 'transparent' ? '10px 10px' : 'auto',
                            }}
                          />
                        ))}
                      </div>
                    </ControlGroup>

                    <ControlGroup label="Primary Color">
                      <ColorPicker
                        value={state.primaryColor}
                        onChange={(primaryColor) => setState({ ...state, primaryColor })}
                      />
                    </ControlGroup>

                    <ControlGroup label="Secondary Color">
                      <ColorPicker
                        value={state.secondaryColor}
                        onChange={(secondaryColor) => setState({ ...state, secondaryColor })}
                      />
                    </ControlGroup>

                    <ControlGroup label="Text Color">
                      <ColorPicker
                        value={state.textColor}
                        onChange={(textColor) => setState({ ...state, textColor })}
                      />
                    </ControlGroup>
                  </>
                )}

                {/* Text Tab */}
                {activeTab === 'text' && (
                  <>
                    <ControlGroup label="Show Company Name">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={state.showText}
                          onChange={(e) => setState({ ...state, showText: e.target.checked })}
                          className="w-5 h-5 rounded accent-blue-500"
                        />
                        <span className="text-slate-300">Display text below logo</span>
                      </label>
                    </ControlGroup>

                    {state.showText && (
                      <>
                        <ControlGroup label="Company Name">
                          <input
                            type="text"
                            value={state.text}
                            onChange={(e) => setState({ ...state, text: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </ControlGroup>

                        <ControlGroup label={`Font Size: ${state.fontSize}px`}>
                          <input
                            type="range"
                            min="24"
                            max="120"
                            value={state.fontSize}
                            onChange={(e) => setState({ ...state, fontSize: Number(e.target.value) })}
                            className="w-full accent-blue-500"
                          />
                        </ControlGroup>

                        <ControlGroup label="Font Family">
                          <select
                            value={state.fontFamily}
                            onChange={(e) => setState({ ...state, fontFamily: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none"
                          >
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Impact">Impact</option>
                          </select>
                        </ControlGroup>

                        <ControlGroup label="Text Alignment">
                          <div className="flex gap-2">
                            {([
                              { value: 'left', icon: AlignLeft },
                              { value: 'center', icon: AlignCenter },
                              { value: 'right', icon: AlignRight },
                            ] as const).map(({ value, icon: Icon }) => (
                              <button
                                key={value}
                                onClick={() => setState({ ...state, textAlign: value })}
                                className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                                  state.textAlign === value
                                    ? 'bg-blue-500 border-blue-400 text-white'
                                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                                }`}
                              >
                                <Icon size={20} className="mx-auto" />
                              </button>
                            ))}
                          </div>
                        </ControlGroup>
                      </>
                    )}
                  </>
                )}

                {/* Transform Tab */}
                {activeTab === 'transform' && (
                  <>
                    <ControlGroup label={`Logo Size: ${state.logoSize}%`}>
                      <input
                        type="range"
                        min="30"
                        max="200"
                        value={state.logoSize}
                        onChange={(e) => setState({ ...state, logoSize: Number(e.target.value) })}
                        className="w-full accent-blue-500"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => setState({ ...state, logoSize: Math.max(30, state.logoSize - 10) })}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-white transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <button
                          onClick={() => setState({ ...state, logoSize: Math.min(200, state.logoSize + 10) })}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-white transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </ControlGroup>

                    <ControlGroup label={`Rotation: ${state.rotation}°`}>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={state.rotation}
                        onChange={(e) => setState({ ...state, rotation: Number(e.target.value) })}
                        className="w-full accent-blue-500"
                      />
                    </ControlGroup>

                    <ControlGroup label={`Opacity: ${state.opacity}%`}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.opacity}
                        onChange={(e) => setState({ ...state, opacity: Number(e.target.value) })}
                        className="w-full accent-blue-500"
                      />
                    </ControlGroup>

                    <ControlGroup label="Show Grid">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={state.showGrid}
                          onChange={(e) => setState({ ...state, showGrid: e.target.checked })}
                          className="w-5 h-5 rounded accent-blue-500"
                        />
                        <span className="text-slate-300">Display alignment grid</span>
                      </label>
                    </ControlGroup>

                    <button
                      onClick={resetChanges}
                      className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} />
                      Reset to Defaults
                    </button>
                  </>
                )}

                {/* Export Tab */}
                {activeTab === 'export' && (
                  <>
                    <ControlGroup label="Export Format">
                      <div className="space-y-3">
                        {[
                          { format: 'png', label: 'PNG (Transparent)', desc: 'Best for web and print' },
                          { format: 'jpg', label: 'JPG (White BG)', desc: 'Smaller file size' },
                          { format: 'svg', label: 'SVG (Vector)', desc: 'Coming soon', disabled: true },
                        ].map(({ format, label, desc, disabled }) => (
                          <button
                            key={format}
                            onClick={() => !disabled && handleDownload(format as 'png' | 'jpg' | 'svg')}
                            disabled={disabled}
                            className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                              disabled
                                ? 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-slate-800 border-slate-600 hover:border-blue-500 hover:bg-slate-700 text-white'
                            }`}
                          >
                            <div className="font-semibold">{label}</div>
                            <div className="text-sm text-slate-400">{desc}</div>
                          </button>
                        ))}
                      </div>
                    </ControlGroup>

                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-slate-400 text-sm mb-4">Quick Export Sizes:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { size: '512x512', label: 'Social' },
                          { size: '1024x1024', label: 'Print' },
                          { size: '256x256', label: 'Favicon' },
                          { size: '2048x2048', label: 'HD' },
                        ].map(({ size, label }) => (
                          <button
                            key={size}
                            onClick={() => toast.success(`Size presets coming soon!`)}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white text-sm transition-colors"
                          >
                            <div className="font-semibold">{label}</div>
                            <div className="text-xs text-slate-400">{size}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700 bg-slate-900/50">
            <p className="text-slate-400 text-sm">
              💡 Tip: Use the grid for precise alignment
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload('png')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                <Download size={18} />
                Download PNG
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper Components
function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      {children}
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-16 h-10 rounded border-2 border-slate-600 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono text-sm focus:border-blue-500 outline-none"
      />
    </div>
  );
}
