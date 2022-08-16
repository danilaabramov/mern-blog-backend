import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { useSelector } from "react-redux";

export const PostLink = () => {
  const [data, setData] = React.useState({});
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        window.localStorage.setItem("clickCount", "0");
        navigate("/");
        alert("Ошибка при получении статьи");
      });
  }, []);

  const [createTime, setCreateTime] = React.useState("");

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

  useEffect(() => {
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
    const time = new Date(Date.parse(data.createdAt));

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
  }, [data]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        height: 180,
      }}
    >
      <img
        src={data?.imageUrl ? data?.imageUrl : ""}
        alt=""
        style={{ width: 224, objectFit: "cover" }}
      ></img>

      <div
        style={{
          margin: "32px 32px 28px",
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-between",
          width: "calc(100% - 224px)",
        }}
      >
        <div
          style={{
            fontWeight: 500,
            fontSize: 18,
            lineHeight: "22px",
          }}
        >
          {data?.title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: 24,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#1a1a1a",
              lineHeight: "16px",
            }}
          >
            {data?.user?.fullName}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#5c5c5c",
              lineHeight: "16px",
            }}
          >
            {data?.createdAt ? createTime : ""}
          </div>
        </div>
      </div>
    </div>
  );
};
