import { useState } from "react";
import { postRequest, getRequest } from "@/lib/api-Request/api-requests";
import { toast } from "react-toastify";

export interface OrderPayload {
  products: { product: string; quantity: number }[];
  deliveryMethod: "Shipping" | "Pickup";
  shippingAddress?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
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

  return {
    createOrder,
    getUserOrders,
    loading,
  };
};
