import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";
import { imagesReducer } from "./slices/images";

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    images: imagesReducer,
  },
});

export default store;
