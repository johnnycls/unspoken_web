import React, { MouseEventHandler, useState } from "react";
import { Skeleton } from "primereact/skeleton";

const LoadingImage: React.FC<{
  src?: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
  className?: string;
  width?: string;
  height?: string;
}> = ({ src = "", onClick = () => {}, className = "", width, height }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <>
      <img
        src={src}
        className={className + (isLoading ? " hidden" : "")}
        onClick={onClick}
        onLoad={() => {
          setIsLoading(false);
        }}
      />
      {isLoading && <Skeleton width={width} height={height} />}
    </>
  );
};

export default LoadingImage;
