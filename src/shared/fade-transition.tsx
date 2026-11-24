import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";

// Create the native Remotion transition element so TransitionSeries can validate it.
export const fadeTransition = (durationInFrames: number) => (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({durationInFrames})}
  />
);
