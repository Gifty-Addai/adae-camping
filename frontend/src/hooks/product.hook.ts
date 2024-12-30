import { ApiResponse, Product, ProductFormData, UseProductAPI } from "@/core/interfaces";
import { deleteRequest, getRequest, postRequest } from "@/lib/api-Request/api-requests";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";



export const fetchProducts = async (page: number, limit: number, isAvailable: boolean | undefined): Promise<{ products: Product[], totalPages: number, currentPage: number, totalProducts: number, isSuggestion: boolean, activeProducts: number, inActiveProducts: number, }> => {
  const data = await postRequest<{ products: Product[], totalPages: number, currentPage: number, totalProducts: number, activeProducts: number, inActiveProducts: number, isSuggestion: boolean }>('/api/product/searchProducts', { page, limit, isAvailable });
  return data;
};

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  console.log("Creating product with data:", productData);
  const data = await postRequest<Product>('/api/product/createProduct', productData);
  return data;
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const data = await getRequest<Product>(`/api/product/getProductById/${id}`,);
  return data;
};

export const updateProduct = async (id: string, productData: ProductFormData): Promise<Product> => {
  console.log("Updating product with ID:", id, "Data:", productData);
  const data = await postRequest<Product>(`/api/product/updateProduct/${id}`, productData);
  return data;
};
// Delete a product by ID
export const deleteProduct = async (id: string): Promise<ApiResponse> => {
  return await deleteRequest(`/api/product/deleteProduct/${id}`);
};

// Search products by filters
export const searchProducts = async (filters: Record<string, any>, page: number, limit: number, isAvailable: boolean | undefined): Promise<{ products: Product[], totalPages: number, currentPage: number, totalProducts: number, isSuggestion: boolean }> => {
  const data = await postRequest<{ products: Product[], totalPages: number, currentPage: number, totalProducts: number, isSuggestion: boolean }>('/api/product/searchProducts', { ...filters, page, limit, isAvailable });
  console.log("product search", data)
  return data;
};


export const useProductAPI = (defaultAvailability: boolean | undefined = undefined): UseProductAPI => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [inActiveProducts, setInActiveProducts] = useState<number>(0);
  const [activeProducts, setActiveProducts] = useState<number>(0);
  const [isSuggestion, setIsSuggestion] = useState<boolean>(false);

  const limit = 12;

  const getProducts = async (isAvailable: boolean | undefined = defaultAvailability, page: number = currentPage): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetchProducts(page, limit, isAvailable);
      setProducts(response.products || []);
      setTotalPages(response.totalPages || 1);
      setIsSuggestion(response.isSuggestion || false);
      setTotalProducts(response.totalProducts || 0);
      setActiveProducts(response.activeProducts || 0);
      setInActiveProducts(response.inActiveProducts || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: ProductFormData): Promise<void> => {
    setLoading(true);
    try {
      await createProduct(productData);
      await getProducts(undefined);
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (id: string, productData: ProductFormData): Promise<void> => {
    setLoading(true);
    try {
      await updateProduct(id, productData);
      await getProducts(undefined);
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteProduct(id);
      await getProducts(undefined);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const searchProduct = async (filters: Record<string, any>, isAvailable: boolean | undefined, page: number = currentPage): Promise<Product[] | void> => {
    setLoading(true);
    try {
      const result = await searchProducts(filters, page, limit, isAvailable);
      setProducts(result.products || []);
      setTotalPages(result.totalPages || 1);
      setIsSuggestion(result.isSuggestion || false);

      return result.products;
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Failed to search products.");
    } finally {
      setLoading(false);
    }
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
      getProducts(undefined, page);
    }
  };

  useEffect(() => {
    getProducts(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    getProductById,
    activeProducts,
    inActiveProducts,
    totalProducts,
    goToPage,
  };
};