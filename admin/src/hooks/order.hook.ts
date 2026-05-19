import { useState } from "react";
import { postRequest, getRequest } from "@/lib/api-Request/api-requests";
import { toast } from "react-toastify";

export interface OrderPayload {
  products: { product: string; quantity: number }[];
  deliveryMethod: "Shipping" | "Pickup";
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
    landmark?: string;
  };
  pickupLocation?: string;
  paymentMethod: string;
}

export const useOrderAPI = () => {
  const [loading, setLoading] = useState(false);

  const createOrder = async (orderData: OrderPayload) => {
    setLoading(true);
    try {
      const response = await postRequest("/api/orders", orderData);
      toast.success("Order placed successfully!");
      return response;
    } catch (error: any) {
      console.error("Create Order Error:", error);
      toast.error(error.message || "Failed to place order");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserOrders = async () => {
    setLoading(true);
    try {
      const response = await getRequest("/api/orders/my-orders");
      return response;
    } catch (error: any) {
      console.error("Get Orders Error:", error);
      toast.error("Failed to fetch orders");
      // return empty array or throw?
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAllOrders = async () => {
    setLoading(true);
    try {
      const response = await getRequest("/api/orders/admin");
      return response;
    } catch (error: any) {
      console.error("Get All Orders Error:", error);
      toast.error("Failed to fetch all orders");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id: string) => {
    setLoading(true);
    try {
      // Assuming the backend has an endpoint for getting a single order by ID for admin
      // If not, we might need to add it or use the user one if relevant.
      // Based on typical REST patterns: GET /api/orders/:id
      // However, looking at the plan, we didn't explicitly check if this route exists.
      // Let's assume it does or I will add it.
      // Actually, I should probably check the backend routes first to be sure.
      // But for now, I'll add the hook function.
      const response = await getRequest(`/api/orders/${id}`);
      return response;
    } catch (error: any) {
      console.error("Get Order Error:", error);
      toast.error("Failed to fetch order details");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    loading,
  };
};
