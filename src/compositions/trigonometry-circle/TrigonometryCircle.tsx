import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const C = {ink:"#101A2B",paper:"#F6F2E9",cyan:"#48C7D4",coral:"#FF796C",gold:"#F2C66D"};
const TAU = Math.PI * 2;
const clamp = {extrapolateLeft:"clamp" as const, extrapolateRight:"clamp" as const};
const ease = (f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...clamp});
const polar = (cx:number,cy:number,r:number,a:number)=>({x:cx+r*Math.cos(a),y:cy-r*Math.sin(a)});
const line = (x1:number,y1:number,x2:number,y2:number,color:string,width=5,opacity=1)=> <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity}/>;
const label = (x:number,y:number,txt:string,color:string,size=25,anchor:"start"|"middle"|"end"="middle")=><text x={x} y={y} fill={color} fontSize={size} fontWeight={650} textAnchor={anchor} fontFamily="Inter,Arial,sans-serif">{txt}</text>;

const Backdrop:React.FC<{frame:number}> = ({frame})=>{
  const drift = (frame*.18)%100;
  return <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:"absolute",inset:0}}>
    <defs>
      <radialGradient id="glow"><stop offset="0%" stopColor="#263d59"/><stop offset="100%" stopColor={C.ink}/></radialGradient>
      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="#91a6bd" strokeOpacity=".10" strokeWidth="1"/></pattern>
      <filter id="blur"><feGaussianBlur stdDeviation="54"/></filter>
    </defs>
    <rect width="1920" height="1080" fill="url(#glow)"/>
    <circle cx={360+drift*2} cy={210} r="180" fill={C.cyan} opacity=".07" filter="url(#blur)"/>
    <circle cx={1490-drift} cy={840} r="250" fill={C.coral} opacity=".06" filter="url(#blur)"/>
    <rect width="1920" height="1080" fill="url(#grid)"/>
    {Array.from({length:34},(_,i)=><circle key={i} cx={(i*191+frame*(.22+i%3*.08))%2000} cy={(i*83+Math.sin(frame*.012+i)*22+1080)%1080} r={i%4===0?3:1.5} fill={i%3===0?C.cyan:C.paper} opacity=".24"/>)}
  </svg>;
};

const Header:React.FC<{kicker:string;title:string;sub:string;frame:number}> = ({kicker,title,sub,frame})=>{
  const op=ease(frame,0,14);
  return <div style={{position:"absolute",left:116,top:78,opacity:op}}>
    <div style={{color:C.cyan,fontSize:17,letterSpacing:5,fontWeight:800}}>{kicker.toUpperCase()}</div>
    <div style={{color:C.paper,fontSize:58,fontWeight:800,letterSpacing:-2,marginTop:14}}>{title}</div>
    <div style={{color:"#B8C5D3",fontSize:25,marginTop:13}}>{sub}</div>
  </div>;
};

