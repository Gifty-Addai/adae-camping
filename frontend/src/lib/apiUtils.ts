import { Product, ProductFormData, SignInResponse, VerifyPaymentResponse } from "@/core/interfaces";
import { deleteRequest, postRequest } from "./utils";

export const verifyPayment = async (param: {reference_id:string}) : Promise<VerifyPaymentResponse> =>{

  const data = await postRequest<VerifyPaymentResponse>(`/api/auth/verifypayment/${param.reference_id}`);
  return data;
}

export const sigin = async (params:{email:string,password:string}): Promise<SignInResponse> => {
  const data = await postRequest<SignInResponse>('/api/auth/login', params);
  return data;
};

// Fetch all products
export const fetchProducts = async (page: number, limit: number): Promise<{ products: Product[], totalPages: number, currentPage:number, totalProducts:number, isSuggestion:boolean }> => {
  const data = await postRequest<{ products: Product[], totalPages: number, currentPage:number, totalProducts:number, isSuggestion:boolean }>('/api/product/searchProducts', { page, limit });
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
export const deleteProduct = async (id: string): Promise<void> => {
  await deleteRequest(`/api/product/deleteProduct/${id}`);
};

// Search products by filters
export const searchProducts = async (filters: Record<string, any>, page: number, limit: number): Promise<{ products: Product[], totalPages: number, currentPage:number, totalProducts:number, isSuggestion:boolean }> => {
  const data = await postRequest<{ products: Product[], totalPages: number, currentPage:number, totalProducts:number, isSuggestion:boolean }>('/api/product/searchProducts', { ...filters, page, limit });
  console.log("product search", data)
  return data;
};
