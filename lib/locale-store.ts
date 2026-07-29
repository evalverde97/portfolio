import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "./i18n";

type LocaleState = {
  locale: Locale;
  toggleLocale: () => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "es",
      toggleLocale: () =>
        set((state) => ({ locale: state.locale === "es" ? "en" : "es" })),
    }),
    { name: "ev-portfolio-locale" }
  )
);
