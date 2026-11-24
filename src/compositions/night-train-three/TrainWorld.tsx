import React, {useLayoutEffect, useMemo, useRef} from "react";
import {useCurrentFrame, interpolate} from "remotion";
import * as THREE from "three";
import {ThreeScene, GroundPlane} from "../../shared/three-scene";

type V3=[number,number,number];
const Mountain:React.FC<{position:V3;scale:V3;color:string;seed:number}> = ({position,scale,color,seed})=>{
 const geometry=React.useMemo(()=>{
  const g=new THREE.ConeGeometry(1,2,9,4); const p=g.attributes.position as THREE.BufferAttribute;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i); const wobble=Math.sin((i+seed)*2.13)*.14+Math.cos((i+seed)*.71)*.09; p.setXYZ(i,x*(1+wobble),y+(y>-.9?wobble*.7:0),z*(1+wobble));}
  g.computeVertexNormals(); return g;
 },[seed]);
 return <mesh geometry={geometry} position={position} scale={scale} receiveShadow><meshStandardMaterial color={color} roughness={1} flatShading/></mesh>;
};
const Window:React.FC<{x:number;y:number;z:number}> = ({x,y,z})=><mesh position={[x,y,z]}><boxGeometry args={[.34,.3,.035]}/><meshStandardMaterial color="#ffca78" emissive="#ff9d3e" emissiveIntensity={2.4} roughness={.35}/></mesh>;
const Coach:React.FC<{position:V3;index:number}> = ({position,index})=><group position={position}>
 <mesh position={[0,.82,0]}><boxGeometry args={[3.65,1.45,1.55]}/><meshStandardMaterial color={index%2?"#263e50":"#314c5d"} metalness={.38} roughness={.48} /></mesh>
 <mesh position={[0,1.58,0]}><boxGeometry args={[3.68,.12,1.58]}/><meshStandardMaterial color="#9aaab0" metalness={.65} roughness={.32} /></mesh>
 <mesh position={[0,.21,0]}><boxGeometry args={[3.72,.22,1.62]}/><meshStandardMaterial color="#101d27" metalness={.3} /></mesh>
 {Array.from({length:7},(_,i)=><Window key={i} x={-1.48+i*.49} y={1.05} z={.792}/>)}
 {[-1.1,1.1].map(x=><group key={x} position={[x,.25,0]}>
  {[-.62,.62].map(z=><mesh key={z} position={[0,0,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.35,.35,.13,12]}/><meshStandardMaterial color="#080d13" roughness={.9} /></mesh>)}
 </group>)}
 <mesh position={[1.86,.78,0]}><boxGeometry args={[.12,.65,1.52]}/><meshStandardMaterial color="#a6b5bc" metalness={.55} /></mesh>
 </group>;
const Locomotive:React.FC=()=> <group>
 <mesh position={[0,1.05,0]}><boxGeometry args={[4.3,1.7,1.85]}/><meshStandardMaterial color="#29495d" metalness={.35} roughness={.5} /></mesh>
 <mesh position={[2.12,.98,0]} rotation={[0,0,-.06]}><boxGeometry args={[.42,1.18,1.68]}/><meshStandardMaterial color="#8fa2ad" metalness={.3} roughness={.52}/></mesh>
 <mesh position={[2.35,1.15,.02]}><boxGeometry args={[.045,.58,1.15]}/><meshStandardMaterial color="#172d3d" metalness={.15} roughness={.2}/></mesh>
 <mesh position={[2.39,1.15,.02]}><boxGeometry args={[.06,.36,.95]}/><meshStandardMaterial color="#e8c88d" emissive="#ffb24d" emissiveIntensity={2.6}/></mesh>
 <mesh position={[2.32,.48,0]} rotation={[0,0,-.14]}><boxGeometry args={[.5,.22,1.45]}/><meshStandardMaterial color="#101c27" metalness={.55}/></mesh>
 <mesh position={[2.35,.28,0]} rotation={[0,0,-.22]}><boxGeometry args={[.72,.12,1.35]}/><meshStandardMaterial color="#a9b7be" metalness={.72} roughness={.3}/></mesh>
 <mesh position={[-1.35,1.9,0]}><boxGeometry args={[1.25,.5,1.9]}/><meshStandardMaterial color="#172c3b" metalness={.4} /></mesh>
 <mesh position={[-.75,1.72,.94]}><boxGeometry args={[.72,.82,.045]}/><meshStandardMaterial color="#e9c88e" emissive="#ffb34d" emissiveIntensity={1.7}/></mesh>
 <mesh position={[.85,1.55,.94]}><boxGeometry args={[.9,.65,.045]}/><meshStandardMaterial color="#e9c88e" emissive="#ffb34d" emissiveIntensity={1.5}/></mesh>
 <mesh position={[2.18,.82,.66]}><sphereGeometry args={[.2,12,10]}/><meshStandardMaterial color="#fff0c7" emissive="#ffc66f" emissiveIntensity={5}/></mesh>
 <mesh position={[2.18,.82,-.66]}><sphereGeometry args={[.2,12,10]}/><meshStandardMaterial color="#fff0c7" emissive="#ffc66f" emissiveIntensity={5}/></mesh>
 <mesh position={[2.32,1.55,0]}><boxGeometry args={[.14,.12,.6]}/><meshStandardMaterial color="#cbd7dc" metalness={.6}/></mesh>
 <mesh position={[-.1,2.03,0]}><cylinderGeometry args={[.23,.28,.75,9]}/><meshStandardMaterial color="#101b25" roughness={.7} /></mesh>
 <mesh position={[0,.18,0]}><boxGeometry args={[4.5,.22,1.95]}/><meshStandardMaterial color="#0a121a" metalness={.5} /></mesh>
 {[-1.35,1.3].map(x=><group key={x} position={[x,.28,0]}>{[-.82,.82].map(z=><mesh key={z} position={[0,0,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.43,.43,.16,14]}/><meshStandardMaterial color="#070d13" roughness={.9}/></mesh>)}</group>)}
 </group>;
