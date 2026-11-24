import React from "react";
import {AbsoluteFill,useCurrentFrame,interpolate} from "remotion";
import {TrainWorld} from "./TrainWorld";
const Overlay:React.FC<{label:string;detail:string;fadeIn:number;fadeOut:number}> = ({label,detail,fadeIn,fadeOut})=>{
 const f=useCurrentFrame(),opacity=interpolate(f,[fadeIn,fadeIn+12,fadeOut-12,fadeOut],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <AbsoluteFill style={{pointerEvents:"none",opacity}}>
  <div style={{position:"absolute",left:86,top:72,color:"#e5eef4",font:"600 17px Arial",letterSpacing:5,textShadow:"0 2px 12px #05101b"}}>{detail}</div>
  <div style={{position:"absolute",left:86,top:105,color:"#f5f7f8",font:"700 34px Arial",letterSpacing:1,textShadow:"0 3px 20px #07111c"}}>{label}</div>
  <div style={{position:"absolute",left:86,bottom:70,width:240,height:3,background:"#d5b780",transformOrigin:"left",transform:`scaleX(${interpolate(f,[fadeIn,fadeOut],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})})`}}/>
 </AbsoluteFill>;
};
export const SideTracking:React.FC=()=> <AbsoluteFill>
 <TrainWorld shot="side"/>
 <Overlay detail="01 / NORTHBOUND • 02:17" label="A train enters the frozen pass" fadeIn={0} fadeOut={52}/>
</AbsoluteFill>;
export const LowTrack:React.FC=()=> <AbsoluteFill>
 <TrainWorld shot="low"/>
 <Overlay detail="02 / TRACK LEVEL • 2,418 M" label="Steel, snow and warm light" fadeIn={0} fadeOut={48}/>
</AbsoluteFill>;
export const HighPullback:React.FC=()=> <AbsoluteFill>
 <TrainWorld shot="high"/>
 <Overlay detail="03 / ABOVE THE RIDGELINE" label="The journey disappears into winter" fadeIn={0} fadeOut={48}/>
</AbsoluteFill>;
