import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.scss";

import { Header } from "./components";
import {
  Home,
  FullPost,
  Registration,
  AddPost,
  Login,
  Gallery,
  PostLink,
} from "./pages";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    if (!isAuth) dispatch(fetchAuthMe());
  }, [dispatch, isAuth]);
  return (
    <div>
      <Routes>
        <Route
          path="*"
          element={
            <div>
              <Header />
              <div className={styles.main}>
                <Home />
              </div>
            </div>
          }
        />
        <Route
          path="/"
          element={
            <div>
              <Header />
              <div className={styles.main}>
                <Home />
              </div>
            </div>
          }
        />
        <Route
          path="/gallery"
          element={
            <div>
              <Header />
              <div className={styles.main}>
                <Gallery />
              </div>
            </div>
          }
        />
        <Route path="/link/:id" element={<PostLink />} />
        <Route
          path="/tags/:tag"
          element={
            <div>
              <Header />
              <div className={styles.main}>
                <Home />
              </div>
            </div>
          }
        />

        <Route
          path="/posts/:id"
          element={
            <div>
              <Header />
              <div className={styles.main}>
                <FullPost />
              </div>
            </div>
          }
        />
        <Route
          path="/posts/:id/edit"
          element={
            <div>
              <Header />
              <div className={styles.main}>
                <AddPost />
              </div>
            </div>
          }
        />
        <Route
          path="/add-post"
          element={
            <div>
              <Header />
              <div className={styles.main}>
                <AddPost />
              </div>
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div>
              <Header />
              <div className={styles.main}>
                <Login />
              </div>
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div>
              <Header />
              <div className={styles.main}>
                <Registration />
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
