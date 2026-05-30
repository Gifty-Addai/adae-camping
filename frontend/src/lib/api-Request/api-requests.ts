/* eslint-disable @typescript-eslint/no-explicit-any */
// apiRequests.ts
import axios, { AxiosRequestConfig, CancelToken } from 'axios';
import axiosInstance from '../axios-instance';
import { ApiError } from '../apiUtils';
import logger from '../logger';

interface CacheEntry {
  data: unknown;
  expiry: number;
}

// Global in-memory cache store
const cacheMap = new Map<string, CacheEntry>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Endpoints that are safe and beneficial to cache
const CACHEABLE_URLS = [
  '/api/settings',
  '/api/product/getTallowProducts',
  '/api/product/getProductById',
  '/api/product/searchProducts',
  '/api/trip/getTripById',
  '/api/trip/getTrips',
  '/api/trip/searchTrips'
];

// Write/mutation endpoints that should clear the cache
const MUTATION_URLS = [
  '/api/product/createProduct',
  '/api/product/updateProduct',
  '/api/product/deleteProduct',
  '/api/trip/createTrip',
  '/api/trip/updateTrip',
  '/api/trip/deleteTrip',
  '/api/order',
  '/api/mail/bookingMail'
];

/**
 * Checks if a request is cacheable based on URL and method.
 */
const isCacheableRequest = (url: string, method: string): boolean => {
  const upperMethod = method.toUpperCase();
  if (upperMethod === 'GET') {
    return CACHEABLE_URLS.some(path => url.includes(path));
  }
  if (upperMethod === 'POST') {
    // Only cache read-like POST queries
    return url.includes('/api/product/searchProducts') || url.includes('/api/trip/searchTrips');
  }
  return false;
};

/**
 * Checks if a request is a mutation that should clear the cache.
 */
const isMutationRequest = (url: string, method: string): boolean => {
  const upperMethod = method.toUpperCase();
  if (['PUT', 'DELETE', 'PATCH'].includes(upperMethod)) return true;
  if (upperMethod === 'POST') {
    return MUTATION_URLS.some(path => url.includes(path));
  }
  return false;
};

/**
 * Generates a unique cache key based on URL and request configuration or payload.
 */
const generateCacheKey = (url: string, payload?: unknown): string => {
  const payloadStr = payload ? JSON.stringify(payload) : '';
  return `${url}::${payloadStr}`;
};

/**
 * Clears expired cache entries.
 */
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, entry] of cacheMap.entries()) {
    if (now > entry.expiry) {
      cacheMap.delete(key);
    }
  }
};

/**
 * Generic GET request with advanced features:
 * - Type safety
 * - Request cancellation
 * - Enhanced error handling
 * - Logging
 * - Local Memory Caching
 *
 * @template T - The expected response data type
 * @param {string} url - API endpoint (relative to baseURL)
 * @param {AxiosRequestConfig} [config] - Optional Axios request configuration
 * @returns {Promise<T>} - The response data
 * @throws {ApiError} - Throws ApiError on failure
 */
export const getRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig & { cancelToken?: CancelToken }
): Promise<T> => {
  cleanExpiredCache();
  const cacheKey = generateCacheKey(url, config?.params);

  if (isCacheableRequest(url, 'GET')) {
    const cached = cacheMap.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      logger.info(`[Cache HIT] GET ${url}`);
      return cached.data as T;
    }
  }

  try {
    const response = await axiosInstance.get<{ success: boolean; data: T; message?: string }>(url, config);

    if (response.data.success) {
      if (isCacheableRequest(url, 'GET')) {
        cacheMap.set(cacheKey, {
          data: response.data.data,
          expiry: Date.now() + DEFAULT_TTL
        });
        logger.info(`[Cache SET] GET ${url}`);
      }
      return response.data.data;
    } else {
      // Handle business logic errors
      throw new ApiError(response.data.message || 'An error occurred', response.status);
    }
  } catch (error: any) {
    return handleRequestError(error, 'GET', url);
  }
};

/**
 * Generic PUT request with advanced features:
 * - Type safety
 * - Request cancellation
 * - Enhanced error handling
 * - Logging
 * - Cache Invalidation
 *
 * @template T - The expected response data type
 * @param {string} url - API endpoint (relative to baseURL)
 * @param {any} data - Request payload
 * @param {AxiosRequestConfig} [config] - Optional Axios request configuration
 * @returns {Promise<T>} - The response data
 * @throws {ApiError} - Throws ApiError on failure
 */
export const putRequest = async <T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig & { cancelToken?: CancelToken }
): Promise<T> => {
  if (isMutationRequest(url, 'PUT')) {
    logger.info(`[Cache Invalidation] PUT mutation on ${url}. Clearing cache.`);
    cacheMap.clear();
  }

  try {
    const response = await axiosInstance.put<{ success: boolean; data: T; message?: string }>(url, data, config);

    if (response.data.success) {
      return response.data.data;
    } else {
      // Handle business logic errors
      throw new ApiError(response.data.message || 'An error occurred', response.status);
    }
  } catch (error: any) {
    return handleRequestError(error, 'PUT', url);
  }
};

