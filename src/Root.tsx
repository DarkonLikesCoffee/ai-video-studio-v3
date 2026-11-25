import { Composition } from "remotion";
import { MadridTrip, MADRID_TRIP_DURATION, FPS, WIDTH, HEIGHT } from "./compositions/madrid-trip";
import { TinyAstronautCrystalCave } from "./compositions/tiny-astronaut-crystal-cave/TinyAstronautCrystalCave";
import { ThreeSmoke } from "./compositions/render-technique-smoke/ThreeSmoke";
import { ImageSmoke } from "./compositions/render-technique-smoke/ImageSmoke";
import { NightTrainThree } from "./compositions/night-train-three";
import { DawnBalloon } from "./compositions/dawn-balloon";

export const RemotionRoot = () => (
 <>
  <Composition id="MadridTrip" component={MadridTrip} durationInFrames={MADRID_TRIP_DURATION} fps={FPS} width={WIDTH} height={HEIGHT}/>
  <Composition id="TinyAstronautCrystalCave" component={TinyAstronautCrystalCave} durationInFrames={600} fps={30} width={1920} height={1080}/>
  <Composition id="ThreeSmoke" component={ThreeSmoke} durationInFrames={150} fps={30} width={1920} height={1080}/>
  <Composition id="ImageSmoke" component={ImageSmoke} durationInFrames={150} fps={30} width={1920} height={1080}/>
  <Composition id="NightTrainThree" component={NightTrainThree} durationInFrames={600} fps={30} width={1920} height={1080}/>
  <Composition id="DawnBalloon" component={DawnBalloon} durationInFrames={600} fps={30} width={1920} height={1080}/>
 </>
);
