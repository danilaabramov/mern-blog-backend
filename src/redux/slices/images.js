import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchImagesLimits = createAsyncThunk(
  "posts/fetchImagesLimits",
  async ({ length, date = 0 }) => {
    const { data } = await axios.get(`/images/limit/${length}/date/${date}`);

    return data;
  }
);

export const fetchImagesLimitFirst = createAsyncThunk(
  "posts/fetchImagesLimitFirst",
  async () => {
    const { data } = await axios.get(`/images/limit/0/date/0`);
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
  images: {
    items: [],
    status: "loading",
    firstDate: 0,
  },
};

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchImagesLimits.pending]: (state) => {
      state.images.status = "loading";
    },
    [fetchImagesLimits.fulfilled]: (state, action) => {
      state.images.items = [...state.images.items, ...action.payload];
      state.images.status = "loaded";
    },
    [fetchImagesLimits.rejected]: (state) => {
      state.images.status = "error";
    },
    [fetchImagesLimitFirst.pending]: (state) => {
      state.images.status = "loading";
    },
    [fetchImagesLimitFirst.fulfilled]: (state, action) => {
      state.images.firstDate = action.payload[0].createdAt;
      state.images.items = action.payload;
      state.images.status = "loaded";
    },
    [fetchImagesLimitFirst.rejected]: (state) => {
      state.images.status = "error";
    },
  },
});

export const imagesReducer = imagesSlice.reducer;
export const isImagesLoaded = (state) =>
  Boolean(state.images.images.items.length);
