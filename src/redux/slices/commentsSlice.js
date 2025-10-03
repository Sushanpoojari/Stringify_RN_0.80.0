import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CommentsAPI } from "../../api/commentsAPI/commentsAPI";
import { post } from "../../utils/API/api";

export const fetchComments = createAsyncThunk(
  '/api/user/fetchComments',
  async ({ questionID = 0 }, { rejectWithValue }) => {
    try {
      const response = await CommentsAPI.fetchCommentsForAPost(questionID);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const postAComment = createAsyncThunk(
  '/api/user/postAComment',
  async ({ parentId = 0, parentType = "Question", content = "", postedBy = null }, { rejectWithValue,getState }) => {
    try {
      const state = getState();
      const user = state.auth.user;

      const response = await CommentsAPI.postAComment({
        parentId,
        parentType,
        content,
        postedBy
      });
      console.log('response.data?.data', JSON.stringify(response.data?.data, null, 2))
      return {
        ...response.data?.data,
        postedBy: user
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    isCommentBeingSaved: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        state.loading = true;
      })
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload
      })
    builder
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
      })
    builder
      .addCase(postAComment.pending, (state, action) => {
        state.isCommentBeingSaved = true;
      })
    builder
      .addCase(postAComment.fulfilled, (state, action) => {
        state.isCommentBeingSaved = false;
        const newComment = action.payload;
        state.comments = [newComment, ...state.comments];
      })
    builder
      .addCase(postAComment.rejected, (state, action) => {
        state.isCommentBeingSaved = false;
      })
  }
});

export default commentsSlice.reducer;