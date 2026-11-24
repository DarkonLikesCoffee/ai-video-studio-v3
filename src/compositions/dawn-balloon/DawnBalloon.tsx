import React from "react";
import {useCurrentFrame, Audio, staticFile, interpolate, AbsoluteFill} from "remotion";
import {ValleyLiftOff,SideDrift,CloudRise} from "./Scenes";

export const DawnBalloon:React.FC=()=>{
 const frame=useCurrentFrame();
 const audioVolume=interpolate(frame,[0,30,540,600],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <AbsoluteFill style={{background:"#8296ac"}}>
  {frame < 210 ? <ValleyLiftOff/> : frame < 420 ? <SideDrift/> : <CloudRise/>}
  <Audio src={staticFile("audio/ambient.wav")} volume={audioVolume}/>
 </AbsoluteFill>;
};
