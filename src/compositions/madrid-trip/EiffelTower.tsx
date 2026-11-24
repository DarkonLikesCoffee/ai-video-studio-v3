import React, { useMemo } from "react";
import * as THREE from "three";
import { random } from "remotion";

// Tower proportions, in scene units (1 unit ~ 33 m).
const H = 8.4;
const W0 = 2.0;
const W1 = 0.13;
const CURVE = 2.7;
const LEVELS = 22;

export const TOWER_TOP = H + 1.8;

const halfWidth = (y: number) =>
  W1 + (W0 - W1) * Math.pow(1 - Math.min(y / H, 1), CURVE);

type BeamData = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  length: number;
  radius: number;
};

const UP = new THREE.Vector3(0, 1, 0);

const beam = (a: THREE.Vector3, b: THREE.Vector3, radius: number): BeamData => {
  const dir = new THREE.Vector3().subVectors(b, a);
  const length = dir.length();
  return {
    position: new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5),
    quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()),
    length,
    radius,
  };
};

const CORNERS: [number, number][] = [
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
];

const buildLattice = (): BeamData[] => {
  // Denser rings near the wide base, sparser toward the tip.
  const ys = Array.from(
    { length: LEVELS + 1 },
    (_, i) => H * Math.pow(i / LEVELS, 1.35),
  );
  const corner = (k: number, y: number) => {
    const w = halfWidth(y);
    const signs = CORNERS[k]!;
    return new THREE.Vector3(signs[0] * w, y, signs[1] * w);
  };

  const beams: BeamData[] = [];
  for (let i = 0; i < LEVELS; i++) {
    const y0 = ys[i]!;
    const y1 = ys[i + 1]!;
    const legRadius = 0.035 + 0.075 * (halfWidth(y0) / W0);

    for (let k = 0; k < 4; k++) {
      const next = (k + 1) % 4;
      // Curved legs, horizontal rings and crossed structural braces.
      beams.push(beam(corner(k, y0), corner(k, y1), legRadius));
      beams.push(beam(corner(k, y0), corner(next, y0), 0.02));
      beams.push(beam(corner(k, y0), corner(next, y1), 0.014));
      beams.push(beam(corner(next, y0), corner(k, y1), 0.014));
    }
  }
  return beams;
};

const PLATFORMS = [
  { y: 1.73, pad: 0.55, h: 0.14 },
  { y: 3.5, pad: 0.4, h: 0.12 },
  { y: 7.7, pad: 0.3, h: 0.1 },
];

type Props = {
  /** 0 -> 1: how much of the tower has been built, bottom to top. */
  build: number;
  rotationY: number;
  frame: number;
};

export const EiffelTower: React.FC<Props> = ({ build, rotationY, frame }) => {
  const beams = useMemo(buildLattice, []);

  // One shared clipping plane reveals the tower from the ground up.
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    [],
  );
  const revealY = interpolate01(build, -0.1, TOWER_TOP + 0.2);
  plane.constant = revealY;

  const iron = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9a7650",
        metalness: 0.55,
        roughness: 0.45,
        emissive: "#4a2a08",
        emissiveIntensity: 0.7,
        clippingPlanes: [plane],
      }),
    [plane],
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => {
        const y = random(`sy-${i}`) * (H - 0.3) + 0.2;
        const w = halfWidth(y) + 0.12;
        return {
          y,
          x: (random(`sx-${i}`) * 2 - 1) * w,
          z: (random(`sz-${i}`) * 2 - 1) * w,
          phase: random(`sp-${i}`) * 36,
        };
      }),
    [],
  );

  const building = build > 0 && build < 1;
  const ringRadius = halfWidth(Math.min(Math.max(revealY, 0), H)) * 1.35 + 0.15;
  const sparkleOn = build >= 1;

  return (
    <group rotation-y={rotationY}>
      {beams.map((b, i) => (
        <mesh
          key={i}
          position={b.position}
          quaternion={b.quaternion}
          material={iron}
        >
          <cylinderGeometry args={[b.radius, b.radius, b.length, 6]} />
        </mesh>
      ))}

      {PLATFORMS.map((p) => {
        const size = halfWidth(p.y) * 2 + p.pad;
        return (
          <mesh key={p.y} position={[0, p.y, 0]} material={iron}>
            <boxGeometry args={[size, p.h, size]} />
          </mesh>
        );
      })}

      {/* base arches */}
      {[0, 1, 2, 3].map((k) => (
        <group key={k} rotation-y={(k * Math.PI) / 2}>
          <mesh position={[0, 0, W0]} material={iron}>
            <torusGeometry args={[1.55, 0.06, 8, 48, Math.PI]} />
          </mesh>
        </group>
      ))}

      {/* spire */}
      <mesh position={[0, H + 0.6, 0]} material={iron}>
        <cylinderGeometry args={[0.02, 0.1, 1.2, 8]} />
      </mesh>
      <mesh position={[0, H + 1.5, 0]} material={iron}>
        <cylinderGeometry args={[0.008, 0.02, 0.6, 6]} />
      </mesh>

      {/* glowing build line */}
      {building ? (
        <mesh position={[0, revealY, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[ringRadius, 0.03, 8, 64]} />
          <meshBasicMaterial color="#ffd27a" toneMapped={false} />
        </mesh>
      ) : null}

      {/* evening sparkle once the tower is complete */}
      {sparkleOn
        ? sparkles.map((s, i) => {
            const t = ((frame + s.phase) % 36) / 36;
            const flash = Math.pow(Math.max(0, Math.sin(t * Math.PI)), 12);
            if (flash < 0.02) return null;
            return (
              <mesh key={i} position={[s.x, s.y, s.z]} scale={flash}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshBasicMaterial color="#fff1c2" toneMapped={false} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};

const interpolate01 = (t: number, from: number, to: number) =>
  from + (to - from) * t;
