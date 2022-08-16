import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { logout, selectIsAuth } from "../../redux/slices/auth";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);
  const navigate = useNavigate();

  const onClickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <Link className={styles.logo} to="/">
          <img src={require("./logo.png")} alt="" height={40} width={40}></img>
          <div style={{ marginLeft: 20 }}>abramov.tech</div>
        </Link>
        <div className={styles.buttons}>
          {window.localStorage.getItem("token") || isAuth ? (
            <div style={{ display: "flex" }}>
              <Button onClick={() => navigate("/add-post")} variant="contained">
                Написать статью
              </Button>
              <div>
                <img
                  src={userData?.avatarUrl}
                  alt=""
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    marginLeft: 10,
                  }}
                />
              </div>
              <Button onClick={onClickLogout} variant="contained" color="error">
                Выйти
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outlined">Войти</Button>
              </Link>
              <Link to="/register">
                <Button variant="contained">Создать аккаунт</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
