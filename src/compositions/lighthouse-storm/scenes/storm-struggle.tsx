import {useCurrentFrame} from "remotion";
import {Sky,Tower,Keeper,Beam,Lightning} from "../visuals";
import {StormRain} from "../../../shared/particles";
const progress=(f:number,a:number,b:number)=>Math.max(0,Math.min(1,(f-a)/(b-a)));
export const StormStruggle=()=>{const frame=useCurrentFrame();const strain=progress(frame,0,100);return <><Sky frame={frame}/><Tower frame={frame}/><Keeper frame={frame} x={760+Math.sin(frame*.12)*24} work={strain}/><Beam frame={frame} intensity={.15}/><StormRain frame={frame} density={120}/><Lightning frame={frame}/></>;};
