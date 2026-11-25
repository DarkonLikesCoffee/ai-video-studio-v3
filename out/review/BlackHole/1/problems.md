# BlackHole — review round 1

Inspected the rendered PNGs and contact sheet from workflow run 45662497800 against attached reference images 01, 03 and 04. Actual output was reviewed.

## Three biggest aesthetic problems
1. Accretion disk reads as stacked, clean torus bands rather than broad, turbulent dusty plasma. In frames 180 and 300 the result resembles a Saturn ring; its polygonal ends and uniform stripes diverge from reference-03's soft, grainy disk.
2. Lensing reads as concentric hoops. The bright loops encircle the shadow rather than forming the high luminous crown and partially visible lower arc in reference-01 and reference-03.
3. Close-up does not match reference-04's diagonal depth. Frames 480 and 611 show a near-frontal circular coil crossed by a thin horizontal band, not a thick lower-left-to-upper-right foreground flow. Warm colors are flat and banded instead of white-hot with textured amber/copper plasma.

## Motion check
Frames 000–180 show gradual camera approach, but the hero interval is visually repetitive across one-second samples. The final warm view remains nearly frontal; clear diagonal travel is absent. The code rotates the disk slowly, but the visible motion is not persuasive enough.

## Technical issues
- npm ci succeeded.
- Selected PNG still renders succeeded.
- Contact-sheet render succeeded.
- Final MP4 intentionally skipped in round 1.
- npm run check is not run by the review workflow and has not been verified.
