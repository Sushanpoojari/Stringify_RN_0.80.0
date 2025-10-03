import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAPI } from "../../api/userAPI/userAPI";

export const fetchProfileData= createAsyncThunk(
    "/api/user/fetchProfile",
    async ({userId},{rejectWithValue})=>{
       try {
         console.log('userId -- ', userId)   
        const response = await userAPI.getUserData({ userId });
        console.log('response', JSON.stringify(response, null, 2))
        return response.data?.data;
       } catch (error) {
        console.log("Fetch profile Data ",error)
        return rejectWithValue(error)
       }
    }
)

const userProfileSlice = createSlice({
    name:'userProfile',
    initialState:{
        profile: [],
        isLoading:false,
        error:null,
        isUpdating:{},
    },
    reducers:{},
    extraReducers: builder=>{
        builder
            .addCase(fetchProfileData.pending, (state) => {
                state.isLoading = true;
              })
            .addCase(fetchProfileData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload || [];
              })
            .addCase(fetchProfileData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
              });
    }
});

export default userProfileSlice.reducer;