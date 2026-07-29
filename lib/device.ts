/** Coarse-pointer or narrow-viewport devices get a lighter 3D scene. */
export function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
}
