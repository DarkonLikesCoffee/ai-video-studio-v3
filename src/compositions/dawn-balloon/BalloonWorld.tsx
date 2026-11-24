import React, {useMemo} from "react";
import {useCurrentFrame} from "remotion";
import {useThree} from "@react-three/fiber";
import * as THREE from "three";
import {GroundPlane, ThreeScene} from "../../shared/three-scene";

type Vec3 = [number, number, number];
type Shot = "valley" | "tracking" | "crane";

const smooth = (start:number,end:number,value:number) => {
  const t=THREE.MathUtils.clamp((value-start)/(end-start),0,1);
  return t*t*(3-2*t);
};

const makeEnvelopeSegment = (thetaStart:number,thetaLength:number) => {
  const geometry=new THREE.SphereGeometry(1,14,12,0,Math.PI*2,thetaStart,thetaLength);
  const position=geometry.attributes.position as THREE.BufferAttribute;
  for(let i=0;i<position.count;i++){
    const x=position.getX(i);
    const y=position.getY(i);
    const z=position.getZ(i);
    const radial=1+0.055*Math.cos(y*Math.PI*1.4)+0.018*Math.sin(x*7+z*4);
    position.setXYZ(i,x*radial,y*1.015,z*radial);
  }
  geometry.computeVertexNormals();
  return geometry;
};

const Mountain:React.FC<{position:Vec3;scale:Vec3;seed:number;far?:boolean}> = ({position,scale,seed,far=false}) => {
  const geometry=useMemo(()=>{
    const g=new THREE.ConeGeometry(1,2,7,2);
    const points=g.attributes.position as THREE.BufferAttribute;
    for(let i=0;i<points.count;i++){
      const x=points.getX(i),y=points.getY(i),z=points.getZ(i);
      const n=Math.sin((i+seed*11)*1.73)*.10+Math.cos((i+seed*5)*.83)*.075;
      points.setXYZ(i,x*(1+n),y+(y>-.8?n*.35:0),z*(1+n));
    }
    g.computeVertexNormals();
    return g;
  },[seed]);
  return <mesh geometry={geometry} position={position} scale={scale}>
    <meshStandardMaterial color={far?"#536d86":"#354f6b"} roughness={1} flatShading/>
  </mesh>;
};

const SnowCap:React.FC<{position:Vec3;scale:Vec3}> = ({position,scale}) => <mesh position={position} scale={scale}>
  <coneGeometry args={[.76,.7,7,1]}/>
  <meshStandardMaterial color="#d8e1e2" roughness={1} flatShading/>
</mesh>;

const MountainRange:React.FC<{frame:number;layer:number}> = ({frame,layer}) => {
  const shift=frame*(layer===0?.026:layer===1?.012:.005);
  const z=layer===0?-11:layer===1?-24:-38;
  const items=Array.from({length:9},(_,i)=>{
    const x=((i*13.6-shift+80)%122)-61;
    const height=(layer===0?5.2:layer===1?7.2:9.4)+(i%3)*1.5;
    const width=(layer===0?8.6:layer===1?10.5:12)+(i%2)*1.5;
    return {x,height,width,seed:i+layer*9};
  });
  return <group>{items.map(m=><group key={m.seed}>
    <Mountain position={[m.x,-1+m.height/2,z]} scale={[m.width,m.height/2,m.width*.75]} seed={m.seed} far={layer>0}/>
    <SnowCap position={[m.x,-1+m.height*.9,z]} scale={[m.width*.44,m.height*.1,m.width*.36]}/>
  </group>)}</group>;
};

const Envelope:React.FC=()=>{
  const bands=useMemo(()=>[
    makeEnvelopeSegment(0,1.47),
    makeEnvelopeSegment(1.47,.56),
    makeEnvelopeSegment(2.03,.60),
    makeEnvelopeSegment(2.63,Math.PI-2.63)
  ],[]);
  return <group position={[0,3.15,0]} scale={[1.22,1.72,1.08]}>
    <mesh geometry={bands[0]}><meshStandardMaterial color="#d78b58" roughness={.72} flatShading/></mesh>
    <mesh geometry={bands[1]} scale={[1.003,1.003,1.003]}><meshStandardMaterial color="#e9bc81" roughness={.78} flatShading/></mesh>
    <mesh geometry={bands[2]} scale={[1.004,1.004,1.004]}><meshStandardMaterial color="#b96c51" roughness={.78} flatShading/></mesh>
    <mesh geometry={bands[3]} scale={[1.005,1.005,1.005]}><meshStandardMaterial color="#9b5b48" roughness={.8} flatShading/></mesh>
    <mesh position={[0,-1.61,0]}>
      <cylinderGeometry args={[.46,.54,.16,12]}/>
      <meshStandardMaterial color="#6b4539" roughness={.8}/>
    </mesh>
    <mesh position={[0,-1.70,0]}>
      <torusGeometry args={[.53,.06,5,14]}/>
      <meshStandardMaterial color="#d9aa75" metalness={.25} roughness={.45}/>
    </mesh>
  </group>;
};

