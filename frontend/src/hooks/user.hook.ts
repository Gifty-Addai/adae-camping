import { ApiResponse, ConfirmMemberRequest, ConfirmMembershipResponse, UpdateUserPayload, User, UseUserAPI } from "@/core/interfaces";
import { isApiError } from "@/core/interfaces/guards";
import { confirmUserMembership, deleteUserAPI, fetchAllUsers, fetchUserByIdAPI, fetchUserProfile, updateUserByIdAPI, updateUserProfileAPI } from "@/lib/apiUtils";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

export function useUserAPI(): UseUserAPI {
    const [users, setUsers] = useState<User[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleError = (err: any) => {
      const message = err?.message || "An unexpected error occurred";
      setError(message);
      toast.error(message);
    };
  
    const getUserProfile = async (): Promise<User | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchUserProfile();
        return result;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const updateUserProfile = async (payload: UpdateUserPayload): Promise<User | null> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await updateUserProfileAPI(payload);
        toast.success("Profile updated successfully!");
        return updated;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const confirmMembership = async (
      params : ConfirmMemberRequest
    ): Promise<ConfirmMembershipResponse> => {
      setLoading(true);
      setError(null);
      try {
        const result = await confirmUserMembership(params);
        return result;
      } catch (error: any) {
        if (isApiError(error)) {
          console.error("Verification error:", error);
          toast.error(`${error.message}`);
        } else {
          console.error("Unexpected error:", error);
          toast.error('An unexpected error occurred while checking memebership.');
        }
        // Optionally, you might want to re-throw the error or handle it differently
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    const getAllUsers = async (): Promise<User[] | null> => {
      setLoading(true);
      setError(null);
      try {
        const allUsers = await fetchAllUsers();
        setUsers(allUsers);
        return allUsers;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const getUserById = useCallback(async (id: string): Promise<User | null> => {
      setLoading(true);
      setError(null);
      try {
        const user = await fetchUserByIdAPI(id);
        return user;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const updateUserById = async (id: string, payload: UpdateUserPayload): Promise<User | null> => {
      setLoading(true);
      setError(null);
      try {
        const user = await updateUserByIdAPI(id, payload);
        toast.success("User updated successfully!");
        // Optionally refresh users list if needed:
        // await getAllUsers();
        return user;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const deleteUser = async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const result = await deleteUserAPI(id);
        if (result.success) {
          toast.success("User deleted successfully!");
          // Optionally refresh users list if needed:
          // await getAllUsers();
          return true;
        }
        return false;
      } catch (err) {
        handleError(err);
        return false;
      } finally {
        setLoading(false);
      }
    };
  
    return {
      users,
      loading,
      error,
      getUserProfile,
      updateUserProfile,
      confirmMembership,
      getAllUsers,
      getUserById,
      updateUserById,
      deleteUser,
    };
  }