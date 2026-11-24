import {useCurrentFrame} from "remotion";
import {Sky,Tower,Keeper,Lightning} from "../visuals";
import {StormRain} from "../../../shared/particles";
const progress=(f:number,a:number,b:number)=>Math.max(0,Math.min(1,(f-a)/(b-a)));
// The keeper completes the full crossing by local frame 96, before the transition begins.
export const StormApproach=()=>{const frame=useCurrentFrame();const walk=progress(frame,0,96);return <><Sky frame={frame}/><Tower frame={frame}/><Keeper frame={frame} x={340+walk*430}/><StormRain frame={frame} density={110}/><Lightning frame={frame}/></>;};
