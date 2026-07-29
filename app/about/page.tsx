"use client";

import { useLocaleStore } from "@/lib/locale-store";
import { dictionary } from "@/lib/i18n";

export default function AboutPage() {
  const locale = useLocaleStore((s) => s.locale);
  const t = dictionary[locale];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-accent-soft">
        {t.nav.about}
      </p>
      <h1 className="mt-4 text-3xl font-light text-white sm:text-4xl">
        {t.comingSoonTitle}
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted">{t.aboutBody}</p>
    </main>
  );
}