const CircleDiagram:React.FC<{frame:number;mode:"orbit"|"triangle"|"sine"|"cosine"|"tangent"}> = ({frame,mode})=>{
  const cx=1040,cy=595,r=330;
  const local = mode==="orbit" ? frame : frame+0;
  const theta = mode==="orbit" ? -Math.PI/5 + frame*.027 : -Math.PI/5;
  const p=polar(cx,cy,r,theta);
  const progress = mode==="orbit" ? 1 : ease(frame,4,24);
  const showTriangle = mode!=="orbit" && mode!=="tangent";
  const sinOn = mode==="sine";
  const cosOn = mode==="cosine";
  const tanOn = mode==="tangent";
  const ringDash = 2*Math.PI*r;
  const pulse = 1+Math.sin(frame*.12)*.035;
  return <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:"absolute",inset:0}}>
    <defs>
      <filter id="shadow"><feGaussianBlur stdDeviation="12"/></filter>
      <linearGradient id="radiusGlow"><stop stopColor={C.gold}/><stop offset="1" stopColor={C.coral}/></linearGradient>
    </defs>
    {/* Orbiting guide rings and axes */}
    <circle cx={cx} cy={cy} r={r+42} fill="none" stroke={C.cyan} strokeOpacity=".12" strokeWidth="2" strokeDasharray="4 16" transform={`rotate(${frame*.05} ${cx} ${cy})`}/>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.paper} strokeOpacity=".54" strokeWidth="4"/>
    {line(cx-r-100,cy,cx+r+110,cy,"#A9B8C8",2,.55)}
    {line(cx,cy-r-82,cx,cy+r+85,"#A9B8C8",2,.55)}
    {label(cx+r+112,cy+9,"x",C.paper,24)}
    {label(cx+12,cy-r-92,"y",C.paper,24)}
    <circle cx={cx} cy={cy} r="7" fill={C.paper}/>
    {label(cx-15,cy+38,"O",C.paper,22,"end")}
    <circle cx={cx} cy={cy} r={r*.72*pulse} fill="none" stroke={C.cyan} strokeOpacity=".09" strokeWidth="1.5"/>
    {/* Angle arc */}
    <path d={`M ${cx+78} ${cy} A 78 78 0 0 0 ${cx+78*Math.cos(theta)} ${cy-78*Math.sin(theta)}`} fill="none" stroke={C.gold} strokeWidth="5" strokeLinecap="round"/>
    {label(cx+112,cy-42,"θ",C.gold,31)}
    {/* Radius shadow and radius */}
    <line x1={cx} y1={cy+5} x2={p.x} y2={p.y+5} stroke="#000" strokeWidth="18" opacity=".18" filter="url(#shadow)"/>
    {line(cx,cy,p.x,p.y,"url(#radiusGlow)",10)}
    {/* Point */}
    <circle cx={p.x} cy={p.y} r="17" fill={C.coral} stroke={C.paper} strokeWidth="5"/>
    {/* Triangle and its legs */}
    {showTriangle && <>
      {line(p.x,p.y,p.x,cy,sinOn?C.cyan:"#7E8FA4",sinOn?11:7,.95)}
      {line(p.x,cy,cx,cy,cosOn?C.coral:"#7E8FA4",cosOn?11:7,.95)}
      <path d={`M ${p.x-22} ${cy} L ${p.x-22} ${cy-22} L ${p.x} ${cy-22}`} fill="none" stroke={C.paper} strokeOpacity=".65" strokeWidth="2"/>
      {label(p.x+30,(p.y+cy)/2,"sin θ",C.cyan,25,"start")}
      {label((cx+p.x)/2,cy+42,"cos θ",C.coral,25)}
      {label(cx+(p.x-cx)*.48-20,cy+(p.y-cy)*.48-22,"1",C.gold,23)}
      <circle cx={p.x} cy={cy} r="6" fill={C.paper}/>
    </>}
    {tanOn && <>
      {line(p.x,p.y,p.x,cy,C.cyan,8)}
      {line(cx,cy,p.x,cy,C.coral,8)}
      <path d={`M ${p.x} ${cy} L ${p.x} ${p.y}`} stroke={C.gold} strokeDasharray="7 8" strokeWidth="3" fill="none"/>
      {label(p.x+34,(p.y+cy)/2,"opposite (y)",C.cyan,22,"start")}
      {label((cx+p.x)/2,cy+43,"adjacent (x)",C.coral,22)}
    </>}
    {mode==="orbit" && <>
      <path d={`M ${cx+r*Math.cos(-Math.PI/5)} ${cy-r*Math.sin(-Math.PI/5)} A ${r} ${r} 0 1 0 ${p.x} ${p.y}`} fill="none" stroke={C.cyan} strokeWidth="7" strokeDasharray={`${ringDash*.22} ${ringDash}`} strokeLinecap="round" opacity=".9"/>
      {label(580,760,"A rotating radius creates an angle",C.paper,25)}
    </>}
    {/* Axis projection guides */}
    {showTriangle && line(p.x,p.y,p.x,cy,C.paper,2,.33)}
    <g opacity=".9">
      <rect x="1430" y="350" width="330" height="148" rx="20" fill="#1B2C41" stroke="#50657C" strokeOpacity=".5"/>
      {label(1460,390,"UNIT CIRCLE",C.cyan,16,"start")}
      {label(1460,444,"r = 1",C.paper,34,"start")}
      {label(1460,478,"x² + y² = 1",C.paper,23,"start")}
    </g>
  </svg>;
};

