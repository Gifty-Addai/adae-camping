// Import necessary modules
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import axios from "axios";
import { app_local_storage_key, YOUTUBE_API_KEY, CHANNEL_ID } from "../core/constants";
import { CachedItem, IUser, ProcessedVideo, YouTubePlaylistItem, YouTubePlaylistResponse, YouTubeVideosResponse } from "@/core/interfaces";
import { getRequest } from "./api-Request/api-requests";

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const  getInclusiveDayDifference = (start: string, end: string): number =>{
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
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
): Promise<T> => {
  const key = cacheKey || url + JSON.stringify(params);
  const cachedItem = apiCache.get<T>(key);

  if (cachedItem && moment().isBefore(moment(cachedItem.expiry))) {
    console.log(`Cache hit for key: ${key}`);
    return cachedItem.data; // Returns ApiResponse<T>
  }

  console.log(`Cache miss for key: ${key}. Fetching from API.`);
  const response = await getRequest<T>(url, params); // Correct generic usage

  if (response) {
    apiCache.set<T>(key, response, cacheExpiryInMinutes);
  } else {
    console.warn(`API responded with success=false for key: ${key}`);
  }

  return response; // Returns ApiResponse<T>
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
  set: <T>(key: string, data: T, expiryInMinutes = 5): void => {
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