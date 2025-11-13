/**
 * API client for Brandora - AI Logo Generator
 */
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const logoApi = {
  // Health check - ✅ MATCHES your Railway backend
  healthCheck: () => api.get('/health'),
  
  // Generate logo - ✅ MATCHES your Railway backend  
  generateLogo: (data: {
    company_name: string;
    industry?: string;
    color_scheme?: string;
    style?: string;
  }) => api.post('/generate-logo', data),
  
  // Get API info - ✅ MATCHES your Railway backend
  getApiInfo: () => api.get('/'),
};

// Legacy API for backward compatibility
export const brandingApi = logoApi;
