import React from "react";
import {useCurrentFrame} from "remotion";
import {ThreeScene, GroundPlane, LowPolyRock, LowPolyCharacter} from "../../../shared/three-scene";
import {AtmosphereParticles, Vignette} from "../../../shared/overlays";

// A small spatial scene verifies the R3F canvas, camera rig, low-poly props, and animated overlays.
export const SpatialSmoke: React.FC = () => {
  const frame = useCurrentFrame();
  return <>
    <ThreeScene background="#101a2c" fog="#18283b" cameraFrom={[5, 3.2, 8]} cameraTo={[4.2, 2.8, 7]}>
      <GroundPlane color="#26384b" />
      <LowPolyRock position={[-2, 0.65, -1]} scale={[1.4, 1.8, 1.2]} color="#53647a" />
      <LowPolyRock position={[2.1, 0.45, -2]} scale={[1.8, 1.1, 1.2]} color="#394e66" />
      <group position={[Math.sin(frame / 22) * 0.14, 0, 0.8]}><LowPolyCharacter position={[0, 0, 0]} /></group>
    </ThreeScene>
    <AtmosphereParticles kind="embers" count={36} />
    <Vignette strength={0.45} />
  </>;
};
