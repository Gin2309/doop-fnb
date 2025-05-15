import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import language files
import translationEN from "@/locales/en.json";
import translationVI from "@/locales/vi.json";

// Default language
const defaultLanguage = "vi";

// Function to initialize i18next
const initI18next = (language: string) => {
  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: translationEN,
      },
      vi: {
        translation: translationVI,
      },
    },
    lng: language,
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false,
    },
  });
};

// Initialize with default language
initI18next(defaultLanguage);

export default i18n;
