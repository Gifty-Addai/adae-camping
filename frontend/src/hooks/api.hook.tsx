import { Trip, TripSearchParams, TripStatus, UseMailAPI, UseTripAPI } from "@/core/interfaces";
import { isApiError } from "@/core/interfaces/guards";
import { TripFormInput } from "@/core/interfaces/zod";
import { postRequest } from "@/lib/api-Request/api-requests";
import { createTrip, deleteTrip, fetchTripById, fetchTrips, searchTrips, updateTrip } from "@/lib/apiUtils";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";




export function useTripAPI(defaultType?: string, defaultDifficulty?: string): UseTripAPI {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  console.info("loading book from api hook", loading)


  // Items per page
  const limit = 10;

  // GET trips from the server
  const getTrips = async (
    page: number = currentPage,
    type?: string,
    difficulty?: string,
    status?: TripStatus
  ): Promise<void> => {
    setLoading(true);
    try {
      const result = await fetchTrips(page, limit, status, type || defaultType, difficulty || defaultDifficulty);
      setTrips(result.trips!);
      setCurrentPage(result.currentPage!);
      setTotalPages(result.totalPages!);
    } catch (error) {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const getTripById = useCallback(async (id: string): Promise<Trip | null> => {
    setLoading(true);
    try {
      const trip = await fetchTripById(id);
      return trip;
    } catch (error) {
      toast.error("Failed to fetch trip details");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE a new trip
  const addTrip = async (tripData: TripFormInput): Promise<void> => {
    try {
      await createTrip(tripData);
      // await getTrips();
      toast.success("Trip created successfully!");
    } catch (error) {
      if (isApiError(error)) {
        toast.error(`${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        toast.error('An unexpected error occurred while creating the booking.');
      }
      throw error;
    }
  };

  // UPDATE an existing trip
  const editTrip = async (id: string, tripData: TripFormInput): Promise<void> => {
    try {
      await updateTrip(id, tripData);
      await getTrips(); // Refresh list
      toast.success("Trip updated successfully!");
    } catch (error) {
      toast.error("Failed to update trip");
    }
  };

  // DELETE a trip
  const removeTrip = async (id: string): Promise<void> => {
    try {
      await deleteTrip(id);
      await getTrips();
      toast.success("Trip deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  };

  // SEARCH trips
  const searchTrip = async (
    filters: TripSearchParams
  ): Promise<void> => {
    setLoading(true);
    try {
      const result = await searchTrips(filters);
      setTrips(result.trips!);
      setCurrentPage(result.currentPage!);
      setTotalPages(result.totalPages!);
    } catch (error) {
      toast.error("Failed to search trips");
    } finally {
      setLoading(false);
    }
  };

  // PAGINATION
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getTrips(page);
    }
  };

  useEffect(() => {
    getTrips();
  }, []);

  return {
    trips,
    loading,
    addTrip,
    editTrip,
    removeTrip,
    searchTrip,
    getTripById,
    currentPage,
    totalPages,
    goToPage,
    getTrips,
  };
}

export function useMailAPI(): UseMailAPI {
  const [loading, setLoading] = useState<boolean>(false);

  const handleMailRequest = async (
    endpointFn: (id: string) => Promise<void>,
    id: string,
    successMessage: string,
    errorMessage: string
  ): Promise<void> => {
    setLoading(true);
    try {
      await endpointFn(id);
      toast.success(successMessage);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(`${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const bookingConfirm = async (id: string): Promise<void> =>
    handleMailRequest(
      async (bookingId) =>
        postRequest("/api/mail/bookingMail", { confirm: true, bookingId }),
      id,
      "Booking confirmed successfully! 🎉",
      "An error occurred while confirming the booking. 😞"
    );

  const bookingCancel = async (id: string): Promise<void> =>
    handleMailRequest(
      async (bookingId) =>
        postRequest("/api/mail/bookingMail", { cancel: true, bookingId }),
      id,
      "Booking cancelled successfully. ❌",
      "An error occurred while cancelling the booking. 😞"
    );

  const bookingReschedule = async (id: string): Promise<void> =>
    handleMailRequest(
      async (bookingId) =>
        postRequest("/api/mail/bookingMail", {
          reschedule: true,
          bookingId,
          newDate: new Date().toISOString(),
        }),
      id,
      "Booking rescheduled successfully! ⏰",
      "An error occurred while rescheduling the booking. 😞"
    );

  return {
    loading,
    bookingConfirm,
    bookingCancel,
    bookingReschedule,
  };
}



