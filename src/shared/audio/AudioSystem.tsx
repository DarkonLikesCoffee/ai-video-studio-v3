import React from "react";
import {Audio, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

export type AudioInterval = {
  startSeconds: number;
  endSeconds: number;
};

export type AudioTrack = {
  src: string;
  volume?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
};

export type AudioSystemProps = {
  narration?: AudioTrack;
  music?: AudioTrack;
  speechIntervals?: readonly AudioInterval[];
  musicDucking?: {
    enabled?: boolean;
    targetVolume?: number;
    fadeFrames?: number;
  };
};

const clampVolume = (value: number) => Math.max(0, Math.min(1, value));

const trackFade = (frame: number, durationInFrames: number, fadeInFrames: number, fadeOutFrames: number) => {
  const fadeIn = fadeInFrames > 0
    ? interpolate(frame, [0, fadeInFrames], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})
    : 1;
  const fadeOut = fadeOutFrames > 0
    ? interpolate(frame, [Math.max(0, durationInFrames - fadeOutFrames), durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  return Math.min(fadeIn, fadeOut);
};

const duckingEnvelope = (frame: number, fps: number, intervals: readonly AudioInterval[], targetVolume: number, fadeFrames: number) => {
  let envelope = 1;
  for (const interval of intervals) {
    const start = Math.max(0, interval.startSeconds * fps);
    const end = Math.max(start, interval.endSeconds * fps);
    const fadeStart = Math.max(0, start - fadeFrames);
    const fadeEnd = end + fadeFrames;
    let candidate = 1;

    if (frame >= fadeStart && frame < start && fadeFrames > 0) {
      candidate = interpolate(frame, [fadeStart, start], [1, targetVolume], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (frame >= start && frame <= end) {
      candidate = targetVolume;
    } else if (frame > end && frame <= fadeEnd && fadeFrames > 0) {
      candidate = interpolate(frame, [end, fadeEnd], [targetVolume, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    envelope = Math.min(envelope, candidate);
  }
  return envelope;
};

/** A small shared mixer for one narration track and one music track. */
export const AudioSystem: React.FC<AudioSystemProps> = ({narration, music, speechIntervals = [], musicDucking}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();

  const narrationVolume = narration
    ? clampVolume(narration.volume ?? 1) * trackFade(frame, durationInFrames, narration.fadeInFrames ?? 0, narration.fadeOutFrames ?? 0)
    : 0;

  const musicBaseVolume = music
    ? clampVolume(music.volume ?? 0.25) * trackFade(frame, durationInFrames, music.fadeInFrames ?? 0, music.fadeOutFrames ?? 0)
    : 0;

  const duckingEnabled = musicDucking?.enabled === true && speechIntervals.length > 0;
  const ducking = duckingEnabled
    ? duckingEnvelope(frame, fps, speechIntervals, clampVolume(musicDucking?.targetVolume ?? 0.3), Math.max(0, musicDucking?.fadeFrames ?? 9))
    : 1;

  return (
    <>
      {narration ? <Audio src={narration.src} volume={narrationVolume} /> : null}
      {music ? <Audio src={music.src} volume={musicBaseVolume * ducking} /> : null}
    </>
  );
};
