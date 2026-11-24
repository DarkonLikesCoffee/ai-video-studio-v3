import React from "react";
import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

type ParallaxLayerProps = {src: string; depth?: number; direction?: "left" | "right" | "up" | "down"; scale?: number; style?: React.CSSProperties};
// A frame-deterministic image layer that drifts according to its relative scene depth.
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({src, depth = 1, direction = "left", scale = 1.04, style}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const offset = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [-1, 1]);
  const x = direction === "left" ? -offset * 18 * depth : direction === "right" ? offset * 18 * depth : 0;
  const y = direction === "up" ? -offset * 12 * depth : direction === "down" ? offset * 12 * depth : 0;
  return <AbsoluteFill style={{overflow: "hidden", pointerEvents: "none", ...style}}>
    <Img src={src} style={{width: "100%", height: "100%", objectFit: "cover", transform: `translate3d(${x}px,${y}px,0) scale(${scale})`}} />
  </AbsoluteFill>;
};

type CameraPushProps = {children: React.ReactNode; fromScale?: number; toScale?: number; panX?: number; panY?: number};
// Applies a gentle scene-wide push and pan without rasterizing individual foreground layers.
export const CameraPush: React.FC<CameraPushProps> = ({children, fromScale = 1, toScale = 1.08, panX = 0, panY = 0}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {extrapolateRight: "clamp"});
  return <AbsoluteFill style={{transform: `translate3d(${panX * progress}px,${panY * progress}px,0) scale(${interpolate(progress, [0, 1], [fromScale, toScale])})`, transformOrigin: "50% 50%", overflow: "hidden"}}>{children}</AbsoluteFill>;
};
