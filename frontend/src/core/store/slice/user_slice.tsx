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
  otpStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  code : string;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  otpStatus: 'idle',
  error: null,
  code: "",
};

/**
 * LOGIN Thunk - Sends credentials and triggers OTP
 */
export const loginAndSendOTP = createAsyncThunk(
  'user/loginAndSendOTP',
  async (
    { password, phone }: { password: string; phone?: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      const response = await postRequest<{ ussd_code: string }>('/api/auth/login', {
        password,
        phone,
      });
      return response.ussd_code;
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Failed to send OTP.';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * VERIFY OTP Thunk - Verifies OTP and logs in the user
 */
export const verifyOTPAndLogin = createAsyncThunk(
  'user/verifyOTPAndLogin',
  async (
    { number, code }: { number: string; code: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await postRequest<{
        accessToken: string;
        user: IUser;
      }>('/api/user/verifyOTP', {
        number,
        code,
      });

      setAccessToken(response.accessToken);
      return response.user as IUser;
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'OTP verification failed.';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * FETCH PROFILE Thunk - Retrieves user details
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
        'Profile fetch failed.';
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
        'Logout failed.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // loginAndSendOTP
    builder.addCase(loginAndSendOTP.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(loginAndSendOTP.fulfilled, (state,action) => {
      state.status = 'succeeded';
      state.error = null;
      state.code = action.payload
    });
    builder.addCase(loginAndSendOTP.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });

    // verifyOTPAndLogin
    builder.addCase(verifyOTPAndLogin.pending, (state) => {
      state.otpStatus = 'loading';
      state.error = null;
    });
    builder.addCase(verifyOTPAndLogin.fulfilled, (state, action) => {
      state.otpStatus = 'succeeded';
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(verifyOTPAndLogin.rejected, (state, action) => {
      state.otpStatus = 'failed';
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

export const { setUser, clearError } = userSlice.actions;
export default userSlice.reducer;
