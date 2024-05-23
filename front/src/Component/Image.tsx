import React from "react";
import s8 from "../assets/s8.jpg";

const Image: React.FC<{ URL: string }> = ({ URL }) => {
  // console.log(URL);
  return (
    <div>
      <img src={URL} alt="image" />
    </div>
  );
};

export default Image;
