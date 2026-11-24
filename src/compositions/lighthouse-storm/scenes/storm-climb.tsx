import {useCurrentFrame} from "remotion";
import {Sky,Tower,Keeper,Lightning} from "../visuals";
import {StormRain} from "../../../shared/particles";
const progress=(f:number,a:number,b:number)=>Math.max(0,Math.min(1,(f-a)/(b-a)));
export const StormClimb=()=>{const frame=useCurrentFrame();const climb=progress(frame,0,100);return <><Sky frame={frame}/><Tower frame={frame}/><Keeper frame={frame} x={1020-climb*360} work={climb} scale={.86}/><StormRain frame={frame} density={100}/><Lightning frame={frame}/></>;};
