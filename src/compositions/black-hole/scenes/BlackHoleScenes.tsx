import React, {useMemo, useRef} from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {useFrame, useThree} from "@react-three/fiber";
import * as THREE from "three";
import {Vignette} from "../../../shared/overlays";

const TAU=Math.PI*2;
type Shot="wide"|"hero"|"oblique";
const CameraMove:React.FC<{shot:Shot}> = ({shot})=>{
 const frame=useCurrentFrame(),{camera}=useThree(),{durationInFrames}=useVideoConfig();
 useFrame(()=>{
  const t=frame/Math.max(1,durationInFrames-1);
  if(shot==="wide") camera.position.set(.2+Math.sin(t*1.5)*.22,2.2+Math.sin(t*2)*.12,15.5-3.2*t);
  else if(shot==="hero") camera.position.set(.15+Math.sin(t*1.3)*.34,1.2+Math.sin(t*1.6)*.15,10.5-1.1*t);
  else camera.position.set(3.2+Math.sin(t*1.2)*.6,4.1+Math.sin(t*1.5)*.25,10.4-1.4*t);
  camera.lookAt(0,0,0);
 });
 return null;
};
const OrbitParticles:React.FC<{count:number;radius:number;color:string;size:number;seed:number;depth:number;drift:number}> = ({count,radius,color,size,seed,depth,drift})=>{
 const ref=useRef<THREE.Points>(null);
 const positions=useMemo(()=>{
  const a=new Float32Array(count*3);let n=seed;
  const rand=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};
  for(let i=0;i<count;i++){const angle=rand()*TAU,r=radius*(.35+rand()*.85);a[i*3]=Math.cos(angle)*r;a[i*3+1]=(rand()-.5)*depth;a[i*3+2]=Math.sin(angle)*r;}
  return a;
 },[count,radius,seed,depth]);
 useFrame(({clock})=>{if(ref.current)ref.current.rotation.y=clock.getElapsedTime()*drift;});
 return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial color={color} size={size} transparent opacity={.66} sizeAttenuation depthWrite={false}/></points>;
};
const EventHorizon:React.FC=()=> <group>
 <mesh><sphereGeometry args={[2.02,48,32]}/><meshBasicMaterial color="#000000"/></mesh>
 <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[2.08,.045,8,128]}/><meshBasicMaterial color="#8ceaff" transparent opacity={.35}/></mesh>
</group>;
const LensRings:React.FC<{warm?:boolean}> = ({warm=false})=> <group rotation={[Math.PI/2,0,0]}>
 {[2.27,2.38,2.53].map((r,i)=><mesh key={r}><torusGeometry args={[r,.038-i*.006,8,160]}/><meshBasicMaterial color={warm?["#fff3d7","#ffd38a","#c77c42"][i]! : ["#ffffff","#bff7ff","#5ba9d8"][i]!} transparent opacity={[.95,.58,.24][i]!}/></mesh>)}
