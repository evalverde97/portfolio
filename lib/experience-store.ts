import { create } from "zustand";

export type TransitionPhase = "idle" | "traveling" | "arrived" | "returning";

type ExperienceState = {
  /** 0 → 1 scroll progress through the landing → network sequence. */
  scrollProgress: number;
  /** True once the network has fully settled and nodes are interactive. */
  networkSettled: boolean;
  hoveredNodeId: string | null;
  activeNodeId: string | null;
  /** Id of the umbrella node whose sub-nodes are currently revealed, if any. */
  expandedNodeId: string | null;
  transitionPhase: TransitionPhase;
  reducedMotion: boolean;
  setScrollProgress: (progress: number) => void;
  setNetworkSettled: (settled: boolean) => void;
  setHoveredNodeId: (id: string | null) => void;
  toggleExpandedNode: (id: string) => void;
  beginTravelTo: (id: string) => void;
  beginReturn: () => void;
  setTransitionPhase: (phase: TransitionPhase) => void;
  setReducedMotion: (value: boolean) => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  scrollProgress: 0,
  networkSettled: false,
  hoveredNodeId: null,
  activeNodeId: null,
  expandedNodeId: null,
  transitionPhase: "idle",
  reducedMotion: false,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setNetworkSettled: (settled) => set({ networkSettled: settled }),
  setHoveredNodeId: (id) => set({ hoveredNodeId: id }),
  toggleExpandedNode: (id) =>
    set((state) => ({
      expandedNodeId: state.expandedNodeId === id ? null : id,
    })),
  beginTravelTo: (id) =>
    set({ activeNodeId: id, transitionPhase: "traveling" }),
  beginReturn: () => set({ transitionPhase: "returning" }),
  setTransitionPhase: (phase) => set({ transitionPhase: phase }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
}));
