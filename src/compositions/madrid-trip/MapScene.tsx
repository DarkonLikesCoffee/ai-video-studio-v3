import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {getPointAtLength, getTangentAtLength} from "@remotion/paths";
import {
  BASE_ZOOM,
  CITIES,
  COLORS,
  FONT,
  HEIGHT,
  T,
  WIDTH,
} from "./constants";
import {
  MADRID_XY,
  NEW_YORK_XY,
  PARIS_XY,
  ROUTE_1,
  ROUTE_1_LENGTH,
  ROUTE_2,
  ROUTE_2_LENGTH,
  bordersPath,
  graticulePath,
  landPath,
} from "./geo";
import {AnimatedMapLine} from "../../shared/map-line";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const travelEase = Easing.bezier(0.45, 0, 0.3, 1);

const legProgress = (frame: number, [start, end]: readonly [number, number]) =>
  interpolate(frame, [start, end], [0, 1], { ...clamp, easing: travelEase });

/**
 * One pure function of the frame drives the whole camera, so every
 * phase hands off to the next without a jump.
 */
const getCamera = (frame: number) => {
  const p1 = legProgress(frame, T.leg1);
  const p2 = legProgress(frame, T.leg2);
  const tip1 = getPointAtLength(ROUTE_1, p1 * ROUTE_1_LENGTH) ?? {
    x: MADRID_XY[0],
    y: MADRID_XY[1],
  };
  const tip2 = getPointAtLength(ROUTE_2, p2 * ROUTE_2_LENGTH) ?? {
    x: NEW_YORK_XY[0],
    y: NEW_YORK_XY[1],
  };

  // Center follows the tip of whichever line is drawing.
  const center = frame < T.leg2[0] ? tip1 : tip2;

  let scale: number;
  if (frame < T.zoomEnd) {
    // Zoom in log-space so the zoom-out feels constant-speed.
    const logScale = interpolate(
      frame,
      [0, T.zoomEnd],
      [Math.log(18), Math.log(BASE_ZOOM)],
      { ...clamp, easing: Easing.bezier(0.2, 0.6, 0.3, 1) },
    );
    scale = Math.exp(logScale);
  } else if (frame < T.pause[1]) {
    scale = BASE_ZOOM * interpolate(p1, [0, 0.5, 1], [1, 0.72, 1]);
  } else if (frame < T.leg2[1]) {
    scale = BASE_ZOOM * interpolate(p2, [0, 0.5, 1], [1, 0.72, 1]);
  } else {
    scale = interpolate(frame, [T.leg2[1], T.end], [BASE_ZOOM, 4.5], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });
  }

  return { x: center.x, y: center.y, scale, p1, p2, tip1, tip2 };
};

const Pin: React.FC<{
  xy: readonly [number, number];
  name: string;
  appearAt: number;
  zoom: number;
}> = ({ xy, name, appearAt, zoom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < appearAt) return null;

  const pop = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const pulse = ((frame - appearAt) % 45) / 45;

  // Counter-scale so pins and labels keep a constant on-screen size.
  return (
    <g transform={`translate(${xy[0]} ${xy[1]}) scale(${1 / zoom})`}>
      <circle
        r={10 + pulse * 36}
        fill="none"
        stroke={COLORS.route}
        strokeWidth={2}
        opacity={(1 - pulse) * 0.7 * pop}
      />
      <circle
        r={10 * pop}
        fill={COLORS.route}
        stroke={COLORS.ocean}
        strokeWidth={3}
      />
      <text
        x={20}
        y={-18}
        fill={COLORS.text}
        stroke={COLORS.ocean}
        strokeWidth={6}
        paintOrder="stroke"
        fontFamily={FONT}
        fontSize={34}
        fontWeight={700}
        opacity={pop}
      >
        {name}
      </text>
    </g>
  );
};

const Plane: React.FC<{
  path: string;
  length: number;
  progress: number;
  zoom: number;
}> = ({ path, length, progress, zoom }) => {
  if (progress <= 0 || progress >= 1) return null;
  const at = progress * length;
  const point = getPointAtLength(path, at) ?? { x: 0, y: 0 };
  const tangent = getTangentAtLength(path, at) ?? { x: 1, y: 0 };
  const heading = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI + 90;

  return (
    <g
      transform={`translate(${point.x} ${point.y}) rotate(${heading}) scale(${1.9 / zoom})`}
    >
      <path
        d="M0,-12 L3,-3 L13,3 L13,5.5 L3,3.5 L2,9.5 L5.5,12 L5.5,13.5 L0,12 L-5.5,13.5 L-5.5,12 L-2,9.5 L-3,3.5 L-13,5.5 L-13,3 L-3,-3 Z"
        fill={COLORS.text}
        stroke={COLORS.ocean}
        strokeWidth={1.5}
      />
    </g>
  );
};

export const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = getCamera(frame);

  const transform = `translate(${WIDTH / 2 - cam.x * cam.scale} ${
    HEIGHT / 2 - cam.y * cam.scale
  }) scale(${cam.scale})`;

  const stopLabel = frame < T.leg1[0]
    ? CITIES.madrid.name
    : frame < T.leg2[0]
      ? `${CITIES.madrid.name}  to  ${CITIES.newYork.name}`
      : `${CITIES.newYork.name}  to  ${CITIES.paris.name}`;
  const hudOpacity = interpolate(frame, [0, 20], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, ${COLORS.oceanGlow} 0%, ${COLORS.ocean} 75%)`,
      }}
    >
      <svg width={WIDTH} height={HEIGHT} style={{ display: "block" }}>
        <g transform={transform}>
          <path
            d={graticulePath}
            fill="none"
            stroke={COLORS.grid}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <path d={landPath} fill={COLORS.land} />
          <path
            d={bordersPath}
            fill="none"
            stroke={COLORS.border}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={landPath}
            fill="none"
            stroke={COLORS.coast}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />

          <AnimatedMapLine path={ROUTE_1} progress={cam.p1} zoom={cam.scale} color={COLORS.route} ghostColor={COLORS.routeGhost} />
          <AnimatedMapLine path={ROUTE_2} progress={cam.p2} zoom={cam.scale} color={COLORS.route} ghostColor={COLORS.routeGhost} />

          <Pin xy={MADRID_XY} name={CITIES.madrid.name} appearAt={0} zoom={cam.scale} />
          <Pin
            xy={NEW_YORK_XY}
            name={CITIES.newYork.name}
            appearAt={T.leg1[1] - 8}
            zoom={cam.scale}
          />
          <Pin
            xy={PARIS_XY}
            name={CITIES.paris.name}
            appearAt={T.leg2[1] - 8}
            zoom={cam.scale}
          />

          <Plane path={ROUTE_1} length={ROUTE_1_LENGTH} progress={cam.p1} zoom={cam.scale} />
          <Plane path={ROUTE_2} length={ROUTE_2_LENGTH} progress={cam.p2} zoom={cam.scale} />
        </g>
      </svg>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 55%, rgba(4,8,18,0.75) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 72,
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 700,
          color: COLORS.text,
          opacity: hudOpacity,
          whiteSpace: "pre",
        }}
      >
        {stopLabel}
      </div>
    </AbsoluteFill>
  );
};
