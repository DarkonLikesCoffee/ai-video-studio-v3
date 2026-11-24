import { ThreeCanvas } from "@remotion/three";
import { getAstronautLayerVisibility } from "./tinyAstronautPhases";
import { DoubleSide } from "three";
import type { FC } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {cameraTrack} from "../../shared/camera";
import {easeProgress} from "../../shared/easing";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const smooth = (frame: number, range: [number, number]) =>
  easeProgress(frame, range[0], range[1]);

const Terrain: FC<{ frame: number }> = ({ frame }) => (
  <group>
    <mesh position={[0, -1.9, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[42, 42, 1, 1]} />
      <meshStandardMaterial color="#352b3b" roughness={0.98} />
    </mesh>
    {Array.from({ length: 34 }, (_, i) => {
      const x = ((i * 37) % 31) - 15;
      const z = -4 - ((i * 19) % 22);
      const h = 1.2 + ((i * 13) % 8) * 0.42;
      return (
        <mesh key={i} position={[x, -1.5 + h / 2, z]} rotation={[0, (i % 5) * 0.23, 0]}>
          <coneGeometry args={[1.1 + (i % 4) * 0.45, h, 5 + (i % 3)]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#5c4054" : "#443647"} roughness={1} flatShading />
        </mesh>
      );
    })}
    {Array.from({ length: 44 }, (_, i) => {
      const x = Math.sin(i * 17.3) * 12;
      const z = -1 - ((i * 23) % 26);
      return (
        <mesh key={i} position={[x, -1.68, z]} rotation={[0, i * 0.7, 0]}>
          <dodecahedronGeometry args={[0.09 + (i % 4) * 0.045, 0]} />
          <meshStandardMaterial color="#ad6c55" roughness={0.9} />
        </mesh>
      );
    })}
    <pointLight position={[Math.sin(frame / 60) * 2, 2.2, -8]} color="#c77c4e" intensity={15} distance={23} />
  </group>
);

const Astronaut: FC<{ frame: number; scale?: number }> = ({ frame, scale = 1 }) => {
  const walk = Math.sin(frame / 5.5);
  const bob = Math.abs(Math.sin(frame / 5.5)) * 0.045;
  return (
    <group position={[0, -0.85 + bob, 0]} scale={scale}>
      {/* Backpack */}
      <mesh position={[0, 0.05, -0.3]}>
        <boxGeometry args={[0.42, 0.58, 0.24]} />
        <meshStandardMaterial color="#b65b38" metalness={0.38} roughness={0.54} />
      </mesh>
      {/* Suit torso and collar */}
      <mesh position={[0, 0.02, 0]}>
        <capsuleGeometry args={[0.28, 0.38, 6, 12]} />
        <meshStandardMaterial color="#e7e4d9" roughness={0.76} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.19, 0.22, 0.12, 20]} />
        <meshStandardMaterial color="#9da9ad" metalness={0.7} roughness={0.28} />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 0.66, 0.015]}>
        <sphereGeometry args={[0.31, 32, 24]} />
        <meshPhysicalMaterial color="#dce9ec" metalness={0.68} roughness={0.16} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.66, 0.23]} scale={[0.83, 0.78, 0.31]}>
        <sphereGeometry args={[0.29, 32, 24]} />
        <meshPhysicalMaterial color="#142b40" metalness={0.82} roughness={0.12} clearcoat={1} />
      </mesh>
      <mesh position={[-0.11, 0.78, 0.31]} rotation={[0.1, 0, -0.3]} scale={[0.045, 0.14, 0.012]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshBasicMaterial color="#d8f6ff" transparent opacity={0.82} />
      </mesh>
      {/* Shoulder joints and arms */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.28, 0.18, 0]} rotation={[0, 0, side * (0.18 + walk * 0.12)]}>
          <mesh position={[0, -0.17, 0]}>
            <capsuleGeometry args={[0.105, 0.25, 5, 10]} />
            <meshStandardMaterial color="#e8e5dc" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.34, 0.035]}>
            <sphereGeometry args={[0.105, 16, 12]} />
            <meshStandardMaterial color="#b45c3d" roughness={0.58} />
          </mesh>
        </group>
      ))}
      {/* Legs */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.13, -0.29, 0]} rotation={[0, 0, side * walk * 0.24]}>
          <mesh position={[0, -0.21, 0]}>
            <capsuleGeometry args={[0.12, 0.25, 5, 10]} />
            <meshStandardMaterial color="#e6e2d8" roughness={0.78} />
          </mesh>
          <mesh position={[0, -0.4, 0.065]}>
            <boxGeometry args={[0.23, 0.13, 0.34]} />
            <meshStandardMaterial color="#9b4a35" roughness={0.72} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 0.65, 0.45]} color="#71dfff" intensity={0.8} distance={2} />
    </group>
  );
};

