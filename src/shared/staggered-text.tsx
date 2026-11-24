import type {CSSProperties, FC} from "react";
import {spring, useCurrentFrame, useVideoConfig} from "remotion";

type StaggeredTextProps = {
  text: string;
  startFrame?: number;
  staggerFrames?: number;
  style?: CSSProperties;
};

// Reveal each word on its own spring to create a readable, paced title.
export const StaggeredText: FC<StaggeredTextProps> = ({
  text,
  startFrame = 0,
  staggerFrames = 5,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span style={{display: "inline-flex", flexWrap: "wrap", columnGap: "0.22em", ...style}}>
      {words.map((word, index) => {
        const progress = spring({
          frame: Math.max(0, frame - startFrame - index * staggerFrames),
          fps,
          config: {damping: 18, stiffness: 110},
        });
        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              opacity: progress,
              transform: `translateY(${(1 - progress) * 22}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};
