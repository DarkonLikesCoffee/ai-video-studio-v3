import React from "react";
import {AbsoluteFill,useCurrentFrame,interpolate,Easing} from "remotion";
import {AtmosphereParticles,Fog,Vignette} from "../../../shared/overlays";
export const Opening:React.FC=()=>{
 const f=useCurrentFrame(),p=interpolate(f,[0,210],[0,1],{easing:Easing.inOut(Easing.cubic)});
 const stars=Array.from({length:85},(_,i)=><circle key={i} cx={(i*197)%1920} cy={(i*83)%530} r={i%3===0?2:1} fill="#e1efff" opacity={.24+(i%5)*.1}/>);
 return <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(180deg,#06101e 0%,#12283d 58%,#091725 100%)"}}>
  <svg viewBox="0 0 1920 1080" style={{position:"absolute",width:"100%",height:"100%"}}>
   <defs><linearGradient id="mountainA" x2="0" y2="1"><stop stopColor="#5d7588"/><stop offset="1" stopColor="#172c3b"/></linearGradient></defs>
   {stars}<circle cx="1460" cy="190" r="75" fill="#dce9ef" opacity=".72"/><circle cx="1460" cy="190" r="108" fill="#dce9ef" opacity=".08"/>
   <path d="M0 570 210 320 365 490 580 230 790 485 1010 280 1205 520 1410 300 1640 530 1820 355 1920 450V1080H0Z" fill="#243f52"/>
   <path d="M0 570 210 320 365 490 580 230 790 485 1010 280 1205 520 1410 300 1640 530 1820 355 1920 450" fill="none" stroke="#d8e7ef" strokeWidth="18" opacity=".58"/>
   <path d="M0 710 300 520 470 650 770 455 980 690 1220 460 1470 685 1700 500 1920 660V1080H0Z" fill="url(#mountainA)"/>
   <path d="M0 730 300 520 470 650 770 455 980 690 1220 460 1470 685 1700 500 1920 660" fill="none" stroke="#b8ccd8" strokeWidth="13" opacity=".66"/>
   <path d="M0 865 Q450 785 910 850 T1920 820V1080H0Z" fill="#152a37"/>
   <path d="M0 900 Q500 820 950 900 T1920 865" fill="none" stroke="#d8e8f0" strokeWidth="8" opacity=".16"/>
   <path d="M0 1000 650 965 1120 970 1920 905 M0 1030 650 995 1120 1000 1920 935" stroke="#8da4b0" strokeWidth="6" fill="none" opacity=".65"/>
  </svg>
  <svg viewBox="0 0 1920 1080" style={{position:"absolute",width:"100%",height:"100%"}}>
   <g transform={`translate(${160-p*120} 0)`} opacity={.85}><path d="M0 655V540H190L255 610V690H0Z" fill="#101f2c" stroke="#8096a5" strokeWidth="5"/><path d="M35 552H170L220 600H35Z" fill="#263e50"/><path d="M25 625H220" stroke="#e6c78e" strokeWidth="9"/></g>
  </svg>
  <div style={{position:"absolute",left:135,top:145,color:"#e7f0f5",letterSpacing:8,fontSize:18}}>ALPINE NIGHT LINE / 02:17</div>
  <div style={{position:"absolute",left:130,top:205,color:"#f3f7fa",fontSize:72,fontWeight:700,lineHeight:1.08,textShadow:"0 4px 30px #00101d"}}>THE LAST TRAIN<br/>THROUGH THE PASS</div>
  <div style={{position:"absolute",left:138,top:390,color:"#b9cbd7",fontSize:24,letterSpacing:4}}>A WINTER JOURNEY ABOVE THE CLOUDS</div>
  <div style={{position:"absolute",left:140,top:995,width:380,height:3,background:"#d6ba87",transformOrigin:"left",transform:`scaleX(${p})`}}/>
  <Fog opacity={.16}/><AtmosphereParticles kind="snow" count={120}/><Vignette strength={.55}/>
 </AbsoluteFill>;
};
