import {useCurrentFrame} from "remotion";
import {AbsoluteFill} from "remotion";
import {Sky,Tower,Keeper,Beam} from "../visuals";
import {StormRain} from "../../../shared/particles";
const progress=(f:number,a:number,b:number)=>Math.max(0,Math.min(1,(f-a)/(b-a)));
export const StormCoast=()=>{const frame=useCurrentFrame();const dawn=progress(frame,0,100);return <><Sky frame={frame} storm={.15}/><Tower frame={frame} beam={1}/><Beam frame={frame} intensity={1}/><Keeper frame={frame} x={480} work={1}/><AbsoluteFill style={{background:`linear-gradient(180deg,rgba(247,191,119,${dawn*.17}),transparent 65%)`}}/><StormRain frame={frame} density={30}/></>;};
