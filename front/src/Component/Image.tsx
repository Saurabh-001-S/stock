import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const Image: React.FC<{ URL: string }> = ({ URL }) => {
  return (
    <div>
      <Zoom>
        <img src={`./assets/${URL}`} alt="image" />
      </Zoom>
    </div>
  );
};

export default Image;
