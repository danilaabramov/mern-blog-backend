import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchImagesLimitFirst,
  fetchImagesLimits,
} from "../redux/slices/images";

export const Gallery = () => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.images);
  const [scroll, setScroll] = useState(0);

  window.addEventListener("scroll", () => setScroll(window.scrollY));

  useEffect(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (
      clientHeight + scroll + 300 >= scrollHeight &&
      images.status === "loaded" &&
      images.firstDate
    ) {
      dispatch(
        fetchImagesLimits({
          length: images.items.length,
          date: images.firstDate,
        })
      );
    }
  }, [scroll, images.items.length]);

  useEffect(() => {
    if (!images.items.length) {
      dispatch(fetchImagesLimitFirst());
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        display: "flex",
        position: "absolute",
        left: 0,
      }}
    >
      {images.items.map((img) => {
        return (
          <img
            key={img._id}
            src={img.imageUrl}
            alt=""
            style={{ width: 200, height: 200, objectFit: "cover" }}
          />
        );
      })}
    </div>
  );
};
