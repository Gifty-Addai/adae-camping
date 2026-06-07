import {
  ApiResponse,
  Product,
  ProductFormData,
  UseProductAPI,
} from "@/core/interfaces";
import {
  deleteRequest,
  getRequest,
  postRequest,
} from "@/lib/api-Request/api-requests";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const fetchProducts = async (
  page: number,
  limit: number,
  isAvailable: boolean | undefined,
  filters: Record<string, any> = {},
): Promise<{
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
  isSuggestion: boolean;
  activeProducts: number;
  inActiveProducts: number;
}> => {
  const data = await postRequest<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
    activeProducts: number;
    inActiveProducts: number;
    isSuggestion: boolean;
  }>("/api/product/searchProducts", { ...filters, page, limit, isAvailable });
  return data;
};

export const fetchTallowProducts = async (
  page: number,
  limit: number,
  subCategory?: string,
): Promise<{
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
  activeProducts: number;
}> => {
  const url = `/api/product/getTallowProducts?page=${page}&limit=${limit}${
    subCategory ? `&subCategory=${encodeURIComponent(subCategory)}` : ""
  }`;
  const data = await getRequest<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
    activeProducts: number;
    inActiveProducts?: number;
  }>(url);
  return data;
};

export const createProduct = async (
  productData: ProductFormData,
): Promise<Product> => {
  console.log("Creating product with data:", productData);
  const data = await postRequest<Product>(
    "/api/product/createProduct",
    productData,
  );
  return data;
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const data = await getRequest<Product>(`/api/product/getProductById/${id}`);
  return data;
};

export const updateProduct = async (
  id: string,
  productData: ProductFormData,
): Promise<Product> => {
  console.log("Updating product with ID:", id, "Data:", productData);
  const data = await postRequest<Product>(
    `/api/product/updateProduct/${id}`,
    productData,
  );
  return data;
};
// Delete a product by ID
export const deleteProduct = async (id: string): Promise<ApiResponse> => {
  return await deleteRequest(`/api/product/deleteProduct/${id}`);
};

// Search products by filters
export const searchProducts = async (
  filters: Record<string, any>,
  page: number,
  limit: number,
  isAvailable: boolean | undefined,
): Promise<{
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
  isSuggestion: boolean;
}> => {
  const data = await postRequest<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
    isSuggestion: boolean;
  }>("/api/product/searchProducts", { ...filters, page, limit, isAvailable });
  console.log("product search", data);
  return data;
};

export const trackProductClick = async (id: string): Promise<void> => {
  console.log(`[Frontend] Tracking click for product: ${id}`);
  await postRequest(`/api/product/click/${id}`, {});
};

export const useProductAPI = (
  defaultAvailability: boolean | undefined = undefined,
  isAdmin: boolean = false,
  initialFilters: Record<string, any> = {},
): UseProductAPI & { trackClick: (id: string) => Promise<void> } => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [inActiveProducts, setInActiveProducts] = useState<number>(0);
  const [activeProducts, setActiveProducts] = useState<number>(0);
  const [isSuggestion, setIsSuggestion] = useState<boolean>(false);
  const [searchFilters, setSearchFilters] = useState<Record<string, any>>({});

  const limit = 12;

  const getProducts = async (
    isAvailable: boolean | undefined = defaultAvailability,
    page: number = currentPage,
    filters: Record<string, any> = searchFilters
  ): Promise<void> => {
    setLoading(true);

    try {
      let response;
      const combinedFilters = { ...initialFilters, ...filters };
      if (isAdmin) {
        // Pass filter if admin
        response = await fetchProducts(
          page,
          limit,
          isAvailable,
          combinedFilters,
        );
        setInActiveProducts(response.inActiveProducts || 0);
        setIsSuggestion(response.isSuggestion || false);
      } else {
        response = await fetchTallowProducts(page, limit, combinedFilters?.subCategory);
        setInActiveProducts(
          (response.totalProducts || 0) - (response.activeProducts || 0),
        );
        setIsSuggestion(false);
      }

      setProducts(response.products || []);
      setTotalPages(response.totalPages || 1);
      setTotalProducts(response.totalProducts || 0);
      setActiveProducts(response.activeProducts || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(
        "Failed to load products. Check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: ProductFormData): Promise<boolean> => {
    setLoading(true);
    try {
      await createProduct(productData);
      await getProducts(undefined, 1, {});
      toast.success("Product added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (
    id: string,
    productData: ProductFormData,
  ): Promise<boolean> => {
    setLoading(true);
    try {
      await updateProduct(id, productData);
      await getProducts(undefined, currentPage, searchFilters);
      toast.success("Product updated successfully!");
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteProduct(id);
      await getProducts(undefined, currentPage, searchFilters);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const searchProduct = async (
    filters: Record<string, any>,
    isAvailable: boolean | undefined,
    page: number = 1,
  ): Promise<Product[] | void> => {
    setSearchFilters(filters);
    setCurrentPage(page);
    await getProducts(isAvailable, page, filters);
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    setLoading(true);
    try {
      const result = await fetchProductById(id);
      return result;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      toast.error("Failed to fetch product details.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getProducts(undefined, page, searchFilters);
    }
  };

  useEffect(() => {
    setSearchFilters({});
    setCurrentPage(1);
    getProducts(undefined, 1, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters.subCategory, initialFilters.category]);

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
    getProductById,
    activeProducts,
    inActiveProducts,
    totalProducts,
    goToPage,
    trackClick: trackProductClick,
  };
};
