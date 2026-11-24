import React from "react";
import {AbsoluteFill,interpolate,useCurrentFrame} from "remotion";
import {BalloonWorld} from "./BalloonWorld";

const TitleCard:React.FC=()=>{
  const frame=useCurrentFrame();
  const opacity=interpolate(frame,[0,8,43,52],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{justifyContent:"center",alignItems:"center",opacity,pointerEvents:"none"}}>
    <div style={{color:"#fff1dc",font:"500 42px Georgia,serif",letterSpacing:2,textShadow:"0 3px 20px rgba(21,34,52,.55)"}}>Above the quiet valley</div>
  </AbsoluteFill>;
};

const ShotOverlay:React.FC<{index:string;caption:string}> = ({index,caption})=>{
  const frame=useCurrentFrame();
  const opacity=interpolate(frame,[12,26,170,198],[0,.6,.6,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{pointerEvents:"none",opacity}}>
    <div style={{position:"absolute",left:76,top:66,color:"#fff0dd",font:"600 13px Arial",letterSpacing:4,textShadow:"0 2px 12px #33445b"}}>{index}</div>
    <div style={{position:"absolute",left:76,top:91,color:"#fff5e7",font:"500 21px Georgia,serif",textShadow:"0 2px 12px #33445b"}}>{caption}</div>
  </AbsoluteFill>;
};

export const ValleyLiftOff:React.FC=()=> <AbsoluteFill>
  <BalloonWorld shot="valley" globalStart={0}/>
  <TitleCard/>
  <ShotOverlay index="01 / THE FIRST LIGHT" caption="A quiet beginning"/>
</AbsoluteFill>;
export const SideDrift:React.FC=()=> <AbsoluteFill>
  <BalloonWorld shot="tracking" globalStart={210}/>
  <ShotOverlay index="02 / ABOVE THE RIDGE" caption="Carried by the morning air"/>
</AbsoluteFill>;
export const CloudRise:React.FC=()=> <AbsoluteFill>
  <BalloonWorld shot="crane" globalStart={420}/>
  <ShotOverlay index="03 / INTO THE SUNRISE" caption="A wider world unfolds"/>
</AbsoluteFill>;
