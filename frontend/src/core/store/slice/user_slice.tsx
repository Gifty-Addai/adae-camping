// src/core/store/slice/user_slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, IUserState } from '../../interfaces';
import { getUserSession, localStorageUtil } from '@/lib/utils';

const initialState: IUserState = {
  user: getUserSession(),
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state: IUserState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setUser: (state: IUserState, action: PayloadAction<IUser>) => {  
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      localStorageUtil.set("user-info", action.payload);
    },
    removeUser: (state: IUserState) => { 
      state.user = null;
      state.isLoading = false;
      state.error = null;
      localStorageUtil.remove("user-info");
      localStorageUtil.remove("token"); 
    },
    setError: (state: IUserState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setUser, removeUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
