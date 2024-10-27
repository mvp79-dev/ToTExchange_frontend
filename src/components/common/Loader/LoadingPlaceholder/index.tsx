import * as React from "react";
import loadingAnimation from "@/assets/animations/loading.json";
import Lottie from "lottie-react";

interface IProps extends React.AllHTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
}

function LoadingPlaceholder({ isLoading, children, ...props }: IProps) {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
          style={{
            width: "10rem",
            height: "10rem",
          }}
        />
      ) : (
        children
      )}
    </div>
  );
}

export default LoadingPlaceholder;
