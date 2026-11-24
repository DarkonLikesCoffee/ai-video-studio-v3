import {useCurrentFrame} from "remotion";
import {Sky,Tower,Keeper,Beam} from "../visuals";
import {StormRain} from "../../../shared/particles";
const progress=(f:number,a:number,b:number)=>Math.max(0,Math.min(1,(f-a)/(b-a)));
export const StormIgnition=()=>{const frame=useCurrentFrame();const ignition=progress(frame,0,100);return <><Sky frame={frame}/><Tower frame={frame} beam={ignition}/><Keeper frame={frame} x={500} work={ignition} scale={.82}/><Beam frame={frame} intensity={ignition}/><StormRain frame={frame} density={90}/></>;};
