import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGE_FONTS: Record<string, string> = {
  en: '"Noto Sans", sans-serif',
  zh: '"Noto Sans TC", sans-serif',
  // ja: '"Noto Sans JP", sans-serif',
};

// Hook to apply language-specific font by setting data-lang attribute and CSS variables
export const useLanguageFont = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const applyLanguageFont = (lng: string) => {
      // Update CSS variables dynamically
      const fontFamily = LANGUAGE_FONTS[lng] || LANGUAGE_FONTS.en;
      document.documentElement.style.setProperty("font-family", fontFamily);
      document.documentElement.style.setProperty("--font-family", fontFamily);
    };

    // Apply font for current language
    applyLanguageFont(i18n.language);

    // Listen for language changes
    i18n.on("languageChanged", applyLanguageFont);

    return () => {
      i18n.off("languageChanged", applyLanguageFont);
    };
  }, [i18n]);
};
