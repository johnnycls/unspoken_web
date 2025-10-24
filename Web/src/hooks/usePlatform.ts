import { useEffect, useState } from "react";

export type Platform = "windows" | "mac" | "ios" | "android" | "unknown";

const usePlatform = () => {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    if (/Windows/.test(navigator.userAgent)) {
      setPlatform("windows");
    } else if (/Macintosh/.test(navigator.userAgent)) {
      setPlatform("mac");
    } else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      setPlatform("ios");
    } else if (/Android/.test(navigator.userAgent)) {
      setPlatform("android");
    }
  }, []);

  return platform;
};

export default usePlatform;
