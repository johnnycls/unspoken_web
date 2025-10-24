import { BlockUI } from "primereact/blockui";
import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";

const LoadingScreen: React.FC<{
  isLoading: boolean;
}> = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <ProgressSpinner className="z-50" />
        <BlockUI blocked fullScreen />
      </div>
    )
  );
};

export default LoadingScreen;