const BasketRig:React.FC=()=>{
  const ropes=[
    {start:[-.48,1.48,-.42] as Vec3,end:[-.50,-.57,-.42] as Vec3},
    {start:[.48,1.48,-.42] as Vec3,end:[.50,-.57,-.42] as Vec3},
    {start:[-.48,1.48,.42] as Vec3,end:[-.50,-.57,.42] as Vec3},
    {start:[.48,1.48,.42] as Vec3,end:[.50,-.57,.42] as Vec3}
  ];
  return <group>
    {ropes.map((rope,i)=>{
      const vector=new THREE.Vector3(
        rope.end[0]-rope.start[0],
        rope.end[1]-rope.start[1],
        rope.end[2]-rope.start[2]
      );
      const mid=new THREE.Vector3(
        (rope.start[0]+rope.end[0])/2,
        (rope.start[1]+rope.end[1])/2,
        (rope.start[2]+rope.end[2])/2
      );
      const quaternion=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),vector.clone().normalize());
      return <mesh key={i} position={mid} quaternion={quaternion}>
        <cylinderGeometry args={[.035,.035,vector.length(),6]}/>
        <meshStandardMaterial color="#463d39" roughness={.8}/>
      </mesh>;
    })}
    <mesh position={[0,-.99,0]}>
      <boxGeometry args={[1.05,.82,.94]}/>
      <meshStandardMaterial color="#805337" roughness={.9} flatShading/>
    </mesh>
    <mesh position={[0,-.57,0]}>
      <boxGeometry args={[1.16,.12,1.04]}/>
      <meshStandardMaterial color="#d1a36c" roughness={.65}/>
    </mesh>
    <mesh position={[0,-.36,0]}>
      <cylinderGeometry args={[.16,.24,.34,7]}/>
      <meshStandardMaterial color="#4f514d" metalness={.55} roughness={.42}/>
    </mesh>
    <mesh position={[0,-.10,0]}>
      <coneGeometry args={[.18,.48,6]}/>
      <meshStandardMaterial color="#ffd17c" emissive="#ff9b35" emissiveIntensity={3.8} transparent opacity={.94}/>
    </mesh>
    <pointLight position={[0,-.04,0]} color="#ffb45d" intensity={3.6} distance={5}/>
  </group>;
};

const Balloon:React.FC<{globalFrame:number;shot:Shot}> = ({globalFrame,shot}) => {
  const seconds=globalFrame/30;
  const rise=shot==="valley" ? .55+seconds*.43 : 1.15+seconds*.31;
  const drift=seconds*.52;
  const sway=Math.sin(globalFrame/48)*.13;
  const rotation=Math.sin(globalFrame/110)*.04;
  return <group position={[drift,rise+sway,-1.2]} rotation={[0,0,rotation]}>
    <Envelope/>
    <BasketRig/>
  </group>;
};

const CloudBank:React.FC<{frame:number;shot:Shot}> = ({frame,shot}) => <group>
  {Array.from({length:13},(_,i)=>{
    const x=((i*7.1-frame*.045+55)%110)-55;
    const y=7.0+Math.sin(i*1.4)*1.1;
    const z=-5-(i%4)*2.2;
    return <group key={i} position={[x,y,z]}>
      <mesh scale={[3.1,1.0,1.25]}>
        <icosahedronGeometry args={[1,1]}/>
        <meshStandardMaterial color="#c6d0d5" transparent opacity={shot==="crane"?.10:.24} roughness={1} flatShading/>
      </mesh>
      <mesh position={[1.6,.18,.15]} scale={[2.0,.72,1.1]}>
        <icosahedronGeometry args={[1,1]}/>
        <meshStandardMaterial color="#e5d5c6" transparent opacity={shot==="crane"?.07:.17} roughness={1} flatShading/>
      </mesh>
    </group>;
  })}
