export const Sky=({frame,storm=1}:{frame:number;storm?:number})=><svg viewBox="0 0 1920 1080" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
 <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#071321"/><stop offset=".65" stopColor="#233e4f"/><stop offset="1" stopColor="#0d202c"/></linearGradient><linearGradient id="water" x2="0" y2="1"><stop stopColor="#285d72"/><stop offset=".38" stopColor="#12384d"/><stop offset="1" stopColor="#030d17"/></linearGradient><linearGradient id="towerStone" x2="1" y2=".2"><stop stopColor="#596b70"/><stop offset=".35" stopColor="#c9c3ad"/><stop offset=".7" stopColor="#918f83"/><stop offset="1" stopColor="#485c64"/></linearGradient><radialGradient id="beaconGlow"><stop stopColor="#fff4cb" stopOpacity=".9"/><stop offset="1" stopColor="#ffd78a" stopOpacity="0"/></radialGradient></defs>
 <rect width="1920" height="1080" fill="url(#sky)"/>
 {Array.from({length:8},(_,i)=><path key={i} d={`M0 ${380+i*48+Math.sin(frame*.05+i)*15} Q250 ${340+i*50} 500 ${390+i*50} T1000 ${390+i*50} T1500 ${390+i*50} T2000 ${390+i*50}`} fill="none" stroke="#b0c4cc" strokeWidth={30+i*4} opacity={.035*storm}/>)}
 <path d="M0 670 Q190 610 390 676 T780 666 T1170 678 T1560 660 T1950 680 V1080 H0Z" fill="url(#water)"/>
 {Array.from({length:18},(_,i)=><path key={i} d={`M${i*120-30} ${720+(i%5)*61+Math.sin(frame*.08+i)*16} q48 -13 98 0`} fill="none" stroke="#c5d9df" strokeWidth="4" opacity=".23"/>)}
 <path d="M0 1080 0 940 210 825 380 870 570 760 770 860 960 700 1150 850 1350 705 1540 855 1740 755 1920 900 1920 1080Z" fill="#142630"/><path d="M0 880 Q260 840 520 890 T1040 875 T1560 890 T2080 865" fill="none" stroke="#89a8b0" strokeWidth="16" opacity=".13"/>
</svg>;
export const Tower=({frame,beam=0}:{frame:number;beam?:number})=><svg viewBox="0 0 1920 1080" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
 <path d="M1060 980 1125 280 Q1220 235 1315 280 L1382 980Z" fill="url(#towerStone)" stroke="#e6d8b7" strokeWidth="12"/>
 <path d="M1090 400 H1350 M1080 530 H1360 M1070 670 H1370 M1060 810 H1380" stroke="#566b6e" strokeWidth="13" opacity=".55"/>
 <path d="M1125 282 1164 155 H1280 L1315 282Z" fill="#223c48" stroke="#cbb98f" strokeWidth="12"/>
 <path d="M1150 155 H1297 L1270 105 H1180Z" fill="#a98d67"/>
 <rect x="1160" y="183" width="120" height="90" fill="#ffdb9a" opacity={.42+beam*.48}/>
 {Array.from({length:5},(_,i)=><path key={i} d={`M${1180+i*24} 185 V273`} stroke="#263a43" strokeWidth="9"/>)}
 <g transform={`translate(1220 228) rotate(${frame*.85})`}>{Array.from({length:8},(_,i)=><path key={i} d="M-5 -4 L-14 -82 L0 -96 L14 -82 L5 -4Z" fill="#ffeabc" transform={`rotate(${i*45})`}/>)}</g>
 <circle cx="1220" cy="228" r="26" fill="#fff4d1" opacity={beam}/>
 <path d="M1220 228 L-250 -150 L-270 620Z" fill="#ffe9b6" opacity={beam*.14}/>
 <path d="M1150 980 V825 Q1220 765 1290 825 V980Z" fill="#172831" stroke="#c6b790" strokeWidth="13"/>
 <path d="M1180 980 V858 Q1220 816 1260 858 V980Z" fill="#030d14"/>
