"use client";

import { useEffect, useRef } from "react";
import { useMusicStore } from "@/lib/music-store";
import { useLocaleStore } from "@/lib/locale-store";

const VIDEO_ID = "wLoWd2KyUro";
type Player = { playVideo: () => void; mute: () => void; unMute: () => void; destroy: () => void };
declare global {
  interface Window {
    YT: { Player: new (el: HTMLElement, config: Record<string, unknown>) => Player };
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function EntryGate() {
  const entered = useMusicStore(s => s.entered);
  const setEntered = useMusicStore(s => s.setEntered);
  const setPlayer = useMusicStore(s => s.setPlayer);
  const setMuted = useMusicStore(s => s.setMuted);
  const locale = useLocaleStore(s => s.locale);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!entered || !wrapperRef.current) return;
    let active = true;
    let player: Player | null = null;
    const mount = document.createElement("div");
    wrapperRef.current.appendChild(mount);
    const createPlayer = () => {
      if (!active) return;
      player = new window.YT.Player(mount, {
        height: "0", width: "0", videoId: VIDEO_ID,
        playerVars: { autoplay: 0, mute: 1, controls: 0, disablekb: 1 },
        events: { onReady: () => {
          if (!active) return;
          setPlayer(player); setMuted(false);
          player?.unMute(); player?.playVideo();
        } },
      });
    };
    let script: HTMLScriptElement | null = null;
    if (window.YT?.Player) createPlayer();
    else {
      window.onYouTubeIframeAPIReady = createPlayer;
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
    return () => {
      active = false; player?.destroy(); mount.remove(); script?.remove();
      if (window.onYouTubeIframeAPIReady === createPlayer) window.onYouTubeIframeAPIReady = () => {};
      setPlayer(null);
    };
  }, [entered, setPlayer, setMuted]);
  return <>
    <div ref={wrapperRef} className="fixed h-0 w-0 overflow-hidden opacity-0" aria-hidden="true" />
    {!entered && <button className="sound-invite" onClick={() => setEntered(true)}>
      <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>
      {locale === "es" ? "Activar sonido" : "Enable sound"}
    </button>}
  </>;
}