const Crystal: FC<{ frame: number }> = ({ frame }) => {
  const awaken = smooth(frame, [470, 590]);
  const pulse = 0.82 + 0.18 * Math.sin(frame / 8);
  return (
    <group position={[0, 0.15, -1.2]} rotation={[0.04, frame / 150, 0]} scale={0.78 + awaken * 0.08}>
      {/* Core and layered translucent facets */}
      <mesh scale={[0.74 * pulse, 1.85 * pulse, 0.62 * pulse]}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial color="#5bd9e8" emissive="#087f9b" emissiveIntensity={1.1 + awaken * 2.4} metalness={0.28} roughness={0.12} transmission={0.18} thickness={1.4} clearcoat={1} />
      </mesh>
      <mesh position={[-0.52, -0.35, 0.08]} rotation={[0.1, 0, -0.28]} scale={[0.35, 1.08, 0.31]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#a3fbff" emissive="#0c9eaf" emissiveIntensity={1.8} metalness={0.22} roughness={0.18} />
      </mesh>
      <mesh position={[0.52, -0.48, -0.06]} rotation={[-0.1, 0.2, 0.32]} scale={[0.33, 0.94, 0.28]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#3bb7d3" emissive="#075d83" emissiveIntensity={2.1} metalness={0.36} roughness={0.2} />
      </mesh>
      <mesh position={[0.05, 1.02, 0.02]} rotation={[0, 0, 0.08]} scale={[0.28, 0.7, 0.24]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#c0ffff" emissive="#39d8e9" emissiveIntensity={2.3 + awaken * 1.5} roughness={0.14} />
      </mesh>
      <pointLight position={[0, 0.2, 1.2]} color="#42dff4" intensity={30 + awaken * 78 + pulse * 12} distance={13} decay={2} />
      <pointLight position={[0, 1.7, -0.4]} color="#7bdcff" intensity={12 + awaken * 34} distance={8} />
    </group>
  );
};

const Cave: FC<{ frame: number }> = ({ frame }) => {
  const light = smooth(frame, [456, 584]);
  return (
    <>
      <color attach="background" args={["#070a17"]} />
      <fog attach="fog" args={["#0a1020", 6, 22]} />
      <ambientLight intensity={0.3 + light * 0.34} />
      {/* Open-front cavern: solid rock shell kept around the edges, never across the lens. */}
      <mesh position={[0, 3.15, -2.7]}>
        <boxGeometry args={[12.4, 0.7, 17]} />
        <meshStandardMaterial color="#392c48" roughness={1} />
      </mesh>
      <mesh position={[-6.05, 0.35, -2.7]}>
        <boxGeometry args={[0.75, 5.2, 17]} />
        <meshStandardMaterial color="#46334d" roughness={1} />
      </mesh>
      <mesh position={[6.05, 0.35, -2.7]}>
        <boxGeometry args={[0.75, 5.2, 17]} />
        <meshStandardMaterial color="#46334d" roughness={1} />
      </mesh>
      <mesh position={[0, 0.25, -11.1]}>
        <boxGeometry args={[12.4, 5.8, 0.8]} />
        <meshStandardMaterial color="#30243b" roughness={1} />
      </mesh>
      {/* Broken rock shoulders frame the opening without hiding the scene. */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 5.0, -0.45, -0.2]} rotation={[0, side * -0.12, side * 0.08]}>
          <mesh position={[0, 0.5, 0]}>
            <dodecahedronGeometry args={[1.15, 0]} />
            <meshStandardMaterial color="#55405a" roughness={1} flatShading />
          </mesh>
          <mesh position={[side * -0.3, 1.6, -1.9]} rotation={[0.2, 0, side * 0.18]}>
            <coneGeometry args={[0.72, 2.4, 5]} />
            <meshStandardMaterial color="#4a384f" roughness={1} flatShading />
          </mesh>
        </group>
      ))}
      {/* Cave floor */}
      <mesh position={[0, -1.55, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 28]} />
        <meshStandardMaterial color="#302337" roughness={1} />
      </mesh>
      {/* Stalactites / rock formations */}
      {Array.from({ length: 28 }, (_, i) => {
        const x = -5.4 + i * 0.4;
        const z = -5 - ((i * 17) % 8);
        const length = 0.7 + ((i * 11) % 7) * 0.24;
        return (
          <mesh key={i} position={[x, 2.35 - length / 2, z]} rotation={[0, i * 0.8, 0]}>
            <coneGeometry args={[0.35 + (i % 3) * 0.12, length, 5]} />
            <meshStandardMaterial color={i % 4 === 0 ? "#59445e" : "#3c3045"} roughness={1} flatShading />
          </mesh>
        );
      })}
      {Array.from({ length: 27 }, (_, i) => {
        const x = -5.3 + i * 0.41;
        const z = -4.7 - ((i * 13) % 10);
        const h = 0.9 + ((i * 7) % 6) * 0.26;
        return (
          <mesh key={i} position={[x, -1.12 + h / 2, z]} rotation={[0, i * 0.43, 0]}>
            <coneGeometry args={[0.3 + (i % 2) * 0.15, h, 5]} />
            <meshStandardMaterial color="#514056" roughness={1} flatShading />
          </mesh>
        );
      })}
      {/* Crystal clusters embedded in walls */}
      {Array.from({ length: 11 }, (_, i) => {
        const x = -4.7 + i * 0.94;
        const y = -0.65 + (i % 4) * 0.55;
        return (
          <mesh key={i} position={[x, y, -5.4 - (i % 3)]} rotation={[0.1, i * 0.8, (i % 2 ? 1 : -1) * 0.3]}>
            <octahedronGeometry args={[0.42 + (i % 3) * 0.1, 0]} />
            <meshStandardMaterial color="#288fa8" emissive="#07566e" emissiveIntensity={1.1} roughness={0.22} />
          </mesh>
        );
      })}
      <Crystal frame={frame} />
      {Array.from({ length: 58 }, (_, i) => {
        const phase = i * 2.399963229728653;
        const drift = frame / (38 + (i % 9) * 6);
        const radius = 1.2 + (i % 7) * 0.45;
        const x = Math.sin(phase + drift) * radius;
        const y = -0.75 + ((i * 17) % 26) / 15 + Math.sin(drift * 1.5 + phase) * 0.16;
        const z = -2.4 - ((i * 11) % 19) / 3;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.018 + (i % 4) * 0.01, 6, 6]} />
            <meshBasicMaterial color={i % 4 === 0 ? "#c6ffff" : "#48c6e0"} transparent opacity={0.36 + 0.36 * Math.sin(frame / 19 + i)} />
          </mesh>
        );
      })}
      <pointLight position={[-3, 1, -4]} color="#845bd1" intensity={13} distance={12} />
      <pointLight position={[3, -0.4, -5]} color="#d47a50" intensity={10} distance={10} />
  </>
  );
};

