import { useState } from "react";
import { getRequest, putRequest } from "@/lib/api-Request/api-requests";
import { toast } from "react-toastify";

export interface SettingsData {
  whatsappNumber: string;
  supportEmail: string;
  supportPhone: string;
  promoMessage: string;
  promoEnabled: boolean;
  instagramLink?: string;
  linkedinLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useSettingsAPI = () => {
  const [loading, setLoading] = useState(false);

  const getSettings = async (): Promise<SettingsData | null> => {
    setLoading(true);
    try {
      const response = await getRequest<SettingsData>("/api/settings");
      return response;
    } catch (error: any) {
      console.error("Get Settings Error:", error);
      toast.error(error.message || "Failed to fetch settings");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (data: Partial<SettingsData>): Promise<SettingsData | null> => {
    setLoading(true);
    try {
      const response = await putRequest<SettingsData>("/api/settings", data);
      toast.success("Settings updated successfully!");
      return response;
    } catch (error: any) {
      console.error("Update Settings Error:", error);
      toast.error(error.message || "Failed to update settings");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getSettings,
    updateSettings,
    loading,
  };
};
