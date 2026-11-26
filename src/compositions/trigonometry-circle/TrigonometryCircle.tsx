import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

export const FPS=30;
export const C={ink:"#101A2B",paper:"#F6F2E9",cyan:"#48C7D4",coral:"#FF796C",gold:"#F2C66D"} as const;
const T={eyebrow:16,title:54,subtitle:22,body:24,number:29};
const clamp={extrapolateLeft:"clamp" as const,extrapolateRight:"clamp" as const};
const ease=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],clamp);
const smooth=(f:number,a:number,b:number)=>{const t=ease(f,a,b);return t*t*(3-2*t)};
const TAU=Math.PI*2, THETA=Math.PI/5;
const SIN=Math.sin(THETA),COS=Math.cos(THETA);
const fmt=(n:number)=>n.toFixed(3);
const polar=(cx:number,cy:number,r:number,a:number)=>({x:cx+r*Math.cos(a),y:cy-r*Math.sin(a)});
export type SceneId="hook"|"radians"|"triangle"|"sine"|"cosine"|"tangent"|"quadrants"|"pythagorean"|"special"|"recap";
export const SCENES:{id:SceneId;from:number;duration:number;title:string;subtitle:string;tag:string}[]=[
{id:"hook",from:0,duration:150,title:"Trigonometry",subtitle:"One circle connects angles, coordinates and three functions.",tag:"01 / THE UNIT CIRCLE"},
{id:"radians",from:150,duration:120,title:"An angle measures an arc",subtitle:"On a unit circle, radians and arc length are the same number.",tag:"02 / RADIANS"},
{id:"triangle",from:270,duration:120,title:"Build a right triangle",subtitle:"The radius is the hypotenuse — and its length is exactly 1.",tag:"03 / THE TRIANGLE"},
{id:"sine",from:390,duration:150,title:"Sine is the vertical coordinate",subtitle:"As the point rises, its y-coordinate becomes sin θ.",tag:"04 / SINE"},
{id:"cosine",from:540,duration:150,title:"Cosine is the horizontal coordinate",subtitle:"As the point moves sideways, its x-coordinate becomes cos θ.",tag:"05 / COSINE"},
{id:"tangent",from:690,duration:180,title:"Tangent is a length on a tangent",subtitle:"Extend the radius to x = 1: that vertical segment is tan θ.",tag:"06 / TANGENT"},
{id:"quadrants",from:870,duration:150,title:"The signs change by quadrant",subtitle:"The point tells you the signs of sine, cosine and tangent.",tag:"07 / SIGNS"},
{id:"pythagorean",from:1020,duration:150,title:"The Pythagorean identity",subtitle:"The two leg-squares always add up to the unit square.",tag:"08 / WHY IT WORKS"},
{id:"special",from:1170,duration:150,title:"Three angles worth knowing",subtitle:"Some angles have exact values you can recognize instantly.",tag:"09 / SPECIAL ANGLES"},
{id:"recap",from:1320,duration:120,title:"Three functions. One point.",subtitle:"Read the coordinates — and trigonometry follows.",tag:"10 / RECAP"}
];
export const TRIGONOMETRY_DURATION=SCENES[SCENES.length-1]!.from+SCENES[SCENES.length-1]!.duration;
const active=(f:number)=>[...SCENES].reverse().find(s=>f>=s.from)??SCENES[0]!;
const angle=(id:SceneId,f:number,d:number)=>{
 if(id==="hook")return interpolate(f,[0,d-1],[0,TAU*2+THETA],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 if(id==="sine"||id==="cosine")return THETA*smooth(f,10,d-24);
 if(id==="tangent")return THETA+(Math.PI/2-THETA)*smooth(f,68,d-20);
 if(id==="quadrants")return interpolate(f,[0,d-1],[0,TAU],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 if(id==="special")return ([Math.PI/6,Math.PI/4,Math.PI/3][Math.min(2,Math.floor(f/42))] ?? THETA);
 return THETA;
};
const tx=(x:number,y:number,s:string,c:string=C.paper,size=T.body,a:"start"|"middle"|"end"="start",w=650)=><text x={x} y={y} fill={c} fontSize={size} fontWeight={w} textAnchor={a} fontFamily="Inter,Arial,sans-serif" style={{fontVariantNumeric:"tabular-nums"}}>{s}</text>;
const ln=(x1:number,y1:number,x2:number,y2:number,c:string,w=4,o=1,dash?:string)=><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round" opacity={o} strokeDasharray={dash}/>;
const poly=(pts:{x:number;y:number}[],c:string,w=5)=><polyline points={pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>;

const Backdrop:React.FC<{f:number}>=({f})=><svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:"absolute",inset:0}}>
<defs><radialGradient id="trig-bg"><stop offset="0%" stopColor="#263d59"/><stop offset="100%" stopColor={C.ink}/></radialGradient><pattern id="trig-grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke={C.paper} strokeOpacity=".055"/></pattern></defs>
<rect width="1920" height="1080" fill="url(#trig-bg)"/><rect width="1920" height="1080" fill="url(#trig-grid)"/>
{Array.from({length:30},(_,i)=><circle key={i} cx={(i*193+f*(.16+i%3*.07))%1920} cy={(i*89+Math.sin(f*.012+i)*20+1080)%1080} r={i%5===0?3:1.5} fill={i%2?C.cyan:C.paper} opacity=".2"/>)}</svg>;

const Diagram:React.FC<{f:number;id:SceneId;d:number}>=({f,id,d})=>{
 const cx=500,cy=590,r=260,th=angle(id,f,d),p=polar(cx,cy,r,th);
 const tri=["triangle","sine","cosine","pythagorean","recap"].includes(id);
 const quad=((Math.floor((((th%TAU)+TAU)%TAU)/(Math.PI/2))%4)+1);
 const sy=Math.sin(th),co=Math.cos(th),ta=Math.tan(th);
 const undefinedTan=id==="tangent"&&Math.abs(Math.cos(th))<.035;
 const tangentY=cy-r*ta;
 const graphX=1050,graphY=790,graphW=630,graphH=160;
 const graphProgress=(id==="sine"||id==="cosine")?smooth(f,8,d-24):0;
 const graph=Array.from({length:90},(_,i)=>{const a=i/89*Math.max(THETA,th);const v=id==="sine"?Math.sin(a):Math.cos(a);return{x:graphX+i/89*graphW*graphProgress,y:graphY-(v+1)*graphH/2}}).filter((_,i)=>i/89<=graphProgress);
 const sinSign=sy>=0?"+":"−",cosSign=co>=0?"+":"−",tanSign=ta>=0?"+":"−";
 const specialIndex=Math.min(2,Math.floor(f/42)),special=([Math.PI/6,Math.PI/4,Math.PI/3][specialIndex] ?? Math.PI/6);
 const exact=([["1/2","√3/2"],["√2/2","√2/2"],["√3/2","1/2"]][specialIndex] ?? ["1/2","√3/2"]) as [string,string];
 const square=smooth(f,28,92);
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:"absolute",inset:0}}>
 <defs><linearGradient id="trig-radius"><stop stopColor={C.gold}/><stop offset="1" stopColor={C.coral}/></linearGradient><filter id="trig-shadow"><feGaussianBlur stdDeviation="8"/></filter></defs>
 {/* Persistent circle, axes, radius and moving point */}
 <circle cx={cx} cy={cy} r={r+34} fill="none" stroke={C.cyan} strokeOpacity=".12" strokeWidth="2" strokeDasharray="3 14" transform={`rotate(${f*.035} ${cx} ${cy})`}/>
 <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.paper} strokeOpacity=".65" strokeWidth="4"/>
 {ln(cx-r-90,cy,cx+r+100,cy,"#91A4B9",2,.7)}{ln(cx,cy-r-90,cx,cy+r+90,"#91A4B9",2,.7)}
 {tx(cx+r+110,cy+8,"x",C.paper,21)}{tx(cx+12,cy-r-100,"y",C.paper,21)}{tx(cx-18,cy+34,"O",C.paper,20,"end")}
 {ln(cx+r,cy-10,cx+r,cy+10,C.gold,3)}{tx(cx+r,cy+42,"1",C.gold,19,"middle")}
 {ln(cx-10,cy-r,cx+10,cy-r,C.gold,3)}{tx(cx-26,cy-r-12,"1",C.gold,19,"end")}
 {ln(cx,cy,p.x,p.y,"url(#trig-radius)",9)}
 <circle cx={p.x} cy={p.y} r="18" fill="#000" opacity=".2" filter="url(#trig-shadow)"/><circle cx={p.x} cy={p.y} r="13" fill={id==="quadrants"?([C.cyan,C.gold,C.coral,C.paper][quad-1] ?? C.coral):C.coral} stroke={C.paper} strokeWidth="4"/>
 {tx(p.x+22,p.y-20,`(${fmt(co)}, ${fmt(sy)})`,C.paper,19)}
 <path d={`M ${cx+66} ${cy} A 66 66 0 0 0 ${cx+66*Math.cos(th)} ${cy-66*Math.sin(th)}`} fill="none" stroke={C.gold} strokeWidth="5" strokeLinecap="round"/>
 {tx(cx+96,cy-40,id==="special"?`${[30,45,60][specialIndex]}°`:"θ",C.gold,24)}
 {/* Radian arc unrolled alongside the circle */}
 {id==="radians"&&<g>
  <path d={`M ${cx+r} ${cy} A ${r} ${r} 0 0 0 ${p.x} ${p.y}`} fill="none" stroke={C.cyan} strokeWidth="9"/>
  {ln(880,380,880+r*THETA,380,C.cyan,9)}{ln(880,365,880,395,C.paper,2)}{ln(880+r*THETA,365,880+r*THETA,395,C.paper,2)}
  {tx(880,340,"unrolled arc",C.cyan,18)}{tx(880+r*THETA/2,425,"s = rθ = 0.628",C.paper,22,"middle")}
  {ln(880,480,880+r,480,C.gold,5)}{tx(880+r/2,520,"1 rad = 1 unit of arc",C.gold,20,"middle")}
 </g>}
 {/* Triangle legs build in sequence */}
 {tri&&<g>
  {ln(p.x,p.y,p.x,cy,C.cyan,8,id==="triangle"?smooth(f,34,62):1)}
  {ln(p.x,cy,cx,cy,C.coral,8,id==="triangle"?smooth(f,58,86):1)}
  <path d={`M ${p.x-22} ${cy} L ${p.x-22} ${cy-22} L ${p.x} ${cy-22}`} fill="none" stroke={C.paper} strokeWidth="3"/>
  {tx(p.x+24,(p.y+cy)/2,`y = ${fmt(sy)}`,C.cyan,19)}{tx((cx+p.x)/2,cy+42,`x = ${fmt(co)}`,C.coral,19,"middle")}
  {tx(cx+(p.x-cx)*.48-20,cy+(p.y-cy)*.48-22,"r = 1",C.gold,20,"middle")}
 </g>}
 {/* Sine/cosine projections and their live unrolled graphs */}
 {(id==="sine"||id==="cosine")&&<g>
  {ln(p.x,p.y,p.x,cy,C.cyan,9)}{ln(p.x,p.y,cx,p.y,C.cyan,2,.65,"7 9")}{ln(cx,cy,p.x,cy,C.coral,9)}
  <rect x="1010" y="290" width="700" height="360" rx="26" fill="#17283C" stroke="#3D566E"/>
  {tx(1060,350,id==="sine"?"SINE / LIVE HEIGHT":"COSINE / LIVE WIDTH",C.cyan,18)}
  {tx(1060,425,id==="sine"?`sin 36° = ${fmt(SIN)}`:`cos 36° = ${fmt(COS)}`,C.paper,37)}
  {tx(1060,480,id==="sine"?"The y-coordinate":"The x-coordinate",C.gold,23)}
  {tx(graphX,graphY-graphH-28,id==="sine"?"A sine wave, unrolled":"A cosine wave, unrolled",C.paper,20)}
  {ln(graphX,graphY,graphX+graphW,graphY,"#8193A8",2,.5)}{ln(graphX,graphY-graphH,graphX,graphY+12,"#8193A8",2,.5)}
  {poly(graph,id==="sine"?C.cyan:C.coral,6)}
  <circle cx={graphX+graphW*graphProgress} cy={graphY-((id==="sine"?sy:co)+1)*graphH/2} r="9" fill={id==="sine"?C.cyan:C.coral} stroke={C.paper} strokeWidth="3"/>
 </g>}
 {/* True tangent line x=1 and radius extension */}
 {id==="tangent"&&<g>
  {ln(cx+r,cy-250,cx+r,cy+250,C.gold,4,1,"8 8")}{tx(cx+r+22,cy-260,"x = 1",C.gold,19)}
  {ln(cx,cy,cx+r,tangentY,C.coral,7)}
  {!undefinedTan&&ln(cx+r,cy,cx+r,tangentY,C.cyan,11)}
  {tx(cx+r+22,Math.max(230,Math.min(890,(cy+tangentY)/2)),undefinedTan?"undefined (cos θ = 0)":`tan θ = ${fmt(ta)}`,C.cyan,20)}
  {tx(1050,355,"TANGENT LENGTH",C.gold,18)}{tx(1050,415,undefinedTan?"undefined":fmt(ta),C.paper,40)}
  {tx(1050,470,"tan θ = sin θ / cos θ",C.paper,24)}
 </g>}
 {/* Quadrant sign readout and ASTC memory chip */}
 {id==="quadrants"&&<g>
  <rect x="1030" y="300" width="680" height="390" rx="24" fill="#17283C" stroke="#3D566E"/>
  {tx(1080,360,`QUADRANT ${quad}`,C.gold,20)}
  {tx(1080,430,`sin θ   ${sinSign}`,C.cyan,28)}{tx(1300,430,`cos θ   ${cosSign}`,C.coral,28)}{tx(1520,430,`tan θ   ${tanSign}`,C.gold,28)}
  {["I: ALL +","II: SIN +","III: TAN +","IV: COS +"].map((s,i)=><g key={s}><rect x={1065+i*158} y="505" width="145" height="82" rx="14" fill={quad===i+1?"#34465A":"#1D3046"} stroke={quad===i+1?C.gold:"#52677D"} strokeWidth={quad===i+1?3:1}/>{tx(1137+i*158,554,s,C.paper,15,"middle")}</g>)}
  {tx(1080,645,"ASTC · All · Sine · Tangent · Cosine",C.paper,20)}
 </g>}
 {/* Leg-square areas add to the unit square */}
 {id==="pythagorean"&&<g>
  <rect x="1030" y="285" width="680" height="430" rx="24" fill="#17283C" stroke="#3D566E"/>
  {tx(1080,345,"AREA ADDS TO ONE",C.gold,18)}
  <rect x="1090" y="390" width={220*square} height={220*square} fill={C.coral} fillOpacity=".28" stroke={C.coral} strokeWidth="3"/>
  <rect x="1335" y="390" width={220*square} height={220*square} fill={C.cyan} fillOpacity=".28" stroke={C.cyan} strokeWidth="3"/>
  {tx(1200,645,`cos² = ${fmt(COS*COS)}`,C.coral,21,"middle")}{tx(1445,645,`sin² = ${fmt(SIN*SIN)}`,C.cyan,21,"middle")}
  {tx(1080,695,`${fmt(COS*COS)} + ${fmt(SIN*SIN)} = 1`,C.paper,25)}
 </g>}
 {/* Exact special-angle values */}
 {id==="special"&&<g>
  <rect x="1030" y="300" width="680" height="390" rx="24" fill="#17283C" stroke="#3D566E"/>
  {tx(1080,360,`${[30,45,60][specialIndex]}°`,C.gold,38)}
  {tx(1080,440,`sin = ${exact[0]} ≈ ${fmt(Math.sin(special))}`,C.cyan,27)}
  {tx(1080,510,`cos = ${exact[1]} ≈ ${fmt(Math.cos(special))}`,C.coral,27)}
  {tx(1080,590,`tan ≈ ${fmt(Math.tan(special))}`,C.paper,27)}
  {[30,45,60].map((v,i)=><g key={v}><circle cx={1090+i*190} cy="650" r="11" fill={i===specialIndex?C.gold:"#66788B"}/>{tx(1120+i*190,658,`${v}°`,i===specialIndex?C.gold:C.paper,18)}</g>)}
 </g>}
 {/* Final formula recap */}
 {id==="recap"&&<g>
  <rect x="1020" y="300" width="700" height="390" rx="26" fill="#17283C" stroke="#3D566E"/>
  {tx(1080,380,"sin θ",C.cyan,38)}{tx(1330,380,"= y",C.paper,38)}
  {tx(1080,475,"cos θ",C.coral,38)}{tx(1330,475,"= x",C.paper,38)}
  {tx(1080,570,"tan θ",C.gold,38)}{tx(1330,570,"= y / x",C.paper,38)}
  {tx(1080,650,`At 36°: (${fmt(COS)}, ${fmt(SIN)})`,C.paper,23)}
 </g>}
 {/* Numeric readout is always live */}
 <rect x="90" y="900" width="820" height="82" rx="18" fill="#17283C" stroke="#3D566E"/>
 {tx(125,950,`θ = ${(th*180/Math.PI).toFixed(1)}°`,C.gold,24)}
 {tx(390,950,`x = cos θ = ${fmt(co)}`,C.coral,21)}
 {tx(690,950,`y = sin θ = ${fmt(sy)}`,C.cyan,21)}
 </svg>;
};