const PlanetScene: FC<{ frame: number }> = ({ frame }) => {
  const descent = smooth(frame, [0, 80]);
  const walk = smooth(frame, [120, 285]);
  return (
    <>
      <color attach="background" args={["#170e26"]} />
      <fog attach="fog" args={["#392339", 8, 32]} />
      <ambientLight intensity={0.52} />
      <directionalLight position={[6, 8, 4]} intensity={2.2} color="#ffd0a0" />
      <pointLight position={[-5, 3, -5]} color="#a56bca" intensity={18} distance={24} />
      <mesh position={[0, 2.1, -13]}>
        <sphereGeometry args={[2.6, 48, 32]} />
        <meshStandardMaterial color="#8d4258" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.1, -13]} scale={1.035}>
        <sphereGeometry args={[2.6, 48, 32]} />
        <meshBasicMaterial color="#ff8d73" transparent opacity={0.2} />
      </mesh>
      <Terrain frame={frame} />
      {/* Distant twin moons */}
      <mesh position={[-5, 5.2, -14]}>
        <sphereGeometry args={[0.42, 24, 16]} />
        <meshStandardMaterial color="#d7a4b9" roughness={0.86} />
      </mesh>
      <mesh position={[5.2, 4.4, -16]}>
        <sphereGeometry args={[0.24, 20, 14]} />
        <meshStandardMaterial color="#b7a9dc" roughness={0.8} />
      </mesh>
      {/* Landing pod */}
      <group position={[-2.7 + descent * 1.2, -0.72 + (1 - descent) * 2.3, -4.6]} rotation={[0, 0, descent * 0.04]}>
        <mesh>
          <cylinderGeometry args={[0.62, 0.78, 1.45, 12]} />
          <meshPhysicalMaterial color="#d7dedc" metalness={0.72} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.76, 0]}>
          <coneGeometry args={[0.64, 0.44, 12]} />
          <meshStandardMaterial color="#b65b39" metalness={0.35} roughness={0.42} />
        </mesh>
        <mesh position={[0, -0.77, 0]}>
          <cylinderGeometry args={[0.35, 0.48, 0.18, 12]} />
          <meshStandardMaterial color="#6d7581" metalness={0.8} roughness={0.3} emissive="#e66e38" emissiveIntensity={0.75 + (1 - descent) * 2} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.82, -0.48, 0]} rotation={[0, 0, side * -0.2]}>
            <boxGeometry args={[0.13, 1.35, 0.14]} />
            <meshStandardMaterial color="#b5c0c3" metalness={0.68} roughness={0.36} />
          </mesh>
        ))}
      </group>
      {/* Tiny figure traverses the terrain */}
      {getAstronautLayerVisibility(frame).planet ? (
        <group position={[0.7 - walk * 1.5, -0.12, -0.25]} rotation={[0, walk * 0.12, 0]}>
          <Astronaut frame={frame} scale={0.63} />
        </group>
      ) : null}
      {Array.from({ length: 24 }, (_, i) => {
        const x = -3.5 + ((i * 13) % 70) / 10;
        const y = -0.9 + ((i * 17) % 9) / 8;
        const z = -1 - ((i * 7) % 15);
        const drift = Math.sin(frame / 35 + i * 2) * 0.18;
        return (
          <mesh key={i} position={[x + drift, y + Math.sin(frame / 20 + i) * 0.12, z]}>
            <sphereGeometry args={[0.025 + (i % 3) * 0.012, 6, 6]} />
            <meshBasicMaterial color="#c78b78" transparent opacity={0.36} />
          </mesh>
        );
      })}
    </>
  );
};

