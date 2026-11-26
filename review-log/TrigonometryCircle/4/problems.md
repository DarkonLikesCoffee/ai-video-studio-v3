# Round 4 — rendered verification

The round-4 CI typecheck passed and the review workflow rendered the selected stills, one-second contact sheet, and final MP4 successfully.

Compared frames:
- Frame 0: title, circle and point are visible.
- Frame 180: radians chapter shows the 36° arc, explicit θ = 36° = π/5 rad, and the 1-radian reference arc.
- Frame 420: sine chapter has eased from 36° toward 0°; the point/readout reflects the local angle.
- Frame 510: sine projection and graph reach approximately 36°.
- Frame 720: tangent starts at 36° and displays tan θ ≈ 0.727 on the x = 1 tangent.
- Frame 840: tangent has approached 90° and changes to undefined.
- Frame 900: quadrant II sign readout shows sine positive, cosine and tangent negative.
- Frame 1050: proportional leg squares show 0.655 + 0.345 = 1.
- Frame 1230: 30°, 45°, 60° exact values and decimal approximations are all visible.

Remaining issues found:
1. At frame 720, the point-coordinate label collides with the vertical tangent segment.
2. At frame 180, the point-coordinate label is too close to the unrolled arc-length equation.
3. At frame 420, the graph's trace was parameterized to the final 36° even while the point was still near 0°; the graph axis also began behind the information card. The panel showed the final 36° value rather than the live current value.
