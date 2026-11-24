import React from "react";
import {AbsoluteFill,Audio,staticFile,interpolate,useCurrentFrame} from "remotion";
import {TransitionSeries} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {linearTiming} from "@remotion/transitions";
import {ValleyLiftOff,SideDrift,CloudRise} from "./Scenes";

const Fade=()=> <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:18})}/>;
const AmbientAudio:React.FC=()=>{
 const frame=useCurrentFrame();
 const volume=interpolate(frame,[0,30,540,600],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <Audio src={staticFile("audio/ambient.wav")} volume={volume}/>;
};
export const DawnBalloon:React.FC=()=> <AbsoluteFill style={{background:"#8296ac"}}>
 <TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={210}><ValleyLiftOff/></TransitionSeries.Sequence>
  <Fade/>
  <TransitionSeries.Sequence durationInFrames={210}><SideDrift/></TransitionSeries.Sequence>
  <Fade/>
  <TransitionSeries.Sequence durationInFrames={216}><CloudRise/></TransitionSeries.Sequence>
 </TransitionSeries>
 <AmbientAudio/>
 </AbsoluteFill>;
