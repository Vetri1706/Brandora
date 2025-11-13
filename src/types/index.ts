/**
 * Type definitions for the application
 */

export interface CompanyProfile {
  name: string;
  company_type: string;
  industry: string;
  description: string;
  target_audience: string;
  brand_values: string[];
  tone: string;
  additional_context?: string;
}

export interface BrandingRequest {
  company_id: string;
  company_profile?: CompanyProfile;
  num_variations: number;
  focus: 'logo' | 'tagline' | 'palette' | 'typography' | 'all';
  god_mode?: GodModeOptions;
}

export interface LogoVariation {
  id: string;
  description: string;
  color_scheme: string[];
  style: string;
  image_url?: string;
  prompt_used: string;
}

export interface TaglineVariation {
  id: string;
  text: string;
  tone: string;
  explanation: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  psychology: Record<string, string>;
  usage_guidelines: string;
}

export interface TypographyRecommendation {
  heading_font: string;
  body_font: string;
  accent_font?: string;
  rationale: string;
  pairings: Array<{
    context: string;
    recommendation: string;
  }>;
}

export interface BrandingResponse {
  id: string;
  company_id: string;
  logos: LogoVariation[];
  taglines: TaglineVariation[];
  color_palette: ColorPalette;
  typography: TypographyRecommendation;
  brand_guidelines: string;
  generated_at: string;
  generation_time_seconds: number;
}

export interface CompanyType {
  id: string;
  name: string;
  description: string;
}

export interface GodModeOptions {
  prompt?: string;
  industry_override?: string;
  color_overrides?: string[];
  style_preference?: string;
  symbols?: string[];
  negative?: string[];
  seed?: string;
}
