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

  const generateBranding = useCallback(
    async (request: BrandingRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await brandingApi.generateBranding(request);
        setData(response.data);
        return response.data;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.detail || 
          err.message || 
          'Failed to generate branding';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { generateBranding, isLoading, error, data };
};

export const useCompanyTypes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchCompanyTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await brandingApi.getCompanyTypes();
      setData(response.data);
      return response.data;
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
