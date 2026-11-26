# Round 6 — live sine/cosine readout

- The main sine/cosine value now displays sin θ / cos θ for the current point.
- The smaller reference line separately displays the computed 36° target value.
- This removes the mismatch between intermediate sweep frames and the explanatory panel.

Final verification targets:
- Frame 420: near-zero sine value in the panel matches the point.
- Frame 510: sine panel reads approximately 0.583 and the endpoint is near the 36° target.
- Frame 570: cosine panel begins its local sweep from 36° and descends toward the x-axis value at 0°.
- Frame 660: cosine panel and graph finish at cos(36°) ≈ 0.809.
