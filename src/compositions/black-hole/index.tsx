import React from "react";
import {AbsoluteFill} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {DeepField, EdgeOnHero, ObliqueSweep} from "./scenes/BlackHoleScenes";
const crossfade=()=> <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:24})}/>;
export const BlackHole:React.FC=()=> <AbsoluteFill style={{background:"#020307"}}>
 <TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={180}><DeepField/></TransitionSeries.Sequence>
  {crossfade()}
  <TransitionSeries.Sequence durationInFrames={240}><EdgeOnHero/></TransitionSeries.Sequence>
  {crossfade()}
  <TransitionSeries.Sequence durationInFrames={240}><ObliqueSweep/></TransitionSeries.Sequence>
 </TransitionSeries>
</AbsoluteFill>;
