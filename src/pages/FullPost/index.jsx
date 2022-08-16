import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "../../axios";
import rehypeRaw from "rehype-raw";

import { Post } from "../../components";
import { CommentsBlock } from "../../components";
import styles from "./FullPost.module.scss";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [dataNext, setDataNext] = React.useState([]);
  const [dataPrev, setDataPrev] = React.useState([]);
  const [text, setText] = React.useState();
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    axios
      .get(`/posts/${id}/prev`)
      .then((res) => {
        setDataPrev(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Ошибка при получении статьи");
      });

    axios
      .get(`/posts/${id}/next`)
      .then((res) => {
        setDataNext(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Ошибка при получении статьи");
      });

    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        window.localStorage.setItem("clickCount", "0");
        navigate("/");
        alert("Ошибка при получении статьи");
      });
  }, [id]);

  const onSubmit = async () => {
    try {
      const fields = {
        comment: {
          user: {
            fullName: userData.fullName,
            avatarUrl: userData.avatarUrl,
          },
          text,
        },
      };
      await axios.patch(`/posts/${id}/comment`, fields);

      axios
        .get(`/posts/${id}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
          alert("Ошибка при получении статьи");
        });
      setText("");
    } catch (err) {
      console.warn(err);
      alert("Ошибка при создании комментария!");
    }
  };

  if (!location.state && (!data || !dataPrev || !dataNext)) {
    return (
      <Post
        isLoading={!location.state && (!data || !dataPrev || !dataNext)}
        isFullPost
      />
    );
  }

  return (
    <div
      style={{
        maxWidth: 1160,
        width: "100%",
      }}
    >
      <Post
        id={id}
        title={data ? data.title : location.state.title}
        title2={data ? data.title2 : location.state.title2}
        imageUrl={data ? data.imageUrl : location.state.imageUrl}
        user={data ? data.user : location.state.user}
        text={data ? data.text : location.state.text}
        comments={data ? data.comments : location.state.comments}
        createdAt={data ? data.createdAt : location.state.createdAt}
        viewsCount={data ? data.viewsCount : location.state.viewsCount}
        commentsCount={
          data ? data.comments.length : location.state.comments.length
        }
        tags={data ? data.tags : location.state.tags}
        isFullPost
        isEditable={
          data
            ? userData?._id === data.user._id
            : userData?._id === location.state.user._id
        }
      >
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          children={data ? data.text : location.state.text}
        />
      </Post>

      <div
        style={{
          display: "flex",
          width: "100%",
          border: "1px solid #eee",
          borderRadius: 10,
        }}
      >
        {dataPrev?.length === 1 ? (
          <div
            onClick={() => {
              setData(null);
              setDataNext(null);
              setDataPrev(null);
              navigate(`/posts/${dataPrev[0]._id}`, {
                state: dataPrev[0],
              });
            }}
            style={{
              textAlign: "end",
              borderRight: ".5px solid #eee",
            }}
            className={styles.PostLink}
          >
            <div className={styles.spanLink}>Предыдущий</div>
            {dataPrev[0].title}
          </div>
        ) : (
          <div style={{ marginLeft: "50%" }} />
        )}

        {dataNext?.length === 1 && (
          <div
            onClick={() => {
              setData(null);
              setDataNext(null);
              setDataPrev(null);
              navigate(`/posts/${dataNext[0]._id}`, {
                state: dataNext[0],
              });
            }}
            style={{
              borderLeft: ".5px solid #eee",
            }}
            className={styles.PostLink}
          >
            <div className={styles.spanLink}>Следующий</div>
            {dataNext[0].title}
          </div>
        )}
      </div>

      <CommentsBlock
        items={data ? data.comments : location.state.comments}
        isLoading={false}
      >
        <div className={styles.root}>
          <Avatar classes={{ root: styles.avatar }} src={userData?.avatarUrl} />
          <div className={styles.form}>
            <TextField
              label="Написать комментарий"
              variant="outlined"
              maxRows={10}
              multiline
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button variant="contained" onClick={onSubmit}>
              Отправить
            </Button>
          </div>
        </div>
      </CommentsBlock>
    </div>
  );
};