const EquationPanel:React.FC<{frame:number;mode:string}> = ({frame,mode})=>{
  const content = mode==="sine"
    ? ["SINE","sin(θ) = opposite / hypotenuse","sin(θ) = y / 1 = y","The point’s vertical coordinate"]
    : mode==="cosine"
    ? ["COSINE","cos(θ) = adjacent / hypotenuse","cos(θ) = x / 1 = x","The point’s horizontal coordinate"]
    : mode==="tangent"
    ? ["TANGENT","tan(θ) = opposite / adjacent","tan(θ) = y / x = sin(θ) / cos(θ)","Undefined when x = 0 (cos θ = 0)"]
    : ["THE RIGHT TRIANGLE","Hypotenuse = radius = 1","Opposite = vertical leg (y)","Adjacent = horizontal leg (x)"];
  const op=ease(frame,5,19);
  return <div style={{position:"absolute",left:118,top:390,width:650,opacity:op}}>
    <div style={{fontSize:18,color:C.cyan,fontWeight:800,letterSpacing:4}}>{content[0]}</div>
    <div style={{marginTop:28,display:"grid",gap:19}}>
      {content.slice(1,3).map((s,i)=><div key={s} style={{padding:"19px 24px",borderRadius:16,background:"rgba(246,242,233,.07)",border:"1px solid rgba(246,242,233,.14)",color:i===1?C.gold:C.paper,fontSize:i===1?29:24,fontWeight:700}}>{s}</div>)}
    </div>
    <div style={{marginTop:25,color:"#B8C5D3",fontSize:23,lineHeight:1.45,maxWidth:570}}>{content[3]}</div>
  </div>;
};

const Scene:React.FC<{start:number;end:number;title:string;sub:string;mode:"orbit"|"triangle"|"sine"|"cosine"|"tangent";tag:string}> = ({start,end,title,sub,mode,tag})=>{
  const frame=useCurrentFrame();
  const f=frame-start;
  const fadeIn=ease(frame,start,start+18);
  const fadeOut=1-ease(frame,end-16,end);
  const opacity=fadeIn*fadeOut;
  const lift=interpolate(f,[0,22],[28,0],{...clamp});
  return <AbsoluteFill style={{opacity,transform:`translateY(${lift}px)`}}>
    <Header kicker={tag} title={title} sub={sub} frame={f}/>
    <CircleDiagram frame={f} mode={mode}/>
    {mode!=="orbit" && <EquationPanel frame={f} mode={mode}/>}
  </AbsoluteFill>;
};

export const TrigonometryCircle:React.FC=()=>{
  const frame=useCurrentFrame();
  const {durationInFrames}=useVideoConfig();
  const vignette=interpolate(frame,[0,durationInFrames],[.16,.32],clamp);
  return <AbsoluteFill style={{background:C.ink,fontFamily:"Inter,Arial,sans-serif",overflow:"hidden"}}>
    <Backdrop frame={frame}/>
    <div style={{position:"absolute",inset:0,boxShadow:`inset 0 0 180px rgba(0,0,0,${vignette})`,pointerEvents:"none"}}/>
    <Scene start={0} end={120} mode="orbit" tag="THE BIG IDEA" title="Trigonometry" sub="One circle. Three powerful functions."/>
    <Scene start={108} end={240} mode="triangle" tag="START WITH A CIRCLE" title="Meet the triangle" sub="A radius of 1 creates a right triangle."/>
    <Scene start={228} end={360} mode="sine" tag="THE VERTICAL SIDE" title="Sine measures height" sub="Follow the point straight down to the x-axis."/>
    <Scene start={348} end={480} mode="cosine" tag="THE HORIZONTAL SIDE" title="Cosine measures width" sub="Read the point’s horizontal coordinate."/>
    <Scene start={468} end={600} mode="tangent" tag="PUT THEM TOGETHER" title="Tangent is the ratio" sub="Compare vertical height with horizontal width."/>
    <div style={{position:"absolute",bottom:42,left:116,right:116,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:.82}}>
      <div style={{color:"#B8C5D3",fontSize:15,letterSpacing:3,fontWeight:700}}>TRIGONOMETRY / UNIT CIRCLE</div>
      <div style={{height:3,width:330,background:"rgba(246,242,233,.18)",borderRadius:5,overflow:"hidden"}}><div style={{height:"100%",width:`${(frame/600)*100}%`,background:C.cyan}}/></div>
      <div style={{color:C.paper,fontSize:16,fontVariantNumeric:"tabular-nums"}}>{String(Math.floor(frame/30)).padStart(2,"0")} / 20 SEC</div>
    </div>
  </AbsoluteFill>;
};
