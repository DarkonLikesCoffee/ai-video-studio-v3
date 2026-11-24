import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {CameraPush, ParallaxLayer} from "../../../shared/parallax";
import {Fog, LightSweep, Vignette} from "../../../shared/overlays";

// This image-led smoke scene expects a generated plate at the documented public asset path.
export const AtmosphereSmoke: React.FC = () => {
  const frame = useCurrentFrame();
  return <CameraPush fromScale={1.02} toScale={1.08} panX={-16} panY={4}>
    <AbsoluteFill style={{background: "linear-gradient(145deg,#24364a,#526273 48%,#182331)"}} />
    <ParallaxLayer src="/render-technique-smoke/establishing-bg.jpg" depth={0.4} direction="left" />
    <ParallaxLayer src="/render-technique-smoke/establishing-mid.png" depth={1.4} direction="right" />
    <AbsoluteFill style={{background: `linear-gradient(180deg,transparent 45%,rgba(7,16,28,${0.2 + Math.sin(frame / 18) * 0.04}) 100%)`}} />
    <Fog opacity={0.2} />
    <LightSweep opacity={0.08} />
    <Vignette strength={0.55} />
  </CameraPush>;
};
