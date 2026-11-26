# Round 5 — graph/label alignment and live values

Implemented:
- Moved the sine/cosine graph completely below its information card.
- Parametrized the graph from 0 to the current scene-local angle, so its endpoint and moving dot correspond to the same point on the circle.
- The equation panel now displays the live sin θ / cos θ value and separately shows the final 36° reference value.
- Moved point-coordinate labels to the left for radians and tangent scenes to avoid the arc-length equation and tangent segment.

Remaining checks:
1. Confirm the graph dot meets the end of the trace at frames 420, 465, 510, 570, 615 and 660.
2. Confirm coordinate labels no longer overlap at frames 180 and 720.
3. Confirm final 48-second render remains clean and no unexpected clipping appears near frame 1439.