</group>;

const Atmosphere:React.FC<{frame:number}> = ({frame}) => {
  const positions=useMemo(()=>{
    const p=new Float32Array(240*3);
    for(let i=0;i<240;i++){
      p[i*3]=Math.sin(i*19.13)*34;
      p[i*3+1]=Math.cos(i*7.17)*7+1;
      p[i*3+2]=-18+Math.sin(i*2.73)*18;
    }
    return p;
  },[]);
  const moved=useMemo(()=>{
    const p=new Float32Array(positions.length);
    for(let i=0;i<240;i++){
      p[i*3]=positions[i*3]!+frame*.012;
      p[i*3+1]=positions[i*3+1]!+Math.sin(frame*.012+i)*.11;
      p[i*3+2]=positions[i*3+2]!;
    }
    return p;
  },[positions,frame]);
  return <points>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[moved,3]}/></bufferGeometry>
    <pointsMaterial color="#f3dfc7" size={.035} transparent opacity={.42} sizeAttenuation/>
  </points>;
};

const Sun:React.FC=()=> <group position={[12,13,-35]}>
  <mesh><sphereGeometry args={[3.05,16,12]}/><meshBasicMaterial color="#ffd49a"/></mesh>
  <mesh scale={[1.5,1.5,1.5]}><sphereGeometry args={[3.05,16,12]}/><meshBasicMaterial color="#ffc27d" transparent opacity={.09}/></mesh>
  <pointLight color="#ffc17f" intensity={70} distance={100} decay={1.25}/>
</group>;

const AnimatedCamera:React.FC<{shot:Shot;frame:number;globalFrame:number}> = ({shot,frame,globalFrame}) => {
  const {camera}=useThree();
  const seconds=globalFrame/30;
  const subjectX=seconds*.52;
  const subjectY=(shot==="valley"?.55+seconds*.43:1.15+seconds*.31)+3.15;
  const subjectZ=-1.2;
  const p=shot==="crane"?smooth(0,179,frame):frame/209;

  if(shot==="valley"){
    camera.position.set(.15+.55*p,1.65,17.5-1.5*p);
    camera.lookAt(subjectX*.35,3.55+.45*p,-3);
  }else if(shot==="tracking"){
    const angle=THREE.MathUtils.degToRad(-20+40*p);
    const offsetX=-7.5*Math.sin(angle);
    const offsetZ=7.5*Math.cos(angle);
    camera.position.set(subjectX+offsetX,subjectY+.35,subjectZ+offsetZ);
    camera.lookAt(subjectX,subjectY,subjectZ);
  }else{
    camera.position.set(subjectX-2+8*p,subjectY+3.8+8*p,subjectZ+14+10*p);
    camera.lookAt(subjectX+.8*p,subjectY+1.6*p,-5);
  }
  return null;
};

export const BalloonWorld:React.FC<{shot:Shot;globalStart:number}> = ({shot,globalStart}) => {
  const frame=useCurrentFrame();
  const globalFrame=globalStart+frame;
  const warm=shot==="crane"?smooth(0,179,frame):shot==="tracking"?.65:smooth(0,180,frame);
  const fogColor=shot==="crane"?"#a8bac6":"#9cabb7";
  return <ThreeScene
    background="#8296ac"
    fog={fogColor}
    cameraFrom={[0,3,15]}
    cameraTo={[0,3,15]}
    durationInFrames={shot==="crane"?180:210}
  >
    <AnimatedCamera shot={shot} frame={frame} globalFrame={globalFrame}/>
    <ambientLight intensity={.48} color="#a8c2dd"/>
    <directionalLight position={[10,12,-5]} intensity={1.8+warm*.65} color="#ffcf9d"/>
    <directionalLight position={[-8,7,10]} intensity={.9} color="#83a9d2"/>
    <hemisphereLight args={["#e9c9ab","#344b65",.5]}/>
    <Sun/>
    <group position={[0,-1,0]}>
      <GroundPlane color="#405a6c" width={150} depth={100}/>
      <MountainRange frame={frame} layer={0}/>
      <MountainRange frame={frame} layer={1}/>
      <MountainRange frame={frame} layer={2}/>
    </group>
    <CloudBank frame={frame} shot={shot}/>
    <Balloon globalFrame={globalFrame} shot={shot}/>
    <Atmosphere frame={frame}/>
  </ThreeScene>;
};
