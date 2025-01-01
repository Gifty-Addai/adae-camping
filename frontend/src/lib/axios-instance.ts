import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry';
import logger from './logger';
import { API_BASE_URL } from '@/core/constants';
import { postRequest } from './api-Request/api-requests';
import { isApiError } from '@/core/interfaces/guards';

/**
 * Access token stored in a module-level variable (in-memory).
 * - This prevents XSS attacks from reading it (unlike localStorage).
 */
let inMemoryAccessToken: string | null = null;

/**
 * Set the access token in memory.
 */
export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

/**
 * Get the access token from memory.
 */
export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

/**
 * Create an Axios instance with secure defaults.
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * axios-retry configuration:
 * - Exponential backoff with a maximum of 5 retries.
 */
axiosRetry(axiosInstance, {
  retries: 5,
  retryDelay: (retryCount: number) => {
    const delay = Math.pow(2, retryCount) * 1000;
    logger.warn(`Retry attempt #${retryCount} (waiting ${delay}ms)`);
    return delay;
  },
  retryCondition: (error: AxiosError) => {
    return (
      axiosRetry.isNetworkError(error) ||
      axiosRetry.isRetryableError(error) ||
      (error.response && error.response.status >= 500)
    );
  },
} as IAxiosRetryConfig);

/**
 * Request Interceptor:
 * - Attaches the current in-memory access token in the Authorization header.
 * - Logs the outbound request for debugging.
 *
 * NOTE: Must use InternalAxiosRequestConfig for Axios v1 interceptors.
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    try {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      logger.info(`Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        headers: config.headers,
      });

      return config;
    } catch (error) {
      logger.error('Request Interceptor Error:', { error });
      throw error;
    }
  },
  (error: AxiosError) => {
    logger.error('Request Error:', { error });
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * - Logs responses for debugging.
 * - On HTTP 401 (Unauthorized), attempts to refresh the token and retry the original request.
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.info(
      `Response: ${response.status} ${response.config.url}`,
      { data: response.data }
    );
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const { status, config } = error.response;
      logger.error(
        `Response Error: ${status} on ${config?.url}`,
        { data: error.response.data }
      );

      // Handle 401 errors by refreshing the access token
      if (status === 401 && config) {
        try {
          // Attempt token refresh
          const refreshResponse = await postRequest<{ accessToken: string }>('/api/auth/refresh', {});
          const newAccessToken = refreshResponse.accessToken;

          if (newAccessToken) {
            // Update our in-memory access token
            setAccessToken(newAccessToken);

            // Retry the original request
            const newConfig = {
              ...config,
              headers: { ...config.headers, Authorization: `Bearer ${newAccessToken}` },
            } as InternalAxiosRequestConfig;

            return axiosInstance.request(newConfig);
          } else {
            // No new token received, clear session
            setAccessToken(null);
          }
        } catch (refreshError) {
          if (isApiError(refreshError)) {
            logger.error('Refresh token expired. Logging out user.', { error: refreshError });

          }
          else {

            logger.error('Token refresh failed:', { error: refreshError });
          }

          setAccessToken(null);
        }
      }
    } else {
      // Possibly a network error or CORS issue
      logger.error('Response Error (no response):', { error: error.message });
    }
    return Promise.reject(error);
  }
);



export default axiosInstance;
