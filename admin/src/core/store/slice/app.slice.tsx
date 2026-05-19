import { IAppState } from "@/core/interfaces";
import { createSlice } from '@reduxjs/toolkit';


const initialState: IAppState = {
    appName:"adae-akoben",
    isLoading: false,
    error: false,
};

const appSlice = createSlice({
    name:'adae-akoben',
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