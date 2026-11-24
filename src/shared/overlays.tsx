import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

type OverlayProps = {opacity?: number; color?: string};
// Adds deterministic rain streaks with varied lengths and speeds.
export const Rain: React.FC<{count?: number; color?: string}> = ({count = 90, color = "#d5e9f4"}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: "none", overflow: "hidden"}}>{Array.from({length: count}, (_, i) => {
    const x = (i * 137 + frame * (5 + i % 5)) % 2050;
    const y = (i * 83 + frame * (13 + i % 9)) % 1160;
    const opacity = 0.12 + (i % 5) * 0.035;
    return <div key={i} style={{position: "absolute", left: x, top: y, width: i % 4 === 0 ? 2 : 1, height: 18 + i % 19, background: color, opacity, transform: "rotate(18deg)", borderRadius: 2}} />;
  })}</AbsoluteFill>;
};

// Adds a broad animated fog veil with softly blended edges.
export const Fog: React.FC<OverlayProps> = ({opacity = 0.22, color = "#cbd5dc"}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: "none", background: `radial-gradient(ellipse at ${48 + Math.sin(frame / 90) * 8}% 65%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}, transparent 72%)`, mixBlendMode: "screen"}} />;
};

// Sweeps a soft wide light gradient across the frame.
export const LightSweep: React.FC<{color?: string; opacity?: number}> = ({color = "#fff2cf", opacity = 0.16}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const x = interpolate(frame, [0, durationInFrames], [-40, 140]);
  return <AbsoluteFill style={{pointerEvents: "none", background: `linear-gradient(105deg, transparent ${x - 8}%, ${color} 50%, transparent ${x + 8}%)`, opacity, mixBlendMode: "screen"}} />;
};

// Adds restrained frame-deterministic exposure flicker.
export const Flicker: React.FC<{amount?: number}> = ({amount = 0.035}) => {
  const frame = useCurrentFrame();
  const value = 1 - amount / 2 + (Math.sin(frame * 1.7) + Math.sin(frame * 0.37)) * amount / 4;
  return <AbsoluteFill style={{pointerEvents: "none", background: "#fff", opacity: Math.max(0, 1 - value), mixBlendMode: "screen"}} />;
};

// Adds edge falloff as a single smooth vignette rather than a hard rectangular mask.
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.5}) => <AbsoluteFill style={{pointerEvents: "none", background: `radial-gradient(ellipse at center, transparent 46%, rgba(0,0,0,${strength}) 100%)`}} />;

// Emits subtle embers or snow as soft round particles with independent frame speeds.
export const AtmosphereParticles: React.FC<{kind?: "embers" | "snow"; count?: number}> = ({kind = "embers", count = 48}) => {
  const frame = useCurrentFrame();
  const snow = kind === "snow";
  return <AbsoluteFill style={{pointerEvents: "none", overflow: "hidden"}}>{Array.from({length: count}, (_, i) => {
    const x = (i * 191 + Math.sin(frame / 34 + i) * (snow ? 28 : 12)) % 2000;
    const y = (i * 113 - frame * (snow ? 1.4 + i % 3 * 0.35 : 2.1 + i % 4 * 0.5) + 1200) % 1200;
    const size = snow ? 2 + i % 3 : 2 + i % 4;
    return <div key={i} style={{position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: snow ? "#f4fbff" : "#ffb65c", opacity: snow ? 0.55 : 0.3 + (i % 4) * 0.1, filter: "blur(0.6px)"}} />;
  })}</AbsoluteFill>;
};
