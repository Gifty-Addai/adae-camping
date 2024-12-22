// Import necessary modules
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { app_local_storage_key, API_BASE_URL, YOUTUBE_API_KEY, CHANNEL_ID } from "../core/constants";
import { ApiResponse, CachedItem, IUser, ProcessedVideo, YouTubePlaylistItem, YouTubePlaylistResponse, YouTubeVideosResponse } from "@/core/interfaces";
import { ApiError } from "./apiUtils";

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to validate ISO 8601 date strings
export const isValidDate = (dateString: string) => {
  return moment(dateString, moment.ISO_8601, true).isValid();
};

// Simplified localStorage utility with added error handling and type safety
export const localStorageUtil = {
  get: <T>(key: string): T | null => {
    try {
      const item = window.localStorage.getItem(app_local_storage_key + ":" + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage for key: ${key}`, error);
      return null;
    }
  },

  set: (key: string, data: any): void => {
    try {
      window.localStorage.setItem(app_local_storage_key + ":" + key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage for key: ${key}`, error);
    }
  },

  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(app_local_storage_key + ":" + key);
    } catch (error) {
      console.error(`Error removing item from localStorage for key: ${key}`, error);
    }
  },
};

// Get User session info from localStorage
export const getUserSession = (): IUser | null => {
  try {
    const user = localStorageUtil.get<IUser>("user-info");
    return user;
  } catch {
    return null;
  }
};

// Axios instance with optional custom configuration and automatic token handling
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made, but no response was received
      return Promise.reject({
        success: false,
        message: 'No response received from the server.',
        data: null,
      });
    } else {
      // Something happened while setting up the request
      return Promise.reject({
        success: false,
        message: error.message || 'An unknown error occurred.',
        data: null,
      });
    }
  }
);


/**
 * Perform a GET request with caching.
 * @param url - The API endpoint.
 * @param params - Query parameters.
 * @param cacheKey - Optional custom cache key.
 * @param cacheExpiryInMinutes - Cache expiry time in minutes (default: 5).
 * @returns Promise<ApiResponse<T>>
 */
export const getCachedRequest = async <T>(
  url: string,
  params?: any,
  cacheKey?: string,
  cacheExpiryInMinutes = 5
): Promise<ApiResponse<T>> => {
  const key = cacheKey || url + JSON.stringify(params);
  const cachedItem = apiCache.get<T>(key);

  if (cachedItem && moment().isBefore(moment(cachedItem.expiry))) {
    console.log(`Cache hit for key: ${key}`);
    return cachedItem.data; // Returns ApiResponse<T>
  }

  console.log(`Cache miss for key: ${key}. Fetching from API.`);
  const response = await getRequest<T>(url, params); // Correct generic usage

  if (response.success) {
    apiCache.set<T>(key, response, cacheExpiryInMinutes);
  } else {
    console.warn(`API responded with success=false for key: ${key}`);
  }

  return response; // Returns ApiResponse<T>
};



/**
 * Generic GET request
 * @param url - API endpoint
 * @param params - Query parameters
 * @returns Promise<ApiResponse<T>>
 */
export const getRequest = <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
  return axiosInstance.get<ApiResponse<T>>(url, { params }).then((response) => response.data);
};

/**
 * Generic POST request
 * @param url - API endpoint
 * @param data - Request payload
 * @returns Promise<ApiResponse<T>>
 */
export const postRequest = async <T>(
  url: string,
  data: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data);

    // If the response indicates success, return the data
    if (response.data.success) {
      return response.data;
    } else {
      // If success is false, throw an ApiError with the message
      throw new ApiError(response.data.message || 'An error occurred', response.status);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      if (error.response) {
        // Server responded with a status other than 2xx
        throw new ApiError(error.response.data.message || 'An error occurred', error.response.status);
      } else if (error.request) {
        // Request was made but no response received
        throw new ApiError('No response from server. Please try again later.', 503);
      } else {
        // Something else happened while setting up the request
        throw new ApiError(error.message || 'An unexpected error occurred.', 500);
      }
    } else if (error instanceof ApiError) {
      // Re-throw ApiError to be handled later
      throw error;
    } else {
      // For unexpected errors, throw a generic ApiError
      throw new ApiError('An unexpected error occurred.', 500);
    }
  }
};

