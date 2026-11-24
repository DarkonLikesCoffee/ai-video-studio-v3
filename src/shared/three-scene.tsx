import React from "react";
import {ThreeCanvas} from "@remotion/three";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {useThree} from "@react-three/fiber";
import * as THREE from "three";

type CameraRigProps = {from?: [number, number, number]; to?: [number, number, number]; lookAt?: [number, number, number]; durationInFrames?: number};
// Drives a gentle deterministic camera move from Remotion's frame clock.
const CameraRig: React.FC<CameraRigProps> = ({from = [5, 3, 8], to = [3.8, 2.5, 7], lookAt = [0, 1, 0], durationInFrames: sceneDuration}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: compositionDuration} = useVideoConfig();
  const {camera} = useThree();
  const durationInFrames = sceneDuration ?? compositionDuration;
  const t = Math.min(1, frame / Math.max(1, durationInFrames - 1));
  camera.position.set(...from.map((v, i) => THREE.MathUtils.lerp(v, to[i]!, t)) as [number, number, number]);
  camera.lookAt(...lookAt);
  return null;
};

type ThreeSceneProps = {children?: React.ReactNode; background?: string; fog?: string; cameraFrom?: [number, number, number]; cameraTo?: [number, number, number]; durationInFrames?: number};
// Provides a lightweight lit scene with a key, fill, rim, and optional exponential fog.
export const ThreeScene: React.FC<ThreeSceneProps> = ({children, background = "#111a2a", fog, cameraFrom, cameraTo, durationInFrames}) => (
  <ThreeCanvas width={1920} height={1080} camera={{position: cameraFrom ?? [5, 3, 8], fov: 38}}>
    <color attach="background" args={[background]} />
    {fog ? <fog attach="fog" args={[fog, 8, 26]} /> : null}
    <ambientLight intensity={0.55} />
    <directionalLight position={[5, 8, 4]} intensity={2.1} castShadow={false} />
    <directionalLight position={[-5, 4, -3]} intensity={0.75} color="#8db9ff" />
    <pointLight position={[0, 5, -5]} intensity={1.1} color="#ffd3a1" />
    <CameraRig {...(cameraFrom ? {from: cameraFrom} : {})} {...(cameraTo ? {to: cameraTo} : {})} {...(durationInFrames ? {durationInFrames} : {})} />
    {children}
  </ThreeCanvas>
);

// Places a low-poly ground slab beneath spatial scene props.
export const GroundPlane: React.FC<{color?: string; width?: number; depth?: number}> = ({color = "#293648", width = 18, depth = 18}) => <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow={false}><planeGeometry args={[width, depth, 1, 1]} /><meshStandardMaterial color={color} roughness={1} /></mesh>;

// Builds a faceted mountain or rock from a low-segment cone.
export const LowPolyRock: React.FC<{position?: [number, number, number]; scale?: [number, number, number]; color?: string}> = ({position = [0, 0, 0], scale = [1, 1.4, 1], color = "#596477"}) => <mesh position={position} scale={scale} castShadow={false}><coneGeometry args={[1, 2, 6, 1]} /><meshStandardMaterial color={color} roughness={0.95} flatShading /></mesh>;

// Builds a restrained low-poly character prop from a capsule body and sphere head.
export const LowPolyCharacter: React.FC<{position?: [number, number, number]; color?: string}> = ({position = [0, 0, 0], color = "#d8b68a"}) => <group position={position}><mesh position={[0, 0.65, 0]}><capsuleGeometry args={[0.28, 0.68, 3, 5]} /><meshStandardMaterial color={color} roughness={0.82} flatShading /></mesh><mesh position={[0, 1.25, 0]}><icosahedronGeometry args={[0.28, 1]} /><meshStandardMaterial color="#e5c8a5" roughness={0.9} flatShading /></mesh></group>;
