# Trigonometry on the Unit Circle — production plan

**Style:** 2D, explicitly requested by the user. **Technique:** SVG motion graphics in Remotion/React. A single oversized unit-circle “world” is the visual anchor, with animated radius, right-triangle projections, coordinate guides, and equations. No 3D or generated scenery.

## Story and scenes (30 fps, 600 frames / 20 seconds)
1. **Hook (0–4 s):** A point travels around a large circumference; camera-like scale/pan introduces the circle and a moving radius. Caption: “One circle. Three powerful functions.”
2. **Build the triangle (4–8 s):** Freeze the angle at 38.7°, drop a vertical projection to the x-axis, and label hypotenuse, adjacent and opposite. Explain radius = 1.
3. **Sine (8–12 s):** Highlight the vertical leg and animate a coordinate guide from point to y-axis. Show sin(θ) = y / r = y.
4. **Cosine (12–16 s):** Highlight the horizontal leg, guide to x-axis. Show cos(θ) = x / r = x.
5. **Tangent + recap (16–20 s):** Show tan(θ) = y / x = sin(θ) / cos(θ), flag undefined when x = 0, then recap sin = y, cos = x on the unit circle.

## Palette (5 colors)
Ink navy #101A2B, warm ivory #F6F2E9, cyan #48C7D4, coral #FF796C, muted gold #F2C66D.

## Motion and depth
A soft radial background glow and drifting fine grid/dots sit at different speeds behind the circle; a midground ring and slow orbiting markers add parallax; foreground radius, projections, labels and coordinate chips animate with spring/easing. The diagram world receives subtle camera-like scale and drift. No static hold exceeds 2 seconds; transitions are animated wipes/fades within the evolving world.

## Sound
No music or sound effects are added in this pass. Voiceover-ready pacing and clean pauses are reserved; audio architecture remains unchanged.

## Review
Render representative frames at scene starts, mids and ends plus one-second samples, inspect a contact sheet, document the three highest-impact problems, and make at least two fix rounds before the final MP4 render.


## Visual review — round 1
Compared the 0 s opening frame and 10 s sine frame from the rendered contact sheet. Three highest-impact issues:
1. Opening title/header was effectively invisible at frame 0 because its opacity started at zero.
2. The static example angle put the point below the x-axis, conflicting with the first-quadrant lesson and making the positive sine/cosine explanations confusing.
3. The legs were labeled only with function names; learners benefit from seeing the coordinate identity directly (y = sin θ and x = cos θ).

Motion check: the orbiting subject is a point on the circumference. At the first-quadrant lesson angle it faces/travels up and right from the origin along the radius; the orbital point travels clockwise around the circle in the opener. The animation changes visibly between sampled seconds.

## Visual review — round 2
Compared the corrected 10 s sine frame and 15 s cosine frame from the second rendered contact sheet. The point now sits in the first quadrant; the radius, horizontal and vertical components are clearly distinguishable, and the x/y coordinate identities are visible. Remaining issues to address in a final educational pass:
- The circle and equations are readable but the numeric angle is not stated; this example is fixed at 36° (π/5), and should be explicit.
- The tangent chapter should visually demonstrate the ratio and warn that tangent is undefined when x = 0; the current label text supplies the warning but the geometry remains static.
- The lesson has no narration yet; this is intentional because the current pass is a silent visual explainer and the audio architecture is not yet in scope.

Motion check: the subject remains in the first quadrant and moves through subtle background/parallax motion; the radius and point hold at a stable 36° teaching position after the rotating-circle opener. One-second samples show changing background particles and progress indicator, while the mathematical diagram remains deliberately stable for legibility.