/**
 * Generic PUT request
 * @param url - API endpoint
 * @param data - Request payload
 * @returns Promise<ApiResponse<T>>
 */
export const putRequest = <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  return axiosInstance.put<ApiResponse<T>>(url, data).then((response) => response.data);
};

/**
 * Generic DELETE request
 * @param url - API endpoint
 * @returns Promise<ApiResponse<T>>
 */
export const deleteRequest = <T = any>(url: string): Promise<ApiResponse<T>> => {
  return axiosInstance.delete<ApiResponse<T>>(url).then((response) => response.data);
};

export const apiCache = {
  /**
   * Retrieve cached data by key.
   * @param key - The unique cache key.
   * @returns CachedItem<T> | null
   */
  get: <T>(key: string): CachedItem<T> | null => {
    const cached = localStorageUtil.get<string>(`apiCache:${key}`);
    return cached ? (JSON.parse(cached) as CachedItem<T>) : null;
  },

  /**
   * Store data in cache with a key and expiry time.
   * @param key - The unique cache key.
   * @param data - The ApiResponse data to cache.
   * @param expiryInMinutes - Time in minutes after which the cache expires.
   */
  set: <T>(key: string, data: ApiResponse<T>, expiryInMinutes = 5): void => {
    const expiryDate = moment().add(expiryInMinutes, 'minutes').toISOString();
    const cacheData: CachedItem<T> = { data, expiry: expiryDate };
    localStorageUtil.set(`apiCache:${key}`, JSON.stringify(cacheData));
  },

  /**
   * Remove cached data by key.
   * @param key - The unique cache key.
   */
  remove: (key: string): void => {
    localStorageUtil.remove(`apiCache:${key}`);
  },
};

// Function to build query strings
export const buildQueryString = (params: Record<string, any>): string => {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};


const fetchUploadsPlaylistId = async (): Promise<string> => {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
  const response = await axios.get(url);
  const playlistId: string =
    response.data.items[0].contentDetails.relatedPlaylists.uploads;
  return playlistId;
};

const fetchVideosFromPlaylist = async (
  playlistId: string,
  pageToken: string | null = null
): Promise<YouTubePlaylistResponse> => {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}${pageToken ? `&pageToken=${pageToken}` : ""
    }`;

  const response = await axios.get<YouTubePlaylistResponse>(url);
  return response.data;
};

const fetchVideoStatistics = async (videoIds: string[]): Promise<YouTubeVideosResponse> => {
  const ids = videoIds.join(",");
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${YOUTUBE_API_KEY}`;
  const response = await axios.get<YouTubeVideosResponse>(url);
  return response.data;
};

export const fetchAllChannelVideos = async (): Promise<ProcessedVideo[]> => {
  const playlistId = await fetchUploadsPlaylistId();
  let allVideos: YouTubePlaylistItem[] = [];
  let pageToken: string | null = null;

  do {
    const data = await fetchVideosFromPlaylist(playlistId, pageToken);
    allVideos = [...allVideos, ...data.items];
    pageToken = data.nextPageToken || null;
  } while (pageToken);

  // Extract video IDs
  const videoIds = allVideos.map((item) => item.snippet.resourceId.videoId);

  // Fetch statistics
  const statisticsResponse = await fetchVideoStatistics(videoIds);

  // Map and combine video details with statistics
  return allVideos.map((item) => {
    const videoId = item.snippet.resourceId.videoId;
    const stats = statisticsResponse.items.find((stat) => stat.id === videoId);

    return {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      views: stats ? parseInt(stats.statistics.viewCount).toLocaleString() : "0",
    };
  });
};

export default fetchAllChannelVideos;