const Track:React.FC=()=>{
 const sleepers=useRef<THREE.InstancedMesh>(null);
 const geometry=useMemo(()=>new THREE.BoxGeometry(.22,.16,3.8),[]);
 const material=useMemo(()=>new THREE.MeshStandardMaterial({color:"#737a80",roughness:1}),[]);
 useLayoutEffect(()=>{
  if(!sleepers.current)return;
  const dummy=new THREE.Object3D();
  for(let i=0;i<72;i++){dummy.position.set(-40+i*1.15,.08,0);dummy.updateMatrix();sleepers.current.setMatrixAt(i,dummy.matrix);}
  sleepers.current.instanceMatrix.needsUpdate=true;
 },[]);
 return <group position={[0,.03,0]}>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]}><planeGeometry args={[100,12]}/><meshStandardMaterial color="#172532" roughness={1} /></mesh>
  <instancedMesh ref={sleepers} args={[geometry,material,72]}/>
  {[-1.15,1.15].map(z=><mesh key={z} position={[0,.2,z]}><boxGeometry args={[100,.2,.16]}/><meshStandardMaterial color="#aebbc2" metalness={.75} roughness={.3} /></mesh>)}
 </group>;
};
const Snowfall:React.FC=()=>{
 const f=useCurrentFrame();
 const positions=React.useMemo(()=>{const a=new Float32Array(900*3);for(let i=0;i<900;i++){a[i*3]=(Math.sin(i*91.7)*.5+.5)*54-27;a[i*3+1]=(Math.sin(i*43.1)*.5+.5)*19+1;a[i*3+2]=(Math.cos(i*31.9)*.5+.5)*23-11.5;}return a;},[]);
 const moved=React.useMemo(()=>new Float32Array(positions.length),[positions]);
 for(let i=0;i<900;i++){moved[i*3]=positions[i*3]!+Math.sin(f*.035+i)*.55;moved[i*3+1]=1+((positions[i*3+1]! - f*.085 + 20)%20);moved[i*3+2]=positions[i*3+2]!;}
 return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[moved,3]}/></bufferGeometry><pointsMaterial color="#eef7ff" size={.075} transparent opacity={.8} sizeAttenuation/></points>;
};
const SceneLights:React.FC=()=> <><ambientLight intensity={.32}/><directionalLight position={[-8,13,4]} intensity={1.5} color="#b8d5ef"/><directionalLight position={[5,6,-7]} intensity={.8} color="#809fc7"/><pointLight position={[5,3,2]} intensity={22} distance={25} color="#ffc777"/></>;
export const TrainWorld:React.FC<{shot:"side"|"low"|"high"}> = ({shot})=>{
 const f=useCurrentFrame();
 const trainX=shot==="side"?interpolate(f,[0,209],[-5,10]):shot==="low"?interpolate(f,[0,209],[-5,5]):interpolate(f,[0,209],[-2,2]);
 // Track the nose with the camera in the first two shots. The closing shot
 // deliberately cranes upward and backward while the locomotive keeps moving.
 const camera=shot==="side"?{from:[-12,4.5,19] as V3,to:[-2,4.2,19] as V3}:shot==="low"?{from:[-7,2.05,12] as V3,to:[0.2,2.2,12] as V3}:{from:[-6,8,19] as V3,to:[-13.5,10,25] as V3};
 return <ThreeScene background="#081522" {...(shot==="high" ? {} : {fog:"#263b50"})} cameraFrom={camera.from} cameraTo={camera.to} durationInFrames={shot==="high" ? 216 : 210}>
  <SceneLights/><ambientLight intensity={shot==="high" ? 1.05 : .32}/><directionalLight position={[7,9,8]} intensity={shot==="high" ? 2.4 : 1.1} color="#d7e9f5"/><directionalLight position={[-6,5,-5]} intensity={shot==="high" ? 1.5 : .75} color="#8db9ff"/><pointLight position={[8,4,5]} intensity={shot==="high" ? 46 : 32} distance={shot==="high" ? 48 : 32} color="#ffd28c"/><pointLight position={[-8,5,-2]} intensity={shot==="high" ? 25 : 18} distance={35} color="#9ec8ef"/>
  <group position={[0,-.08,0]}><GroundPlane color="#1b2c3b" width={70} depth={40}/></group>
  <Track/>
  <group position={[trainX,0,0]}><Locomotive/><pointLight position={[5.8,1.25,0]} intensity={shot==="high" ? 95 : 48} distance={shot==="high" ? 60 : 38} decay={1.6} color="#ffc96e"/>{Array.from({length:5},(_,i)=><Coach key={i} position={[-4.05-i*3.9,0,0]} index={i}/>)}</group>
  <Mountain position={[-17,5,-10]} scale={[10,12,8]} color="#8299ac" seed={1}/>
  <Mountain position={[-4,5,-13]} scale={[9,11,8]} color="#637f94" seed={2}/>
  <Mountain position={[12,4,-12]} scale={[12,10,8]} color="#526e85" seed={3}/>
  <Mountain position={[20,3,8]} scale={[9,8,7]} color="#31485e" seed={4}/>
  <Mountain position={[-23,3,8]} scale={[9,9,8]} color="#405a70" seed={5}/>
  <Snowfall/>
 </ThreeScene>;
};
