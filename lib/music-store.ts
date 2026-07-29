import { create } from "zustand";

// Loosely typed to avoid pulling in @types/youtube for one player instance.
type YTPlayer = {
  playVideo: () => void;
  mute: () => void;
  unMute: () => void;
};

type MusicState = {
  entered: boolean;
  muted: boolean;
  player: YTPlayer | null;
  setEntered: (value: boolean) => void;
  setMuted: (value: boolean) => void;
  setPlayer: (player: YTPlayer | null) => void;
};

export const useMusicStore = create<MusicState>((set) => ({
  entered: false,
  muted: false,
  player: null,
  setEntered: (value) => set({ entered: value }),
  setMuted: (value) => set({ muted: value }),
  setPlayer: (player) => set({ player }),
}));
