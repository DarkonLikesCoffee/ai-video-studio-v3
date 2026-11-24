import {useCurrentFrame} from "remotion";
import {Interior} from "../visuals";
import {StormRain} from "../../../shared/particles";
const progress=(f:number,a:number,b:number)=>Math.max(0,Math.min(1,(f-a)/(b-a)));
export const StormLensRepair=()=>{const frame=useCurrentFrame();const repair=progress(frame,0,100);return <><Interior frame={frame} repair={repair}/><StormRain frame={frame} density={40}/></>;};
