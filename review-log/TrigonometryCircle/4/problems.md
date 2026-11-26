# Round 4 — scene-local animation and mathematical labeling

Implemented:
- Diagram now receives the active scene-local frame for all scene animations, while a separate global frame preserves continuous orbit-ring motion.
- Radian chapter explicitly labels θ = 36° = π/5 rad, computes the arc length from rθ, and draws a 1-radian reference arc on the circle.
- Special-angle cards include decimal tangent values alongside exact values.
- Tangent and recap equations use stacked numerator/denominator SVG fractions.

Remaining issues to check:
1. Confirm the sine/cosine sweeps reset from 36° to 0° and then grow smoothly to 36° at frames 390–539 and 540–689.
2. Confirm the tangent segment grows from tan(36°) and reaches the undefined state only near 90° (frames 690–869).
3. Check that the new stacked fractions and radian labels remain inside the 80 px safe margins and do not collide with headers or footer.
