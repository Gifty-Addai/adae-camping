import { useState } from "react";
import { getRequest, patchRequest, postRequest, deleteRequest } from "@/lib/api-Request/api-requests";
import { toast } from "react-toastify";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedContactResponse {
  data: ContactMessage[];
  currentPage: number;
  totalPages: number;
  totalData: number;
}

export const useContactAPI = () => {
  const [loading, setLoading] = useState(false);

  const getContactMessages = async (
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<PaginatedContactResponse | null> => {
    setLoading(true);
    try {
      let url = `/api/contact?page=${page}&limit=${limit}`;
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }
      if (search && search.trim() !== '') {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await getRequest<PaginatedContactResponse>(url);
      return response;
    } catch (error: any) {
      console.error("Get Contact Messages Error:", error);
      toast.error(error.message || "Failed to fetch contact messages");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateContactMessageStatus = async (id: string, status: 'read' | 'unread'): Promise<ContactMessage | null> => {
    setLoading(true);
    try {
      const response = await patchRequest<ContactMessage>(`/api/contact/${id}`, { status });
      toast.success(`Message marked as ${status}`);
      return response;
    } catch (error: any) {
      console.error("Update Contact Status Error:", error);
      toast.error(error.message || "Failed to update message status");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const replyContactMessage = async (id: string, replyMessage: string): Promise<ContactMessage | null> => {
    setLoading(true);
    try {
      const response = await postRequest<ContactMessage>(`/api/contact/${id}/reply`, { replyMessage });
      toast.success("Reply sent successfully via email!");
      return response;
    } catch (error: any) {
      console.error("Reply Contact Error:", error);
      toast.error(error.message || "Failed to send reply");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteContactMessage = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await deleteRequest(`/api/contact/${id}`);
      toast.success("Message deleted successfully");
      return true;
    } catch (error: any) {
      console.error("Delete Contact Error:", error);
      toast.error(error.message || "Failed to delete message");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    getContactMessages,
    updateContactMessageStatus,
    replyContactMessage,
    deleteContactMessage,
    loading
  };
};
