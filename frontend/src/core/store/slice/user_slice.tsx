import { IUser, User } from '@/core/interfaces';
import { getRequest, postRequest } from '@/lib/api-Request/api-requests';
import { setAccessToken } from '@/lib/axios-instance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';


/**
 * The shape of our User slice state.
 */
export interface UserState {
  user: IUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

/**
 * LOGIN Thunk
 */
export const login = createAsyncThunk(
  '/api/auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await postRequest<{ accessToken: string, user: IUser }>('/api/auth/login', { email, password });
      setAccessToken(response.accessToken);

      return response.user as IUser;
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * FETCH PROFILE Thunk
 */
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<User>('/api/user/getUserProfile');

      return response as User;
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Profile fetch failed';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * LOGOUT Thunk
 */
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await postRequest('/api/auth/logout', {});
      setAccessToken(null);
      return true;
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Logout failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });

    // fetchUserProfile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });

    // logout
    builder.addCase(logout.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state) => {
      // On logout, clear user
      state.status = 'idle';
      state.user = null;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
