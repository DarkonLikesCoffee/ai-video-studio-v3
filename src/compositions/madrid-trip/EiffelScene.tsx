import React, { useLayoutEffect } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { COLORS, FONT } from "./constants";
import {cameraTrack} from "../../shared/camera";
import {StaggeredText} from "../../shared/staggered-text";
import { EiffelTower } from "./EiffelTower";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const CameraRig: React.FC<{ y: number; z: number }> = ({ y, z }) => {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    camera.position.set(0, y, z);
    camera.lookAt(0, 4.4, 0);
  }, [camera, y, z]);
  return null;
};

export const EiffelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const build = interpolate(frame, [15, 150], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const dolly = cameraTrack(frame, [0, durationInFrames], [22, 19.5], "out");
  const camY = cameraTrack(frame, [0, 150], [7.5, 5.6], "out");
  const spin = frame * 0.014;

  const glow = 14 + Math.sin(frame / 6) * 4;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 62%, #24345f 0%, ${COLORS.ocean} 72%)`,
      }}
    >
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 38, position: [0, 8, 20] }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
        }}
      >
        <CameraRig y={camY} z={dolly} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 10, 8]} intensity={1.6} />
        <pointLight position={[0, 9.5, 0]} color="#ffb347" intensity={glow} />
        <gridHelper args={[28, 56, "#2a4070", "#16233f"]} position={[0, -0.02, 0]} />
        <EiffelTower build={build} rotationY={spin} frame={frame} />
      </ThreeCanvas>

      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 72,
          fontFamily: FONT,
          color: COLORS.text,
        }}
      >
        <StaggeredText text="Paris" startFrame={25} staggerFrames={8} style={{fontSize: 96, fontWeight: 800, lineHeight: 1}} />
        <div style={{marginTop: 12}}>
          <StaggeredText text="La Tour Eiffel" startFrame={36} staggerFrames={5} style={{fontSize: 34, opacity: 0.8}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
