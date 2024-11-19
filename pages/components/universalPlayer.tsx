import React from "react";
import ReactPlayer from "react-player";

const UniversalPlayer = ({ url, style, onProgress }: any) => (
  <ReactPlayer
    style={{ ...style }}
    url={url}
    controls={true}
    width="100%"
    height="100%"
    onProgress={onProgress}
  />
);

export default UniversalPlayer;
