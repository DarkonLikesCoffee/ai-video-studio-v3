import React, {useMemo} from "react";
import {useCurrentFrame} from "remotion";
import * as THREE from "three";
import {ThreeCanvas} from "@remotion/three";

type Vec3 = [number, number, number];
type Shot = "valley" | "tracking" | "crane";

const smooth = (a:number,b:number,x:number) => {
  const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);
  return t*t*(3-2*t);
};

const Mountain:React.FC<{position:Vec3;scale:Vec3;seed:number;far?:boolean}> = ({position,scale,seed,far=false}) => {
  const geometry=useMemo(()=>{
    const g=new THREE.ConeGeometry(1,2,7,1);
    const p=g.attributes.position as THREE.BufferAttribute;
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
      const n=Math.sin((i+seed*11)*1.73)*.10+Math.cos((i+seed*5)*.83)*.075;
      p.setXYZ(i,x*(1+n),y+(y>-.8?n*.45:0),z*(1+n));
    }
    g.computeVertexNormals();
    return g;
  },[seed]);
  return <mesh geometry={geometry} position={position} scale={scale}>
    <meshStandardMaterial color={far?"#536d86":"#354f6b"} roughness={1} flatShading />
  </mesh>;
};

const SnowCap:React.FC<{position:Vec3;scale:Vec3}> = ({position,scale}) => <mesh position={position} scale={scale}>
  <coneGeometry args={[.76,.7,7,1]} />
  <meshStandardMaterial color="#d8e1e2" roughness={1} flatShading />
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
    <Mountain position={[m.x,m.height/2-1,z]} scale={[m.width,m.height,m.width*.75]} seed={m.seed} far={layer>0}/>
    <SnowCap position={[m.x,m.height*.83-1,z]} scale={[m.width*.58,m.height*.30,m.width*.44]}/>
  </group>)}</group>;
};

const Balloon:React.FC<{globalFrame:number}> = ({globalFrame}) => {
  const rise=globalFrame/30;
  const drift=globalFrame/30*.52;
  const sway=Math.sin(globalFrame/48)*.16;
  const rotation=Math.sin(globalFrame/110)*.045;
  return <group position={[drift,1.15+rise*.31+sway,-1.2]} rotation={[0,0,rotation]}>
    <group position={[0,3.15,0]}>
      <mesh scale={[1.22,1.72,1.08]}>
        <sphereGeometry args={[1,14,12]} />
        <meshStandardMaterial color="#d78b58" roughness={.72} flatShading />
      </mesh>
      <mesh position={[0,.02,.005]} scale={[1.235,1.18,1.095]}>
        <sphereGeometry args={[1,14,10]} />
        <meshStandardMaterial color="#e9bc81" roughness={.78} flatShading />
      </mesh>
      <mesh position={[0,-.50,0]} scale={[1.245,.58,1.10]}>
        <sphereGeometry args={[1,14,8]} />
        <meshStandardMaterial color="#b96c51" roughness={.78} flatShading />
      </mesh>
      <mesh position={[0,-1.58,0]} rotation={[Math.PI,0,0]}>
        <cylinderGeometry args={[.48,.60,.12,12]} />
        <meshStandardMaterial color="#6b4539" roughness={.8} />
      </mesh>
      <mesh position={[0,-1.68,0]}>
        <torusGeometry args={[.55,.065,5,14]} />
        <meshStandardMaterial color="#d9aa75" metalness={.25} roughness={.45}/>
      </mesh>
    </group>
    <group>
      {[[-.43,-1.55,-.43],[.43,-1.55,-.43],[-.43,-1.55,.43],[.43,-1.55,.43]].map((start,i)=>{
        const end:Vec3=[i%2===0?-.36:.36,-3.12,i<2?-.31:.31];
        const mid:Vec3=[(start[0]+end[0])/2,-2.30,(start[2]+end[2])/2];
        const vector=new THREE.Vector3(end[0]-start[0],end[1]-start[1],end[2]-start[2]);
        return <mesh key={i} position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),vector.clone().normalize())}>
          <cylinderGeometry args={[.025,.025,vector.length(),5]}/>
          <meshStandardMaterial color="#463d39" roughness={.8}/>
        </mesh>;
      })}
      <mesh position={[0,-3.22,0]}>
        <boxGeometry args={[.88,.72,.82]}/>
        <meshStandardMaterial color="#805337" roughness={.9} flatShading/>
      </mesh>
      <mesh position={[0,-2.84,0]}>
        <boxGeometry args={[.98,.12,.92]}/>
        <meshStandardMaterial color="#d1a36c" roughness={.65}/>
      </mesh>
      <mesh position={[0,-2.70,0]}>
        <cylinderGeometry args={[.13,.20,.30,7]}/>
        <meshStandardMaterial color="#4f514d" metalness={.55} roughness={.42}/>
      </mesh>
      <mesh position={[0,-2.47,0]}>
        <coneGeometry args={[.14,.40,6]}/>
        <meshStandardMaterial color="#ffd17c" emissive="#ff9b35" emissiveIntensity={3.8} transparent opacity={.94}/>
      </mesh>
      <pointLight position={[0,-2.30,0]} color="#ffb45d" intensity={3.6} distance={5}/>
    </group>
  </group>;
};

