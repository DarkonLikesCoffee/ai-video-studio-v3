import {Easing, interpolate} from "remotion";

// Give scene beats the same smooth, deterministic frame progression.
export const easeProgress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
