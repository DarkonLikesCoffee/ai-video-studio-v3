import React from "react";
import {AbsoluteFill,useCurrentFrame,interpolate,Easing} from "remotion";
import {AtmosphereParticles,Fog,Vignette,LightSweep} from "../../../shared/overlays";
export const Pass:React.FC=()=>{
 const f=useCurrentFrame(),move=interpolate(f,[0,210],[0,1],{easing:Easing.inOut(Easing.cubic)});
 const trainX=interpolate(f,[0,210],[2400,-2100],{easing:Easing.inOut(Easing.cubic)});
 const ridgeFar="M0 565 Q55 485 120 400 Q175 370 245 435 Q310 335 385 225 Q445 245 500 390 Q585 295 670 165 Q740 260 800 420 Q885 335 950 275 Q1025 315 1090 445 Q1175 305 1260 195 Q1335 300 1410 425 Q1495 345 1560 255 Q1650 345 1740 455 Q1830 365 1920 310V1080H0Z";
 const ridgeNear="M0 720 Q75 640 145 590 Q210 560 260 645 Q350 525 450 465 Q520 555 600 695 Q695 550 785 480 Q875 570 950 705 Q1050 570 1140 465 Q1215 565 1300 695 Q1400 575 1495 485 Q1570 580 1660 675 Q1735 600 1815 530 Q1870 550 1920 605V1080H0Z";
 return <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(180deg,#071522,#294052 62%,#091825)"}}>
  <svg viewBox="0 0 1920 1080" style={{position:"absolute",width:"100%",height:"100%"}}>
   <defs>
    <linearGradient id="farSnow" x2="0" y2="1"><stop stopColor="#829aaa"/><stop offset=".55" stopColor="#526d80"/><stop offset="1" stopColor="#263f52"/></linearGradient>
    <linearGradient id="nearSnow" x2="0" y2="1"><stop stopColor="#d5e0e5"/><stop offset=".4" stopColor="#657f90"/><stop offset="1" stopColor="#1b3344"/></linearGradient>
    <linearGradient id="locomotive" x2="0" y2="1"><stop stopColor="#d7e0df"/><stop offset=".2" stopColor="#426274"/><stop offset=".85" stopColor="#142b3a"/><stop offset="1" stopColor="#091723"/></linearGradient>
    <linearGradient id="coach" x2="0" y2="1"><stop stopColor="#d9d9cd"/><stop offset=".18" stopColor="#4c6c7c"/><stop offset=".9" stopColor="#1a3546"/></linearGradient>
    <radialGradient id="lamp"><stop stopColor="#fff8d7" stopOpacity="1"/><stop offset=".2" stopColor="#ffe9af" stopOpacity=".65"/><stop offset="1" stopColor="#f7c76d" stopOpacity="0"/></radialGradient>
   </defs>
   <circle cx="1470" cy="170" r="60" fill="#dbe8ed" opacity=".52"/>
   <circle cx="1470" cy="170" r="120" fill="#dbe8ed" opacity=".045"/>
   <path d={ridgeFar} fill="url(#farSnow)" opacity=".84"/>
   <path d="M0 520 130 330 245 410 390 170 520 370 675 115 810 380 960 220 1090 415 1260 150 1410 395 1570 205 1740 435 1920 260" stroke="#dce8ee" strokeWidth="11" opacity=".45" fill="none"/>
   <path d="M0 635 Q300 560 560 620T1080 615T1600 590T1920 620" stroke="#c9d7df" strokeWidth="70" opacity=".06" fill="none"/>
   <path d={ridgeNear} fill="#284353"/>
   <path d="M0 700 160 540 280 600 470 390 610 630 800 420 950 655 1150 390 1310 650 1500 430 1660 625 1810 470 1920 560" fill="none" stroke="#e6eef1" strokeWidth="14" opacity=".48"/>
   <path d="M0 850 Q400 740 760 840T1480 790T1920 815V1080H0Z" fill="#0c1d2a"/>
   <path d="M0 915 Q520 815 960 900T1920 865" fill="none" stroke="#bbcbd4" strokeWidth="11" opacity=".45"/>
   <path d="M0 974 Q560 875 1020 962T1920 930" fill="none" stroke="#536f80" strokeWidth="6" opacity=".8"/>
  </svg>
  <svg viewBox="0 0 1920 1080" style={{position:"absolute",width:"100%",height:"100%",transform:`translateX(${-move*72}px)`}}>
   <path d="M0 988 Q480 865 980 945T1920 900" stroke="#9eb3bf" strokeWidth="8" fill="none" opacity=".86"/>
   <path d="M0 1016 Q480 893 980 973T1920 928" stroke="#dce7eb" strokeWidth="4" fill="none" opacity=".72"/>
   <g transform={`translate(${trainX} 0)`}>
    {Array.from({length:5},(_,i)=><g key={i} transform={`translate(${-i*300} 0)`}>
     <path d="M40 715 Q40 660 102 660 H330 Q390 660 408 713 L408 846 H40Z" fill="url(#coach)" stroke="#a9c0cb" strokeWidth="6"/>
     <path d="M45 720H405" stroke="#b89a69" strokeWidth="12"/>
     {Array.from({length:2},(_,j)=><g key={j}><rect x={95+j*145} y="690" width="100" height="83" rx="7" fill="#0e2634" stroke="#9eb4bf" strokeWidth="7"/><rect x={102+j*145} y="697" width="86" height="69" fill="#e9c98a" opacity={.42+.1*Math.sin(f*.06+i+j)}/></g>)}
     <path d="M78 840H370" stroke="#111c25" strokeWidth="18"/><path d="M55 872H392" stroke="#596c78" strokeWidth="8"/>
     {[105,345].map((x,k)=><g key={k}><circle cx={x} cy="850" r="32" fill="#070e15" stroke="#697d89" strokeWidth="8"/><circle cx={x} cy="850" r="9" fill="#c2ccd1"/></g>)}
     <path d="M408 695v135" stroke="#d4e0e4" strokeWidth="7"/>
    </g>)}
    <g>
     <path d="M0 690 Q0 625 80 615 H300 Q385 615 430 674 L510 790 Q530 820 490 840 H0Z" fill="url(#locomotive)" stroke="#d0dce0" strokeWidth="8"/>
     <path d="M45 640 H270 Q335 640 380 690 L420 750 H45Z" fill="#152f3f" stroke="#99b0bd" strokeWidth="7"/>
     <path d="M74 652 H205 L205 725 H65Z" fill="#e7c88c" opacity=".58"/>
     <path d="M218 650 H276 Q329 650 360 700 L386 737 H218Z" fill="#e5c88a" opacity=".35"/>
     <path d="M0 770 H480" stroke="#c9a46d" strokeWidth="19"/>
     <path d="M0 805 H478" stroke="#0b1b27" strokeWidth="15"/>
     <path d="M0 832 H470" stroke="#b9c8cf" strokeWidth="5"/>
     <path d="M0 710 Q-35 765 0 820" stroke="#f0e0bd" strokeWidth="11" fill="none"/>
     <path d="M455 770 L570 809 L510 837 H432Z" fill="#f5dca0"/>
     <circle cx="495" cy="797" r="180" fill="url(#lamp)" opacity=".72"/>
     <path d="M30 835 H455" stroke="#111c25" strokeWidth="24"/>
     {[65,350].map((x,i)=><g key={i}><circle cx={x} cy="858" r="40" fill="#070d14" stroke="#6e8290" strokeWidth="10"/><circle cx={x} cy="858" r="13" fill="#c3cdd2"/></g>)}
     <path d="M105 600 V567 H168 V613 M290 606 V570 H340 V650" stroke="#c7d4d9" strokeWidth="7" fill="none"/>
    </g>
   </g>
  </svg>
  <div style={{position:"absolute",left:130,top:92,color:"#f1f6f8",fontSize:20,letterSpacing:5,textShadow:"0 2px 14px #071522"}}>02:19 / CROSSING THE RIDGELINE</div>
  <div style={{position:"absolute",right:125,bottom:92,color:"#d7e3e9",fontSize:17,letterSpacing:4,textShadow:"0 2px 14px #071522"}}>ALTITUDE 2,418 M</div>
  <Fog opacity={.24}/><AtmosphereParticles kind="snow" count={210}/><LightSweep opacity={.11}/><Vignette strength={.48}/>
 </AbsoluteFill>;
};
