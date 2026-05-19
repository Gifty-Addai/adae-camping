import { useState } from "react";
import { getRequest } from "@/lib/api-Request/api-requests";
import { toast } from "react-toastify";

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: any[];
  salesByRegion: { _id: string; count: number; total: number }[];
}

export const useAdminAPI = () => {
  const [loading, setLoading] = useState(false);

  const getDashboardStats = async (): Promise<DashboardStats | null> => {
    setLoading(true);
    try {
      const response = await getRequest("/api/admin/stats");
      return response as unknown as DashboardStats;
    } catch (error: any) {
      console.error("Get Stats Error:", error);
      toast.error("Failed to fetch dashboard stats");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getDashboardStats,
    loading,
  };
};
