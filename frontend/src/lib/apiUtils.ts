import { ConfirmMembershipResponse, Product, ProductFormData, SignInResponse, Trip, TripFormData, TripSearchParams, UpdateUserPayload, User, VerifyPaymentResponse } from "@/core/interfaces";
import { deleteRequest, getRequest, postRequest, putRequest } from "./utils";

export const verifyPayment = async (param: {reference_id:string}) : Promise<VerifyPaymentResponse> =>{

  const data = await postRequest<VerifyPaymentResponse>(`/api/auth/verifypayment/${param.reference_id}`);
  return data;
}

export const sigin = async (params:{email:string,password:string}): Promise<SignInResponse> => {
  const data = await postRequest<SignInResponse>('/api/auth/login', params);
  return data;
};

// Fetch all products
export const fetchProducts = async (page: number, limit: number, isAvailable:boolean|undefined): Promise<{ products: Product[], totalPages: number, currentPage:number, totalProducts:number, isSuggestion:boolean }> => {
  const data = await postRequest<{ products: Product[], totalPages: number, currentPage:number, totalProducts:number, isSuggestion:boolean }>('/api/product/searchProducts', { page, limit,isAvailable });
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
export const searchProducts = async (filters: Record<string, any>, page: number, limit: number,isAvailable:boolean|undefined): Promise<{ products: Product[], totalPages: number, currentPage:number, totalProducts:number, isSuggestion:boolean }> => {
  const data = await postRequest<{ products: Product[], totalPages: number, currentPage:number, totalProducts:number, isSuggestion:boolean }>('/api/product/searchProducts', { ...filters, page, limit, isAvailable });
  console.log("product search", data)
  return data;
};

export const fetchTrips = async (
  page: number = 1,
  limit: number = 10,
  type?: string,
  difficulty?: string
): Promise<{
  trips: Trip[];
  currentPage: number;
  totalPages: number;
  totalTrips: number;
}> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (type) query.set("type", type);
  if (difficulty) query.set("difficulty", difficulty);

  const endpoint = `/api/trip/getAllTrips?${query.toString()}`;
  const data = await getRequest<{
    trips: Trip[];
    currentPage: number;
    totalPages: number;
    totalTrips: number;
  }>(endpoint);
  return data;
};

export const createTrips = async (trips: Trip[]): Promise<{
  message: string;
  trips?: Trip[];
  errors?: any[];
}> => {
  const data = await postRequest<{
    message: string;
    trips?: Trip[];
    errors?: any[];
  }>("/api/trip/createTrips", trips);
  return data;
};

export const createTrip = async (tripData: TripFormData): Promise<{
  message: string;
  trip?: Trip;
  errors?: any[];
}> => {
  const data = await postRequest<{
    message: string;
    trip?: Trip;
    errors?: any[];
  }>("/api/trip", tripData);
  return data;
};

export const fetchTripById = async (id: string): Promise<Trip> => {
  const data = await getRequest<Trip>(`/api/trip/getTripById/${id}`);
  return data;
};

export const updateTrip = async (id: string, tripData: Partial<Trip>): Promise<{
  message: string;
  trip?: Trip;
  errors?: any[];
}> => {
  const data = await fetch(`/api/trip/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tripData),
  });
  if (!data.ok) {
    throw new Error("Failed to update trip");
  }
  return data.json();
};

export const deleteTrip = async (id: string): Promise<{
  message: string;
}> => {
  const data = await deleteRequest<{ message: string }>(`/api/trip/${id}`);
  return data;
};


export const searchTrips = async (
  filters: TripSearchParams
): Promise<{
  trips: Trip[];
  currentPage: number;
  totalPages: number;
  totalTrips: number;
}> => {
  const data = await getRequest<{
    trips: Trip[];
    currentPage: number;
    totalPages: number;
    totalTrips: number;
  }>(`/api/trip/searchTrip/${filters}`);
  return data;
};



// Fetch the current user's profile
export const fetchUserProfile = async (): Promise<User> => {
  const data = await getRequest<User>("/api/users/profile");
  return data;
};

// Update the current user's profile
export const updateUserProfileAPI = async (payload: UpdateUserPayload): Promise<User> => {
  const data = await putRequest<User>("/api/user/profile", payload);
  return data;
};

// Confirm user membership
export const confirmUserMembership = async (
  name: string, 
  email: string, 
  phone: string
): Promise<ConfirmMembershipResponse> => {
  const data = await postRequest<ConfirmMembershipResponse>("/api/user/confirmMembership", { name, email, phone });
  console.log("ConfirmMembershipResponse",data)
  return data;
};

// Fetch all users (for admins)
export const fetchAllUsers = async (): Promise<User[]> => {
  const data = await getRequest<User[]>("/api/user");
  return data;
};

// Fetch a user by ID (admin or authorized)
export const fetchUserByIdAPI = async (id: string): Promise<User> => {
  const data = await getRequest<User>(`/api/users/${id}`);
  return data;
};

// Update a user by ID (admin or authorized)
export const updateUserByIdAPI = async (id: string, payload: UpdateUserPayload): Promise<User> => {
  const data = await putRequest<User>(`/api/user/${id}`, payload);
  return data;
};

// Delete a user by ID (admin or authorized)
export const deleteUserAPI = async (id: string): Promise<{ success: boolean }> => {
  const data = await deleteRequest<{ success: boolean }>(`/api/user/${id}`);
  return data;
};
