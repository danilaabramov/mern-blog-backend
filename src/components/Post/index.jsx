import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ClockIcon from "@mui/icons-material/AccessTimeOutlined";

import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { fetchRemovePost } from "../../redux/slices/posts";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export const Post = ({
  id,
  title,
  title2,
  text,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
  index,
  comments,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createTime, setCreateTime] = React.useState();

  function declOfNum(number, arr) {
    return (
      number +
      arr[
        number % 100 > 4 && number % 100 < 20
          ? 2
          : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
      ]
    );
  }

  React.useEffect(() => {
    const monthNames = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const now = new Date();
    const time = new Date(Date.parse(createdAt));

    const r = now - time;

    if (parseInt(r / 1000 / 60 / 60 / 24) > 6)
      setCreateTime(
        time.getDate() +
          " " +
          monthNames[time.getMonth()] +
          " " +
          time.getFullYear()
      );
    else if (parseInt(r / 1000 / 60 / 60 / 24))
      setCreateTime(
        declOfNum(parseInt(r / 1000 / 60 / 60 / 24), [
          " день",
          " дня",
          " дней",
        ]) + " назад"
      );
    else if (parseInt(r / 1000 / 60 / 60))
      setCreateTime(
        declOfNum(parseInt(r / 1000 / 60 / 60), [" час", " часа", " часов"]) +
          " назад"
      );
    else if (parseInt(r / 1000 / 60))
      setCreateTime(
        declOfNum(parseInt(r / 1000 / 60), [" минуту", " минуты", " минут"]) +
          " назад"
      );
    else if (parseInt(r / 1000))
      setCreateTime(
        declOfNum(parseInt(r / 1000), [" секунду", " секунды", " секунд"]) +
          " назад"
      );
    else setCreateTime("Только что");
  }, [createdAt]);

  const onClickRemove = () => {
    if (window.confirm("Вы действительно хотите удалить?")) {
      window.localStorage.setItem("clickCount", "0");
      dispatch(fetchRemovePost(id));
      window.localStorage.setItem("clickCount", "0");
      navigate("/");
    }
  };

  if (isLoading || !tags) return <PostSkeleton isFull={isFullPost} />;

  return (
    <div
      className={clsx(styles.root, {
        [styles.rootFull]: isFullPost,
        [styles.rootFirst]: index === 0,
        [styles.root3]: index % 5 === 0 || index % 5 === 3 || index % 5 === 4,
      })}
    >
      {isEditable && isFullPost && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <Link to="/">
            <IconButton onClick={onClickRemove} color="secondary">
              <DeleteIcon />
            </IconButton>
          </Link>
        </div>
      )}

      {isFullPost && (
        <div style={{ width: "100%", maxWidth: 744, margin: "auto" }}>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: 20, marginTop: 15 }}>
              <UserInfo {...user} />
            </div>
            <ul className={styles.postDetails}>
              <li>
                <ClockIcon />
                <span>{createTime}</span>
              </li>
              <li>
                <EyeIcon />
                <span>{viewsCount}</span>
              </li>
              <li>
                <CommentIcon />
                <span>{commentsCount}</span>
              </li>
            </ul>
          </div>

          <h2 className={styles.titleFull}>{title}</h2>

          <div className={styles.tags}>
            <h2 className={styles.title2Full}>{title2}</h2>
          </div>

          {/*{tags.length !== 0 && (*/}
          {/*  <ul className={styles.tags}>*/}
          {/*    {tags.map((name) => (*/}
          {/*      <li key={name}>*/}
          {/*        <Link to={`/tags/${name}`}>*/}
          {/*          <div className={styles.title2Full}>#{name}</div>*/}
          {/*        </Link>*/}
          {/*      </li>*/}
          {/*    ))}*/}
          {/*  </ul>*/}
          {/*)}*/}
        </div>
      )}

      <div
        style={{
          cursor: isFullPost ? null : "pointer",
          width: "100%",
        }}
        onClick={() =>
          isFullPost
            ? {}
            : navigate(`/posts/${id}`, {
                state: {
                  id,
                  title,
                  title2,
                  createdAt,
                  imageUrl,
                  user,
                  viewsCount,
                  commentsCount,
                  tags,
                  isEditable,
                  text,
                  comments,
                },
              })
        }
      >
        {(imageUrl || !isFullPost) && (
          <div
            className={clsx(styles.imageBorder, {
              [styles.imageFullBorder]: isFullPost,
              [styles.imageBorderFirst]: index === 0,
              [styles.imageBorder3]:
                index % 5 === 0 || index % 5 === 3 || index % 5 === 4,
            })}
            style={{
              cursor: isFullPost ? null : "pointer",
              width: "100%",
            }}
          >
            {imageUrl && (
              <div
                className={clsx(styles.image, {
                  [styles.imageFull]: isFullPost,
                  [styles.imageHover]: !isFullPost,
                  [styles.imageFirst]: index === 0,
                  [styles.image3]:
                    index % 5 === 0 || index % 5 === 3 || index % 5 === 4,
                })}
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            )}
          </div>
        )}

        <div
          className={clsx({
            [styles.rootGradient]: !isFullPost,
            [styles.rootGradientFirst]: index === 0,
            [styles.rootGradient3]:
              index % 5 === 0 || index % 5 === 3 || index % 5 === 4,
          })}
        />

        <div
          className={clsx(styles.indention, {
            [styles.indentionFull]: isFullPost,
            [styles.indentionFirst]: index === 0,
          })}
          style={
            !isFullPost
              ? {
                  position: "absolute",
                  bottom: 0,
                  color: "white",
                }
              : null
          }
        >
          {!isFullPost && (
            <>
              <h2
                className={styles.title}
                style={{ fontSize: 13, marginBottom: 8 }}
              >
                {createTime}
              </h2>
              <h1
                className={clsx(styles.title, {
                  [styles.titleFirst]: index === 0,
                })}
              >
                {title}
              </h1>
            </>
          )}

          {isFullPost && children && (
            <div className={styles.content}>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};
