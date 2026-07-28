"use client";

import { useRouter } from "next/navigation";
import { useExperienceStore } from "@/lib/experience-store";

export default function BackToUniverse() {
  const router = useRouter();

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
      Volver al universo
    </button>
  );
}
