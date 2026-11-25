# BlackHole — review round 2

Inspected the actual rendered PNGs from workflow run 45663131082, including frames 000, 180 and 480, and its full contact sheet. Compared against attached references `frame-01.jpg`, `frame-03.jpg` and `frame-04.jpg`.

## Three biggest aesthetic problems
1. **A giant circular halo overwhelms the subject.** At frame 180, a blue-white spherical/sheet-like glow surrounds almost the entire object and consumes most of the frame, unlike reference-03's compact lensing crown and dark negative space. This comes from the bright, spatially misoriented disk mesh and light treatment, not a faithful ring.
2. **The lensed rear arc is still a straight bright bar.** At frame 180 the arc crosses the centre horizontally rather than visibly bending around the upper contour. It needs to be behind the shadow and follow a curved crown, as in reference-01 and reference-03.
3. **The oblique close-up is more diagonal, but still too synthetic.** Frame 480 shows a large warm circular halo and several clean white torus outlines, plus sparse wire-like filaments. Reference-04 has a single thick diagonal plasma flow, varied white-hot/amber texture and soft trailing structure, not a looped neon coil.

## Motion check
The sampled view is larger and the camera framing changes, but the wide/hero samples still hold a near-centred axis without a clearly readable disk-plane travel. The oblique segment rotates the framing but does not establish a convincing lower-left-to-upper-right flow throughout the shot. Distant stars have subtle parallax; foreground plasma movement remains too weak in the rendered samples.

## Technical issues
- npm ci, selected still renders and contact-sheet render succeeded.
- npm run check remains unverified.
- Final MP4 not requested in round 2.
- Round 2 changed disk geometry and camera framing; these renders were actually inspected.
