import React from "react";
import {AbsoluteFill} from "remotion";
import {TransitionSeries,linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {Opening} from "./scenes/opening";
import {Pass} from "./scenes/pass";
import {Close} from "./scenes/close";
const fadeTransition=()=> <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:18})}/>;
export const NightTrainSnowyPass = () => (
 <AbsoluteFill style={{background:"#07111d",fontFamily:"Arial, sans-serif"}}>
  <TransitionSeries>
   <TransitionSeries.Sequence durationInFrames={210}><Opening/></TransitionSeries.Sequence>
   {fadeTransition()}
   <TransitionSeries.Sequence durationInFrames={210}><Pass/></TransitionSeries.Sequence>
   {fadeTransition()}
   <TransitionSeries.Sequence durationInFrames={198}><Close/></TransitionSeries.Sequence>
  </TransitionSeries>
 </AbsoluteFill>
);
