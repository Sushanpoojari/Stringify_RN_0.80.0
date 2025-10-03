import { createSlice } from "@reduxjs/toolkit"

const initialState={
    user:null,
    accessToken:null,
    refreshToken:null,
    isLoggedIn:false
}

const authSlice=createSlice({
        name:'auth',
        initialState,
        reducers:{
            loginSuccess:(state,action)=>{
                state.user=action.payload.user
                state.accessToken=action.payload.accessToken
                state.refreshToken=action.payload.refreshToken
                state.isLoggedIn=true
            },
            logout:(state)=>{
                state.user=null,
                state.accessToken=null,
                state.refreshToken=null,
                state.isLoggedIn=false
                
            }
        }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;