
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: "auth",
    initialState: { token: null },

    reducers: {
        setCredential: (state, action) => {
            const accessToken = action.payload;
            state.token = accessToken;
        }
        ,

        logOut: (state) => {
            state.token = null;
        }
    }
})

export const { setCredential } = authSlice.actions
export default authSlice.reducer;