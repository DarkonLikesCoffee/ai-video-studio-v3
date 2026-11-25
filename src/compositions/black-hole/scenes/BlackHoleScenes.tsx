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
  else camera.position.set(4.2-t*.55,4.0-t*.35,15.5-t*1.0);
  camera.lookAt(0,0,0);
 });
 return null;
};

const seeded=(seed:number)=>{let n=seed;return ()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};};

const StarLayers:React.FC=()=>{
 const far=useRef<THREE.Points>(null),mid=useRef<THREE.Points>(null),near=useRef<THREE.Points>(null);
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const make=(count:number,radius:number,depth:number,seed:number)=>{
  const rand=seeded(seed),a=new Float32Array(count*3);
  for(let i=0;i<count;i++){const theta=rand()*TAU,r=radius*(.25+rand());a[i*3]=Math.cos(theta)*r;a[i*3+1]=(rand()-.5)*depth;a[i*3+2]=Math.sin(theta)*r;}
  return a;
 };
 const farPos=useMemo(()=>make(900,28,28,11),[]);
 const midPos=useMemo(()=>make(310,18,18,43),[]);
 const nearPos=useMemo(()=>make(90,12,12,101),[]);
 useFrame(()=>{
  const t=frame/fps;
  if(far.current)far.current.rotation.y=t*.0015;
  if(mid.current)mid.current.rotation.y=-t*.003;
  if(near.current)near.current.rotation.y=t*.006;
 });
 const layer=(ref:React.RefObject<THREE.Points|null>,positions:Float32Array,color:string,size:number)=>
  <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial color={color} size={size} transparent opacity={.72} sizeAttenuation depthWrite={false}/></points>;
 return <group>{layer(far,farPos,"#667f9f",.024)}{layer(mid,midPos,"#aabfd5",.034)}{layer(near,nearPos,"#d9f0ff",.047)}</group>;
};

const EventHorizon:React.FC=()=> <mesh>
 <sphereGeometry args={[2,64,48]}/>
 <meshBasicMaterial color="#000000" side={THREE.FrontSide}/>
</mesh>;

const DiskPlane:React.FC<{warm?:boolean;wide?:boolean;tilt:number}> = ({warm=false,wide=false,tilt})=>{
 const ref=useRef<THREE.Group>(null);
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 useFrame(()=>{if(ref.current)ref.current.rotation.y=(frame/fps)*.10;});
 const inner=2.12,outer=wide?5.7:5.15;
 const geometry=useMemo(()=>{
  const segments=192,radial=34,vertices:number[]=[],colors:number[]=[],indices:number[]=[];
  const innerC=new THREE.Color(warm?"#fff2d0":"#f3ffff");
  const midC=new THREE.Color(warm?"#d77a36":"#397eaa");
  const outerC=new THREE.Color(warm?"#2a1210":"#102b49");
  for(let j=0;j<=radial;j++){
   const u=j/radial,r=inner+u*(outer-inner);
   for(let i=0;i<=segments;i++){
    const a=i/segments*TAU;
    const turbulence=(Math.sin(a*11+r*2.8)+Math.sin(a*23-r*4.2)*.55+Math.sin(a*39+r*7.1)*.22)/1.77;
    const y=turbulence*.045*(1-u)+Math.sin(a*13-r*2)*.018;
    vertices.push(Math.cos(a)*r,y,Math.sin(a)*r);
    const c=innerC.clone().lerp(midC,THREE.MathUtils.smoothstep(u,.02,.55)).lerp(outerC,THREE.MathUtils.smoothstep(u,.58,1));
    const noise=.78+.22*(.5+.5*Math.sin(i*2.8+j*3.7+turbulence*5));
    colors.push(c.r*noise,c.g*noise,c.b*noise);
   }
  }
  for(let j=0;j<radial;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;indices.push(a,b,a+1,b,b+1,a+1);}
  const g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
  g.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));
  g.setIndex(indices);g.computeVertexNormals();return g;
 },[warm,wide]);
 return <group ref={ref} rotation={[tilt,0,warm?-.52:0]}>
  <mesh geometry={geometry}>
   <meshBasicMaterial vertexColors side={THREE.DoubleSide} transparent opacity={.92}/>
  </mesh>
  <mesh rotation={[Math.PI/2,0,0]}>
   <torusGeometry args={[2.22,.035,8,192]}/>
   <meshBasicMaterial color={warm?"#fff0cf":"#eaffff"} transparent opacity={.58}/>
  </mesh>
 </group>;
};

