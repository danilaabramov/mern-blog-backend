import React from "react";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

import styles from "./Post.module.scss";

export const PostSkeleton = ({ isFull }) => {
  return (
    <div className={styles.skeleton}>
      <Stack spacing={1}>
        {isFull && (
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonUser}>
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                style={{ marginRight: 10 }}
              />

              <Skeleton
                variant="text"
                width={120}
                height={20}
                style={{ marginTop: 10 }}
              />
              <Skeleton
                variant="text"
                width={100}
                height={15}
                style={{ marginTop: 12, marginLeft: 10 }}
              />
              <Skeleton
                variant="text"
                width={50}
                height={15}
                style={{ marginTop: 12, marginLeft: 10 }}
              />
              <Skeleton
                variant="text"
                width={50}
                height={15}
                style={{ marginTop: 12, marginLeft: 10 }}
              />
            </div>

            <div className={styles.skeletonInfo}>
              <Skeleton variant="text" width="100%" height={54} />
              <div className={styles.skeletonTags}>
                <Skeleton variant="text" width={50} height={34} />
                <Skeleton variant="text" width={50} height={34} />
                <Skeleton variant="text" width={50} height={34} />
              </div>
            </div>
          </div>
        )}

        <Skeleton
          variant="rectangular"
          width="100%"
          height={isFull ? 640 : 468}
          style={{ borderRadius: 10 }}
        />
      </Stack>
    </div>
  );
};