</group>;
const AccretionDisk:React.FC<{tilt:number;warm?:boolean;wide?:boolean}> = ({tilt,warm=false,wide=false})=>{
 const ref=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(ref.current)ref.current.rotation.y=clock.getElapsedTime()*.055;});
 const bands=useMemo(()=>Array.from({length:9},(_,i)=>({major:2.38+i*(wide?.36:.31),minor:.14+(i%4)*.035,opacity:.72-i*.055})),[wide]);
 return <group ref={ref} rotation={[tilt,0,0]}>
  {bands.map((b,i)=><mesh key={i} rotation={[Math.PI/2,0,0]}><torusGeometry args={[b.major,b.minor,6,160]}/><meshBasicMaterial color={warm?["#fff4d7","#ffc16b","#db783c"][i%3]! : ["#eafcff","#86dfff","#2e79b0"][i%3]!} transparent opacity={b.opacity} side={THREE.DoubleSide}/></mesh>)}
  {Array.from({length:38},(_,i)=>{const a=i*TAU/38,r=2.9+(i%9)*.25;return <mesh key={i} position={[Math.cos(a)*r,.015*Math.sin(i*4),Math.sin(a)*r]} rotation={[0,-a,0]}><boxGeometry args={[.22+(i%4)*.1,.025,.045+(i%3)*.02]}/><meshBasicMaterial color={warm?"#ffcc8d":"#9be7ff"} transparent opacity={.2+(i%4)*.1}/></mesh>;})}
 </group>;
};
const PlasmaFilaments:React.FC<{warm?:boolean;tilt:number}> = ({warm=false,tilt})=>{
 const ref=useRef<THREE.Group>(null);
 const lines=useMemo(()=>Array.from({length:42},(_,i)=>{
  const angle=i*TAU/42,points=[];const r0=2.55+(i%8)*.18,r1=4.8+(i%6)*.16;
  for(let j=0;j<22;j++){const t=j/21,r=THREE.MathUtils.lerp(r0,r1,t),w=Math.sin(t*9+i*1.7)*.075;points.push(new THREE.Vector3(Math.cos(angle+w)*r,Math.sin(angle+w)*r*.045,Math.sin(angle+w)*r));}
  return new THREE.CatmullRomCurve3(points);
 }),[]);
 useFrame(({clock})=>{if(ref.current)ref.current.rotation.y=clock.getElapsedTime()*.07;});
 return <group ref={ref} rotation={[tilt,0,0]}>{lines.map((curve,i)=><mesh key={i}><tubeGeometry args={[curve,48,.012+(i%3)*.008,4,false]}/><meshBasicMaterial color={warm?(i%3===0?"#fff0ce":"#d98950"):(i%3===0?"#efffff":"#55b5e4")} transparent opacity={.18+(i%4)*.07}/></mesh>)}</group>;
};
const StarLayers:React.FC=()=> <group>
 <OrbitParticles count={950} radius={18} depth={23} color="#8ea8c7" size={.027} seed={11} drift={.0015}/>
 <OrbitParticles count={280} radius={11} depth={13} color="#d5e7f4" size={.038} seed={43} drift={-.0024}/>
 <OrbitParticles count={110} radius={7} depth={9} color="#75a9d8" size={.052} seed={101} drift={.004}/>
</group>;
const BlackHoleSet:React.FC<{shot:Shot}> = ({shot})=>{
 const warm=shot==="oblique",tilt=shot==="oblique"?.58:shot==="wide"?-.12:0;
 return <>
  <color attach="background" args={[shot==="wide"?"#03050a":warm?"#05050b":"#02050a"]}/>
  <fog attach="fog" args={["#03060a",18,42]}/>
  <ambientLight intensity={.09}/>
  <pointLight position={[0,5,4]} intensity={52} distance={18} color={warm?"#ffc37d":"#b9f1ff"}/>
  <StarLayers/>
  <group><EventHorizon/><LensRings warm={warm}/><AccretionDisk tilt={tilt} warm={warm} wide={shot==="wide"}/><PlasmaFilaments tilt={tilt} warm={warm}/></group>
 </>;
};
const Overlay:React.FC<{code:string;caption:string}> = ({code,caption})=>{
 const f=useCurrentFrame(),alpha=interpolate(f,[0,15,130,170],[0,.7,.7,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <AbsoluteFill style={{pointerEvents:"none",opacity:alpha}}>
  <div style={{position:"absolute",left:76,top:62,color:"#b7c8d8",font:"600 13px Arial",letterSpacing:4,textShadow:"0 2px 12px #000"}}>{code}</div>
  <div style={{position:"absolute",left:76,top:88,color:"#eaf4fb",font:"500 17px Arial",letterSpacing:1,textShadow:"0 2px 12px #000"}}>{caption}</div>
 </AbsoluteFill>;
};
const SceneCanvas:React.FC<{shot:Shot}> = ({shot})=>{
 const camera=shot==="wide"?[0,2.2,15.5] as [number,number,number]:shot==="hero"?[0,1.2,10.5] as [number,number,number]:[3.2,4.1,10.4] as [number,number,number];
 return <ThreeCanvas width={1920} height={1080} camera={{position:camera,fov:38,near:.1,far:100}}><CameraMove shot={shot}/><BlackHoleSet shot={shot}/></ThreeCanvas>;
};
export const DeepField:React.FC=()=> <AbsoluteFill><SceneCanvas shot="wide"/><Vignette strength={.58}/><Overlay code="01 / DEEP FIELD • EVENT 7A" caption="A dark centre distorts the light around it"/></AbsoluteFill>;
export const EdgeOnHero:React.FC=()=> <AbsoluteFill><SceneCanvas shot="hero"/><Vignette strength={.62}/><Overlay code="02 / LENSING PLANE" caption="The far side of the disk bends over the shadow"/></AbsoluteFill>;
export const ObliqueSweep:React.FC=()=> <AbsoluteFill><SceneCanvas shot="oblique"/><Vignette strength={.66}/><Overlay code="03 / INNER FLOW" caption="Hot plasma sweeps across the foreground"/></AbsoluteFill>;
