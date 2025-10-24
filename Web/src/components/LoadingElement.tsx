import React from "react";
import { Skeleton } from "primereact/skeleton";

type LoadingElementProps = {
  isLoading: boolean;
  width?: string;
  height?: string;
  children: React.ReactNode;
};

const LoadingElement: React.FC<LoadingElementProps> = ({
  isLoading,
  width = "100%",
  height = "1rem",
  children,
}) => (isLoading ? <Skeleton width={width} height={height} /> : children);

export default LoadingElement;
