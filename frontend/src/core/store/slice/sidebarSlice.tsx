import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  sidebarMenu: boolean;
}

const initialState: SidebarState = {
  sidebarMenu: false,
};

const sidebarSlice = createSlice({
  name: "sidebarMenu",
  initialState,
  reducers: {
    isActive: (state: SidebarState) => { 
      state.sidebarMenu = !state.sidebarMenu;
    },
  },
});

export default sidebarSlice.reducer;
export const { isActive } = sidebarSlice.actions;
