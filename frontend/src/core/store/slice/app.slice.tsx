import { IAppState } from "@/core/interfaces";
import { createSlice } from '@reduxjs/toolkit';


const initialState: IAppState = {
    appName:"Tallow",
    isLoading: false,
    error: false,
};

const appSlice = createSlice({
    name:'Tallow',
    initialState,
    reducers :{
         setAppLoading : (state, action)=>{
            state.isLoading = action.payload
         },

         setError : (state, action)=>{
            state.error = action.payload
         }
    }
})

export const {setAppLoading, setError } = appSlice.actions;

export default appSlice.reducer;