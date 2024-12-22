// axiosInstance.ts
import axios from 'axios';
import axiosRetry from 'axios-retry';
import logger from './logger';
import { API_BASE_URL } from '@/core/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    logger.warn(`Retry attempt: ${retryCount}`);
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
  },
});

// Request interceptor for adding authentication tokens or other headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: Attach JWT token from localStorage
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.info(`Request: ${config.method?.toUpperCase()} ${config.url}`, { data: config.data });
    return config;
  },
  (error) => {
    logger.error('Request error', { error });
    return Promise.reject(error);
  }
);

// Response interceptor for global response handling
axiosInstance.interceptors.response.use(
  (response) => {
    logger.info(`Response: ${response.status} ${response.config.url}`, { data: response.data });
    return response;
  },
  (error) => {
    if (error.response) {
      logger.error(`Response error: ${error.response.status} ${error.config.url}`, { data: error.response.data });
    } else {
      logger.error('Response error', { error: error.message });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
