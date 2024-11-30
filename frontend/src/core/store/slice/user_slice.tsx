import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, IUserState } from '../../interfaces';
import { getUserSession, localStorageUtil } from '@/lib/utils';

const initialState: IUserState = {
  user: getUserSession(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: IUserState, action: PayloadAction<IUser>) => {  
      state.user = action.payload;
      localStorageUtil.set("user-info", action.payload);
    },
    removeUser: (state: IUserState) => {  // Explicitly type 'state'
      state.user = undefined;
      localStorageUtil.remove("user-info");
      // localStorageUtil.remove("token"); 
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
