import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import styles from "./Home.module.scss";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/AddCircleRounded";
import { Post, TagsBlock, CommentsBlock } from "../components";
import {
  fetchPosts11,
  fetchPostsLimits,
  fetchTags,
  fetchComments,
  isPostsLoaded,
} from "../redux/slices/posts";

export const Home = () => {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, comments } = useSelector((state) => state.posts);

  // const isPostsLoading = posts.status === "Loading";
  const IsPostsLoaded = useSelector(isPostsLoaded);
  const isTagsLoading = tags.status === "Loading";
  const isCommentsLoading = comments.status === "Loading";
  const [Posts, setPosts] = useState([]);

  const [clickCount, setClickCount] = useState(
    Number(window.localStorage.getItem("clickCount"))
      ? Number(window.localStorage.getItem("clickCount"))
      : 1
  );

  const onClickNext = () => {
    dispatch(
      fetchPostsLimits({
        length: clickCount,
        date: posts.firstDate,
      })
    );
    setClickCount((c) => c + 1);
    window.localStorage.setItem("clickCount", String(clickCount + 1));
  };

  useEffect(() => {
    if (
      !Number(window.localStorage.getItem("clickCount")) ||
      !posts.items.length
    ) {
      dispatch(fetchPosts11());
      window.localStorage.setItem("clickCount", "1");
      setClickCount(1);
    }
    dispatch(fetchComments());

    dispatch(fetchTags());
  }, [dispatch]);

  useEffect(() => {
    let arr = [];
    if (tag)
      posts.items.map((obj) =>
        [...obj.tags?.map((i) => (tag === i ? 1 : 0)), 0].reduce(
          (a, b) => a + b
        )
          ? arr.push(obj)
          : null
      );
    setPosts(arr);
  }, [posts]);

  return (
    <div style={{ width: 1160 }}>
      {/*<Tabs*/}
      {/*  style={{ marginBottom: 15 }}*/}
      {/*  value={0}*/}
      {/*  aria-label="basic tabs example"*/}
      {/*>*/}
      {/*  <Tab label="Новые" />*/}
      {/*  <Tab label="Популярные" />*/}
      {/*</Tabs>*/}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          width: "100%",
        }}
      >
        {(!IsPostsLoaded ? [...Array(5)] : tag ? Posts : posts.items).map(
          (obj, i) =>
            !IsPostsLoaded ? (
              <Post key={i} isLoading={true} />
            ) : (
              <Post
                key={i}
                id={obj._id}
                title={obj.title}
                title2={obj.title2}
                imageUrl={obj.imageUrl ? obj.imageUrl : ""}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments.length}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
                index={i}
                text={obj.text}
                comments={obj.comments}
              />
            )
        )}
        <div onClick={onClickNext} className={styles.plus}>
          Показать больше
          <AddIcon
            style={{
              display: "block",
              margin: "6px auto 0",
            }}
          />
        </div>
      </div>
      {/*<Grid xs={4} item>*/}
      {/*  <TagsBlock items={tags.items} isLoading={isTagsLoading} />*/}
      {/*  {comments.items ? (*/}
      {/*    <CommentsBlock*/}
      {/*      items={comments.items}*/}
      {/*      isLoading={isCommentsLoading}*/}
      {/*    />*/}
      {/*  ) : null}*/}
      {/*</Grid>*/}
    </div>
  );
};
