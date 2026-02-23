import { createSignal, createMemo } from "solid-js";
import { flatten, translator, resolveTemplate } from "@solid-primitives/i18n";
import { dict } from "./dict";

type Locale = keyof typeof dict;

const getInitialLang = (): Locale => {
  const saved = localStorage.getItem("lang");
  if (saved && dict[saved as Locale]) {
    return saved as Locale;
  }
  const browserLang = navigator.language;
  if (browserLang.startsWith("zh")) {
    if (browserLang === "zh-TW" || browserLang === "zh-HK" || browserLang === "zh-MO") {
      return "zh-TW";
    }
    return "zh-CN";
  }
  return "en";
};

const [locale, setLocaleState] = createSignal<Locale>(getInitialLang());

export const setLocale = (lang: Locale) => {
  setLocaleState(lang);
  localStorage.setItem("lang", lang);
};

export const currentLocale = locale;

const flatDict = createMemo(() => flatten(dict[locale()]));

export const t = translator(flatDict, resolveTemplate);
