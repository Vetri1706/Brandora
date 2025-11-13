/**
 * Zustand store for application state management
 */
import create from 'zustand';
import { BrandingResponse, CompanyProfile } from '@/types';

interface BrandingStore {
  // State
  currentCompanyProfile: CompanyProfile | null;
  generatedBranding: BrandingResponse | null;
  isGenerating: boolean;
  error: string | null;
  history: BrandingResponse[];
  
  // Actions
  setCompanyProfile: (profile: CompanyProfile) => void;
  setGeneratedBranding: (branding: BrandingResponse) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (branding: BrandingResponse) => void;
  clearHistory: () => void;
  clearAll: () => void;
}

export const useBrandingStore = create<BrandingStore>((set) => ({
  currentCompanyProfile: null,
  generatedBranding: null,
  isGenerating: false,
  error: null,
  history: [],
  
  setCompanyProfile: (profile) => set({ currentCompanyProfile: profile }),
  setGeneratedBranding: (branding) => set({ generatedBranding: branding }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  
  addToHistory: (branding) => set((state) => ({
    history: [branding, ...state.history].slice(0, 10), // Keep last 10
  })),
  
  clearHistory: () => set({ history: [] }),
  clearAll: () => set({
    currentCompanyProfile: null,
    generatedBranding: null,
    isGenerating: false,
    error: null,
    history: [],
  }),
}));