const PlasmaStreaks:React.FC<{warm?:boolean;tilt:number;count?:number}> = ({warm=false,tilt,count=120})=>{
 const ref=useRef<THREE.Group>(null);
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const curves=useMemo(()=>{
  const rand=seeded(warm?202:77);
  return Array.from({length:warm?170:120},(_,i)=>{
   const a=rand()*TAU,r0=2.35+rand()*.6,r1=3.5+rand()*2.2,skew=(rand()-.5)*.24;
   const pts:THREE.Vector3[]=[];
   for(let j=0;j<28;j++){
    const t=j/27,r=THREE.MathUtils.lerp(r0,r1,t),angle=a+skew*t+Math.sin(t*12+i)*.035;
    const height=Math.sin(t*7+i*.73)*(.04+rand()*.004);
    pts.push(new THREE.Vector3(Math.cos(angle)*r,height,Math.sin(angle)*r));
   }
   return new THREE.CatmullRomCurve3(pts);
  });
 },[count,warm]);
 useFrame(()=>{if(ref.current)ref.current.rotation.y=(frame/fps)*.12;});
 return <group ref={ref} rotation={[tilt,0,warm?-.52:0]}>
  {curves.map((curve,i)=><mesh key={i}>
   <tubeGeometry args={[curve,36,.006+(i%5)*.003,4,false]}/>
   <meshBasicMaterial color={warm?(i%5===0?"#fff7e8":i%2?"#ffbf75":"#ff8b3d"):(i%5===0?"#ffffff":i%2?"#80d9ff":"#286eaa")} transparent opacity={warm?.30+(i%6)*.035:.14+(i%6)*.035}/>
  </mesh>)}
 </group>;
};

const DustCloud:React.FC<{warm?:boolean}> = ({warm=false})=>{
 const ref=useRef<THREE.Points>(null);
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const positions=useMemo(()=>{
  const rand=seeded(warm?501:301),n=2200,a=new Float32Array(n*3);
  for(let i=0;i<n;i++){
   const angle=rand()*TAU,r=2.15+rand()*3.15;
   a[i*3]=Math.cos(angle)*r;
   a[i*3+1]=(rand()-.5)*(.08+rand()*.24);
   a[i*3+2]=Math.sin(angle)*r;
  }
  return a;
 },[warm]);
 useFrame(()=>{if(ref.current)ref.current.rotation.y=(frame/fps)*.14;});
 return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial color={warm?"#f6b06d":"#70c7ee"} size={.035} transparent opacity={.28} sizeAttenuation depthWrite={false}/></points>;
};

const LensedRearArc:React.FC<{warm?:boolean;tilt:number}> = ({warm=false,tilt})=>
 <group position={[0,.62,0]}>
  <mesh>
   <torusGeometry args={[2.46,.24,10,192,Math.PI*1.04]}/>
   <meshBasicMaterial color={warm?"#ffb66c":"#69cfff"} transparent opacity={.13}/>
  </mesh>
  <mesh>
   <torusGeometry args={[2.42,.075,12,192,Math.PI*1.04]}/>
   <meshBasicMaterial color={warm?"#fff1d0":"#edffff"} transparent opacity={.88}/>
  </mesh>
  <mesh rotation={[0,0,Math.PI]}>
   <torusGeometry args={[2.38,.035,8,192,Math.PI]}/>
   <meshBasicMaterial color={warm?"#ffc47d":"#bcefff"} transparent opacity={.22}/>
  </mesh>
 </group>;

const BlackHoleSet:React.FC<{shot:Shot}> = ({shot})=>{
 const warm=shot==="oblique",wide=shot==="wide",tilt=warm?-.72:wide?-.12:0;
 return <>
  <color attach="background" args={[wide?"#02040a":warm?"#05050b":"#02050a"]}/>
  <fog attach="fog" args={["#03050b",22,52]}/>
  <ambientLight intensity={.06}/>
  <pointLight position={[0,5,4]} intensity={warm?4:3} distance={9} color={warm?"#ffc47d":"#c4f5ff"}/>
  <StarLayers/>
  <EventHorizon/>
  <DiskPlane warm={warm} wide={wide} tilt={tilt}/>
  <LensedRearArc warm={warm} tilt={0}/>
  <DustCloud warm={warm}/>
  <PlasmaStreaks warm={warm} tilt={tilt}/>
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
 return <ThreeCanvas width={1920} height={1080} camera={{position:camera,fov:38,near:.1,far:100}}>
  <CameraMove shot={shot}/><BlackHoleSet shot={shot}/>
 </ThreeCanvas>;
};
export const DeepField:React.FC=()=> <AbsoluteFill><SceneCanvas shot="wide"/><Vignette strength={.6}/><Overlay code="01 / DEEP FIELD • EVENT 7A" caption="A dark centre distorts the light around it"/></AbsoluteFill>;
export const EdgeOnHero:React.FC=()=> <AbsoluteFill><SceneCanvas shot="hero"/><Vignette strength={.62}/><Overlay code="02 / LENSING PLANE" caption="The far side of the disk bends over the shadow"/></AbsoluteFill>;
export const ObliqueSweep:React.FC=()=> <AbsoluteFill><SceneCanvas shot="oblique"/><Vignette strength={.66}/><Overlay code="03 / INNER FLOW" caption="Hot plasma sweeps across the foreground"/></AbsoluteFill>;