const SceneTitle:React.FC<{scene:typeof SCENES[number]}>=({scene})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const s=spring({frame:f,fps,config:{damping:18,stiffness:110,mass:.8}});
 const y=interpolate(s,[0,1],[26,0]);
 return <div style={{position:"absolute",left:96,top:68,maxWidth:1450,opacity:ease(f,0,12),transform:`translateY(${y}px)`}}>
  <div style={{fontSize:T.eyebrow,color:C.cyan,fontWeight:800,letterSpacing:5}}>{scene.tag}</div>
  <div style={{fontSize:T.title,color:C.paper,fontWeight:800,letterSpacing:-2,marginTop:12}}>{scene.title}</div>
  <div style={{fontSize:T.subtitle,color:"#B8C5D3",marginTop:10}}>{scene.subtitle}</div>
 </div>;
};

export const TrigonometryCircle:React.FC=()=>{
 const f=useCurrentFrame(),{durationInFrames,fps}=useVideoConfig();
 const s=active(f),local=f-s.from;
 const progress=interpolate(f,[0,durationInFrames],[0,100],clamp);
 const seconds=durationInFrames/fps;
 const cam=spring({frame:local,fps,config:{damping:22,stiffness:42,mass:1.2}});
 const scale=interpolate(cam,[0,1],[1.015,1]);
 return <AbsoluteFill style={{background:C.ink,fontFamily:"Inter,Arial,sans-serif",overflow:"hidden"}}>
  <Backdrop f={f}/>
  <div style={{position:"absolute",inset:0,transform:`scale(${scale})`,transformOrigin:"50% 50%"}}><Diagram f={f} id={s.id} d={s.duration}/></div>
  {SCENES.map(scene=><Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration} name={scene.id}><SceneTitle scene={scene}/></Sequence>)}
  <div style={{position:"absolute",left:96,right:96,bottom:48,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
   <div style={{fontSize:14,color:"#AAB8C8",letterSpacing:3,fontWeight:800}}>TRIGONOMETRY / UNIT CIRCLE</div>
   <div style={{width:340,height:4,background:"rgba(246,242,233,.18)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:C.cyan}}/></div>
   <div style={{fontSize:16,color:C.paper,fontVariantNumeric:"tabular-nums"}}>{(f/fps).toFixed(1)} / {seconds.toFixed(1)} SEC</div>
  </div>
 </AbsoluteFill>;
};