export const TinyAstronautCrystalCave: FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const astronautVisibility = getAstronautLayerVisibility(frame);
  const cave = smooth(frame, [270, 390]);
  const reveal = smooth(frame, [390, 495]);
  const awaken = smooth(frame, [490, 580]);
  const camera = {
    x: cameraTrack(frame, [0, 90, 210, 300, 390, 480, 600], [4.6, 1.6, 2.6, 1.2, 0.8, 0.2, -0.4]),
    y: cameraTrack(frame, [0, 90, 210, 300, 390, 480, 600], [2.8, 1.5, 2.1, 1.4, 1.0, 0.7, 0.8]),
    z: cameraTrack(frame, [0, 90, 210, 300, 390, 480, 600], [11, 8.6, 9.5, 8.4, 7.6, 6.5, 7.0], "linear"),
  };
  const cameraYaw = Math.atan2(camera.x, camera.z);
  const cameraPitch = -Math.atan2(camera.y, Math.hypot(camera.x, camera.z));
  const vignette = 0.36 + reveal * 0.15 - awaken * 0.18;
  return (
    <AbsoluteFill style={{ backgroundColor: "#120d1d" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [camera.x, camera.y, camera.z], rotation: [cameraPitch, cameraYaw, 0], fov: 43 }}
        style={{ width: "100%", height: "100%" }}
      >
        {frame < 300 ? <PlanetScene frame={frame} /> : <Cave frame={frame} />}
        {astronautVisibility.caveApproach ? (
          <group position={[-1.4 + cave * 1.6, 0.08, -0.4]} rotation={[0, 0.3, 0]}>
            <Astronaut frame={frame} scale={0.7} />
          </group>
        ) : null}
        {astronautVisibility.crystalAwakening ? (
          <group position={[1.45 - reveal * 1.0, 0.08, 0.55]} rotation={[0, -0.3, 0]}>
            <Astronaut frame={frame} scale={0.72 + awaken * 0.02} />
          </group>
        ) : null}
      </ThreeCanvas>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 51% 49%, rgba(6,10,24,0) 34%, rgba(6,8,18,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
