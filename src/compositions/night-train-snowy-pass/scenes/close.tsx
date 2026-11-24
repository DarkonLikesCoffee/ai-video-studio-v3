import React from "react";
import {AbsoluteFill,useCurrentFrame,interpolate,Easing} from "remotion";
import {AtmosphereParticles,Fog,Vignette} from "../../../shared/overlays";
export const Close:React.FC=()=>{
 const f=useCurrentFrame(),p=interpolate(f,[0,198],[0,1],{easing:Easing.inOut(Easing.cubic)});
 return <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(180deg,#07111d,#1b3344 55%,#081522)"}}>
  <svg viewBox="0 0 1920 1080" style={{position:"absolute",width:"100%",height:"100%"}}>
   <circle cx="1350" cy="215" r="67" fill="#e6edf0" opacity=".6"/>
   <path d="M0 590 210 310 400 490 610 220 820 460 1070 285 1320 520 1540 260 1770 490 1920 350V1080H0Z" fill="#223c4d"/>
   <path d="M0 590 210 310 400 490 610 220 820 460 1070 285 1320 520 1540 260 1770 490 1920 350" fill="none" stroke="#ebf2f5" strokeWidth="20" opacity=".65"/>
   <path d="M0 770Q450 650 910 765T1920 710V1080H0Z" fill="#a8bac6"/>
   <path d="M0 910Q500 820 980 900T1920 850V1080H0Z" fill="#152a39"/>
   <g transform={`translate(${interpolate(f,[0,198],[1500,1150])} ${interpolate(f,[0,198],[0,-35])}) scale(.55)`}>
    <path d="M0 740Q0 655 90 655H1200Q1330 655 1410 750L1460 850H0Z" fill="#344f60" stroke="#c4d1d8" strokeWidth="8"/>
    <path d="M0 740H1415" stroke="#c5a06a" strokeWidth="16"/>
    {Array.from({length:7},(_,i)=><rect key={i} x={150+i*165} y="690" width="115" height="100" rx="6" fill="#e5c88b" opacity={.5+(i%3)*.1}/>)}
    <circle cx="1450" cy="810" r="100" fill="#f5d99b" opacity=".9"/>
    {Array.from({length:7},(_,i)=><circle key={i} cx={120+i*165} cy="850" r="32" fill="#07111b" stroke="#8e9fa9" strokeWidth="8"/>)}
   </g>
   <path d="M0 0H1920V1080H0Z" fill="#08121d" opacity={p*.34}/>
  </svg>
  <div style={{position:"absolute",left:145,top:160,color:"#f3f7fa",fontSize:18,letterSpacing:8}}>NORTHBOUND / WINTER SERVICE</div>
  <div style={{position:"absolute",left:140,top:230,color:"#fff",fontSize:76,fontWeight:700,letterSpacing:2,textShadow:"0 5px 32px #020a12",opacity:interpolate(f,[40,85,198],[0,1,1])}}>BEYOND THE<br/>LAST SUMMIT</div>
  <div style={{position:"absolute",left:145,top:430,color:"#cbd9e0",fontSize:22,letterSpacing:5,opacity:interpolate(f,[65,110],[0,1])}}>THE MOUNTAINS KEEP THE SILENCE</div>
  <div style={{position:"absolute",left:145,bottom:112,width:390,height:2,background:"#d0b17b",transformOrigin:"left",transform:`scaleX(${p})`}}/>
  <Fog opacity={.13}/><AtmosphereParticles kind="snow" count={140}/><Vignette strength={.6}/>
 </AbsoluteFill>;
};
