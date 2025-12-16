import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Create axios instance with base configuration
 * @param baseURL - Base URL for the service
 */
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token to requests
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors globally
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        // Handle specific error codes
        switch (error.response.status) {
          case 401:
            // Unauthorized - Clear token and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            break;
          case 403:
            // Forbidden - Account locked or insufficient permissions
            console.error('Access forbidden:', error.response.data);
            break;
          case 429:
            // Rate limit exceeded
            console.error('Too many requests. Please try again later.');
            break;
          default:
            console.error('API Error:', error.response.data);
        }
      } else if (error.request) {
        console.error('Network Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Default API client for main backend (S10 - Employee Identity Service)
const apiClient: AxiosInstance = createApiClient(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:7010'
);

// S09 - Partner General Information Service
export const partnerInfoClient: AxiosInstance = createApiClient(
  import.meta.env.VITE_PARTNER_INFO_SERVICE_URL || 'http://localhost:7011'
);

// S11 - Partner Local Knowledge Service
export const knowledgeClient: AxiosInstance = createApiClient(
  import.meta.env.VITE_KNOWLEDGE_SERVICE_URL || 'http://localhost:7012'
);

// S12 - Partner Knowledge Update Service
export const updateClient: AxiosInstance = createApiClient(
  import.meta.env.VITE_KNOWLEDGE_UPDATE_SERVICE_URL || 'http://localhost:7013'
);

// S14 - Partner Metrics Service
export const metricsClient: AxiosInstance = createApiClient(
  import.meta.env.VITE_METRICS_SERVICE_URL || 'http://localhost:7014'
);

export default apiClient;
