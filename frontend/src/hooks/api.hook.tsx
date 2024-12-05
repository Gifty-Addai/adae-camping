import { Product, ProductFormData, UseProductAPI } from "@/core/interfaces";
import { createProduct, deleteProduct, fetchProducts, searchProducts, updateProduct } from "@/lib/apiUtils";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useProductAPI = (): UseProductAPI => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState<number>(1); 
  const [isSuggestion, setIsSuggestion] = useState<boolean>(false); 

  const limit = 10; 

  const getProducts = async (page: number = currentPage): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchProducts(page, limit);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setIsSuggestion(data.isSuggestion);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: ProductFormData): Promise<void> => {
    try {
      await createProduct(productData);
      await getProducts();
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const editProduct = async (id: string, productData: ProductFormData): Promise<void> => {
    try {
      await updateProduct(id, productData);
      await getProducts();
      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const removeProduct = async (id: string): Promise<void> => {
    try {
      await deleteProduct(id);
      await getProducts(); 
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const searchProduct = async (filters: Record<string, any>, page: number = currentPage): Promise<void> => {
    setLoading(true);
    try {
      const result = await searchProducts(filters, page, limit);
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
      getProducts(page);
    }
  };

  useEffect(() => {
    getProducts(); 
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
