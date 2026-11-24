import React from "react";
import {useCurrentFrame} from "remotion";
import {AbsoluteFill} from "remotion";
import {ValleyLiftOff,SideDrift,CloudRise} from "./Scenes";

export const DawnBalloon:React.FC=()=>{
 const frame=useCurrentFrame();
 return <AbsoluteFill style={{background:"#8296ac"}}>
  {frame < 210 ? <ValleyLiftOff/> : frame < 420 ? <SideDrift/> : <CloudRise/>}
 </AbsoluteFill>;
};
