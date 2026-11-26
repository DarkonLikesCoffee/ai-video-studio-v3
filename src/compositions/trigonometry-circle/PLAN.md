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
