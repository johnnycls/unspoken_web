import { useEffect, useState } from "react";

const useIsStandalone = () => {
  const [isStandalone, setIsStandalone] = useState<false | true | "unknown">(
    "unknown"
  );
  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  return isStandalone;
};

export default useIsStandalone;