const CloudBank:React.FC<{frame:number}> = ({frame}) => <group>
  {Array.from({length:13},(_,i)=>{
    const x=((i*7.1-frame*.045+55)%110)-55;
    const y=5.0+Math.sin(i*1.4)*1.1;
    const z=-5-(i%4)*2.2;
    return <group key={i} position={[x,y,z]}>
      <mesh scale={[3.1,1.0,1.25]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#c6d0d5" transparent opacity={.33} roughness={1} flatShading/></mesh>
      <mesh position={[1.6,.18,.15]} scale={[2.0,.72,1.1]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#e5d5c6" transparent opacity={.23} roughness={1} flatShading/></mesh>
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
  <pointLight color="#ffc17f" intensity={95} distance={100} decay={1.25}/>
</group>;

const AnimatedCamera:React.FC<{shot:Shot;frame:number}> = ({shot,frame}) => {
  const t=frame;
  const valley=shot==="valley" ? smooth(0,209,t) : 0;
  const tracking=shot==="tracking" ? t/209 : 0;
  const crane=shot==="crane" ? smooth(0,179,t) : 0;
  const angle=THREE.MathUtils.degToRad(-20+40*tracking);
  const position:Vec3=shot==="valley"
    ? [2.8*valley,2.6+6.2*valley,15-4*valley]
    : shot==="tracking"
      ? [-8+9*tracking,5.8+1.4*tracking,12*Math.sin(angle)+8]
      : [5+7*crane,11+8*crane,14+10*crane];
  const target:Vec3=shot==="valley"
    ? [1.8*valley,5+7*valley,-3]
    : shot==="tracking"
      ? [.7+t/30*.52,7.2+t/30*.31,-1.2]
      : [2+t/30*.52,8.8+t/30*.31,-5];
  return <perspectiveCamera makeDefault position={position} fov={38} onUpdate={camera=>camera.lookAt(...target)}/>;
};

export const BalloonWorld:React.FC<{shot:Shot;globalStart:number}> = ({shot,globalStart}) => {
  const frame=useCurrentFrame();
  const globalFrame=globalStart+frame;
  const warm=shot==="crane" ? smooth(0,179,frame) : shot==="tracking" ? .65 : smooth(0,180,frame);
  return <ThreeCanvas width={1920} height={1080} camera={{position:[0,3,15],fov:38}}>
    <color attach="background" args={["#8296ac"]}/>
    <fog attach="fog" args={["#9cabb7",8,30]}/>
    <AnimatedCamera shot={shot} frame={frame}/>
    <ambientLight intensity={.72} color="#a8c2dd"/>
    <directionalLight position={[10,12,-5]} intensity={2.1+warm*.8} color="#ffcf9d"/>
    <directionalLight position={[-8,7,10]} intensity={1.1} color="#83a9d2"/>
    <hemisphereLight args={["#e9c9ab","#344b65",.65]}/>
    <Sun/>
    <group position={[0,-1,0]}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.02,0]}>
        <planeGeometry args={[150,100]}/>
        <meshStandardMaterial color="#405a6c" roughness={1}/>
      </mesh>
      <MountainRange frame={frame} layer={0}/>
      <MountainRange frame={frame} layer={1}/>
      <MountainRange frame={frame} layer={2}/>
    </group>
    <CloudBank frame={frame}/>
    <Balloon globalFrame={globalFrame}/>
    <Atmosphere frame={frame}/>
  </ThreeCanvas>;
};
