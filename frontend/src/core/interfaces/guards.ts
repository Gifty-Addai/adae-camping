import { ApiError } from "@/lib/apiUtils";

export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};