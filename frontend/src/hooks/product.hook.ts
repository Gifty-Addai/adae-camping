import { ApiResponse, Product, ProductFormData, UseProductAPI } from "@/core/interfaces";
import { deleteRequest, postRequest } from "@/lib/api-Request/api-requests";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";



export const fetchProducts = async (page: number, limit: number, isAvailable: boolean | undefined): Promise<{ products: Product[], totalPages: number, currentPage: number, totalProducts: number, isSuggestion: boolean }> => {
  const data = await postRequest<{ products: Product[], totalPages: number, currentPage: number, totalProducts: number, isSuggestion: boolean }>('/api/product/searchProducts', { page, limit, isAvailable });
  return data;
};

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  console.log("Creating product with data:", productData);
  const data = await postRequest<Product>('/api/product/createProduct', productData);
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
  const [isSuggestion, setIsSuggestion] = useState<boolean>(false);

  const limit = 12;

  const getProducts = async (isAvailable: boolean | undefined = defaultAvailability, page: number = currentPage): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetchProducts(page, limit, isAvailable);
      setProducts(response.products!);
      setTotalPages(response.totalPages!);
      setIsSuggestion(response.isSuggestion!);
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

  const searchProduct = async (filters: Record<string, any>, isAvailable: boolean | undefined, page: number = currentPage): Promise<void> => {
    setLoading(true);
    try {
      const result = await searchProducts(filters, page, limit, isAvailable);
      setProducts(result.products!);
      setTotalPages(result.totalPages!);
      setIsSuggestion(result.isSuggestion!);
    } catch (error) {
      toast.error("Failed to search products");
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