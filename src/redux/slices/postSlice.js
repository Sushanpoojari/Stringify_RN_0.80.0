import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postAPI } from "../../api/postAPI/postAPI";
import { voteAPI } from "../../api/voteAPI/voteAPI";
import { userAPI } from "../../api/userAPI/userAPI";

export const fetchDashboardData = createAsyncThunk(
  '/api/user/fetchDashboard',
  async ({ userId, pageNumber = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await userAPI.getDashboardData({ userId, pageNumber, pageSize });
      return response.data?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const votePost = createAsyncThunk(
  "/api/votes/updateVote",
  async ({ questionId, voteType, userId }, { dispatch }) => {
    console.log('{ questionId: postId, voteType, userId }', JSON.stringify({ questionId, voteType, userId }, null, 2))
    const response = await voteAPI.updateVote({ questionId, voteType, userId });
    console.log('response', JSON.stringify(response, null, 2))
    // dispatch(fetchDashboardData({ userId }));
    return response?.data?.data;
  }
);


const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    isRefreshing:false,
    error: null,
    totalPage:0,
    isVoting: false,
    userVoting: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardData.pending, (state,action) => {
        if (action.meta.arg.pageNumber === 1) {
          state.loading = true;
        }else{
          state.isRefreshing=true;
        }
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.isRefreshing=false;

        if (action.meta.arg.pageNumber === 1) {
          // First page -> New Data
          state.posts = action.payload;
        } else {
          // Next pages -> append without duplicating
          const existingIds = new Set(state.posts.map(p => p._id));
          const newPosts = action.payload.filter(p => !existingIds.has(p._id));
          state.posts = [...state.posts, ...newPosts];
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.isRefreshing=false;
        state.error = action.error.message;
      })
      .addCase(votePost.pending, (state, action) => {
        state.isVoting = true;
        const { questionId } = action.meta.arg;
        state.userVoting[questionId] = true;
      })
      .addCase(votePost.fulfilled, (state, action) => {
        state.isVoting = false;
        const { questionId, voteType, userId } = action.meta.arg;
        state.userVoting[questionId] = false;
      
        // Find the post in state
        const postIndex = state.posts.findIndex(p => p._id === questionId);
      
        if (postIndex !== -1) {
          // Update votes with server response
          state.posts[postIndex].upvotes = action.payload.upvotes;
          state.posts[postIndex].downvotes = action.payload.downvotes;
      
          // Update the hasCurrentUserVoted field
          if (state.posts[postIndex].hasCurrentUserVoted?.length > 0) {
            state.posts[postIndex].hasCurrentUserVoted[0].voteType = voteType;
          } else {
            state.posts[postIndex].hasCurrentUserVoted = [
              { userId, voteType }
            ];
          }
        }
      })
      .addCase(votePost.rejected, (state, action) => {
        state.isVoting = false;
        const { questionId } = action.meta.arg;
        state.userVoting[questionId] = false;
      });
  },
});

export default postsSlice.reducer;