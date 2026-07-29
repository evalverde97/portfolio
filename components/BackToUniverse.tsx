"use client";

import { useRouter } from "next/navigation";
import { useExperienceStore } from "@/lib/experience-store";
import { useLocaleStore } from "@/lib/locale-store";
import { dictionary } from "@/lib/i18n";

export default function BackToUniverse() {
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);

  const handleBack = () => {
    useExperienceStore.getState().beginReturn();
    window.setTimeout(() => {
      router.push("/?from=project");
    }, 650);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="group inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-white"
    >
      <span className="transition-transform group-hover:-translate-x-1">←</span>
      {dictionary[locale].backToUniverse}
    </button>
  );
}
