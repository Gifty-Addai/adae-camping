import { Booking, BookingFormData, BookingSearchParams, ConfirmMembershipResponse, Product, ProductFormData, Trip, TripFormData, TripSearchParams, UpdateUserPayload, UseBookingAPI, UseProductAPI, User, UseTripAPI, UseUserAPI } from "@/core/interfaces";
import { confirmUserMembership, createBooking, createProduct, createTrip, deleteBookingAPI, deleteProduct, deleteTrip, deleteUserAPI, fetchAllUsers, fetchBookingById, fetchBookings, fetchProducts, fetchTripById, fetchTrips, fetchUserByIdAPI, fetchUserProfile, searchBookings, searchProducts, searchTrips, updateBooking, updateProduct, updateTrip, updateUserByIdAPI, updateUserProfileAPI } from "@/lib/apiUtils";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";


export const useProductAPI = (defaultAvailability: boolean | undefined = undefined): UseProductAPI => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState<number>(1); 
  const [isSuggestion, setIsSuggestion] = useState<boolean>(false); 

  const limit = 12; 

  const getProducts = async ( isAvailable:boolean|undefined = defaultAvailability,page: number = currentPage): Promise<void> => {
    setLoading(true);

    try {
      const data = await fetchProducts(page, limit, isAvailable);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setIsSuggestion(data.isSuggestion);
      // localStorage.setItem(cacheKey, JSON.stringify({
      //   products: data.products,
      //   totalPages: data.totalPages,
      //   timestamp: Date.now(), 
      // }));
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: ProductFormData): Promise<void> => {
    try {
      await createProduct(productData);
      await getProducts(undefined);
      
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const editProduct = async (id: string, productData: ProductFormData): Promise<void> => {
    try {
      await updateProduct(id, productData);
      await getProducts(undefined);
      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const removeProduct = async (id: string): Promise<void> => {
    try {
      await deleteProduct(id);
      await getProducts(undefined); 
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const searchProduct = async (filters: Record<string, any>, isAvailable:boolean|undefined, page: number = currentPage): Promise<void> => {
    setLoading(true);
    try {
      const result = await searchProducts(filters, page, limit, isAvailable);
      setProducts(result.products);
      setTotalPages(result.totalPages);
      setIsSuggestion(result.isSuggestion); 
    } catch (error) {
      toast.error("Failed to search products");
    } finally {
      setLoading(false);
    }
  };


  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getProducts(undefined,page);
    }
  };

  useEffect(() => {
    getProducts(undefined); 
  }, []);

  return {
    products,
    loading,
    addProduct,
    editProduct,
    removeProduct,
    searchProduct,
    currentPage,
    totalPages,
    isSuggestion,
    goToPage, 
  };
};

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
    difficulty?: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchTrips(page, limit, type || defaultType, difficulty || defaultDifficulty);
      setTrips(data.trips);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
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
  const addTrip = async (tripData: TripFormData): Promise<void> => {
    try {
      await createTrip(tripData);
      await getTrips(); 
      toast.success("Trip created successfully!");
    } catch (error) {
      toast.error("Failed to create trip");
    }
  };

  // UPDATE an existing trip
  const editTrip = async (id: string, tripData: TripFormData): Promise<void> => {
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
      setTrips(result.trips);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
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

export function useUserAPI(): UseUserAPI {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any) => {
    const message = err?.message || "An unexpected error occurred";
    setError(message);
    toast.error(message);
  };

  const getUserProfile = async (): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const profile = await fetchUserProfile();
      return profile;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (payload: UpdateUserPayload): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateUserProfileAPI(payload);
      toast.success("Profile updated successfully!");
      return updated;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const confirmMembership = async (
    name: string,
    email: string,
    phone: string
  ): Promise<ConfirmMembershipResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await confirmUserMembership(name, email, phone);
      return result;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async (): Promise<User[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
      return allUsers;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = useCallback(async (id: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const user = await fetchUserByIdAPI(id);
      return user;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserById = async (id: string, payload: UpdateUserPayload): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const user = await updateUserByIdAPI(id, payload);
      toast.success("User updated successfully!");
      // Optionally refresh users list if needed:
      // await getAllUsers();
      return user;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteUserAPI(id);
      if (result.success) {
        toast.success("User deleted successfully!");
        // Optionally refresh users list if needed:
        // await getAllUsers();
        return true;
      }
      return false;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    getUserProfile,
    updateUserProfile,
    confirmMembership,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUser,
  };
}

export function useBookingAPI(defaultFilters?: BookingSearchParams): UseBookingAPI {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Items per page
  const limit = 10;

  // GET bookings from the server
  const getBookings = useCallback(
    async (
      page: number = currentPage,
      filters?: BookingSearchParams
    ): Promise<void> => {
      setLoading(true);
      try {
        const data = await fetchBookings(page, limit, filters || defaultFilters);
        setBookings(data.bookings);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    },
    [currentPage, defaultFilters]
  );

  const getBookingById = useCallback(async (id: string): Promise<Booking | null> => {
    setLoading(true);
    try {
      const booking = await fetchBookingById(id);
      return booking;
    } catch (error) {
      toast.error('Failed to fetch booking details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE a new booking
  const addBooking = async (bookingData: BookingFormData): Promise<void> => {
    setLoading(true);
    try {
      await createBooking(bookingData);
      await getBookings(); // Refresh list
      toast.success('Booking created successfully!');
    } catch (error) {
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE an existing booking
  const editBooking = async (id: string, bookingData: BookingFormData): Promise<void> => {
    setLoading(true);
    try {
      await updateBooking(id, bookingData);
      await getBookings(); // Refresh list
      toast.success('Booking updated successfully!');
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
      setBookings(result.bookings);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
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
  }, [getBookings]);

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