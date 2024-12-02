import { Product, ProductFormData, UseProductAPI } from "@/core/interfaces";
import { createProduct, deleteProduct, fetchProducts, searchProducts, updateProduct } from "@/lib/apiUtils";
import { useState, useEffect } from "react";
import { toast } from "react-toastify"; 

export const useProductAPI = (): UseProductAPI => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getProducts = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
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

  const searchProduct = async (filters: Record<string, any>): Promise<void> => {
    setLoading(true);
    try {
      const result = await searchProducts(filters);
      setProducts(result);
      toast.success("Products searched successfully!"); 
    } catch (error) {
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
    addProduct,
    editProduct,
    removeProduct,
    searchProduct,
  };
};