/**
 * Generic DELETE request with advanced features:
 * - Type safety
 * - Request cancellation
 * - Enhanced error handling
 * - Logging
 * - Cache Invalidation
 *
 * @template T - The expected response data type
 * @param {string} url - API endpoint (relative to baseURL)
 * @param {AxiosRequestConfig} [config] - Optional Axios request configuration
 * @returns {Promise<T>} - The response data
 * @throws {ApiError} - Throws ApiError on failure
 */
export const deleteRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig & { cancelToken?: CancelToken }
): Promise<T> => {
  if (isMutationRequest(url, 'DELETE')) {
    logger.info(`[Cache Invalidation] DELETE mutation on ${url}. Clearing cache.`);
    cacheMap.clear();
  }

  try {
    const response = await axiosInstance.delete<{ success: boolean; data: T; message?: string }>(url, config);

    if (response.data.success) {
      return response.data.data;
    } else {
      // Handle business logic errors
      throw new ApiError(response.data.message || 'An error occurred', response.status);
    }
  } catch (error: any) {
    return handleRequestError(error, 'DELETE', url);
  }
};

/**
 * Generic PATCH request with advanced features:
 * - Type safety
 * - Request cancellation
 * - Enhanced error handling
 * - Logging
 * - Cache Invalidation
 *
 * @template T - The expected response data type
 * @param {string} url - API endpoint (relative to baseURL)
 * @param {any} data - Request payload
 * @param {AxiosRequestConfig} [config] - Optional Axios request configuration
 * @returns {Promise<T>} - The response data
 * @throws {ApiError} - Throws ApiError on failure
 */
export const patchRequest = async <T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig & { cancelToken?: CancelToken }
): Promise<T> => {
  if (isMutationRequest(url, 'PATCH')) {
    logger.info(`[Cache Invalidation] PATCH mutation on ${url}. Clearing cache.`);
    cacheMap.clear();
  }

  try {
    const response = await axiosInstance.patch<{ success: boolean; data: T; message?: string }>(url, data, config);

    if (response.data.success) {
      return response.data.data;
    } else {
      // Handle business logic errors
      throw new ApiError(response.data.message || 'An error occurred', response.status);
    }
  } catch (error: any) {
    return handleRequestError(error, 'PATCH', url);
  }
};

/**
 * Generic POST request with advanced features:
 * - Type safety
 * - Request cancellation
 * - Enhanced error handling
 * - Logging
 * - Local Memory Caching & Cache Invalidation
 *
 * @template T - The expected response data type
 * @param {string} url - API endpoint (relative to baseURL)
 * @param {any} data - Request payload
 * @param {AxiosRequestConfig} [config] - Optional Axios request configuration
 * @returns {Promise<T>} - The response data
 * @throws {ApiError} - Throws ApiError on failure
 */
export const postRequest = async <T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig & { cancelToken?: CancelToken }
): Promise<T> => {
  cleanExpiredCache();

  if (isMutationRequest(url, 'POST')) {
    logger.info(`[Cache Invalidation] POST mutation on ${url}. Clearing cache.`);
    cacheMap.clear();
  }

  const cacheKey = generateCacheKey(url, data);

  if (isCacheableRequest(url, 'POST')) {
    const cached = cacheMap.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      logger.info(`[Cache HIT] POST ${url}`);
      return cached.data as T;
    }
  }

  try {
    const response = await axiosInstance.post<{ success: boolean; data: T; message?: string }>(url, data, config);

    if (response.data.success) {
      if (isCacheableRequest(url, 'POST')) {
        cacheMap.set(cacheKey, {
          data: response.data.data,
          expiry: Date.now() + DEFAULT_TTL
        });
        logger.info(`[Cache SET] POST ${url}`);
      }
      return response.data.data;
    } else {
      // Handle business logic errors
      throw new ApiError(response.data.message || 'An error occurred', response.status);
    }
  } catch (error: any) {
    return handleRequestError(error, 'POST', url);
  }
};

/**
 * Handles errors from Axios requests by logging and throwing ApiError.
 *
 * @param {any} error - The error thrown by Axios
 * @param {string} method - The HTTP method used
 * @param {string} url - The API endpoint called
 * @throws {ApiError} - Throws ApiError with appropriate message and status
 */
const handleRequestError = (error: any, method: string, url: string): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with a status other than 2xx
      logger.error(`${method} API Error Response`, { url, status: error.response.status, data: error.response.data });
      throw new ApiError(error.response.data.message || 'An error occurred', error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      logger.error(`${method} No response received from server`, { url, error: error.message });
      throw new ApiError('No response from server. Please try again later.', 503);
    } else {
      // Something happened while setting up the request
      logger.error(`${method} Axios request setup error`, { message: error.message });
      throw new ApiError(error.message || 'An unexpected error occurred.', 500);
    }
  } else if (error instanceof ApiError) {
    // Re-throw ApiError to be handled by the caller
    throw error;
  } else {
    // Handle unexpected errors
    logger.error(`${method} Unexpected error`, { error });
    throw new ApiError('An unexpected error occurred.', 500);
  }
};

