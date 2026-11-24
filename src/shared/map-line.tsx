import type {FC} from "react";
import {evolvePath} from "@remotion/paths";

type AnimatedMapLineProps = {
  path: string;
  progress: number;
  zoom: number;
  color: string;
  ghostColor: string;
};

// Draw a route progressively while keeping stroke widths stable as the map zooms.
export const AnimatedMapLine: FC<AnimatedMapLineProps> = ({
  path,
  progress,
  zoom,
  color,
  ghostColor,
}) => {
  const evolved = evolvePath(progress, path);
  return (
    <>
      <path
        d={path}
        fill="none"
        stroke={ghostColor}
        strokeWidth={2 / zoom}
        strokeDasharray={`${8 / zoom} ${12 / zoom}`}
        opacity={0.55}
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={14 / zoom}
        strokeLinecap="round"
        opacity={0.22}
        {...evolved}
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={4 / zoom}
        strokeLinecap="round"
        {...evolved}
      />
    </>
  );
};
