import { Button } from "primereact/button";
import React from "react";

const Error: React.FC<{ onReload?: () => void; errorText: string }> = ({
  onReload,
  errorText,
}) => {
  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <div className="flex flex-col items-center">
        <h3>{errorText}</h3>
        {onReload && <Button icon="pi pi-refresh" text onClick={onReload} />}
      </div>
    </div>
  );
};

export default Error;
