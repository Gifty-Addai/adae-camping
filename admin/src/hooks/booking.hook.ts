import { AddBookinResponse, ApiResponse, Booking, BookingFormData, BookingSearchParams, BookingUpdate, UseBookingAPI } from "@/core/interfaces";
import { isApiError } from "@/core/interfaces/guards";
import { deleteRequest, getRequest, patchRequest, postRequest } from "@/lib/api-Request/api-requests";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const fetchBookings = async (
  page: number = 1,
  limit: number = 10,
  filters?: BookingSearchParams
): Promise<{ bookings: Booking[]; currentPage: number; totalPages: number }> => {
  const params: Record<string, any> = { page, limit };

  if (filters) {
    if (filters.tempUser) params.tempUser = filters.tempUser;
    if (filters.trip) params.trip = filters.trip;
    if (filters.status) params.status = filters.status;
    if (filters.dateRange) {
      params.from = filters.dateRange.from.toISOString();
      params.to = filters.dateRange.to.toISOString();
    }
  }

  // Serialize query parameters
  const queryString = new URLSearchParams(params).toString();
  const url = `api/booking/getAllBookings?${queryString}`;

  return await getRequest<{ bookings: Booking[]; currentPage: number; totalPages: number }>(url);
};

export const fetchBookingById = async (id: string): Promise<Booking> => {
  const url = `/api/booking/getBookingById/${id}`;
  return await getRequest<Booking>(url);
};

export const createBooking = async (
  bookingData: BookingFormData
): Promise<AddBookinResponse> => {
  const data = await postRequest<AddBookinResponse>("/api/booking/createBooking", bookingData);
  return data;
};


export const updateBooking = async (id: string, bookingData: BookingUpdate): Promise<Booking> => {
  const url = `/api/booking/updateBooking/${id}`;
  return await patchRequest<Booking>(url, bookingData);
};

export const deleteBookingAPI = async (id: string): Promise<ApiResponse> => {
  const url = `/api/booking/deleteBooking/${id}`;
  return await deleteRequest(url);
};

export const searchBookings = async (
  filters: BookingSearchParams,
  page: number = 1,
  limit: number = 10
): Promise<{ bookings: Booking[]; currentPage: number; totalPages: number }> => {
  const params: Record<string, any> = { page, limit };

  if (filters.tempUser) params.tempUser = filters.tempUser;
  if (filters.trip) params.trip = filters.trip;
  if (filters.status) params.status = filters.status;
  if (filters.dateRange) {
    params.from = filters.dateRange.from.toISOString();
    params.to = filters.dateRange.to.toISOString();
  }

  // Serialize query parameters
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/booking/searchBookings?${queryString}`;

  return await getRequest<{ bookings: Booking[]; currentPage: number; totalPages: number }>(url);
};




export function useBookingAPI(defaultFilters?: BookingSearchParams): UseBookingAPI {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Items per page
  const limit = 10;

  // GET bookings from the server
  const getBookings = async (
    page: number = currentPage,
    filters?: BookingSearchParams
  ): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetchBookings(page, limit, filters || defaultFilters);
      setBookings(response.bookings!);
      setCurrentPage(response.currentPage!);
      setTotalPages(response.totalPages!);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getBookingById = async (id: string): Promise<Booking | null> => {
    setLoading(true);
    try {
      const response = await fetchBookingById(id);
      return response;
    } catch (error) {
      toast.error('Failed to fetch booking details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // CREATE a new booking
  const addBooking = async (bookingData: BookingFormData): Promise<AddBookinResponse> => {
    setLoading(true);
    try {
      console.log(" About to call create BOooking")
      const resp = await createBooking(bookingData);
      console.log(" After to call create BOooking", resp)
      return resp;
    } catch (error: any) {
      console.error("Booking error:", error);
      if (isApiError(error)) {
        toast.error(`${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        toast.error('An unexpected error occurred while creating the booking.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE an existing booking
  const editBooking = async (id: string, bookingData: BookingUpdate): Promise<void> => {
    setLoading(true);
    try {
      await updateBooking(id, bookingData);
      await getBookings();
      toast.success('Successful');
    } catch (error) {
      toast.error('Failed to update booking');
    } finally {
      setLoading(false);
    }
  };

  // DELETE a booking
  const removeBooking = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteBookingAPI(id);
      await getBookings();
      toast.success('Booking deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete booking');
    } finally {
      setLoading(false);
    }
  };

  // SEARCH bookings
  const searchBooking = async (filters: BookingSearchParams): Promise<void> => {
    setLoading(true);
    try {
      const result = await searchBookings(filters);
      setBookings(result.bookings!);
      setCurrentPage(result.currentPage!);
      setTotalPages(result.totalPages!);
    } catch (error) {
      toast.error('Failed to search bookings');
    } finally {
      setLoading(false);
    }
  };

  // PAGINATION
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getBookings(page);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  return {
    bookings,
    loading,
    addBooking,
    editBooking,
    removeBooking,
    searchBooking,
    getBookingById,
    currentPage,
    totalPages,
    goToPage,
    getBookings,
  };
}