import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center max-h-screen ">
      <div className="flex flex-col items-center space-y-4">
        <ClipLoader size={50} color="#FF4C5A" />
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default Loading;