</svg>;
export const Keeper=({frame,x=470,work=0,scale=1}:{frame:number;x?:number;work?:number;scale?:number})=><svg viewBox="0 0 1920 1080" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
 <g transform={`translate(${x+Math.sin(frame*.14)*4} ${835+Math.abs(Math.sin(frame*.22))*-7}) rotate(${Math.sin(frame*.22)*3} 0 -100) scale(${scale})`}>
  <ellipse cy="138" rx="72" ry="19" fill="#000" opacity=".5"/>
  <g transform={`translate(0 0)`}><path d={`M-30 0 -48 ${58+Math.sin(frame*.22)*19} M30 0 46 ${58-Math.sin(frame*.22)*19}`} stroke="#243c4c" strokeWidth="34" strokeLinecap="round"/><path d={`M-48 ${58+Math.sin(frame*.22)*19} -55 120 M46 ${58-Math.sin(frame*.22)*19} 54 120`} stroke="#243c4c" strokeWidth="28" strokeLinecap="round"/></g>
  <path d="M-72 118 h68 m-4 0 h58" stroke="#080f18" strokeWidth="22" strokeLinecap="round"/>
  <path d="M-58 -170 Q0 -204 58 -170 L75 15 H-75Z" fill="#405d6a" stroke="#d0d0bb" strokeWidth="8"/>
  <path d="M-69 -88 H69" stroke="#b99b6c" strokeWidth="14"/>
  <circle cy="-222" r="53" fill="#bcae93" stroke="#3b5260" strokeWidth="9"/>
  <path d="M-77 -248 Q-70 -337 0 -334 Q78 -328 82 -248Z" fill="#253a47" stroke="#d2bd8d" strokeWidth="12"/>
  <path d="M-33 -218 h66" stroke="#263c49" strokeWidth="9"/><circle cy="-219" r="7" fill="#e6c98e"/>
  <g transform={`translate(66 -112) rotate(${-20-work*65})`}><path d="M0 0 58 -25 95 -2" stroke="#9aabac" strokeWidth="22" strokeLinecap="round"/><circle cx="98" cy="-2" r="16" fill="#e1c58b"/></g>
  <path d="M-54 -95 -90 -25" stroke="#83969a" strokeWidth="18" strokeLinecap="round"/>
 </g>
</svg>;
export const Beam=({frame,intensity}:{frame:number;intensity:number})=><svg viewBox="0 0 1920 1080" style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
 <g transform={`translate(1220 228) rotate(${Math.sin(frame*.025)*40-35})`}>
 <path d="M0 0 L-1650 -420 L-1650 420Z" fill="#ffe5b2" opacity={intensity*.2}/>
 <path d="M0 0 L-1500 -150 L-1500 150Z" fill="#fff7df" opacity={intensity*.11}/>
 </g>
</svg>;
export const Interior=({frame,repair}:{frame:number;repair:number})=><svg viewBox="0 0 1920 1080" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
 <rect width="1920" height="1080" fill="#101d27"/>
 <circle cx="1020" cy="500" r="365" fill="#2b424b" stroke="#ab9166" strokeWidth="34"/>
 <circle cx="1020" cy="500" r="288" fill="#0d2029" stroke="#e0c17e" strokeWidth="18"/>
 <g transform={`rotate(${frame*1.2} 1020 500)`}>{Array.from({length:12},(_,i)=><path key={i} d="M1020 500 L964 210 Q1020 170 1076 210Z" fill="#ffe7af" opacity=".8" transform={`rotate(${i*30} 1020 500)`}/>)}</g>
 <circle cx="1020" cy="500" r="85" fill="#ffe2a0" opacity={.3+repair*.7}/>
 <path d={`M690 650 H${1060+repair*170}`} stroke="#bfa46b" strokeWidth="28" strokeLinecap="round"/>
 <path d={`M750 650 H${1040+repair*150}`} stroke="#fff0c1" strokeWidth="9" strokeLinecap="round"/>
 <Keeper frame={frame} x={430} work={repair} scale={.7}/>
</svg>;

export const Lightning=({frame}:{frame:number})=>{const flash=Math.pow(Math.max(0,Math.sin(frame*.17+1.2)),26);return <svg viewBox="0 0 1920 1080" style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}><path d="M740 0 680 170 735 155 650 370 820 145 760 158 820 0Z" fill="#d8efff" opacity={flash*.85}/><path d="M740 0 680 170 735 155 650 370" fill="none" stroke="#fff" strokeWidth="12" opacity={flash}/><rect width="1920" height="1080" fill="#d7edff" opacity={flash*.09}/></svg>;};
