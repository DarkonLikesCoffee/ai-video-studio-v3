import React from "react";
import {AbsoluteFill} from "remotion";
import {TransitionSeries,linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {SideTracking,LowTrack,HighPullback} from "./Scenes";
const transition=()=> <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:18})}/>;
export const NightTrainThree:React.FC=()=> <AbsoluteFill style={{background:"#081522"}}>
 <TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={210}><SideTracking/></TransitionSeries.Sequence>
  {transition()}
  <TransitionSeries.Sequence durationInFrames={210}><LowTrack/></TransitionSeries.Sequence>
  {transition()}
  <TransitionSeries.Sequence durationInFrames={216}><HighPullback/></TransitionSeries.Sequence>
 </TransitionSeries>
</AbsoluteFill>;
