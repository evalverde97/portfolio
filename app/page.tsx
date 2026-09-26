"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import ScrollStage from "@/components/ScrollStage";
import HeadlineOverlay from "@/components/HeadlineOverlay";
import JourneyInterface from "@/components/JourneyInterface";
import ReturnScrollRestore from "@/components/ReturnScrollRestore";

const Experience = dynamic(() => import("@/components/scene/Experience"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative w-full max-w-full overflow-x-hidden bg-black">
      <div className="fixed inset-0 z-0">
        <Experience />
      </div>
      <HeadlineOverlay />
      <JourneyInterface />
      <ScrollStage />
      <Suspense fallback={null}>
        <ReturnScrollRestore />
      </Suspense>
    </main>
  );
}
