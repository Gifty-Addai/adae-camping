// Import necessary modules
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { toast } from 'react-toastify'; 
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { app_local_storage_key, API_BASE_URL, YOUTUBE_API_KEY, CHANNEL_ID } from "../core/constants";
import { IUser, ProcessedVideo, YouTubePlaylistItem, YouTubePlaylistResponse, YouTubeVideosResponse } from "@/core/interfaces";

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

// Interceptor to handle unauthorized requests and other global errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Success: Return the response directly
    return response;
  },
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Token might have expired, redirect to login
        window.location.href = '/login';
        toast.error('Session expired. Redirecting to login...', { autoClose: 3000 });
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.', { autoClose: 3000 });
      } else if (status >= 500) {
        toast.error('An error occurred on the server. Please try again later.', { autoClose: 3000 });
      }
    } else if (error.request) {
      toast.error('No response received from the server. Please check your network connection.', { autoClose: 3000 });
    } else {
      toast.error('An error occurred while setting up the request.', { autoClose: 3000 });
    }
    return Promise.reject(error);
  }
);
// Utility to get request with cache
export const getCachedRequest = async <T = any>(
  url: string,
  params?: any,
  cacheKey?: string,
  cacheExpiryInMinutes = 5
): Promise<T> => {
  const key = cacheKey || url + JSON.stringify(params);
  const cachedItem = apiCache.get(key);

  if (cachedItem && moment().isBefore(moment(cachedItem.expiry))) {
    return cachedItem.data;
  }

  const data = await getRequest<T>(url, params);
  apiCache.set(key, data, cacheExpiryInMinutes);
  return data;
};

// Example API request functions
export const getRequest = <T = any>(url: string, params?: any): Promise<T> => {
  return axiosInstance.get<T>(url, { params }).then((response) => response.data);
};

export const postRequest = <T = any>(url: string, data?: any): Promise<T> => {
  return axiosInstance.post<T>(url, data).then((response) => response.data);
};

export const putRequest = <T = any>(url: string, data?: any): Promise<T> => {
  return axiosInstance.put<T>(url, data).then((response) => response.data);
};

export const deleteRequest = <T = any>(url: string): Promise<T> => {
  return axiosInstance.delete<T>(url).then((response) => response.data);
};

// API cache utility with expiry time
export const apiCache = {
  get: (key: string) => {
    const cached = localStorageUtil.get<string>(`apiCache:${key}`);
    return cached ? JSON.parse(cached) : null;
  },
  set: (key: string, data: any, expiryInMinutes = 5) => {
    const expiryDate = moment().add(expiryInMinutes, 'minutes').toISOString();
    const cacheData = { data, expiry: expiryDate };
    localStorageUtil.set(`apiCache:${key}`, JSON.stringify(cacheData));
  },
  remove: (key: string) => {
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
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}${
    pageToken ? `&pageToken=${pageToken}` : ""
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