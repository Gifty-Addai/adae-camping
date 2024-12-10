import { Product, ProductFormData, UseProductAPI } from "@/core/interfaces";
import { createProduct, deleteProduct, fetchProducts, searchProducts, updateProduct } from "@/lib/apiUtils";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// const CACHE_EXPIRATION_TIME = 15 * 60 * 1000; 
// const CACHE_KEY_PREFIX = "productsCachePage_";

// const getCacheKeyForPage = (page: number) => `${CACHE_KEY_PREFIX}${page}`;


export const useProductAPI = (): UseProductAPI => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState<number>(1); 
  const [isSuggestion, setIsSuggestion] = useState<boolean>(false); 

  const limit = 12; 

  // const isCacheExpired = (timestamp: number): boolean => {
  //   return Date.now() - timestamp > CACHE_EXPIRATION_TIME;
  // };

  const getProducts = async (page: number = currentPage): Promise<void> => {
    setLoading(true);

    // const cacheKey = getCacheKeyForPage(page);
    // const cachedData = localStorage.getItem(cacheKey);


    // if (cachedData) {
    //   const parsedData = JSON.parse(cachedData);
    //   const { products, totalPages, timestamp } = parsedData;

    //   if (!isCacheExpired(timestamp)) {
    //     setProducts(products);
    //     setTotalPages(totalPages);
    //     setLoading(false);
    //     return;
    //   } else {
    //     localStorage.removeItem(cacheKey);
    //   }
    // }

    try {
      const data = await fetchProducts(page, limit, true);
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
