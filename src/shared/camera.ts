import {Easing, interpolate} from "remotion";

// Keep camera tracks frame-driven and clamped at both ends.
export const cameraTrack = (
  frame: number,
  input: number[],
  output: number[],
  curve: "linear" | "in" | "out" | "inOut" = "inOut",
) => {
  const easing = {
    linear: Easing.linear,
    in: Easing.in(Easing.cubic),
    out: Easing.out(Easing.cubic),
    inOut: Easing.inOut(Easing.cubic),
  }[curve];
  return interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
};
