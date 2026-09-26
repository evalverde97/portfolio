"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useExperienceStore } from "@/lib/experience-store";

const RETURN_PROGRESS = 0.78;

/**
 * When arriving back at `/` from a project page (`?from=project`), skips the
 * intro/dissolve sequence by jumping straight to the settled-network scroll
 * position, then clears the transition overlay and the query param.
 *
 * Strips the query param via raw History API (not next/navigation's router)
 * because router.replace triggers Next's scroll restoration, which would
 * reset scrollY back to 0 right after we've just set it.
 */
export default function ReturnScrollRestore() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("from") !== "project") return;

    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * RETURN_PROGRESS, behavior: "auto" });
    useExperienceStore.getState().setScrollProgress(RETURN_PROGRESS);
    useExperienceStore.getState().setNetworkSettled(true);

    const timeout = window.setTimeout(() => {
      useExperienceStore.getState().setTransitionPhase("idle");
      window.history.replaceState(null, "", "/");
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchParams]);

  return null;
}
