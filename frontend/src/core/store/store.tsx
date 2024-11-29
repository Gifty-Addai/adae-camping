import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./slice/app.slice";
import userSlice from "./slice/user_slice";
import sideBar from "./slice/sidebarSlice";
import cartReducer from "./slice/cart.slice";

export const store = configureStore({
    reducer : {
        appSlice : appSlice,
        userSlice : userSlice,
        sideBer : sideBar,
        cart: cartReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;