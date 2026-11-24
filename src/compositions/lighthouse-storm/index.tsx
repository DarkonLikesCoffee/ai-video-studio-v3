import {TransitionSeries} from "@remotion/transitions";
import {fadeTransition} from "../../shared/fade-transition";
import {StormApproach} from "./scenes/storm-approach";
import {StormStruggle} from "./scenes/storm-struggle";
import {StormClimb} from "./scenes/storm-climb";
import {StormLensRepair} from "./scenes/storm-lens-repair";
import {StormIgnition} from "./scenes/storm-ignition";
import {StormCoast} from "./scenes/storm-coast";

// 6 × 105-frame scenes minus five 6-frame overlaps = exactly 600 frames.
const SCENE_FRAMES=105;
const TRANSITION_FRAMES=6;
export const LighthouseStorm=()=> <TransitionSeries>
 <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><StormApproach/></TransitionSeries.Sequence>
 {fadeTransition(TRANSITION_FRAMES)}
 <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><StormStruggle/></TransitionSeries.Sequence>
 {fadeTransition(TRANSITION_FRAMES)}
 <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><StormClimb/></TransitionSeries.Sequence>
 {fadeTransition(TRANSITION_FRAMES)}
 <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><StormLensRepair/></TransitionSeries.Sequence>
 {fadeTransition(TRANSITION_FRAMES)}
 <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><StormIgnition/></TransitionSeries.Sequence>
 {fadeTransition(TRANSITION_FRAMES)}
 <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><StormCoast/></TransitionSeries.Sequence>
</TransitionSeries>;
