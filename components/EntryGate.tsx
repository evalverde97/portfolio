"use client";

import { useEffect, useRef } from "react";
import { useMusicStore } from "@/lib/music-store";
import { useLocaleStore } from "@/lib/locale-store";

// AC/DC – Shoot to Thrill, official audio uploaded by Sony Music Entertainment:
// https://www.youtube.com/watch?v=wLoWd2KyUro
const VIDEO_ID = "wLoWd2KyUro";

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement,
        config: Record<string, unknown>
      ) => { playVideo: () => void; mute: () => void; unMute: () => void };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function EntryGate() {
  const entered = useMusicStore((s) => s.entered);
  const setEntered = useMusicStore((s) => s.setEntered);
  const setPlayer = useMusicStore((s) => s.setPlayer);
  const locale = useLocaleStore((s) => s.locale);
  // A wrapper React owns and never puts JSX children into — the YouTube SDK
  // gets its own mount node underneath, created imperatively, so it can
  // freely replace that node with an <iframe> without React ever noticing
  // (React would crash trying to reconcile a node the SDK already swapped).
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<{
    playVideo: () => void;
    mute: () => void;
    unMute: () => void;
  } | null>(null);
  // The visitor can click "enter" before the YouTube API has even finished
  // loading — this remembers that intent so playback starts the instant the
  // player becomes ready, instead of the click silently doing nothing.
  const wantsToPlayRef = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const mountNode = document.createElement("div");
    wrapper.appendChild(mountNode);

    const createPlayer = () => {
      playerRef.current = new window.YT.Player(mountNode, {
        height: "0",
        width: "0",
        videoId: VIDEO_ID,
        playerVars: { autoplay: 0, mute: 1, controls: 0, disablekb: 1 },
        events: {
          onReady: () => {
            setPlayer(playerRef.current);
            if (wantsToPlayRef.current) {
              playerRef.current?.unMute();
              playerRef.current?.playVideo();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  }, [setPlayer]);

  const handleEnter = () => {
    setEntered(true);
    wantsToPlayRef.current = true;
    playerRef.current?.unMute();
    playerRef.current?.playVideo();
  };

  return (
    <>
      {/* Stays mounted after the gate closes so playback keeps going. */}
      <div ref={wrapperRef} className="fixed h-0 w-0 overflow-hidden opacity-0" />

      {!entered && (
        <div
          className="fixed inset-0 z-[200] flex cursor-pointer items-center justify-center bg-black"
          onClick={handleEnter}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleEnter();
          }}
        >
          <p
            className="animate-pulse font-mono text-xs tracking-[0.3em] sm:text-sm"
            style={{ color: "var(--accent-soft)" }}
          >
            {locale === "es" ? "CLICK PARA ENTRAR" : "CLICK TO ENTER"}
          </p>
        </div>
      )}
    </>
  );
}
