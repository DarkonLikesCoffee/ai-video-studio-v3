import React from "react";
import {AbsoluteFill, Audio, staticFile, interpolate, useCurrentFrame} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {ValleyLiftOff, SideDrift, CloudRise} from "./Scenes";

const ShotFade:React.FC=()=>(
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({durationInFrames:18})}
  />
);

export const DawnBalloon:React.FC=()=>{
  const frame=useCurrentFrame();
  const audioVolume=interpolate(
    frame,
    [0,30,540,600],
    [0,1,1,0],
    {extrapolateLeft:"clamp",extrapolateRight:"clamp"}
  );
  return <AbsoluteFill style={{background:"#8296ac"}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={210}>
        <ValleyLiftOff/>
      </TransitionSeries.Sequence>
      <ShotFade/>
      <TransitionSeries.Sequence durationInFrames={210}>
        <SideDrift/>
      </TransitionSeries.Sequence>
      <ShotFade/>
      <TransitionSeries.Sequence durationInFrames={216}>
        <CloudRise/>
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Audio src={staticFile("audio/ambient.wav")} volume={audioVolume}/>
  </AbsoluteFill>;
};
