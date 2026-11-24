export type AstronautLayerVisibility = {
  planet: boolean;
  caveApproach: boolean;
  crystalAwakening: boolean;
};

/**
 * Exactly one astronaut layer is active from the first exploration frame onward.
 * The boundaries are deliberate: the planet layer hands off to the cave approach
 * before the composition switches environments, then to the crystal reveal.
 */
export const getAstronautLayerVisibility = (frame: number): AstronautLayerVisibility => ({
  planet: frame >= 90 && frame < 270,
  caveApproach: frame >= 270 && frame < 430,
  crystalAwakening: frame >= 430 && frame < 600,
});
