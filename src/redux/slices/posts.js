import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPostsLimits = createAsyncThunk(
  "posts/fetchPostsLimits",
  async ({ length, date = 0 }) => {
    const { data } = await axios.get(`/posts/limit/${length}/date/${date}`);

    return data;
  }
);

export const fetchPosts11 = createAsyncThunk(
  "posts/fetchPosts11",
  async (length = 0) => {
    const { data } = await axios.get(`/posts/limit/${length}/date/${0}`);
    return data;
  }
);

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async () => {
    const { data } = await axios.get("/comments");
    return data;
  }
);

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    await axios.delete(`/posts/${id}`);
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
    firstDate: 0,
  },
  tags: {
    items: [],
    status: "loading",
  },
  comments: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPostsLimits.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchPostsLimits.fulfilled]: (state, action) => {
      state.posts.items = [...state.posts.items, ...action.payload];
      state.posts.status = "loaded";
    },
    [fetchPostsLimits.rejected]: (state) => {
      state.posts.status = "error";
    },
    [fetchPosts11.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchPosts11.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
      state.posts.firstDate = action.payload[0].createdAt;
    },
    [fetchPosts11.rejected]: (state) => {
      state.posts.status = "error";
    },
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    [fetchComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = "loading";
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = "loaded";
    },
    [fetchComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = "error";
    },
  },
});

export const postsReducer = postsSlice.reducer;
export const isPostsLoaded = (state) => Boolean(state.posts.posts.items.length);
