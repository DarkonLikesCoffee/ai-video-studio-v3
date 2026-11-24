import type {FC} from "react";

// Draw frame-deterministic rain streaks as a lightweight atmospheric particle layer.
export const StormRain: FC<{frame: number; density?: number}> = ({frame, density = 105}) => (
  <svg
    viewBox="0 0 1920 1080"
    style={{position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none"}}
  >
    {Array.from({length: density}, (_, index) => {
      const x = (index * 173 + frame * 10) % 2000;
      const y = (index * 97 + frame * 24) % 1120;
      return (
        <path
          key={index}
          d={`M${x} ${y} l-24 47`}
          stroke="#c2dce4"
          strokeWidth={index % 3 + 2}
          opacity={0.18}
        />
      );
    })}
  </svg>
);
