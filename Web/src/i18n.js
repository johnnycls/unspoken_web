import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "zh",
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    resources: {
      en: {
        translation: {
          // Common
          common: {
            cancel: "Cancel",
            save: "Save",
          },
          // Settings page
          settings: {
            title: "Settings",
            email: "Email Address",
            displayName: "Display Name",
            displayNameLabel: "Enter your display name",
            displayNamePlaceholder: "Your display name",
            language: "Language",
            languageLabel: "Select your preferred language",
            languagePlaceholder: "Select language",
            logout: "Logout",
          },
          // Profile update messages
          updateProfileSuccess: "Profile updated successfully",
          updateProfileError: "Failed to update profile",
          fetchProfileError: "Failed to load profile",
        },
      },
      zh: {
        translation: {
          // Common
          common: {
            cancel: "取消",
            save: "儲存",
          },
          // Settings page
          settings: {
            title: "設定",
            email: "電子郵件地址",
            displayName: "顯示名稱",
            displayNameLabel: "輸入你的顯示名稱",
            displayNamePlaceholder: "你的顯示名稱",
            language: "語言",
            languageLabel: "選擇你的偏好語言",
            languagePlaceholder: "選擇語言",
            logout: "登出",
          },
          // Profile update messages
          updateProfileSuccess: "個人資料更新成功",
          updateProfileError: "個人資料更新失敗",
          fetchProfileError: "載入個人資料失敗",
        },
      },
    },
  });

export default i18n;
