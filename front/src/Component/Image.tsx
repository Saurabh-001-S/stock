import React from "react";

const Image: React.FC<{ URL: string }> = ({ URL }) => {
  return (
    <div>
      <img src={URL} alt="image" />
    </div>
  );
};

export default Image;
