import React from "react";

import {TransitionSeries} from "@remotion/transitions";
import {fadeTransition} from "../../shared/fade-transition";
import { EIFFEL_DURATION, FADE, MAP_DURATION } from "./constants";
import { EiffelScene } from "./EiffelScene";
import { MapScene } from "./MapScene";

export { MADRID_TRIP_DURATION, FPS, WIDTH, HEIGHT } from "./constants";

export const MadridTrip: React.FC = () => (
  <>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={MAP_DURATION}>
        <MapScene />
      </TransitionSeries.Sequence>
      {fadeTransition(FADE)}
      <TransitionSeries.Sequence durationInFrames={EIFFEL_DURATION}>
        <EiffelScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </>
);
