
import { useEffect, useState } from "react";

export type Lang = "vi" | "en";
const KEY = "codeser_lang_v2";

export function useLanguage() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem(KEY);
    return saved === "en" ? "en" : "vi";
  });

  useEffect(() => {
    localStorage.setItem(KEY, lang);
  }, [lang]);

  const toggle = () => setLang((l) => (l === "vi" ? "en" : "vi"));
  return { lang, toggle };
}
