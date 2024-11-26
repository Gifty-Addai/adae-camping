import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./slice/app.slice";
import userSlice from "./slice/user_slice";

export const store = configureStore({
    reducer : {
        appSlice : appSlice,
        userSlice : userSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;