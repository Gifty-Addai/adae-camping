import { useState } from "react";
import { getRequest, postRequest, putRequest, deleteRequest } from "@/lib/api-Request/api-requests";
import { toast } from "react-toastify";

export interface VideoData {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
  embedUrl?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const useVideoAPI = () => {
  const [loading, setLoading] = useState(false);

  const getAllVideos = async (): Promise<VideoData[] | null> => {
    setLoading(true);
    try {
      const response = await getRequest<VideoData[]>("/api/video/getAllVideos");
      return response;
    } catch (error: any) {
      console.error("Get All Videos Error:", error);
      toast.error(error.message || "Failed to fetch videos");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createVideo = async (data: Omit<VideoData, "_id">): Promise<VideoData | null> => {
    setLoading(true);
    try {
      const response = await postRequest<VideoData>("/api/video/createVideo", data);
      toast.success("Video created successfully!");
      return response;
    } catch (error: any) {
      console.error("Create Video Error:", error);
      toast.error(error.message || "Failed to create video");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateVideo = async (id: string, data: Partial<VideoData>): Promise<VideoData | null> => {
    setLoading(true);
    try {
      const response = await putRequest<VideoData>(`/api/video/updateVideo/${id}`, data);
      toast.success("Video updated successfully!");
      return response;
    } catch (error: any) {
      console.error("Update Video Error:", error);
      toast.error(error.message || "Failed to update video");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await deleteRequest<any>(`/api/video/deleteVideo/${id}`);
      toast.success("Video deleted successfully!");
      return true;
    } catch (error: any) {
      console.error("Delete Video Error:", error);
      toast.error(error.message || "Failed to delete video");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    loading,
  };
};
