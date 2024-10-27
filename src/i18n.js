import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationVI from "./locales/vi/translation.json";
import { EKeyTranslations } from "./interfaces/common";

// the translations
const resources = {
  [EKeyTranslations.en]: {
    translation: translationEN,
  },
  [EKeyTranslations.vi]: {
    translation: translationVI,
  },
};

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: EKeyTranslations.vi,
    debug: true,
  });

export default i18n;
