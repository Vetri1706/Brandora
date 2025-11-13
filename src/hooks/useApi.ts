/**
 * Custom hooks for the application
 */
import { useState, useCallback } from 'react';
import { brandingApi } from '@/lib/api';
import { BrandingResponse, BrandingRequest } from '@/types';

export const useBrandingGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BrandingResponse | null>(null);

  const generateLogo = useCallback(
    async (request: BrandingRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await brandingApi.generateLogo({
          company_name: request.company_profile?.name || '',
          industry: request.company_profile?.industry || '',
          color_scheme: 'professional',
          logo_category: 'combination'
        });
        setData(response.data);
        return response.data;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.detail || 
          err.message || 
          'Failed to generate logo';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { generateLogo, isLoading, error, data };
};

export const useCompanyTypes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchCompanyTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock company types since this endpoint doesn't exist in our Railway backend
      const mockTypes = [
        { id: 'tech', name: 'Technology', description: 'Software, apps, platforms' },
        { id: 'finance', name: 'Finance', description: 'Banking, investments, fintech' },
        { id: 'health', name: 'Healthcare', description: 'Medical, wellness, biotech' },
        { id: 'retail', name: 'Retail', description: 'E-commerce, shopping, consumer goods' },
        { id: 'consulting', name: 'Consulting', description: 'Professional services, advisory' },
        { id: 'manufacturing', name: 'Manufacturing', description: 'Industrial, production' }
      ];
      setData(mockTypes);
      return mockTypes;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch company types';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchCompanyTypes, isLoading, error, data };
};
