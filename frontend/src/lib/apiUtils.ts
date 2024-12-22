import { ApiResponse, ConfirmMemberRequest, ConfirmMembershipResponse, SignInResponse, Trip, TripFormData, TripSearchParams, UpdateUserPayload, User, VerifyPaymentResponse } from "@/core/interfaces";
import { deleteRequest, getRequest, postRequest, putRequest } from "./utils";

export class ApiError extends Error {
  public statusCode: number;
  public errorCode?: string;

  constructor(message: string, statusCode: number = 500, errorCode?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}


export const verifyPayment = async (param: { reference_id: string }): Promise<ApiResponse<VerifyPaymentResponse>> => {

  const data = await postRequest<VerifyPaymentResponse>(`/api/auth/verifypayment/${param.reference_id}`, {});
  return data;
}

export const sigin = async (params: { email: string, password: string }): Promise<ApiResponse<SignInResponse>> => {
  const data = await postRequest<SignInResponse>('/api/auth/login', params);
  return data;
};

// Fetch all products

export const fetchTrips = async (
  page: number = 1,
  limit: number = 10,
  type?: string,
  difficulty?: string
): Promise<ApiResponse<{
  trips: Trip[];
  currentPage: number;
  totalPages: number;
  totalTrips: number;
}>> => {
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

export const createTrips = async (trips: Trip[]): Promise<ApiResponse<{
  message: string;
  trips?: Trip[];
  errors?: any[];
}>> => {
  const data = await postRequest<{
    message: string;
    trips?: Trip[];
    errors?: any[];
  }>("/api/trip/createTrips", trips);
  return data;
};

export const createTrip = async (tripData: TripFormData): Promise<ApiResponse<{
  message: string;
  trip?: Trip;
  errors?: any[];
}>> => {
  const data = await postRequest<{
    message: string;
    trip?: Trip;
    errors?: any[];
  }>("/api/trip", tripData);
  return data;
};

export const fetchTripById = async (id: string): Promise<ApiResponse<Trip>> => {
  const data = await getRequest<Trip>(`/api/trip/getTripById/${id}`);
  return data;
};

export const updateTrip = async (id: string, tripData: Partial<Trip>): Promise<ApiResponse<{
  message: string;
  trip?: Trip;
  errors?: any[];
}>> => {
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

export const deleteTrip = async (id: string): Promise<ApiResponse<{
  message: string;
}>> => {
  const data = await deleteRequest<{ message: string }>(`/api/trip/${id}`);
  return data;
};


export const searchTrips = async (
  filters: TripSearchParams
): Promise<ApiResponse<{
  trips: Trip[];
  currentPage: number;
  totalPages: number;
  totalTrips: number;
}>> => {
  const data = await getRequest<{
    trips: Trip[];
    currentPage: number;
    totalPages: number;
    totalTrips: number;
  }>(`/api/trip/searchTrip/${filters}`);
  return data;
};



// Fetch the current user's profile
export const fetchUserProfile = async (): Promise<ApiResponse<User>> => {
  const data = await getRequest<User>("/api/users/profile");
  return data;
};

// Update the current user's profile
export const updateUserProfileAPI = async (payload: UpdateUserPayload): Promise<ApiResponse<User>> => {
  const data = await putRequest<User>("/api/user/profile", payload);
  return data;
};

// Confirm user membership
export const confirmUserMembership = async (
  params: ConfirmMemberRequest
): Promise<ApiResponse<ConfirmMembershipResponse>> => {
  const data = await postRequest<ConfirmMembershipResponse>("/api/user/confirmMembership", params);
  console.log("ConfirmMembershipResponse", data)
  return data;
};

// Fetch all users (for admins)
export const fetchAllUsers = async (): Promise<ApiResponse<User[]>> => {
  const data = await getRequest<User[]>("/api/user");
  return data;
};

// Fetch a user by ID (admin or authorized)
export const fetchUserByIdAPI = async (id: string): Promise<ApiResponse<User>> => {
  const data = await getRequest<User>(`/api/users/${id}`);
  return data;
};

// Update a user by ID (admin or authorized)
export const updateUserByIdAPI = async (id: string, payload: UpdateUserPayload): Promise<ApiResponse<User>> => {
  const data = await putRequest<User>(`/api/user/${id}`, payload);
  return data;
};

// Delete a user by ID (admin or authorized)
export const deleteUserAPI = async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
  const data = await deleteRequest<{ success: boolean }>(`/api/user/${id}`);
  return data;
};

