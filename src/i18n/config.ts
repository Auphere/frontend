import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { STORAGE_KEYS } from "@/lib/constants";

import en from "./locales/en.json";
import es from "./locales/es.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: "es", // Default language (Spanish)
    lng: localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "es", // Get saved language or default

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Order of language detection methods
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
    },
  });

export default i18n;
