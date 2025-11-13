/**
 * API client for communicating with Backend
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

export const brandingApi = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Generate branding
  generateBranding: (data: any) =>
    api.post('/api/v1/generate-branding', data),
  
  // Get company types
  getCompanyTypes: () => api.get('/api/v1/company-types'),
  
  // Get example profile
  getExampleProfile: () => api.get('/api/v1/example-company-profile'),
};
