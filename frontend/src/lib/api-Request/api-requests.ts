// apiRequests.ts
import axios, { AxiosRequestConfig, CancelToken } from 'axios';
import axiosInstance from '../axios-instance';
import { ApiError } from '../apiUtils';
import logger from '../logger';

/**
 * Generic GET request with advanced features:
 * - Type safety
 * - Request cancellation
 * - Enhanced error handling
 * - Logging
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
  try {
    const response = await axiosInstance.get<{ success: boolean; data: T; message?: string }>(url, config);

    if (response.data.success) {
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
  try {
    const response = await axiosInstance.post<{ success: boolean; data: T; message?: string }>(url, data, config);

    if (response.data.success) {
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
