# NightTrainThree — 20-second scene plan

- Visual technique: Three.js only for scenery, train, mountains, rails and snow; shared `src/shared/three-scene.tsx` provides the canvas, lighting and fog. Code overlays are limited to short labels and scene UI.
- Palette: midnight navy, glacial blue, snow grey, restrained warm amber windows and headlamp.
- Sound: no external audio assets are available in this implementation; retain a silent visual master rather than adding synthetic placeholder sound.
- Shot 1 (0:00–0:07): lateral tracking camera beside a large locomotive and five coaches; mountain layers slide at different parallax speeds; warm windows and falling snow.
- Shot 2 (0:07–0:14): camera drops to rail height; locomotive crosses close to camera, sleeper pattern and wheels reinforce speed; snow streams through foreground.
- Shot 3 (0:14–0:20): high pull-back reveals the train threading a wide snowy pass; camera rises and retreats as the train continues through frame.
- Transitions: 18-frame cross-fades; captions fade in/out over the moving world and stay under two seconds.
- Subject continuity: locomotive and carriages are spatial meshes, designed to occupy a substantial fraction of frame and remain moving throughout every shot.
