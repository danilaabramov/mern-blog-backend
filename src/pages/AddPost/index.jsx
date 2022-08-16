import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import { fetchAuthMe, selectIsAuth } from "../../redux/slices/auth";
import styles from "./AddPost.module.scss";
import axios from "../../axios";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [title2, setTitle2] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userId, setUserId] = useState();
  const { data } = useSelector((state) => state.auth);
  const isEditing = Boolean(id);
  const dispatch = useDispatch();

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(
        process.env.REACT_APP_API_URL
          ? process.env.REACT_APP_API_URL + data.url
          : `http://localhost:4444${data.url}`
      );
    } catch (err) {
      console.log(err);
      alert("Ошибка при загрузке файла!");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const fields = {
        title,
        title2,
        imageUrl,
        tags,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      window.localStorage.setItem("clickCount", "0");
      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert("Ошибка при создании статьи!");
    }
  };

  useEffect(() => {
    dispatch(fetchAuthMe());
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setTitle2(data.title2);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(", "));
          setUserId(data.user._id);
        })
        .catch((err) => {
          console.log(err);
          alert("Ошибка при получении статьи!");
        });
    }

    if (!isEditing) {
      setTitle("");
      setTitle2("");
      setText("");
      setImageUrl("");
      setTags("");
    }
  }, [isEditing]);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (
    (!window.localStorage.getItem("token") && !isAuth) ||
    (isEditing && data?._id !== userId && userId && data?._id)
  ) {
    return <Navigate to="/" />;
  }

  if ((userId && data?._id) || !isEditing) {
    return (
      <Paper style={{ paddingBottom: 20, paddingTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            size="large"
            style={{
              overflow: "hidden",
              display: "block",
              height: 36,
              lineHeight: "16px",
              fontSize: 14,
              padding: "2px 5px",
            }}
          >
            Загрузить превью
            <input
              type="file"
              onChange={handleChangeFile}
              style={{
                top: 6,
                right: 102,
                transform: "scale(2)",
                opacity: 0,
                position: "absolute",
                cursor: "pointer",
                width: 206,
              }}
            />
          </Button>
          <TextField
            classes={{ root: styles.title }}
            style={{ paddingRight: 20, paddingLeft: 20 }}
            variant="standard"
            placeholder="Ссылка на превью..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
          />

          {imageUrl && (
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
            >
              Удалить
            </Button>
          )}
        </div>

        {imageUrl && (
          <img className={styles.image} src={imageUrl} alt="Uploaded" />
        )}

        <br />
        <br />
        <TextField
          classes={{ root: styles.title }}
          variant="standard"
          placeholder="Заголовок статьи..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          classes={{ root: styles.title2 }}
          variant="standard"
          placeholder="Подзаголовок статьи..."
          value={title2}
          onChange={(e) => setTitle2(e.target.value)}
          fullWidth
        />
        {/*<TextField*/}
        {/*  value={tags}*/}
        {/*  onChange={(e) => setTags(e.target.value)}*/}
        {/*  classes={{ root: styles.tags }}*/}
        {/*  variant="standard"*/}
        {/*  placeholder="Тэги"*/}
        {/*  fullWidth*/}
        {/*/>*/}
        <SimpleMDE
          className={styles.editor}
          value={text}
          onChange={onChange}
          options={options}
        />
        <div className={styles.buttons}>
          <Button onClick={onSubmit} size="large" variant="contained">
            {isEditing ? "Сохранить" : "Опубликовать"}
          </Button>
          <a href="/">
            <Button size="large">Отмена</Button>
          </a>
        </div>
      </Paper>
    );
  }
};
