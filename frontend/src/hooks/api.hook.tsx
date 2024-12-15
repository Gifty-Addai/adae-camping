import { Product, ProductFormData, Trip, TripFormData, UseProductAPI, UseTripAPI } from "@/core/interfaces";
import { createProduct, createTrip, deleteProduct, deleteTrip, fetchProducts, fetchTrips, searchProducts, searchTrips, updateProduct, updateTrip } from "@/lib/apiUtils";
import { useState, useEffect } from "react";
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

  const getTripById = async (id: string): Promise<Trip | null> => {
    setLoading(true);
    try {
      const trip = await getTripById(id);
      return trip;
    } catch (error) {
      toast.error("Failed to fetch trip details");
      return null;
    } finally {
      setLoading(false);
    }
  };

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
      await getTrips(); // Refresh list
      toast.success("Trip deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  };

  // SEARCH trips
  const searchTrip = async (
    filters: Record<string, any>,
    page: number = currentPage
  ): Promise<void> => {
    setLoading(true);
    try {
      const result = await searchTrips(filters, page, limit);
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