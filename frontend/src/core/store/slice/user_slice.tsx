import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IUserState, User } from '../../interfaces';
import { postRequest } from '@/lib/api-Request/api-requests';
import { fetchUserProfile, signin } from '@/lib/apiUtils';

// Define the initial state
const initialState: IUserState = {
  user: null,
  isLoading: false,
  error: null,
};

// Asynchronous thunk for signing in
export const signIn = createAsyncThunk(
  'user/signIn',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await signin(credentials);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Asynchronous thunk for fetching authenticated user
export const getAuthenticatedUser = createAsyncThunk(
  'user/getAuthenticatedUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await fetchUserProfile();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Asynchronous thunk for signing out
export const signOut = createAsyncThunk(
  'user/signOut',
  async (_, { rejectWithValue }) => {
    try {
      // Implement sign-out logic, e.g., call backend to clear cookie
      // Example: await axiosInstance.post('/api/auth/logout');
      // Assuming a logout endpoint exists
      await postRequest('/api/auth/logout', {});
      return;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Synchronous reducers if needed
    clearUser(state) {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle sign-in
    builder.addCase(signIn.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(signIn.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload || 'Sign-in failed';
    });

    // Handle fetching authenticated user
    builder.addCase(getAuthenticatedUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAuthenticatedUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(getAuthenticatedUser.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch user data';
      state.user = null;
    });

    // Handle sign-out
    builder.addCase(signOut.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
    });
    builder.addCase(signOut.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload || 'Sign-out failed';
    });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
