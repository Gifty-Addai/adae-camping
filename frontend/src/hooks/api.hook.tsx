import { Product, ProductFormData, UseProductAPI } from "@/core/interfaces";
import { createProduct, deleteProduct, fetchProducts, searchProducts, updateProduct } from "@/lib/apiUtils";
import { useState, useEffect } from "react";
import { toast } from "react-toastify"; 

export const useProductAPI = (): UseProductAPI => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null); 

  const getProducts = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setApiError(null);  // Reset error on success
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setApiError("Failed to load products");  // Set error message
      toast.error("Failed to load products"); 
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: ProductFormData): Promise<void> => {
    try {
      await createProduct(productData);
      await getProducts();
      setApiError(null);  // Reset error on success
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Failed to add product:", error);
      setApiError("Failed to add product");  // Set error message
      toast.error("Failed to add product");
    }
  };

  const editProduct = async (id: string, productData: ProductFormData): Promise<void> => {
    try {
      await updateProduct(id, productData);
      await getProducts();
      setApiError(null);  // Reset error on success
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Failed to update product:", error);
      setApiError("Failed to update product"); 
      console.error("Failed to update product apiError",apiError); 
      toast.error("Failed to update product");
    }
  };

  const removeProduct = async (id: string): Promise<void> => {
    try {
      await deleteProduct(id);
      await getProducts();
      setApiError(null);  // Reset error on success
      toast.success("Product deleted successfully!"); 
    } catch (error) {
      console.error("Failed to delete product:", error);
      setApiError("Failed to delete product");  // Set error message
      toast.error("Failed to delete product");
    }
  };

  const searchProduct = async (filters: Record<string, any>): Promise<void> => {
    setLoading(true);
    try {
      const result = await searchProducts(filters);
      setProducts(result);
      setApiError(null);  // Reset error on success
      toast.success("Products searched successfully!"); 
    } catch (error) {
      console.error("Failed to search products:", error);
      setApiError("Failed to search products");  // Set error message
      toast.error("Failed to search products"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return {
    products,
    loading,
    apiError,
    addProduct,
    editProduct,
    removeProduct,
    searchProduct,
  };
};
