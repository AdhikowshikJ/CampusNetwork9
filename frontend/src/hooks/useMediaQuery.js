import { useEffect, useState } from "react";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", documentChangeHandler);
    documentChangeHandler();

    return () => {
      mediaQueryList.removeEventListener("change", documentChangeHandler);
    };
  }, [query]);

  return matches;
};

const useResponsive = () => {
  const isExtraSmallScreen = useMediaQuery("(max-width: 480px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isLaptop = useMediaQuery("(min-width: 1025px)");

  return {
    isExtraSmallScreen,
    isMobile,
    isTablet,
    isLaptop,
  };
};

export default useResponsive;
